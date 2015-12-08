import {UICorePlugin, Events} from 'clappr'
import $ from 'jQuery'
import './style.sass'
import Marker from "./marker"
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
    this._markers = []
    this._createInitialMarkers()
  }

  bindEvents() {
    this.listenTo(this.core.mediaControl.container, Events.CONTAINER_TIMEUPDATE, this._onTimeUpdate)
    this.listenTo(this.core.mediaControl.container, Events.CONTAINER_MEDIACONTROL_SHOW, this._onMediaControlShow)
    this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_RENDERED, this._onMediaControlRendered)
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
    this._markers = Array.from(markers, (a) => {
      var $tooltip = a.getTooltipEl()
      if ($tooltip) {
        $tooltip = $($tooltip)
      }
      return {
        emitter: a.getEmitter(),
        $marker: $(a.getMarkerEl()),
        markerLeft: null,
        $tooltip: $tooltip,
        $tooltipContainer: null,
        tooltipContainerLeft: null,
        tooltipContainerBottom: null,
        tooltipChangedHandler: null,
        time: a.getTime(),
        onDestroy: a.onDestroy
      }
    })
    // append the marker elements to the dom
    for(let marker of this._markers) {
      this._createMarker(marker)
    }
    this._renderMarkers()
  }

  _createMarker(marker) {
    // marker
    var $marker = marker.$marker
    var markerTime = marker.time
    $marker.click((e) => {
      // when marker clicked seek to the exact time represented by the marker
      this.core.mediaControl.container.seek(markerTime)
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

  // calculates and sets the position of the tooltip
  _updateTooltipPosition(marker) {
    var $tooltipContainer = marker.$tooltipContainer
    if (!$tooltipContainer) {
      // no tooltip
      return
    }
    var bottomMargin = this._getOptions().tooltipBottomMargin || 17
    var width = $tooltipContainer.width()
    var seekBarWidth = this._$tooltips.width()
    var mediaDuration = this.core.mediaControl.container.getDuration()
    var leftPos = (seekBarWidth*(marker.time/mediaDuration)) - (width/2)
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

  _onTimeUpdate() {
    // need to render on time update because if duration is increasing
    // markers will need to be repositioned
    this._renderMarkers()
  }

  _onMediaControlShow() {
    this._renderMarkers()
  }

  _renderMarkers() {
    var mediaDuration = this.core.mediaControl.container.getDuration()
    for(let marker of this._markers) {
      let $el = marker.$marker
      let percentage = Math.min(Math.max((marker.time/mediaDuration)*100, 0), 100)
      if (marker.markerLeft !== percentage) {
        $el.css("left", percentage+"%")
        marker.markerLeft = percentage
      }
      this._updateTooltipPosition(marker)
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

  destroy() {
    // remove any listeners and call onDestroy()
    for(let marker of this._markers) {
      if (marker.tooltipChangedHandler) {
        marker.emitter.off("tooltipChanged", marker.tooltipChangedHandler)
      }
      marker.onDestroy()
    }
  }
}

export default MarkersPlugin
export {Marker as Marker}
export {StandardMarker as StandardMarker}