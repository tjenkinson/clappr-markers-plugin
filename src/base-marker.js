import { $ } from 'clappr'
import Marker from './marker'


export default class BaseMarker extends Marker {

  constructor (time) {
    super()
    this._time = time
    this._$marker = this._buildMarkerEl()
    this._$tooltip = null
  }

  /*
   * Should return the time (in seconds) that this marker represents.
   */
  getTime () {
    return this._time
  }

  /*
   * Set a new time for this marker.
   */
  setTime (time) {
    this._time = time
    this.notifyTimeChanged()
  }

  /*
   * Should return the dom element which should represent the marker.
   * It will be inserted onto the seek bar and kept at the correct location.
   */
  getMarkerEl () {
    return this._$marker
  }

  /*
   * Should return the dom element which is the tool tip,
   * or null if there is no tool tip for this marker.
   *
   * The tooltip will placed above the marker element, inside a container,
   * and this containers position will be managed for you.
   */
  getTooltipEl () {
    return this._$tooltip
  }

  _buildMarkerEl () {
    var $marker = $('<div />').addClass('standard-marker')
    $marker.append($('<div />').addClass('standard-marker-inner'))
    return $marker
  }

  /*
   * Set the tooltip element for this marker.
   *
   * The tooltip will placed above the marker element, inside a container,
   * and this containers position will be managed for you.
   */
  _setTooltipEl ($el) {
    if (this._$tooltip) {
      throw new Error("Tooltip can only be set once.")
    }
    this._$tooltip = $el
    this._addListenersForTooltip()
  }

  _addListenersForTooltip () {
    if (!this._$tooltip) {
      return
    }

    var $marker = this._$marker
    var hovering = false
    $marker.bind('mouseover', () => {
      if (hovering) {
        return
      }
      hovering = true
      this._$tooltip.attr('data-show', '1')
      this.notifyTooltipChanged()
    })

    $marker.bind('mouseout', () => {
      if (!hovering) {
        return
      }
      hovering = false
      this._$tooltip.attr('data-show', '0')
    })
  }
}
