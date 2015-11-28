import $ from 'jQuery'
import Marker from './marker'

/*
 * An implementation of a basic Marker, which can have a tooltip containing text.
 */
export default class StandardMarker extends Marker {

  /*
   * time: the time in seconds that this marker represents
   * tooltipText: the text to be shown on the tooltip (optional)
   * tooltipBottomOffset: the number of pixels above the marker to show the tooltip (optional)
   */
  constructor(time, tooltipText, tooltipBottomOffset) {
    super()
    this._time = time
    this._tooltipText = tooltipText || null
    this._tooltipBottomOffset = tooltipText ? tooltipBottomOffset || 100 : null
    this._$marker = this._buildMarkerEl()
    this._$tooltip = this._buildTooltipEl()

    // add listeners so that tooltip is shown when mouse over marker
  }

  /*
   * Should return the time (in seconds) that this marker represents.
   */
  getTime() {
    return this._time
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

  /*
   * Should return the number of pixels above the marker that the
   * tooltip should be positioned.
   *
   * If there is no tooltip this should return null.
   */
  getTooltipBottomOffset() {
    return this._tooltipBottomOffset
  }

  _buildMarkerEl() {
    return $("<div />").addClass("standard-marker")
  }

  _buildTooltipEl() {
    if (!this._tooltipText) {
      return null;
    }
    return $("<div />").addClass("standard-tooltip").text(this._tooltipText)
  }
}
