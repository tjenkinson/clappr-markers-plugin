import {UICorePlugin, Events} from 'clappr'
import $ from 'jQuery'
import './style.sass'
import StandardMarker from "./standard-marker"

class MarkersPlugin extends UICorePlugin {
  get name() { return 'markers-plugin' }

  get attributes() {
    return {
      'class': this.name
    }
  }

  constructor(core) {
    super(core)
    this._createInitialMarkers()
  }

  bindEvents() {
    this.listenTo(this.core.mediaControl.container, Events.CONTAINER_TIMEUPDATE, this.onTimeUpdate)
  }

  _getOptions() {
    if (!("markersPlugin" in this.core.options)) {
      throw "'markersPlugin' property missing from options object."
    }
    return this.core.options.markersPlugin
  }

  _createInitialMarkers() {
    var markers = this._getOptions().markers
    if (!markers) {
      return
    }
    this._markers = markers.slice(0)
    // append the marker elements to the dom
    for(let marker of this._markers) {
      let $el = $(marker.getMarkerEl())
      let markerTime = marker.getTime()
      $el.click((e) => {
        // when marker clicked seek to the exact time represented by the marker
        // TODO this will change to seek() when clappr updated with actual time
        this.core.mediaControl.container.setCurrentTime(markerTime/this.core.mediaControl.container.getDuration()*100)
        e.preventDefault()
        e.stopImmediatePropagation()
      })
      this._$markers.append($el)
    }
    this._renderMarkers()
  }

  _onTimeUpdate() {
    this._renderMarkers()
  }

  _renderMarkers() {
    var mediaDuration = this.core.mediaControl.container.getDuration()
    for(let marker of this._markers) {
      let $el = marker.getMarkerEl()
      let percentage = Math.min(Math.max((marker.getTime()/mediaDuration)*100, 0), 100)
      $el.css("left", percentage+"%")
    }
  }

  _appendElToMediaControl() {
    this.core.mediaControl.$el.find(".bar-container").first().append(this.el)
  }

  render() {
    this._$markers = $("<div />").addClass("markers-plugin-markers")
    this._$tooltips = $("<div />").addClass("markers-plugin-tooltips")
    var $el = $(this.el)
    $el.append(this._$markers)
    $el.append(this._$tooltips)
    this._appendElToMediaControl()
    return this
  }
}

export default MarkersPlugin
export {StandardMarker as StandardMarker}