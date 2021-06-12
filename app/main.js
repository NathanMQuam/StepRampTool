import { ProxyState } from "./AppState.js";

function _draw () {
	let bedHeight = document.getElementById("BedHeightInput")
}

class App {
	constructor() {
		ProxyState.on("triangle", _draw)
		ProxyState.triangle = {
			angA: 90, // Ground Slope
			angB: 23.412175668573788, // Ground Ramp
			angC: 66.58782433142622, // Bed Ramp
			sideA: 72, // Ramp Length
			sideB: 32, // Bed Height
			sideC: 46.425746912091476 // Ground Depth
		}
	}
	/**
	 * @param {event} event
	 */
	setRamp (event) {
		event.preventDefault()

		let tri = ProxyState.triangle
		// let tri = {
		//   angA: 90, // Ground Slope
		//   angB: undefined, // Ground Ramp
		//   angC: undefined, // Bed Ramp
		//   sideA: undefined, // Ramp Length
		//   sideB: undefined, // Bed Height
		//   sideC: undefined // Ground Depth
		// }

		tri.sideB = document.getElementById('BedHeightInput').value
		let b5 = document.getElementById('SR-B5')
		let b6 = document.getElementById('SR-B6')
		tri.sideA = b5.checked ? b5.value : b6.value



		tri.angB = (Math.asin((tri.sideB * Math.sin(tri.angA)) / tri.sideA) * 180 / 3.1415)
		tri.angC = (180 - tri.angA - tri.angB)
		tri.sideC = (Math.abs((tri.sideA * Math.sin(tri.angC)) / Math.sin(tri.angA)))
		console.log(tri.angA + tri.angB + tri.angC)
		console.log(tri)
		ProxyState.triangle = tri
	}

	_draw () {
		// let output = document.getElementById('rampDisplay')
	}
}

window["rampApp"] = new App();
