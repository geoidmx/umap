import*as Utils from"../utils.f29154930320.js"
class BaseUpdater{constructor(umap){this._umap=umap}
getDataLayerFromID(layerId){return this._umap.getDataLayerByUmapId(layerId)}
applyMessage(payload){const{verb}=payload
return this[verb](payload)}}
export class MapUpdater extends BaseUpdater{update({key,value}){if(Utils.fieldInSchema(key)){Utils.setObjectValue(this._umap,key,value)}
this._umap.onPropertiesUpdated([key])
this._umap.render([key])}
getStoredObject(){return this._umap}}
export class DataLayerUpdater extends BaseUpdater{upsert({value}){try{this.getDataLayerFromID(value.id)}catch{const datalayer=this._umap.createDataLayer(value._umap_options||value,false)
if(value.features){datalayer.addData(value)}}}
update({key,metadata,value}){const datalayer=this.getDataLayerFromID(metadata.id)
if(key==='properties'){datalayer.setProperties(value)}else if(Utils.fieldInSchema(key)){Utils.setObjectValue(datalayer,key,value)}else{console.debug('Not applying update for datalayer because key is not in the schema',key)}
datalayer.render([key])}
delete({metadata}){const datalayer=this.getDataLayerFromID(metadata.id)
if(datalayer){datalayer.del(false)
datalayer.commitDelete()}}
getStoredObject(metadata){return this.getDataLayerFromID(metadata.id)}}
export class FeatureUpdater extends BaseUpdater{getFeatureFromMetadata({id,layerId}){const datalayer=this.getDataLayerFromID(layerId)
return datalayer.features.get(id)}
upsert({metadata,value}){const{id,layerId}=metadata
const datalayer=this.getDataLayerFromID(layerId)
const feature=this.getFeatureFromMetadata(metadata)
if(feature){feature.geometry=value.geometry}else{datalayer.makeFeature(value,false)}}
update({key,metadata,value}){const feature=this.getFeatureFromMetadata(metadata)
if(feature===undefined){console.error(`Unable to find feature with id = ${metadata.id}.`)
return}
if(key==='geometry'){const feature=this.getFeatureFromMetadata(metadata)
feature.geometry=value}else{Utils.setObjectValue(feature,key,value)}
feature.render([key])}
delete({metadata}){const feature=this.getFeatureFromMetadata(metadata)
if(feature)feature.del(false)}
getStoredObject(metadata){return this.getDataLayerFromID(metadata.layerId)}}
export class MapPermissionsUpdater extends BaseUpdater{update({key,value}){if(Utils.fieldInSchema(key)){Utils.setObjectValue(this._umap.permissions,key,value)}}
getStoredObject(metadata){return this._umap.permissions}}
export class DataLayerPermissionsUpdater extends BaseUpdater{update({key,value,metadata}){if(Utils.fieldInSchema(key)){Utils.setObjectValue(this.getDataLayerFromID(metadata.id),key,value)}}
getStoredObject(metadata){return this.getDataLayerFromID(metadata.id).permissions}}