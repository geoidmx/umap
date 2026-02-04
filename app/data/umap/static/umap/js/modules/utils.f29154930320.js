import{default as DOMPurifyInitializer}from"../../vendors/dompurify/purify.es.47ffdbe73702.js"
const CHARACTERS='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
export function generateId(length=5){let result=''
const charactersLength=CHARACTERS.length
for(let i=0;i<length;i++){result+=CHARACTERS.charAt(Math.floor(Math.random()*charactersLength))}
return result}
export function checkId(string){if(typeof string!=='string')return false
return/^[A-Za-z0-9]{5}$/.test(string)}
function _getPropertyName(field){const filtered_field=['options.','properties.'].reduce((acc,prefix)=>acc.replace(prefix,''),field)
return filtered_field.split('.')[0]}
export function getImpactsFromSchema(fields,schema){const current_schema=schema||U.SCHEMA
const impacted=fields.map((field)=>{return _getPropertyName(field)}).reduce((acc,field)=>{const impacts=current_schema[field]?.impacts||[]
for(const impact of impacts){acc.add(impact)}
return acc},new Set())
return Array.from(impacted)}
export function fieldInSchema(field,schema){const current_schema=schema||U.SCHEMA
if(typeof field!=='string')return false
const field_name=_getPropertyName(field)
return current_schema[field_name]!==undefined}
export default function getPurify(){if(typeof window==='undefined'){return DOMPurifyInitializer(new global.JSDOM('').window)}
return DOMPurifyInitializer(window)}
export function escapeHTML(s){s=s?s.toString():''
s=getPurify().sanitize(s,{ADD_TAGS:['iframe'],ALLOWED_TAGS:['h3','h4','h5','hr','strong','em','ul','li','a','div','iframe','img','audio','video','source','br','span','dt','dd','b','i','kbd',],ADD_ATTR:['target','allow','allowfullscreen','frameborder','scrolling','controls','class',],ALLOWED_ATTR:['href','src','width','height','style','dir','title','type'],ALLOWED_URI_REGEXP:/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|geo):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,})
return s}
export function toHTML(r,options){if(!r)return''
const target=options?.target||'blank'
r=r.replace(/^\*\* (.*)/gm,'<ul><ul><li>$1</li></ul></ul>')
r=r.replace(/^\* (.*)/gm,'<ul><li>$1</li></ul>')
for(let ii=0;ii<3;ii++){r=r.replace(/<\/ul>(\r\n|\r|\n)<ul>/g,'')}
r=r.replace(/^### (.*)(\r\n|\r|\n)?/gm,'<h6>$1</h6>')
r=r.replace(/^## (.*)(\r\n|\r|\n)?/gm,'<h5>$1</h5>')
r=r.replace(/^# (.*)(\r\n|\r|\n)?/gm,'<h4>$1</h4>')
r=r.replace(/^---/gm,'<hr>')
r=r.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
r=r.replace(/\*(.*?)\*/g,'<em>$1</em>')
r=r.replace(/(^|\s|>|\()(https?:[^ \<)\n]*)/g,`$1<a target="_${target}" href="$2">$2</a>`)
r=r.replace(/\[\[(https?:[^\]|]*?)\]\]/g,`<a target="_${target}" href="$1">$1</a>`)
r=r.replace(/\[\[(https?:[^|]*?)\|(.*?)\]\]/g,`<a target="_${target}" href="$1">$2</a>`)
r=r.replace(/\[\[([^\]|]*?)\]\]/g,`<a target="_${target}" href="$1">$1</a>`)
r=r.replace(/\[\[([^|]*?)\|(.*?)\]\]/g,`<a target="_${target}" href="$1">$2</a>`)
r=r.replace(/{{{(https?[^|{]*)}}}/g,'<div><iframe allowfullscreen src="$1" style="width: 100%; height: 300px; border: 0;"></iframe></div>')
r=r.replace(/{{{(https?[^|{]*)\|(\d*)(px)?}}}/g,'<div><iframe allowfullscreen src="$1" style="width: 100%; height: $2px; border: 0;"></iframe></div>')
r=r.replace(/{{{(https?[^|{]*)\|(\d*)(px)?\*(\d*)(px)?}}}/g,'<div><iframe allowfullscreen src="$1" style="width: $4px; height: $2px; border: 0;"></iframe></div>')
r=r.replace(/{{([^\]|]*?)}}/g,'<img src="$1">')
r=r.replace(/{{([^|]*?)\|(\d*?)(px)?}}/g,'<img src="$1" style="width:$2px;min-width:$2px;">')
r=r.replace(/(h_t_t_p)/g,'http')
r=escapeHTML(r)
return r}
export function isObject(what){return typeof what==='object'&&what!==null&&!Array.isArray(what)}
export function CopyJSON(geojson){return JSON.parse(JSON.stringify(geojson))}
export function detectFileType(f){const filename=f.name?escape(f.name.toLowerCase()):''
function ext(_){return filename.indexOf(_)!==-1}
if(f.type==='application/vnd.google-earth.kml+xml'||ext('.kml')){return'kml'}
if(ext('.gpx'))return'gpx'
if(ext('.geojson')||ext('.json'))return'geojson'
if(f.type==='text/csv'||ext('.csv')||ext('.tsv')||ext('.dsv')){return'csv'}
if(ext('.xml')||ext('.osm'))return'osm'
if(ext('.umap'))return'umap'}
export function usableOption(options,option){return options[option]!==undefined&&options[option]!==''}
export function greedyTemplate(str,data,ignore){function getValue(data,path){let value=data
for(let i=0;i<path.length;i++){value=value[path[i]]
if(value===undefined)break}
return value}
if(typeof str!=='string')return''
return str.replace(/\{ *([^\{\}/\-]+)(?:\|("[^"]*"))? *\}/g,(str,key,staticFallback)=>{const vars=key.split('|')
let value
let path
if(staticFallback!==undefined){vars.push(staticFallback)}
for(const path of vars){if(path.startsWith('"')&&path.endsWith('"')){value=path.substring(1,path.length-1)}else{value=getValue(data,path.split('.'))}
if(value!==undefined&&value!==null)break}
if(value===undefined){if(ignore)value=str
else value=''}
return value})}
export function naturalSort(a,b,lang){a??=''
b??=''
return a.toString().toLowerCase().localeCompare(b.toString().toLowerCase(),lang||'en',{sensitivity:'base',numeric:true,})}
export function sortFeatures(features,sortKey,lang){const sortKeys=sortKey.split(',')
const sort=(a,b,i)=>{let sortKey=sortKeys[i]
let reverse=1
if(sortKey[0]==='-'){reverse=-1
sortKey=sortKey.substring(1)}
let score
const valA=a.properties[sortKey]||''
const valB=b.properties[sortKey]||''
if(!valA)score=-1
else if(!valB)score=1
else score=naturalSort(valA,valB,lang)
if(score===0&&sortKeys[i+1])return sort(a,b,i+1)
return score*reverse}
features.sort((a,b)=>{if(!a.properties||!b.properties){return 0}
return sort(a,b,0)})
return features}
export function flattenCoordinates(coords){while(coords[0]&&typeof coords[0][0]!=='number')coords=coords[0]
return coords}
export function polygonMustBeFlattened(coords){return coords.length===1&&typeof coords?.[0]?.[0]?.[0]!=='number'}
export function buildQueryString(params){const query_string=[]
for(const key in params){query_string.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)}
return query_string.join('&')}
export function getBaseUrl(){return`//${window.location.host}${window.location.pathname}`}
export function hasVar(value){return typeof value==='string'&&value.indexOf('{')!==-1}
export function isPath(value){return value?.length&&value.startsWith('/')}
export function isRemoteUrl(value){return value?.length&&value.startsWith('http')}
export function isDataImage(value){return value?.length&&value.startsWith('data:image')}
export function normalize(s){return((s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''))}
const templateRe=/\{ *([\w_ -]+) *\}/g
export function template(str,data){return str.replace(templateRe,(str,key)=>{let value=data[key]
if(value===undefined){throw new Error(`No value provided for variable ${str}`)}
if(typeof value==='function'){value=value(data)}
return value})}
const DATE_REGEX=[/^(?<year>\d{4})[\-\/](?<month>\d{2})[\-\/](?<day>\d{2})$/,/^(?<day>0[1-9]|[12][0-9]|3[01])[\-\/](?<month>0[1-9]|1[0-2])[\-\/](?<year>\d{4})/,]
export function parseNaiveDate(value){let naive
if(!value)return undefined
value=String(value)
for(const regex of DATE_REGEX){const parsed=value.match(regex)
if(parsed){const{year,month,day}=parsed.groups
naive=new Date(year,Number.parseInt(month,10)-1,Number.parseInt(day,10))
break}}
if(!naive){naive=new Date(value)}
if(isNaN(naive))return undefined
return new Date(Date.UTC(naive.getFullYear(),naive.getMonth(),naive.getDate()))}
export function toggleBadge(element,value){if(!element.nodeType)element=document.querySelector(element)
if(!element)return
if(value)element.dataset.badge=value===true?' ':value
else delete element.dataset.badge}
export function loadTemplate(html){const template=document.createElement('template')
template.innerHTML=html
return template.content.firstElementChild}
export function loadTemplateWithRefs(html){const template=document.createElement('template')
template.innerHTML=html
const element=template.content.firstElementChild
const elements={}
for(const node of template.content.querySelectorAll('[data-ref]')){elements[node.dataset.ref]=node}
return[element,elements]}
export class WithTemplate{loadTemplate(html){const[element,elements]=loadTemplateWithRefs(html)
this.element=element
this.elements=elements
return this.element}}
export function deepEqual(object1,object2){return JSON.stringify(object1)===JSON.stringify(object2)}
export function slugify(str){return(str||'data').replace(/[^a-z0-9]/gi,'_').toLowerCase()}
export function eachElement(selector,callback){for(const el of document.querySelectorAll(selector)){callback(el)}}
export class WithEvents{constructor(){this._target=new EventTarget()}
on(eventType,callback){if(typeof callback!=='function')return
this._target.addEventListener(eventType,callback)}
fire(eventType,detail){const event=new CustomEvent(eventType,{detail})
this._target.dispatchEvent(event)}}
export function isWritable(element){if(['TEXTAREA','INPUT'].includes(element.tagName))return true
if(element.isContentEditable)return true
return false}
export const debounce=(callback,wait)=>{let timeoutId=null
return(...args)=>{window.clearTimeout(timeoutId)
timeoutId=window.setTimeout(()=>{callback.apply(null,args)},wait)}}
export function setObjectValue(obj,key,value){const parts=key.split('.')
const lastKey=parts.pop()
const objectToSet=parts.reduce((currentObj,part)=>{if(currentObj!==undefined&&part in currentObj)return currentObj[part]},obj)
if(objectToSet===undefined)return
if(typeof value==='undefined'){delete objectToSet[lastKey]}else{objectToSet[lastKey]=value}}
export const COLORS=['Black','Navy','DarkBlue','MediumBlue','Blue','DarkGreen','Green','Teal','DarkCyan','DeepSkyBlue','DarkTurquoise','MediumSpringGreen','Lime','SpringGreen','Aqua','Cyan','MidnightBlue','DodgerBlue','LightSeaGreen','ForestGreen','SeaGreen','DarkSlateGray','DarkSlateGrey','LimeGreen','MediumSeaGreen','Turquoise','RoyalBlue','SteelBlue','DarkSlateBlue','MediumTurquoise','Indigo','DarkOliveGreen','CadetBlue','CornflowerBlue','MediumAquaMarine','DimGray','DimGrey','SlateBlue','OliveDrab','SlateGray','SlateGrey','LightSlateGray','LightSlateGrey','MediumSlateBlue','LawnGreen','Chartreuse','Aquamarine','Maroon','Purple','Olive','Gray','Grey','SkyBlue','LightSkyBlue','BlueViolet','DarkRed','DarkMagenta','SaddleBrown','DarkSeaGreen','LightGreen','MediumPurple','DarkViolet','PaleGreen','DarkOrchid','YellowGreen','Sienna','Brown','DarkGray','DarkGrey','LightBlue','GreenYellow','PaleTurquoise','LightSteelBlue','PowderBlue','FireBrick','DarkGoldenRod','MediumOrchid','RosyBrown','DarkKhaki','Silver','MediumVioletRed','IndianRed','Peru','Chocolate','Tan','LightGray','LightGrey','Thistle','Orchid','GoldenRod','PaleVioletRed','Crimson','Gainsboro','Plum','BurlyWood','LightCyan','Lavender','DarkSalmon','Violet','PaleGoldenRod','LightCoral','Khaki','AliceBlue','HoneyDew','Azure','SandyBrown','Wheat','Beige','WhiteSmoke','MintCream','GhostWhite','Salmon','AntiqueWhite','Linen','LightGoldenRodYellow','OldLace','Red','Fuchsia','Magenta','DeepPink','OrangeRed','Tomato','HotPink','Coral','DarkOrange','LightSalmon','Orange','LightPink','Pink','Gold','PeachPuff','NavajoWhite','Moccasin','Bisque','MistyRose','BlanchedAlmond','PapayaWhip','LavenderBlush','SeaShell','Cornsilk','LemonChiffon','FloralWhite','Snow','Yellow','LightYellow','Ivory','White',]
export const LatLngIsValid=(latlng)=>{return(Number.isFinite(latlng.lat)&&Math.abs(latlng.lat)<=90&&Number.isFinite(latlng.lng)&&Math.abs(latlng.lng)<=180)}