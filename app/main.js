// import { ProxyState } from "./AppState.js";

/**@type {HTMLCanvasElement} */
let canvas = document.getElementsByTagName("canvas").namedItem("rampCanvas")
let ctx = canvas.getContext("2d")



let update = function() {
	let form = $('form').serializeArray()
	// console.log(form)
	let tri = {
		angA: 90, // Ground Bed
		// angB: undefined, // Ground Ramp
		// angC: undefined, // Bed Ramp
		sideA: Number(form.find(o => o.name == "rampModel").value), // Ramp Length
		sideB: Number(form.find(o => o.name == "BedHeight").value), // Bed Height
		sideC: undefined // Ground Depth
	}
	$('#BedHeightInput').attr("max", tri.sideA - 2)
	
	tri.sideC = (Math.sqrt(Math.pow(tri.sideA, 2) - Math.pow(tri.sideB, 2)))
	// console.log(Math.pow(tri.sideA, 2), Math.pow(tri.sideB, 2), (Math.pow(tri.sideA, 2) - Math.pow(tri.sideB, 2)))
	

	ctx.clearRect(0, 0, canvas.width, canvas.height)
	ctx.beginPath()
	ctx.lineJoin = "round"
	ctx.moveTo(50, 50) // ang C
	ctx.lineTo(50, 50 + tri.sideB * 2) // ang A
	ctx.lineTo(50 + tri.sideC * 2, 50 + tri.sideB * 2) // ang B
	ctx.closePath()
	ctx.stroke()
}



// console.log(ctx)
if(ctx) {
	update()
	$('form').on('change', update)
} else {
	console.error('Canvas did not return a context')
}



class App {
	constructor() {

	}
	/**
	 * @param {event} event
	 */
	setRamp (event) {
		event.preventDefault()
	}

	_draw () {
		// let output = document.getElementById('rampDisplay')
	}
}

window["rampApp"] = new App();
