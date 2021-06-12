function _draw () {
  let bedHeight = document.getElementById("BedHeightInput")
}

class App {
  /**
   * @param {event} event
   */
  setRamp (event) {
    event.preventDefault()
    console.log(event)
  }
}

window["rampApp"] = new App();
