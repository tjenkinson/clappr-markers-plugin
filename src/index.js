import {UICorePlugin, Events} from 'clappr'
import $ from 'jQuery'
import './style.sass'

export default class MarkersPlugin extends UICorePlugin {
  get name() { return 'markers-plugin' }

  get attributes() {
    return {
      'class': this.name
    }
  }

  constructor(core) {
    super(core)
  }

  bindEvents() {
  
  }

  _getOptions() {
    if (!("markers" in this.core.options)) {
      throw "'markers' property missing from options object."
    }

    return this.core.options.markers
  }


  render() {
    return this
  }
}
