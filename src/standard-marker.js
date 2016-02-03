import $ from 'jquery'
import Marker from './marker'

/*
 * An implementation of a basic Marker, which can have a tooltip containing text.
 */
export default class StandardMarker extends Marker {

  /*
   * time: the time in seconds that this marker represents
   * tooltipText: the text to be shown on the tooltip (optional)
   */
  constructor(time, tooltipText) {
    super()
    this._time = time
    this._tooltipText = tooltipText || null
    this._$marker = this._buildMarkerEl()
    this._$tooltip = this._buildTooltipEl()
    this._addListeners()
  }

  /*
   * Should return the time (in seconds) that this marker represents.
   */
  getTime() {
    return this._time
  }

  /*
   * Set a new time for this marker.
   */
  setTime(time) {
    this._time = time
    this.notifyTimeChanged()
  }

  /*
   * Should return the dom element which should represent the marker.
   * It will be inserted onto the seek bar and kept at the correct location.
   */
  getMarkerEl() {
    return this._$marker
  }

  /*
   * Should return the dom element which is the tool tip,
   * or null if there is o tool tip for this marker.
   *
   * The tooltip will placed above the marker element, inside a container,
   * and this containers position will be managed for you.
   */
  getTooltipEl() {
    return this._$tooltip
  }

  _buildMarkerEl() {
    var $marker = $("<div />").addClass("standard-marker")
    $marker.append($("<div />").addClass("standard-marker-inner"))
    return $marker
  }

  _buildTooltipEl() {
    if (!this._tooltipText) {
      return null;
    }
    return $("<div />").addClass("standard-tooltip").text(this._tooltipText)
  }

  _addListeners() {
    if (!this._$tooltip) {
      return
    }

    this._$marker.hover(() => {
      this._$tooltip.attr("data-show", "1")
      this.notifyTooltipChanged()
    }, () => {
      this._$tooltip.attr("data-show", "0")
    })
  }

}
