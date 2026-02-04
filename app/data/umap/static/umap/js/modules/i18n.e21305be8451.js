import{Util}from"../../vendors/leaflet/leaflet-src.esm.8061ab6fa5db.js"
export const locales={}
export let locale=null
export function registerLocale(code,locale){locales[code]=Util.extend({},locales[code],locale)}
export function setLocale(code){locale=code}
export function getLocale(){return locale}
export function translate(string,data={}){if(locale&&locales[locale]&&locales[locale][string]!==undefined){string=locales[locale][string]}
try{string=Util.template(string,data)}catch(err){console.error(err)}
return string}