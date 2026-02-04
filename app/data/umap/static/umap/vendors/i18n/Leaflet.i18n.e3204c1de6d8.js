(function(factory,window){if(typeof define==='function'&&define.amd){define(['leaflet'],factory);}else if(typeof exports==='object'){module.exports=factory(require('leaflet'));}
if(typeof window!=='undefined'&&window.L){factory(window.L);}}(function(L){L.locales={};L.locale=null;L.registerLocale=function registerLocale(code,locale){L.locales[code]=L.Util.extend({},L.locales[code],locale);};L.setLocale=function setLocale(code){L.locale=code;};return L.i18n=L._=function translate(string,data){if(L.locale&&L.locales[L.locale]&&typeof L.locales[L.locale][string]!=="undefined"){string=L.locales[L.locale][string];}
try{string=L.Util.template(string,data);}
catch(err){}
return string;};},window));