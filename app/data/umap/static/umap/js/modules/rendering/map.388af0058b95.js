import{Map as BaseMap,Browser,Control,DomEvent,latLng,LatLng,LatLngBounds,setOptions,TileLayer,}from"../../../vendors/leaflet/leaflet-src.esm.8061ab6fa5db.js"
import{uMapAlert as Alert}from"../../components/alerts/alert.23a48eacc80d.js"
import DropControl from"../drop.cd7ea1245af6.js"
import{translate}from"../i18n.e21305be8451.js"
import{AttributionControl,CaptionControl,DataLayersControl,EmbedControl,EditControl,HomeControl,MoreControl,PermanentCreditsControl,TileLayerChooser,LoadTemplateControl,PrintControl,SearchControl,}from"./controls.89757c44a16a.js"
import*as Utils from"../utils.f29154930320.js"
import*as Icon from"./icon.8bf06d4a2f9f.js"
BaseMap.mergeOptions({demoTileInfos:{s:'a',z:9,x:265,y:181,'-y':181,r:''},attributionControl:false,})
const ControlsMixin={HIDDABLE_CONTROLS:['home','zoom','search','fullscreen','embed','datalayers','caption','locate','measure','print','tilelayers',],initControls:function(){this._controls={}
if(this._umap.properties.is_template&&!this.options.noControl){new LoadTemplateControl(this).addTo(this)}
if(this._umap.hasEditMode()&&!this.options.noControl){new EditControl(this).addTo(this)}
this._controls.home=new HomeControl(this._umap)
this._controls.zoom=new Control.Zoom({zoomInTitle:translate('Zoom in'),zoomOutTitle:translate('Zoom out'),})
this._controls.datalayers=new DataLayersControl(this._umap)
this._controls.caption=new CaptionControl(this._umap)
this._controls.locate=new U.Locate(this,{strings:{title:translate('Center map on your location'),},showPopup:false,icon:'umap-fake-class',iconLoading:'umap-fake-class',flyTo:this.options.easing,onLocationError:(err)=>U.Alert.error(err.message),})
this._controls.fullscreen=new Control.Fullscreen({title:{false:translate('View Fullscreen'),true:translate('Exit Fullscreen'),},})
this._controls.search=new SearchControl(this._umap)
this._controls.embed=new EmbedControl(this._umap)
this._controls.print=new PrintControl(this._umap)
this._controls.tilelayersChooser=new TileLayerChooser(this._umap)
this._controls.measure=new L.MeasureControl().initHandler(this)
this._controls.more=new MoreControl()
this._controls.scale=new Control.Scale()
this._controls.permanentCredit=new PermanentCreditsControl(this)
this._umap.drop=new DropControl(this._umap,this,this._container)
this._controls.tilelayers=new U.TileLayerControl(this)},renderControls:function(){for(const control of Object.values(this._controls)){this.removeControl(control)}
if(this.options.noControl)return
this._controls.attribution=new AttributionControl().addTo(this)
if(this.options.miniMap){this.whenReady(function(){if(this.selectedTilelayer){this._controls.miniMap=new Control.MiniMap(this.selectedTilelayer,{aimingRectOptions:{color:this._umap.getProperty('color'),fillColor:this._umap.getProperty('fillColor'),stroke:this._umap.getProperty('stroke'),fill:this._umap.getProperty('fill'),weight:this._umap.getProperty('weight'),opacity:this._umap.getProperty('opacity'),fillOpacity:this._umap.getProperty('fillOpacity'),},}).addTo(this)
this._controls.miniMap._miniMap.invalidateSize()}})}
for(const name of this.HIDDABLE_CONTROLS){const status=this._umap.getProperty(`${name}Control`)
if(status===false)continue
const control=this._controls[name]
if(!control)continue
control.addTo(this)
control._container.classList.toggle('display-on-more',status===undefined||status===null)}
if(this._umap.getProperty('permanentCredit'))
this._controls.permanentCredit.addTo(this)
if(this._umap.getProperty('moreControl'))this._controls.more.addTo(this)
if(this._umap.getProperty('scaleControl'))this._controls.scale.addTo(this)
this._controls.tilelayers.setLayers()},}
const ManageTilelayerMixin={initTileLayers:function(){this.pullProperties()
this.tilelayers=[]
for(const props of this.options.tilelayers){const layer=this.createTileLayer(props)
this.tilelayers.push(layer)
if(this.options.tilelayer&&this.options.tilelayer.url_template===props.url_template){this.options.tilelayer.attribution=props.attribution}}
if(this.options.tilelayer?.url_template&&this.options.tilelayer.attribution){this.customTilelayer=this.createTileLayer(this.options.tilelayer)
this.selectTileLayer(this.customTilelayer)}else{this.selectTileLayer(this.tilelayers[0])}
if(this._controls)this._controls.tilelayers.setLayers()},createTileLayer:(tilelayer)=>new TileLayer(tilelayer.url_template,tilelayer),selectTileLayer:function(tilelayer){if(tilelayer===this.selectedTilelayer){return}
try{this.addLayer(tilelayer)
this.fire('baselayerchange',{layer:tilelayer})
if(this.selectedTilelayer){this.removeLayer(this.selectedTilelayer)}
this.selectedTilelayer=tilelayer
if(!Number.isNaN(this.selectedTilelayer.options.minZoom)&&this.getZoom()<this.selectedTilelayer.options.minZoom){this.setZoom(this.selectedTilelayer.options.minZoom)}
if(!Number.isNaN(this.selectedTilelayer.options.maxZoom)&&this.getZoom()>this.selectedTilelayer.options.maxZoom){this.setZoom(this.selectedTilelayer.options.maxZoom)}}catch(e){console.error(e)
this.removeLayer(tilelayer)
Alert.error(`${translate('Error in the tilelayer URL')}: ${tilelayer._url}`)}
this.setOverlay()},eachTileLayer:function(callback,context){const urls=[]
const callOne=(layer)=>{const url=layer.options.url_template
if(urls.indexOf(url)!==-1)return
callback.call(context,layer)
urls.push(url)}
if(this.selectedTilelayer)callOne(this.selectedTilelayer)
if(this.customTilelayer)callOne(this.customTilelayer)
this.tilelayers.forEach(callOne)},setOverlay:function(){if(!this.options.overlay||!this.options.overlay.url_template)return
const overlay=this.createTileLayer(this.options.overlay)
try{this.addLayer(overlay)
if(this.overlay)this.removeLayer(this.overlay)
this.overlay=overlay}catch(e){this.removeLayer(overlay)
console.error(e)
Alert.error(`${translate('Error in the overlay URL')}: ${overlay._url}`)}},editTileLayers:function(){if(this._controls.tilelayersChooser){this._controls.tilelayersChooser.openSwitcher({edit:true})}},}
export const LeafletMap=BaseMap.extend({includes:[ControlsMixin,ManageTilelayerMixin],initialize:function(umap,element){this._umap=umap
const options=this._umap.properties
BaseMap.prototype.initialize.call(this,element,options)
this.loader=new Control.Loading()
this.loader.onAdd(this)
if(!this.options.noControl){DomEvent.on(document.body,'dataloading',(event)=>this.fire('dataloading',event.detail))
DomEvent.on(document.body,'dataload',(event)=>this.fire('dataload',event.detail))}
this.on('baselayerchange',(e)=>{if(this._controls.miniMap)this._controls.miniMap.onMainMapBaseLayerChange(e)})},setup:function(){this.initControls()
this.initCenter()
this.initTileLayers()
this.renderUI()},pullProperties(){setOptions(this,this._umap.properties)},renderUI:function(){this.pullProperties()
if(this.options.scrollWheelZoom){this.scrollWheelZoom.enable()
this.dragging.enable()}else{this.scrollWheelZoom.disable()
if(Browser.mobile)this.dragging.disable()}
this.renderControls()
this.handleLimitBounds()},latLng:(a,b,c)=>{if(!(a instanceof LatLng)&&a.coordinates){a=[a.coordinates[1],a.coordinates[0]]}
return latLng(a,b,c)},_setDefaultCenter:function(){this.options.center=this.latLng(this.options.center)
this.setView(this.options.center,this.options.zoom)},initCenter:function(){this._setDefaultCenter()
if(this.options.hash)this.addHash()
if(this.options.hash&&this._hash.parseHash(location.hash)){this._hash.update()}else if(this.options.defaultView==='locate'&&!this.options.noControl){this._controls.locate.start()}else if(this.options.defaultView==='data'){this._umap.onceDataLoaded(this._umap.fitDataBounds)}else if(this.options.defaultView==='latest'){this._umap.onceDataLoaded(()=>{if(!this._umap.hasData())return
const datalayer=this._umap.datalayers.visible()[0]
let feature
if(datalayer){const feature=datalayer.features.last()
if(feature){feature.zoomTo({callback:this.options.noControl?null:feature.view})
return}}})}},handleLimitBounds:function(){const south=Number.parseFloat(this.options.limitBounds.south)
const west=Number.parseFloat(this.options.limitBounds.west)
const north=Number.parseFloat(this.options.limitBounds.north)
const east=Number.parseFloat(this.options.limitBounds.east)
if(!Number.isNaN(south)&&!Number.isNaN(west)&&!Number.isNaN(north)&&!Number.isNaN(east)){const bounds=new LatLngBounds([[south,west],[north,east],])
this.options.minZoom=this.getBoundsZoom(bounds,false)
try{this.setMaxBounds(bounds)}catch(e){console.error('Error limiting bounds',e)}}else{this.options.minZoom=0
this.setMaxBounds()}},setMaxBounds:function(bounds){bounds=new LatLngBounds(bounds)
if(!bounds.isValid()){this.options.maxBounds=null
return this.off('moveend',this._panInsideMaxBounds)}
return BaseMap.prototype.setMaxBounds.call(this,bounds)},getLayersBounds:(layers)=>{const bounds=new LatLngBounds()
for(const layer of layers){bounds.extend(layer.getBounds())}
return bounds},initEditTools:function(){this.editTools=new U.Editable(this._umap)},})