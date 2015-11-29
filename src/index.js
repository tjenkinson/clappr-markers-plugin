import {UICorePlugin, Events} from 'clappr'
import $ from 'jQuery'
import './style.sass'
import StandardMarker from "./standard-marker"
import MarkerHandle from "./marker-handle"

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
        $marker: $(a.getMarkerEl()),
        markerLeft: null,
        $tooltip: $tooltip,
        $tooltipContainer: null,
        tooltipContainerLeft: null,
        tooltipContainerBottom: null,
        time: a.getTime()
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
      // TODO this will change to seek() when clappr updated with actual time
      this.core.mediaControl.container.setCurrentTime(markerTime/this.core.mediaControl.container.getDuration()*100)
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
    // TODO extract some measurments out to globals and so an updateCalculations method
    var bottomMargin = this._getOptions().tooltipBottomMargin || 17
    var width = $tooltipContainer.width()
    var seekBarWidth = this._$tooltips.width()
    var mediaDuration = this.core.mediaControl.container.getDuration()
    var leftPos = seekBarWidth*(marker.time/mediaDuration)
    leftPos -= (width/2)
    if (bottomMargin !== marker.tooltipContainerBottom || leftPos !== marker.tooltipContainerLeft) {
      $tooltipContainer.css({
        bottom: bottomMargin+"px",
        left: leftPos+"px"
      })
      marker.tooltipContainerBottom = bottomMargin
      marker.tooltipContainerLeft = leftPos
    }
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
}

export default MarkersPlugin
export {StandardMarker as StandardMarker}