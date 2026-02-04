import{JSDOM}from'jsdom'
import{default as DOMPurifyInitializer}from"../../vendors/dompurify/purify.es.47ffdbe73702.js"
console.log(DOMPurifyInitializer)
export default function getPurify(){if(typeof window==='undefined'){return DOMPurifyInitializer(new JSDOM('').window)}
return DOMPurifyInitializer(window)}