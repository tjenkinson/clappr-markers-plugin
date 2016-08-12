import { $ } from 'clappr'
import BaseMarker from './base-marker'

/*
 * An implementation of an image Marker, which can show an image.
 */
export default class ImageMarker extends BaseMarker {

  /*
   * time: the time in seconds that this marker represents
   * tooltipImage: the image to be shown (optional)
   * width: width for the image (Default: 200px)
   * height: height for the image (Default: auto)
   */
  constructor (time, tooltipImage, width, height) {
    super(time)
    this._tooltipImage = tooltipImage || null
    this._width = width || 200
    this._height = height || 'auto'
    this._tooltipImage && this._setTooltipEl(this._buildTooltipEl())
  }

  _buildTooltipEl () {
    if (!this._tooltipImage) {
      return null
    }
    var $img = $('<img />').attr('src', this._tooltipImage).css({
      width: this._width,
      height: this._height
    })
    $img.one('load', this.notifyTooltipChanged.bind(this))
    return $('<div />').addClass('image-tooltip').append($img)
  }
}
