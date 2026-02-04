const EVENT_PREFIX='umap'
export class uMapElement extends HTMLElement{static emit(type,detail={}){const event=new CustomEvent(`${EVENT_PREFIX}:${type}`,{bubbles:true,cancelable:true,detail:detail,})
return document.dispatchEvent(event)}
get template(){return document.getElementById(this.getAttribute('template')||`${this.localName}-template`).content.cloneNode(true)}
constructor(){super()
this.append(this.template)}
handleEvent(event){event.preventDefault()
const eventName=event.type.replace(`${EVENT_PREFIX}:`,'')
this[`on${eventName.charAt(0).toUpperCase() + eventName.slice(1)}`](event)}
listen(eventName){document.addEventListener(`${EVENT_PREFIX}:${eventName}`,this)}}
export function register(klass,name){if('customElements'in globalThis&&!customElements.get(name)){customElements.define(name,klass)}}