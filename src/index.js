import {UICorePlugin, Events, $} from 'clappr'
import './style.sass'
import Marker from "./marker"
import StandardMarker from "./standard-marker"
import ImageMarker from "./image-marker"

export default class MarkersPlugin extends UICorePlugin {

  static get Marker() {
    return Marker
  }

  static get StandardMarker() {
    return StandardMarker
  }

  static get ImageMarker() {
    return ImageMarker
  }

  // backwards compatibility
  static get default() {
    return MarkersPlugin
  }

  get name() { return 'markers-plugin' }

  get attributes() {
    return {
      'class': this.name
    }
  }

  constructor(core) {
    super(core)
    this._markers = []
    this._duration = null
    this._createInitialMarkers()
  }

  bindEvents() {
    if (Events.CORE_ACTIVE_CONTAINER_CHANGED) {
      this.listenTo(this.core, Events.CORE_ACTIVE_CONTAINER_CHANGED, this.rebindEvents)
    }

    this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_RENDERED, this._onMediaControlRendered)
    this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_CONTAINERCHANGED, this._onMediaControlContainerChanged)
  }
 rebindEvents() {
    this.stopListening()
    this.bindEvents()
  }
  /*
   * Add a new marker.
   */
  addMarker(marker) {
    var internalMarker = this._buildInternalMarker(marker)
    this._markers.push(internalMarker)
    this._createMarkerEl(internalMarker)
    this._renderMarkers()
  }

  /*
   * Remove a marker which has previously been added.
   * Returns true if the marker was removed, false if it didn't exist.
   */
  removeMarker(marker) {
    var internalMarker = null
    var index = 0
    this._markers.some((a) => {
      if (a.source === marker) {
        internalMarker = a
        return true
      }
      index++
      return false
    })
    if (!internalMarker) {
      return false
    }
    this._removeInternalMarker(index)
    return true
  }

  _removeInternalMarker(index) {
    let internalMarker = this._markers[index]
    internalMarker.$marker.remove()
    internalMarker.emitter.off("timeChanged", internalMarker.timeChangedHandler)
    if (internalMarker.$tooltipContainer) {
      internalMarker.$tooltipContainer.remove()
    }
    if (internalMarker.tooltipChangedHandler) {
      internalMarker.emitter.off("tooltipChanged", internalMarker.tooltipChangedHandler)
    }
    internalMarker.onDestroy()
    this._markers.splice(index, 1)
  }

  /*
   * Clear all existing markers
   */
  clearMarkers() {
    if (!this._markers) {
      return
    } 
    for (let i = this._markers.length - 1; i >= 0; i--) {
      this._removeInternalMarker(i)
    }
  }

  /*
   * Get all markers
   */
  getAll() {
    return this._markers.map(internalMarker => internalMarker.source)
  }

  /*
   * Get marker by index. Can be used with removeMarker() to remove a marker by index.
   */
  getByIndex(index) {
    if (index >= this._markers.length || index < 0) {
      return null
    }
    return this._markers[index].source
  }

  _bindContainerEvents() {
    if (this._oldContainer) {
      this.stopListening(this._oldContainer, Events.CONTAINER_TIMEUPDATE, this._onTimeUpdate)
      this.stopListening(this._oldContainer, Events.CONTAINER_MEDIACONTROL_SHOW, this._onMediaControlShow)
    }
    this._oldContainer = this.core.mediaControl.container
    this.listenTo(this.core.mediaControl.container, Events.CONTAINER_TIMEUPDATE, this._onTimeUpdate)
    this.listenTo(this.core.mediaControl.container, Events.CONTAINER_MEDIACONTROL_SHOW, this._onMediaControlShow)
  }

  _getOptions() {
    if (!("markersPlugin" in this.core.options)) {
      throw "'markersPlugin' property missing from options object."
    }
    return this.core.options.markersPlugin
  }

  // build a marker object for internal use from the provided Marker
  _buildInternalMarker(marker) {
    var $tooltip = marker.getTooltipEl()
    if ($tooltip) {
      $tooltip = $($tooltip)
    }
    return {
      source: marker,
      emitter: marker.getEmitter(),
      $marker: $(marker.getMarkerEl()),
      markerLeft: null,
      $tooltip: $tooltip,
      $tooltipContainer: null,
      tooltipContainerLeft: null,
      tooltipContainerBottom: null,
      tooltipChangedHandler: null,
      time: marker.getTime(),
      timeChangedHandler: null,
      onDestroy: marker.onDestroy
    }
  }

  _createInitialMarkers() {
    var markers = this._getOptions().markers
    if (!markers) {
      return
    }
    this._markers = []
    markers.forEach((a) => {
      this._markers.push(this._buildInternalMarker(a))
    })
    
    // append the marker elements to the dom
    this._markers.forEach((marker) => {
      this._createMarkerEl(marker)
    })
    this._renderMarkers()
  }

  _createMarkerEl(marker) {
    // marker
    var $marker = marker.$marker
    marker.timeChangedHandler = () => {
      // fired from marker if it's time changes
      this._updateMarkerTime(marker)
    }
    marker.emitter.on("timeChanged", marker.timeChangedHandler)
    $marker.click((e) => {
      // when marker clicked seek to the exact time represented by the marker
      this.core.mediaControl.container.seek(marker.time)
      e.preventDefault()
      e.stopImmediatePropagation()
    })
    this._$markers.append($marker)

    // tooltip
    var $tooltip = marker.$tooltip;
    if ($tooltip) {
      // there is a tooltip
      let $tooltipContainer = $("<div />").addClass("tooltip-container")
      marker.$tooltipContainer = $tooltipContainer
      $tooltipContainer.append($tooltip)
      this._$tooltips.append($tooltipContainer)
      marker.tooltipChangedHandler = () => {
        // fired from marker if it's tooltip contents changes
        this._updateTooltipPosition(marker)
      }
      marker.emitter.on("tooltipChanged", marker.tooltipChangedHandler)
      this._updateTooltipPosition(marker)
    }
  }

  _updateMarkerTime(marker) {
    marker.time = marker.source.getTime()
    this._renderMarkers()
  }

  // calculates and sets the position of the tooltip
  _updateTooltipPosition(marker) {
    if (!this._mediaControlContainerLoaded || !this._duration) {
      // renderMarkers() will be called when it has loaded, which will call this
      return
    }
    var $tooltipContainer = marker.$tooltipContainer
    if (!$tooltipContainer) {
      // no tooltip
      return
    }
    var bottomMargin = this._getOptions().tooltipBottomMargin || 17
    var width = $tooltipContainer.width()
    var seekBarWidth = this._$tooltips.width()
    var leftPos = (seekBarWidth*(marker.time/this._duration) - (width/2))
    leftPos = Math.max(0, Math.min(leftPos, seekBarWidth - width))

    if (bottomMargin !== marker.tooltipContainerBottom || leftPos !== marker.tooltipContainerLeft) {
      $tooltipContainer.css({
        bottom: bottomMargin+"px",
        left: leftPos+"px"
      })
      marker.tooltipContainerBottom = bottomMargin
      marker.tooltipContainerLeft = leftPos
    }
  }

  _onMediaControlRendered() {
    this._appendElToMediaControl()
  }

  _updateDuration() {
    this._duration = this.core.mediaControl.container.getDuration() || null
  }

  _onMediaControlContainerChanged() {
    this._bindContainerEvents()
    this._mediaControlContainerLoaded = true
    this._updateDuration()
    this._renderMarkers()
  }

  _onTimeUpdate() {
    // need to render on time update because if duration is increasing
    // markers will need to be repositioned
    this._updateDuration()
    this._renderMarkers()
  }

  _onMediaControlShow() {
    this._renderMarkers()
  }

  _renderMarkers() {
    if (!this._mediaControlContainerLoaded || !this._duration) {
      // this will be called again once loaded, or there is a duration > 0
      return
    }
    this._markers.forEach((marker) => {
      let $el = marker.$marker
      let percentage = Math.min(Math.max((marker.time/this._duration)*100, 0), 100)
      if (marker.markerLeft !== percentage) {
        $el.css("left", percentage+"%")
        marker.markerLeft = percentage
      }
      this._updateTooltipPosition(marker)
    })
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

  destroy() {
    // remove any listeners and call onDestroy()
    this._markers.forEach((marker) => {
      if (marker.tooltipChangedHandler) {
        marker.emitter.off("timeChanged", marker.timeChangedHandler)
        marker.emitter.off("tooltipChanged", marker.tooltipChangedHandler)
      }
      marker.onDestroy()
    })
  }
}
