// import { ProxyState } from "./AppState.js";

/**@type {HTMLCanvasElement} */
let canvas = document.getElementsByTagName("canvas").namedItem("rampCanvas")
let ctx = canvas.getContext("2d")
// NOTE: The dirtbike in the image is 45.3in tall
let image = new Image
image.src = './assets/img/dirtbike.png'



let update = function() {
	let form = $('form').serializeArray()
	// console.log(form)
	let tri = {
		angA: 90, // Ground Bed
		angB: undefined, // Ground Ramp
		angC: undefined, // Bed Ramp
		sideA: Number(form.find(o => o.name == "rampModel").value), // Ramp Length
		sideB: Number(form.find(o => o.name == "BedHeight").value), // Bed Height
		sideC: undefined // Ground Depth
	}
	$('#BedHeightInput').attr("max", tri.sideA - 2)
	
	tri.sideC = (Math.sqrt(Math.pow(tri.sideA, 2) - Math.pow(tri.sideB, 2)))
	tri.angC = Math.asin(tri.sideC / tri.sideA)
	console.log(tri.angC, tri.angC * (180/Math.PI))
	// console.log(Math.pow(tri.sideA, 2), Math.pow(tri.sideB, 2), (Math.pow(tri.sideA, 2) - Math.pow(tri.sideB, 2)))
	

	ctx.clearRect(0, 0, canvas.width, canvas.height)
	ctx.beginPath()
	ctx.lineJoin = "round"
	ctx.moveTo(50, 50) // Vertex - ang C
	ctx.lineTo(50, 50 + tri.sideB * 2) // Vertex - ang A
	ctx.lineTo(50 + tri.sideC * 2, 50 + tri.sideB * 2) // Vertex - ang B
	ctx.closePath()
	ctx.stroke()

	function drawImageCenter(image, x, y, cx, cy, scale, rotation){
		// console.log('Drawing bike')
    ctx.setTransform(scale, 0, 0, scale, x, y) // sets scale and origin
    ctx.rotate(rotation)
    ctx.drawImage(image, -cx, -cy)
		ctx.setTransform(1,0,0,1,0,0)
	} 

	// Drawing the rotated dirtbike image
	console.log(image.height, 45, 45/image.height)
	drawImageCenter(image, 50, 50, 0, image.height, 45/image.height*2, (90*Math.PI/180) - tri.angC)
	// ctx.drawImage(image, 100, 50)
	// ctx.setTransform(0.5, 0, 0, 0.5, 50, 50)
	// ctx.rotate(0.4)
	// ctx.drawImage(image, 1, 1)
	// ctx.setTransform(1,0,0,1,0,0)
}



// console.log(ctx)
if(ctx) {
	image.addEventListener('load', update)
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
