import*as Utils from"../utils.e02e0d0b0995.js"
import{HybridLogicalClock}from"./hlc.e80d52e0178b.js"
import{UndoManager}from"./undo.a3b913a29083.js"
import{DataLayerUpdater,FeatureUpdater,MapUpdater,MapPermissionsUpdater,DataLayerPermissionsUpdater,}from"./updaters.8fed6ed9f90c.js"
import{WebSocketTransport}from"./websocket.3b1f7535603a.js"
const RECONNECT_DELAY=2000
const RECONNECT_DELAY_FACTOR=2
const MAX_RECONNECT_DELAY=32000
export class SyncEngine{constructor(umap){this._umap=umap
this.updaters={map:new MapUpdater(umap),feature:new FeatureUpdater(umap),datalayer:new DataLayerUpdater(umap),mappermissions:new MapPermissionsUpdater(umap),datalayerpermissions:new DataLayerPermissionsUpdater(umap),}
this.transport=undefined
this._operations=new Operations()
this._reconnectTimeout=null
this._reconnectDelay=RECONNECT_DELAY
this.websocketConnected=false
this.closeRequested=false
this.peerId=Utils.generateId()
this._undoManager=new UndoManager(umap,this.updaters,this)}
get isOpen(){return this.transport?.isOpen}
async authenticate(){if(this.isOpen)return
const websocketTokenURI=this._umap.urls.get('map_websocket_auth_token',{map_id:this._umap.id,})
const[response,_,error]=await this._umap.server.get(websocketTokenURI)
if(error){this.reconnect()
return}
await this.start(response.token)}
async start(authToken){const path=this._umap.urls.get('ws_sync',{map_id:this._umap.id})
const protocol=window.location.protocol==='http:'?'ws:':'wss:'
this.transport=new WebSocketTransport(this)
await this.transport.connect(`${protocol}//${window.location.host}${path}`,authToken,this.peerId,this._umap.properties.user?.name)
this.onConnection()}
stop(){if(this.transport){this.transport.close()}
this.transport=undefined}
onConnection(){this._reconnectTimeout=null
this._reconnectDelay=RECONNECT_DELAY
this.websocketConnected=true
this.updaters.map.update({key:'numberOfConnectedPeers'})}
reconnect(){this.websocketConnected=false
this.updaters.map.update({key:'numberOfConnectedPeers'})
this._reconnectTimeout=setTimeout(async()=>{if(this._reconnectDelay<MAX_RECONNECT_DELAY){this._reconnectDelay=this._reconnectDelay*RECONNECT_DELAY_FACTOR}
await this.authenticate()},this._reconnectDelay)}
startBatch(){this._batch=[]}
commitBatch(subject,metadata){if(!this._batch.length){this._batch=null
return}
const operations=this._batch.map((stage)=>stage.operation)
const operation={verb:'batch',operations,subject,metadata}
this._undoManager.add({operation,stages:this._batch})
this._send(operation)
this._batch=null}
upsert(subject,metadata,value,oldValue){const operation={verb:'upsert',subject,metadata,value,}
const stage={operation,newValue:value,oldValue:oldValue,}
if(this._batch){this._batch.push(stage)
return}
this._undoManager.add(stage)
this._send(operation)}
update(subject,metadata,key,value,oldValue,{undo}={undo:true}){const operation={verb:'update',subject,metadata,key,value,}
const stage={operation,oldValue:oldValue,newValue:value,}
if(this._batch){this._batch.push(stage)
return}
if(undo)this._undoManager.add(stage)
this._send(operation)}
delete(subject,metadata,oldValue){const operation={verb:'delete',subject,metadata,}
const stage={operation,oldValue:oldValue,}
if(this._batch){this._batch.push(stage)
return}
this._undoManager.add(stage)
this._send(operation)}
_getDirtyObjects(){const dirty=new Map()
if(!this._umap.id){dirty.set(this._umap,[])}
const addDirtyObject=(operation)=>{const updater=this._getUpdater(operation.subject)
const obj=updater.getStoredObject(operation.metadata)
if(!dirty.has(obj)){dirty.set(obj,[])}
dirty.get(obj).push(operation)}
for(const operation of this._operations.sorted()){if(operation.dirty){addDirtyObject(operation)
if(operation.verb==='batch'){for(const op of operation.operations){addDirtyObject(op)}}}}
return dirty}
async save(){const needSave=this._getDirtyObjects()
for(const[obj,operations]of needSave.entries()){const ok=await obj.save()
if(!ok)return false
for(const operation of operations){operation.dirty=false}}
this.saved()
this._undoManager.toggleState()
return true}
saved(){if(this.offline)return
if(this.transport){this.transport.send('SavedMessage',{sender:this.peerId,lastKnownHLC:this._operations.getLastKnownHLC(),})}}
_send(operation){const message=this._operations.addLocal(operation)
if(this.offline)return
if(this.transport){this.transport.send('OperationMessage',{sender:this.peerId,...message})}}
_getUpdater(subject,metadata,sync){if(sync&&(subject==='mappermissions'||subject==='datalayerpermissions')){return}
if(Object.keys(this.updaters).includes(subject)){return this.updaters[subject]}
throw new Error(`Unknown updater ${subject}, ${metadata}`)}
_applyOperation(operation){if(operation.verb==='batch'){operation.operations.map((op)=>this._applyOperation(op))
return}
const updater=this._getUpdater(operation.subject,operation.metadata)
if(!updater){debug('No updater for',operation)
return}
updater.applyMessage(operation)}
getPeers(){return this.peers||{}}
receive({kind,...payload}){if(kind==='OperationMessage'){this.onOperationMessage(payload)}else if(kind==='JoinResponse'){this.onJoinResponse(payload)}else if(kind==='ListPeersResponse'){this.onListPeersResponse(payload)}else if(kind==='PeerMessage'){debug('received peermessage',payload)
if(payload.message.verb==='ListOperationsRequest'){this.onListOperationsRequest(payload)}else if(payload.message.verb==='ListOperationsResponse'){this.onListOperationsResponse(payload)}}else if(kind==='SavedMessage'){this.onSavedMessage(payload)}else{throw new Error(`Received unknown message from the websocket server: ${kind}`)}}
onOperationMessage(payload){if(payload.sender===this.peerId)return
debug('received operation',payload)
this._operations.storeRemoteOperations([payload])
this._applyOperation(payload)}
onJoinResponse({peer,peers}){debug('received join response',{peer,peers})
this.onListPeersResponse({peers})
const randomPeer=this._getRandomPeer()
if(randomPeer){this.sendToPeer(randomPeer,'ListOperationsRequest',{lastKnownHLC:this._operations.getLastKnownHLC(),})}}
onListPeersResponse({peers}){debug('received peerinfo',peers)
this.peers=peers
this.updaters.map.update({key:'numberOfConnectedPeers'})}
onListOperationsRequest({sender,message}){debug(`received operations request from peer ${sender} (since ${message.lastKnownHLC})`)
this.sendToPeer(sender,'ListOperationsResponse',{operations:this._operations.getOperationsSince(message.lastKnownHLC),})}
onListOperationsResponse({sender,message}){debug(`received operations list from peer ${sender}`,message.operations)
if(message.operations.length===0)return
const remoteOperations=Operations.sort(message.operations)
this._operations.storeRemoteOperations(remoteOperations)
for(const remote of remoteOperations){if(this._operations.shouldBypassOperation(remote)){debug('Skipping the following operation, because a newer one has been found locally',remote)}else{this._applyOperation(remote)}}}
onSavedMessage({sender,lastKnownHLC}){debug(`received saved message from peer ${sender}`,lastKnownHLC)
this._operations.saved(lastKnownHLC)
this._undoManager.toggleState()}
sendToPeer(recipient,verb,payload){payload.verb=verb
this.transport.send('PeerMessage',{sender:this.peerId,recipient:recipient,message:payload,})}
_getRandomPeer(){const otherPeers=Object.keys(this.peers).filter((p)=>p!==this.peerId)
if(otherPeers.length>0){const random=Math.floor(Math.random()*otherPeers.length)
return otherPeers[random]}
return false}
proxy(object){const handler={get(target,prop){if(['upsert','update','delete','commitBatch'].includes(prop)){const{subject,metadata}=object.getSyncMetadata()
return Reflect.get(...arguments).bind(target,subject,metadata)}
return Reflect.get(...arguments)},}
return new Proxy(this,handler)}}
export class Operations{constructor(){this._hlc=new HybridLogicalClock()
this._operations=new Array()}
saved(hlc){for(const operation of this.getOperationsBefore(hlc)){operation.dirty=false}}
addLocal(operation){operation.hlc=this._hlc.tick()
this._operations.push(operation)
return operation}
sorted(){return Operations.sort(this._operations)}
static sort(operations){const copy=[...operations]
copy.sort((a,b)=>(a.hlc<b.hlc?-1:1))
return copy}
storeRemoteOperations(remoteOperations){const greatestHLC=remoteOperations.map((op)=>op.hlc).reduce((max,current)=>(current>max?current:max))
this._hlc.receive(greatestHLC)
this._operations.push(...remoteOperations)}
getOperationsSince(hlc){if(!hlc)return this._operations
const start=this._operations.findIndex((op)=>op.hlc===hlc)
this._operations.slice(start)
return this._operations.filter((op)=>op.hlc>hlc)}
getOperationsBefore(hlc){if(!hlc)return this._operations
return this._operations.filter((op)=>op.hlc<=hlc)}
getLastKnownHLC(){return this._operations.at(-1)?.hlc}
shouldBypassOperation(remote){const sortedLocalOperations=this.sorted()
if(sortedLocalOperations.length<=0){debug('No operations are stored, no need to check')
return false}
const latest=sortedLocalOperations.at(-1)
if(latest.hlc<remote.hlc){debug('Latest local operation is older than the remote one')
return false}
if(remote.hasOwnProperty('key')&&remote.key==='options.syncEnabled'&&remote.value===true){return true}
for(const local of sortedLocalOperations){if(local.hlc>remote.hlc&&Operations.haveSameContext(local,remote)&&remote.verb!=='upsert'){debug('this is newer:',local)
return true}}
return false}
static haveSameContext(local,remote){const shouldCheckKey=local.key!==undefined&&remote.key!==undefined
return(Utils.deepEqual(local.subject,remote.subject)&&Utils.deepEqual(local.metadata,remote.metadata)&&(!shouldCheckKey||(shouldCheckKey&&local.key===remote.key)))}}
function debug(...args){console.debug('SYNC ⇆',...args.map((x)=>JSON.stringify(x)))}