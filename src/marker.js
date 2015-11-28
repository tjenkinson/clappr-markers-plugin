/*
 * This represents and Marker and should be extended.
 */
export default class Marker {

  /*
   * Should return the time (in seconds) that this marker represents.
   */
  getTime() {
    throw "Not implemented!"
  }

  /*
   * Should return the dom element which should represent the marker.
   * It will be inserted onto the seek bar and kept at the correct location.
   */
  getMarkerEl() {
    throw "Not implemented!"
  }

  /*
   * Should return the dom element which is the tool tip,
   * or null if there is o tool tip for this marker.
   *
   * The tooltip will placed above the marker element, inside a container,
   * and this containers position will be managed for you.
   */
  getTooltipEl() {
    throw "Not implemented!"
  }
}
