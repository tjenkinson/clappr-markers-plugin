(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("clappr"));
	else if(typeof define === 'function' && define.amd)
		define(["clappr"], factory);
	else if(typeof exports === 'object')
		exports["ClapprMarkersPlugin"] = factory(require("clappr"));
	else
		root["ClapprMarkersPlugin"] = factory(root["Clappr"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _clappr=__webpack_require__(1);__webpack_require__(26);var _marker=__webpack_require__(4);var _marker2=_interopRequireDefault(_marker);var _standardMarker=__webpack_require__(23);var _standardMarker2=_interopRequireDefault(_standardMarker);var _imageMarker=__webpack_require__(22);var _imageMarker2=_interopRequireDefault(_imageMarker);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var MarkersPlugin=function(_UICorePlugin){_inherits(MarkersPlugin,_UICorePlugin);_createClass(MarkersPlugin,[{key:'name',get:function get(){return'markers-plugin';}},{key:'attributes',get:function get(){return{'class':this.name};}}],[{key:'Marker',get:function get(){return _marker2.default;}},{key:'StandardMarker',get:function get(){return _standardMarker2.default;}},{key:'ImageMarker',get:function get(){return _imageMarker2.default;}// backwards compatibility
	},{key:'default',get:function get(){return MarkersPlugin;}}]);function MarkersPlugin(core){_classCallCheck(this,MarkersPlugin);var _this=_possibleConstructorReturn(this,(MarkersPlugin.__proto__||Object.getPrototypeOf(MarkersPlugin)).call(this,core));_this._markers=[];_this._duration=null;_this._createInitialMarkers();return _this;}_createClass(MarkersPlugin,[{key:'bindEvents',value:function bindEvents(){this.listenTo(this.core.mediaControl,_clappr.Events.MEDIACONTROL_RENDERED,this._onMediaControlRendered);this.listenTo(this.core.mediaControl,_clappr.Events.MEDIACONTROL_CONTAINERCHANGED,this._onMediaControlContainerChanged);}/*
	   * Add a new marker.
	   */},{key:'addMarker',value:function addMarker(marker){var internalMarker=this._buildInternalMarker(marker);this._markers.push(internalMarker);this._createMarkerEl(internalMarker);this._renderMarkers();}/*
	   * Remove a marker which has previously been added.
	   * Returns true if the marker was removed, false if it didn't exist.
	   */},{key:'removeMarker',value:function removeMarker(marker){var internalMarker=null;var index=0;this._markers.some(function(a){if(a.source===marker){internalMarker=a;return true;}index++;return false;});if(!internalMarker){return false;}this._removeInternalMarker(index);return true;}},{key:'_removeInternalMarker',value:function _removeInternalMarker(index){var internalMarker=this._markers[index];internalMarker.$marker.remove();internalMarker.emitter.off("timeChanged",internalMarker.timeChangedHandler);if(internalMarker.$tooltipContainer){internalMarker.$tooltipContainer.remove();}if(internalMarker.tooltipChangedHandler){internalMarker.emitter.off("tooltipChanged",internalMarker.tooltipChangedHandler);}internalMarker.onDestroy();this._markers.splice(index,1);}/*
	   * Clear all existing markers
	   */},{key:'clearMarkers',value:function clearMarkers(){if(!this._markers){return;}for(var i=this._markers.length-1;i>=0;i--){this._removeInternalMarker(i);}}/*
	   * Get all markers
	   */},{key:'getAll',value:function getAll(){return this._markers.map(function(internalMarker){return internalMarker.source;});}/*
	   * Get marker by index. Can be used with removeMarker() to remove a marker by index.
	   */},{key:'getByIndex',value:function getByIndex(index){if(index>=this._markers.length||index<0){return null;}return this._markers[index].source;}},{key:'_bindContainerEvents',value:function _bindContainerEvents(){if(this._oldContainer){this.stopListening(this._oldContainer,_clappr.Events.CONTAINER_TIMEUPDATE,this._onTimeUpdate);this.stopListening(this._oldContainer,_clappr.Events.CONTAINER_MEDIACONTROL_SHOW,this._onMediaControlShow);}this._oldContainer=this.core.mediaControl.container;this.listenTo(this.core.mediaControl.container,_clappr.Events.CONTAINER_TIMEUPDATE,this._onTimeUpdate);this.listenTo(this.core.mediaControl.container,_clappr.Events.CONTAINER_MEDIACONTROL_SHOW,this._onMediaControlShow);}},{key:'_getOptions',value:function _getOptions(){if(!("markersPlugin"in this.core.options)){throw"'markersPlugin' property missing from options object.";}return this.core.options.markersPlugin;}// build a marker object for internal use from the provided Marker
	},{key:'_buildInternalMarker',value:function _buildInternalMarker(marker){var $tooltip=marker.getTooltipEl();if($tooltip){$tooltip=(0,_clappr.$)($tooltip);}return{source:marker,emitter:marker.getEmitter(),$marker:(0,_clappr.$)(marker.getMarkerEl()),markerLeft:null,$tooltip:$tooltip,$tooltipContainer:null,tooltipContainerLeft:null,tooltipContainerBottom:null,tooltipChangedHandler:null,time:marker.getTime(),timeChangedHandler:null,onDestroy:marker.onDestroy};}},{key:'_createInitialMarkers',value:function _createInitialMarkers(){var _this2=this;var markers=this._getOptions().markers;if(!markers){return;}this._markers=[];markers.forEach(function(a){_this2._markers.push(_this2._buildInternalMarker(a));});// append the marker elements to the dom
	this._markers.forEach(function(marker){_this2._createMarkerEl(marker);});this._renderMarkers();}},{key:'_createMarkerEl',value:function _createMarkerEl(marker){var _this3=this;// marker
	var $marker=marker.$marker;marker.timeChangedHandler=function(){// fired from marker if it's time changes
	_this3._updateMarkerTime(marker);};marker.emitter.on("timeChanged",marker.timeChangedHandler);$marker.click(function(e){// when marker clicked seek to the exact time represented by the marker
	_this3.core.mediaControl.container.seek(marker.time);e.preventDefault();e.stopImmediatePropagation();});this._$markers.append($marker);// tooltip
	var $tooltip=marker.$tooltip;if($tooltip){// there is a tooltip
	var $tooltipContainer=(0,_clappr.$)("<div />").addClass("tooltip-container");marker.$tooltipContainer=$tooltipContainer;$tooltipContainer.append($tooltip);this._$tooltips.append($tooltipContainer);marker.tooltipChangedHandler=function(){// fired from marker if it's tooltip contents changes
	_this3._updateTooltipPosition(marker);};marker.emitter.on("tooltipChanged",marker.tooltipChangedHandler);this._updateTooltipPosition(marker);}}},{key:'_updateMarkerTime',value:function _updateMarkerTime(marker){marker.time=marker.source.getTime();this._renderMarkers();}// calculates and sets the position of the tooltip
	},{key:'_updateTooltipPosition',value:function _updateTooltipPosition(marker){if(!this._mediaControlContainerLoaded||!this._duration){// renderMarkers() will be called when it has loaded, which will call this
	return;}var $tooltipContainer=marker.$tooltipContainer;if(!$tooltipContainer){// no tooltip
	return;}var bottomMargin=this._getOptions().tooltipBottomMargin||17;var width=$tooltipContainer.width();var seekBarWidth=this._$tooltips.width();var leftPos=seekBarWidth*(marker.time/this._duration)-width/2;leftPos=Math.max(0,Math.min(leftPos,seekBarWidth-width));if(bottomMargin!==marker.tooltipContainerBottom||leftPos!==marker.tooltipContainerLeft){$tooltipContainer.css({bottom:bottomMargin+"px",left:leftPos+"px"});marker.tooltipContainerBottom=bottomMargin;marker.tooltipContainerLeft=leftPos;}}},{key:'_onMediaControlRendered',value:function _onMediaControlRendered(){this._appendElToMediaControl();}},{key:'_updateDuration',value:function _updateDuration(){this._duration=this.core.mediaControl.container.getDuration()||null;}},{key:'_onMediaControlContainerChanged',value:function _onMediaControlContainerChanged(){this._bindContainerEvents();this._mediaControlContainerLoaded=true;this._updateDuration();this._renderMarkers();}},{key:'_onTimeUpdate',value:function _onTimeUpdate(){// need to render on time update because if duration is increasing
	// markers will need to be repositioned
	this._updateDuration();this._renderMarkers();}},{key:'_onMediaControlShow',value:function _onMediaControlShow(){this._renderMarkers();}},{key:'_renderMarkers',value:function _renderMarkers(){var _this4=this;if(!this._mediaControlContainerLoaded||!this._duration){// this will be called again once loaded, or there is a duration > 0
	return;}this._markers.forEach(function(marker){var $el=marker.$marker;var percentage=Math.min(Math.max(marker.time/_this4._duration*100,0),100);if(marker.markerLeft!==percentage){$el.css("left",percentage+"%");marker.markerLeft=percentage;}_this4._updateTooltipPosition(marker);});}},{key:'_appendElToMediaControl',value:function _appendElToMediaControl(){this.core.mediaControl.$el.find(".bar-container").first().append(this.el);}},{key:'render',value:function render(){this._$markers=(0,_clappr.$)("<div />").addClass("markers-plugin-markers");this._$tooltips=(0,_clappr.$)("<div />").addClass("markers-plugin-tooltips");var $el=(0,_clappr.$)(this.el);$el.append(this._$markers);$el.append(this._$tooltips);this._appendElToMediaControl();return this;}},{key:'destroy',value:function destroy(){// remove any listeners and call onDestroy()
	this._markers.forEach(function(marker){if(marker.tooltipChangedHandler){marker.emitter.off("timeChanged",marker.timeChangedHandler);marker.emitter.off("tooltipChanged",marker.tooltipChangedHandler);}marker.onDestroy();});}}]);return MarkersPlugin;}(_clappr.UICorePlugin);exports.default=MarkersPlugin;module.exports=exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";var _undefined=__webpack_require__(7)();// Support ES3 engines
	module.exports=function(val){return val!==_undefined&&val!==null;};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _clappr=__webpack_require__(1);var _marker=__webpack_require__(4);var _marker2=_interopRequireDefault(_marker);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var BaseMarker=function(_Marker){_inherits(BaseMarker,_Marker);function BaseMarker(time){_classCallCheck(this,BaseMarker);var _this=_possibleConstructorReturn(this,(BaseMarker.__proto__||Object.getPrototypeOf(BaseMarker)).call(this));_this._time=time;_this._$marker=_this._buildMarkerEl();_this._$tooltip=null;return _this;}/*
	   * Should return the time (in seconds) that this marker represents.
	   */_createClass(BaseMarker,[{key:'getTime',value:function getTime(){return this._time;}/*
	   * Set a new time for this marker.
	   */},{key:'setTime',value:function setTime(time){this._time=time;this.notifyTimeChanged();}/*
	   * Should return the dom element which should represent the marker.
	   * It will be inserted onto the seek bar and kept at the correct location.
	   */},{key:'getMarkerEl',value:function getMarkerEl(){return this._$marker;}/*
	   * Should return the dom element which is the tool tip,
	   * or null if there is no tool tip for this marker.
	   *
	   * The tooltip will placed above the marker element, inside a container,
	   * and this containers position will be managed for you.
	   */},{key:'getTooltipEl',value:function getTooltipEl(){return this._$tooltip;}},{key:'_buildMarkerEl',value:function _buildMarkerEl(){var $marker=(0,_clappr.$)('<div />').addClass('standard-marker');$marker.append((0,_clappr.$)('<div />').addClass('standard-marker-inner'));return $marker;}/*
	   * Set the tooltip element for this marker.
	   *
	   * The tooltip will placed above the marker element, inside a container,
	   * and this containers position will be managed for you.
	   */},{key:'_setTooltipEl',value:function _setTooltipEl($el){if(this._$tooltip){throw new Error("Tooltip can only be set once.");}this._$tooltip=$el;this._addListenersForTooltip();}},{key:'_addListenersForTooltip',value:function _addListenersForTooltip(){var _this2=this;if(!this._$tooltip){return;}var $marker=this._$marker;var hovering=false;$marker.bind('mouseover',function(){if(hovering){return;}hovering=true;_this2._$tooltip.attr('data-show','1');_this2.notifyTooltipChanged();});$marker.bind('mouseout',function(){if(!hovering){return;}hovering=false;_this2._$tooltip.attr('data-show','0');});}}]);return BaseMarker;}(_marker2.default);exports.default=BaseMarker;module.exports=exports['default'];

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _eventEmitter=__webpack_require__(21);var _eventEmitter2=_interopRequireDefault(_eventEmitter);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}/*
	 * This represents and Marker and should be extended.
	 */var Marker=function(){function Marker(){_classCallCheck(this,Marker);this._emitter=new _eventEmitter2.default({});}/*
	   * Get the event emitter.
	   * Used by the plugin and notifyTooltipChanged() method
	   */_createClass(Marker,[{key:"getEmitter",value:function getEmitter(){return this._emitter;}/*
	   * Call this to notify the plugin that the time of the marker
	   * has changed so that it's position can be recalculated and changed
	   * if necessary.
	   */},{key:"notifyTimeChanged",value:function notifyTimeChanged(){this._emitter.emit("timeChanged");}/*
	   * Call this to notify the plugin that the contents of the tooltip
	   * has changed so that it's position will be recalculated and changed
	   * if necessary.
	   */},{key:"notifyTooltipChanged",value:function notifyTooltipChanged(){this._emitter.emit("tooltipChanged");}/*
	   * Should return the time (in seconds) that this marker represents.
	   */},{key:"getTime",value:function getTime(){throw"Not implemented!";}/*
	   * Should return the dom element which should represent the marker.
	   * It will be inserted onto the seek bar and kept at the correct location.
	   */},{key:"getMarkerEl",value:function getMarkerEl(){throw"Not implemented!";}/*
	   * Should return the dom element which is the tool tip,
	   * or null if there is no tool tip for this marker.
	   *
	   * The tooltip will placed above the marker element, inside a container,
	   * and this containers position will be managed for you.
	   */},{key:"getTooltipEl",value:function getTooltipEl(){throw"Not implemented!";}/*
	   * Called when the marker is removed.
	   */},{key:"onDestroy",value:function onDestroy(){// default to doing nothing
	}}]);return Marker;}();exports.default=Marker;module.exports=exports["default"];

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	"use strict";/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/// css base code, injected by the css-loader
	module.exports=function(){var list=[];// return the list of modules as css string
	list.toString=function toString(){var result=[];for(var i=0;i<this.length;i++){var item=this[i];if(item[2]){result.push("@media "+item[2]+"{"+item[1]+"}");}else{result.push(item[1]);}}return result.join("");};// import a list of modules into the list
	list.i=function(modules,mediaQuery){if(typeof modules==="string")modules=[[null,modules,""]];var alreadyImportedModules={};for(var i=0;i<this.length;i++){var id=this[i][0];if(typeof id==="number")alreadyImportedModules[id]=true;}for(i=0;i<modules.length;i++){var item=modules[i];// skip already imported module
	// this implementation is not 100% perfect for weird media query combinations
	//  when a module is imported multiple times with different media queries.
	//  I hope this will never occur (Hey this way we have smaller bundles)
	if(typeof item[0]!=="number"||!alreadyImportedModules[item[0]]){if(mediaQuery&&!item[2]){item[2]=mediaQuery;}else if(mediaQuery){item[2]="("+item[2]+") and ("+mediaQuery+")";}list.push(item);}}};return list;};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';var assign=__webpack_require__(8),normalizeOpts=__webpack_require__(15),isCallable=__webpack_require__(11),contains=__webpack_require__(18),d;d=module.exports=function(dscr,value/*, options*/){var c,e,w,options,desc;if(arguments.length<2||typeof dscr!=='string'){options=value;value=dscr;dscr=null;}else{options=arguments[2];}if(dscr==null){c=w=true;e=false;}else{c=contains.call(dscr,'c');e=contains.call(dscr,'e');w=contains.call(dscr,'w');}desc={value:value,configurable:c,enumerable:e,writable:w};return!options?desc:assign(normalizeOpts(options),desc);};d.gs=function(dscr,get,set/*, options*/){var c,e,options,desc;if(typeof dscr!=='string'){options=set;set=get;get=dscr;dscr=null;}else{options=arguments[3];}if(get==null){get=undefined;}else if(!isCallable(get)){options=get;get=set=undefined;}else if(set==null){set=undefined;}else if(!isCallable(set)){options=set;set=undefined;}if(dscr==null){c=true;e=false;}else{c=contains.call(dscr,'c');e=contains.call(dscr,'e');}desc={get:get,set:set,configurable:c,enumerable:e};return!options?desc:assign(normalizeOpts(options),desc);};

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	"use strict";// eslint-disable-next-line no-empty-function
	module.exports=function(){};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";module.exports=__webpack_require__(9)()?Object.assign:__webpack_require__(10);

/***/ }),
/* 9 */
/***/ (function(module, exports) {

	"use strict";module.exports=function(){var assign=Object.assign,obj;if(typeof assign!=="function")return false;obj={foo:"raz"};assign(obj,{bar:"dwa"},{trzy:"trzy"});return obj.foo+obj.bar+obj.trzy==="razdwatrzy";};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";var keys=__webpack_require__(12),value=__webpack_require__(17),max=Math.max;module.exports=function(dest,src/*, …srcn*/){var error,i,length=max(arguments.length,2),assign;dest=Object(value(dest));assign=function assign(key){try{dest[key]=src[key];}catch(e){if(!error)error=e;}};for(i=1;i<length;++i){src=arguments[i];keys(src).forEach(assign);}if(error!==undefined)throw error;return dest;};

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	// Deprecated
	"use strict";module.exports=function(obj){return typeof obj==="function";};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";module.exports=__webpack_require__(13)()?Object.keys:__webpack_require__(14);

/***/ }),
/* 13 */
/***/ (function(module, exports) {

	"use strict";module.exports=function(){try{Object.keys("primitive");return true;}catch(e){return false;}};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";var isValue=__webpack_require__(2);var keys=Object.keys;module.exports=function(object){return keys(isValue(object)?Object(object):object);};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";var isValue=__webpack_require__(2);var forEach=Array.prototype.forEach,create=Object.create;var process=function process(src,obj){var key;for(key in src){obj[key]=src[key];}};// eslint-disable-next-line no-unused-vars
	module.exports=function(opts1/*, …options*/){var result=create(null);forEach.call(arguments,function(options){if(!isValue(options))return;process(Object(options),result);});return result;};

/***/ }),
/* 16 */
/***/ (function(module, exports) {

	"use strict";module.exports=function(fn){if(typeof fn!=="function")throw new TypeError(fn+" is not a function");return fn;};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";var isValue=__webpack_require__(2);module.exports=function(value){if(!isValue(value))throw new TypeError("Cannot use null or undefined");return value;};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";module.exports=__webpack_require__(19)()?String.prototype.contains:__webpack_require__(20);

/***/ }),
/* 19 */
/***/ (function(module, exports) {

	"use strict";var str="razdwatrzy";module.exports=function(){if(typeof str.contains!=="function")return false;return str.contains("dwa")===true&&str.contains("foo")===false;};

/***/ }),
/* 20 */
/***/ (function(module, exports) {

	"use strict";var indexOf=String.prototype.indexOf;module.exports=function(searchString/*, position*/){return indexOf.call(this,searchString,arguments[1])>-1;};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};var d=__webpack_require__(6),callable=__webpack_require__(16),apply=Function.prototype.apply,call=Function.prototype.call,create=Object.create,defineProperty=Object.defineProperty,defineProperties=Object.defineProperties,hasOwnProperty=Object.prototype.hasOwnProperty,descriptor={configurable:true,enumerable:false,writable:true},on,_once2,off,emit,methods,descriptors,base;on=function on(type,listener){var data;callable(listener);if(!hasOwnProperty.call(this,'__ee__')){data=descriptor.value=create(null);defineProperty(this,'__ee__',descriptor);descriptor.value=null;}else{data=this.__ee__;}if(!data[type])data[type]=listener;else if(_typeof(data[type])==='object')data[type].push(listener);else data[type]=[data[type],listener];return this;};_once2=function once(type,listener){var _once,self;callable(listener);self=this;on.call(this,type,_once=function once(){off.call(self,type,_once);apply.call(listener,this,arguments);});_once.__eeOnceListener__=listener;return this;};off=function off(type,listener){var data,listeners,candidate,i;callable(listener);if(!hasOwnProperty.call(this,'__ee__'))return this;data=this.__ee__;if(!data[type])return this;listeners=data[type];if((typeof listeners==='undefined'?'undefined':_typeof(listeners))==='object'){for(i=0;candidate=listeners[i];++i){if(candidate===listener||candidate.__eeOnceListener__===listener){if(listeners.length===2)data[type]=listeners[i?0:1];else listeners.splice(i,1);}}}else{if(listeners===listener||listeners.__eeOnceListener__===listener){delete data[type];}}return this;};emit=function emit(type){var i,l,listener,listeners,args;if(!hasOwnProperty.call(this,'__ee__'))return;listeners=this.__ee__[type];if(!listeners)return;if((typeof listeners==='undefined'?'undefined':_typeof(listeners))==='object'){l=arguments.length;args=new Array(l-1);for(i=1;i<l;++i){args[i-1]=arguments[i];}listeners=listeners.slice();for(i=0;listener=listeners[i];++i){apply.call(listener,this,args);}}else{switch(arguments.length){case 1:call.call(listeners,this);break;case 2:call.call(listeners,this,arguments[1]);break;case 3:call.call(listeners,this,arguments[1],arguments[2]);break;default:l=arguments.length;args=new Array(l-1);for(i=1;i<l;++i){args[i-1]=arguments[i];}apply.call(listeners,this,args);}}};methods={on:on,once:_once2,off:off,emit:emit};descriptors={on:d(on),once:d(_once2),off:d(off),emit:d(emit)};base=defineProperties({},descriptors);module.exports=exports=function exports(o){return o==null?create(base):defineProperties(Object(o),descriptors);};exports.methods=methods;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _clappr=__webpack_require__(1);var _baseMarker=__webpack_require__(3);var _baseMarker2=_interopRequireDefault(_baseMarker);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}/*
	 * An implementation of an image Marker, which can show an image.
	 */var ImageMarker=function(_BaseMarker){_inherits(ImageMarker,_BaseMarker);/*
	   * time: the time in seconds that this marker represents
	   * tooltipImage: the image to be shown (optional)
	   * width: width for the image (Default: 200px)
	   * height: height for the image (Default: auto)
	   */function ImageMarker(time,tooltipImage,width,height){_classCallCheck(this,ImageMarker);var _this=_possibleConstructorReturn(this,(ImageMarker.__proto__||Object.getPrototypeOf(ImageMarker)).call(this,time));_this._tooltipImage=tooltipImage||null;_this._width=width||200;_this._height=height||'auto';_this._tooltipImage&&_this._setTooltipEl(_this._buildTooltipEl());return _this;}_createClass(ImageMarker,[{key:'_buildTooltipEl',value:function _buildTooltipEl(){if(!this._tooltipImage){return null;}var $img=(0,_clappr.$)('<img />').attr('src',this._tooltipImage).css({width:this._width,height:this._height});$img.one('load',this.notifyTooltipChanged.bind(this));return(0,_clappr.$)('<div />').addClass('image-tooltip').append($img);}}]);return ImageMarker;}(_baseMarker2.default);exports.default=ImageMarker;module.exports=exports['default'];

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _clappr=__webpack_require__(1);var _baseMarker=__webpack_require__(3);var _baseMarker2=_interopRequireDefault(_baseMarker);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}/*
	 * An implementation of a basic Marker, which can have a tooltip containing text.
	 */var StandardMarker=function(_BaseMarker){_inherits(StandardMarker,_BaseMarker);/*
	   * time: the time in seconds that this marker represents
	   * tooltipText: the text to be shown on the tooltip (optional)
	   */function StandardMarker(time,tooltipText){_classCallCheck(this,StandardMarker);var _this=_possibleConstructorReturn(this,(StandardMarker.__proto__||Object.getPrototypeOf(StandardMarker)).call(this,time));_this._tooltipText=tooltipText||null;_this._tooltipText&&_this._setTooltipEl(_this._buildTooltipEl());return _this;}_createClass(StandardMarker,[{key:'_buildTooltipEl',value:function _buildTooltipEl(){return(0,_clappr.$)('<div />').addClass('standard-tooltip').text(this._tooltipText);}}]);return StandardMarker;}(_baseMarker2.default);exports.default=StandardMarker;module.exports=exports['default'];

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, ".markers-plugin {\n  pointer-events: none; }\n  .markers-plugin .markers-plugin-markers {\n    overflow: hidden;\n    position: absolute;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    right: 0; }\n    .markers-plugin .markers-plugin-markers > * {\n      pointer-events: auto; }\n    .markers-plugin .markers-plugin-markers .standard-marker {\n      position: absolute;\n      -webkit-transform: translateX(-50%);\n      -moz-transform: translateX(-50%);\n      -ms-transform: translateX(-50%);\n      -o-transform: translateX(-50%);\n      transform: translateX(-50%);\n      top: 2px;\n      left: 0;\n      width: 20px;\n      height: 20px; }\n      .markers-plugin .markers-plugin-markers .standard-marker .standard-marker-inner {\n        position: absolute;\n        left: 7.5px;\n        top: 7.5px;\n        width: 5px;\n        height: 5px;\n        border-radius: 2.5px;\n        box-shadow: 0 0 0 3px rgba(200, 200, 200, 0.2);\n        background-color: #c8c8c8; }\n      .markers-plugin .markers-plugin-markers .standard-marker:hover {\n        cursor: pointer; }\n        .markers-plugin .markers-plugin-markers .standard-marker:hover .standard-marker-inner {\n          left: 6px;\n          top: 6px;\n          width: 8px;\n          height: 8px;\n          border-radius: 4px;\n          box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.2);\n          background-color: white; }\n  .markers-plugin .markers-plugin-tooltips {\n    position: relative;\n    height: 0; }\n    .markers-plugin .markers-plugin-tooltips .tooltip-container {\n      position: absolute;\n      white-space: nowrap;\n      line-height: normal; }\n      .markers-plugin .markers-plugin-tooltips .tooltip-container > * {\n        pointer-events: auto; }\n      .markers-plugin .markers-plugin-tooltips .tooltip-container .standard-tooltip, .markers-plugin .markers-plugin-tooltips .tooltip-container .image-tooltip {\n        display: none;\n        background-color: rgba(2, 2, 2, 0.5);\n        color: white;\n        font-size: 10px;\n        padding: 4px 7px;\n        line-height: normal; }\n        .markers-plugin .markers-plugin-tooltips .tooltip-container .standard-tooltip[data-show=\"1\"], .markers-plugin .markers-plugin-tooltips .tooltip-container .image-tooltip[data-show=\"1\"] {\n          display: inline-block; }\n", ""]);

	// exports


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(24);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(25)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/index.js?includePaths[]=/Users/tomjenkinson/Documents/GitHub/clappr-markers-plugin/node_modules/compass-mixins/lib!./style.sass", function() {
				var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/index.js?includePaths[]=/Users/tomjenkinson/Documents/GitHub/clappr-markers-plugin/node_modules/compass-mixins/lib!./style.sass");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ })
/******/ ])
});
;