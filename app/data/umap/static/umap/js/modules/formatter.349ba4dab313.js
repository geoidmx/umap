import{uMapAlert as Alert}from"../components/alerts/alert.23a48eacc80d.js"
import{translate}from"./i18n.e21305be8451.js"
const parseTextGeom=async(geom)=>{try{return JSON.parse(geom)}catch(e){try{const betterknown=await import("../../vendors/betterknown/betterknown.48688ccb8c94.mjs")
return betterknown.wktToGeoJSON(geom)}catch{return null}}}
export const EXPORT_FORMATS={geojson:{ext:'.geojson',filetype:'application/json',},gpx:{ext:'.gpx',filetype:'application/gpx+xml',},kml:{ext:'.kml',filetype:'application/vnd.google-earth.kml+xml',},csv:{ext:'.csv',filetype:'text/csv',},wkt:{ext:'.csv',filetype:'text/csv',},}
export class Formatter{async fromGPX(str){const togeojson=await import("../../vendors/togeojson/togeojson.es.e1d232ac64ae.js")
const data=togeojson.gpx(this.toDom(str))
for(const feature of data.features||[]){feature.properties.description=feature.properties.desc
for(const key in feature.properties){if(key.startsWith('_')||typeof feature.properties[key]==='object'){delete feature.properties[key]}}}
return data}
async fromKML(str){const togeojson=await import("../../vendors/togeojson/togeojson.es.e1d232ac64ae.js")
return togeojson.kml(this.toDom(str),{skipNullGeometry:true,})}
async fromGeoJSON(str){return JSON.parse(str)}
async fromOSM(str){let src
try{src=JSON.parse(str)}catch(e){src=this.toDom(str)}
const data=osmtogeojson(src,{flatProperties:true})
for(const feature of data.features||[]){const[osm_type,osm_id]=feature.properties.id.split('/')
feature.properties.osm_id=osm_id
feature.properties.osm_type=osm_type}
return data}
fromCSV(str,callback){csv2geojson.csv2geojson(str,{delimiter:'auto',includeLatLon:false,sexagesimal:false,parseLatLon:(raw)=>Number.parseFloat(raw.toString().replace(',','.')),},async(err,result)=>{if(result?.features.length){const first=result.features[0]
if(first.geometry===null){const geomFields=['geom','geometry','wkt','geojson']
const availableFields=Object.keys(first.properties).reduce((acc,key)=>{acc[key.toLowerCase()]=key
return acc},{})
for(let field of geomFields){field=availableFields[field]
if(first.properties[field]){for(const feature of result.features){feature.geometry=await parseTextGeom(feature.properties[field])
delete feature.properties[field]}
break}}
if(first.geometry===null){err={type:'Error',message:translate('No geo column found: must be either `lat(itude)` and `lon(gitude)` or `geom(etry)`.'),}}}}
if(err){let message
if(err.type==='Error'){message=err.message}else{message=translate('{count} errors during import: {message}',{count:err.length,message:err[0].message,})}
if(str.split(/\r\n|\r|\n/).length<=2){console.debug(err)}else{Alert.error(message,10000)}}
if(result?.features.length){callback(result)}})}
async fromGeoRSS(str){const GeoRSSToGeoJSON=await import('../../vendors/georsstogeojson/GeoRSSToGeoJSON.js')
return GeoRSSToGeoJSON.parse(this.toDom(str))}
toDom(x){const doc=new DOMParser().parseFromString(x,'text/xml')
const errorNode=doc.querySelector('parsererror')
if(errorNode){Alert.error(translate('Cannot parse data'))}
return doc}
async parse(str,format){switch(format){case'csv':return new Promise((resolve,reject)=>{return this.fromCSV(str,(data)=>resolve(data))})
case'gpx':return await this.fromGPX(str)
case'kml':return await this.fromKML(str)
case'osm':return await this.fromOSM(str)
case'georss':return await this.fromGeoRSS(str)
case'geojson':return await this.fromGeoJSON(str)}}
async stringify(features,format){switch(format){case'csv':return await this.toCSV(features)
case'wkt':return await this.toWKT(features)
case'gpx':return await this.toGPX(features)
case'kml':return await this.toKML(features)
case'geojson':return await this.toGeoJSON(features)}}
async toGPX(features){const togpx=await import("../../vendors/geojson-to-gpx/index.0f5fcb92ce6e.js")
for(const feature of features){feature.properties.desc=feature.properties.description}
const gpx=togpx.default(this.toFeatureCollection(features))
return new XMLSerializer().serializeToString(gpx)}
async toKML(features){const tokml=await import("../../vendors/tokml/tokml.es.2fe0c0885d3f.js")
return tokml.toKML(this.toFeatureCollection(features))}
toFeatureCollection(features){return{type:'FeatureCollection',features:features.map((f)=>f.toGeoJSON()),}}
async toGeoJSON(features){return JSON.stringify(this.toFeatureCollection(features),null,2)}
async toCSV(features){const table=[]
for(const feature of features){const row=feature.toGeoJSON().properties
const center=feature.center
delete row._umap_options
row.Latitude=center.lat
row.Longitude=center.lng
table.push(row)}
return csv2geojson.dsv.csvFormat(table)}
async toWKT(features){const table=[]
const betterknown=await import("../../vendors/betterknown/betterknown.48688ccb8c94.mjs")
for(const feature of features){const row=feature.toGeoJSON().properties
delete row._umap_options
row.geometry=betterknown.geoJSONToWkt(feature.geometry)
table.push(row)}
return csv2geojson.dsv.csvFormat(table)}}