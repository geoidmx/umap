import{DomEvent}from"../../../vendors/leaflet/leaflet-src.esm.8061ab6fa5db.js"
import{translate}from"../i18n.e21305be8451.js"
import*as Utils from"../utils.f29154930320.js"
import{Positioned}from"./base.28f7581bc42e.js"
export default class Tooltip extends Positioned{constructor(){super()
this.parent=document.body
this.container=Utils.loadTemplate('<div class="umap-tooltip-container"></div>')
DomEvent.disableClickPropagation(this.container)
this.container.addEventListener('contextmenu',(event)=>event.stopPropagation())
this.container.addEventListener('wheel',(event)=>event.stopPropagation())
this.container.addEventListener('MozMousePixelScroll',(event)=>event.stopPropagation())}
open(opts){this.container.classList.toggle('tooltip-accent',Boolean(opts.accent))
const showIt=()=>{if(opts.content.nodeType===1){this.container.appendChild(opts.content)}else{this.container.innerHTML=Utils.escapeHTML(opts.content)}
this.parent.appendChild(this.container)
this.openAt(opts)}
this.TOOLTIP_ID=window.setTimeout(()=>showIt(),opts.delay||0)
const id=this.TOOLTIP_ID
const closeIt=()=>{this.close(id)}
if(opts.anchor){opts.anchor.addEventListener('mouseout',closeIt,{once:true})}
if(opts.duration!==Number.POSITIVE_INFINITY){window.setTimeout(closeIt,opts.duration||3000)}}
close(id){window.clearTimeout(id)
if(id&&id!==this.TOOLTIP_ID)return
this.toggleClassPosition()
this.container.innerHTML=''
this.setPosition({})
if(this.parent.contains(this.container)){this.parent.removeChild(this.container)}}}