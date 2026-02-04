import*as Utils from"./utils.e02e0d0b0995.js"
import{translate}from"./i18n.e21305be8451.js"
import Tooltip from"./ui/tooltip.9cd96308ee03.js"
export const copyToClipboard=(textToCopy)=>{const tooltip=new Tooltip()
if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(textToCopy)}else{const textArea=document.createElement('textarea')
textArea.value=textToCopy
textArea.style.position='absolute'
textArea.style.left='-999999px'
document.body.prepend(textArea)
textArea.select()
try{document.execCommand('copy')}catch(error){console.error(error)}finally{textArea.remove()}}
tooltip.open({content:translate('✅ Copied!'),duration:5000})}
export const copiableInput=(parent,label,value)=>{const[container,{input,button}]=Utils.loadTemplateWithRefs(`
    <div class="copiable-input">
      <label>${label}<input type="text" readOnly value="${value}" data-ref=input /></label>
      <button type="button" class="icon icon-24 icon-copy" title="${translate('copy')}" data-ref=button></button>
    </div>
  `)
button.addEventListener('click',()=>copyToClipboard(input.value))
parent.appendChild(container)
return input}
const colourMod=(colour)=>{const sRGB=colour/255
let mod=((sRGB+0.055)/1.055)**2.4
if(sRGB<0.03928)mod=sRGB/12.92
return mod}
const RGBRegex=/rgb *\( *([0-9]{1,3}) *, *([0-9]{1,3}) *, *([0-9]{1,3}) *\)/
export const textColorFromBackgroundColor=(el,bgcolor)=>{return contrastedColor(el,bgcolor)?'#ffffff':'#000000'}
const contrastWCAG21=(rgb)=>{const[r,g,b]=rgb
const lum=0.2126*colourMod(r)+0.7152*colourMod(g)+0.0722*colourMod(b)
const whiteLum=1
const contrast=(whiteLum+0.05)/(lum+0.05)
return contrast>3?1:0}
const colorNameToHex=(str)=>{const ctx=document.createElement('canvas').getContext('2d')
ctx.fillStyle=str
return ctx.fillStyle}
export const hexToRGB=(hex)=>{return hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,(m,r,g,b)=>`#${r}${r}${g}${g}${b}${b}`).substring(1).match(/.{2}/g).map((x)=>Number.parseInt(x,16))}
const CACHE_CONTRAST={}
export const contrastedColor=(el,bgcolor)=>{if(typeof CACHE_CONTRAST[bgcolor]!=='undefined')return CACHE_CONTRAST[bgcolor]
let rgb=window.getComputedStyle(el).getPropertyValue('background-color')
rgb=RGBRegex.exec(rgb)
if(rgb&&rgb.length===4){rgb=[Number.parseInt(rgb[1],10),Number.parseInt(rgb[2],10),Number.parseInt(rgb[3],10),]}else{const hex=colorNameToHex(bgcolor)
rgb=hexToRGB(hex)}
if(!rgb)return 1
const out=contrastWCAG21(rgb)
if(bgcolor)CACHE_CONTRAST[bgcolor]=out
return out}