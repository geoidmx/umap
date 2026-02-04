import*as Utils from"../utils.e02e0d0b0995.js"
export class HybridLogicalClock{constructor(walltime=Date.now(),nn=0,id=Utils.generateId()){this._current={walltime,nn,id}}
serialize(clock=this._current){const{walltime,nn,id}=clock
return`${walltime}:${nn}:${id}`}
parse(raw){const tokens=raw.split(':')
if(tokens.length!==3){throw new SyntaxError(`Unable to parse ${raw}`)}
const[walltime,rawNN,id]=tokens
let nn=Number.parseInt(rawNN)
if(Number.isNaN(nn)){nn=0}
return{walltime,nn,id}}
tick(){const current={...this._current}
const now=Date.now()
let nextValue
if(now>current.walltime){nextValue={...current,walltime:now,nn:0}}else{nextValue={...current,nn:current.nn+1}}
this._current=nextValue
return this.serialize(this._current)}
receive(remoteRaw){const local={...this._current}
const remote=this.parse(remoteRaw)
const now=Date.now()
let nextValue
if(now>local.walltime&&now>remote.walltime){nextValue={...local,walltime:now}}else if(local.walltime==remote.walltime){const nn=Math.max(local.nn,remote.nn)+1
nextValue={...local,nn:nn}}else if(remote.walltime>local.walltime){nextValue={...remote,id:local.id,nn:remote.nn+1}}else{nextValue={...local,nn:local.nn+1}}
this._current=nextValue
return this._current}}