import { $ } from 'clappr'
import StandardMarker from './standard-marker'

/*
 * An implementation of an image Marker, which can show an image.
 */
export default class ImageMarker extends StandardMarker {

  /*
   * time: the time in seconds that this marker represents
   * tooltipImage: the image to be shown (optional)
   * width: width for the image (Default: 200px)
   * height: height for the image (Default: auto)
   */
  constructor (time, tooltipImage, width, height) {
    super(time, tooltipImage)
    this._tooltipText = tooltipImage || null
    this._width = width || 200
    this._height = height || 'auto'
    this._$marker = this._buildMarkerEl()
    this._$tooltip = this._buildTooltipEl()
    this._addListeners()
  }

  _buildTooltipEl () {
    if (!this._tooltipText) {
      return null
    }
    var $img = $('<img />').attr('src', this._tooltipText).css({
      width: this._width,
      height: this._height
    })
    $img.one('load', this.notifyTooltipChanged.bind(this))
    return $('<div />').addClass('standard-tooltip').append($img)
  }

  _addListeners () {
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
