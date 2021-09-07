// import { ProxyState } from "./AppState.js";

/**@type {HTMLCanvasElement} */
let canvas = document.getElementsByTagName("canvas").namedItem("rampCanvas")
let ctx = canvas.getContext("2d")
let infoBox = document.getElementById('infoBox')

// NOTE: The dirtbike in the image is 45.3in tall
let bikeImg = new Image
bikeImg.src = './assets/img/dirtbike.png'
let truckImg = new Image
truckImg.src = './assets/img/truck.png'
let bkgImg = new Image
bkgImg.src = './assets/img/truck_background.png'
let foreImg = new Image
foreImg.src = './assets/img/truck_foreground.png'
let rampB5Img = new Image
rampB5Img.src = './assets/img/stepRamp.png'
let rampB6Img = new Image
rampB6Img.src = './assets/img/stepRamp_B6.png'



function drawImageCenter(image, x, y, cx, cy, scale, rotation = 0){
		// console.log('Drawing bike')
		ctx.setTransform(scale, 0, 0, scale, x, y) // sets scale and origin
		ctx.rotate(rotation)
		ctx.drawImage(image, -cx, -cy)
		ctx.setTransform(1,0,0,1,0,0)
	} 



let update = function() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
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
	
	tri.sideC = (Math.sqrt(Math.pow(tri.sideA, 2) - Math.pow(tri.sideB, 2)))
	tri.angC = Math.asin(tri.sideC / tri.sideA)
	tri.angC = (90*Math.PI/180) - tri.angC
	// console.log(tri.angC, tri.angC * (180/Math.PI))
	// console.log(Math.pow(tri.sideA, 2), Math.pow(tri.sideB, 2), (Math.pow(tri.sideA, 2) - Math.pow(tri.sideB, 2)))
	
	let rampOrigin = {x: (230), y: (237 - tri.sideB * 2)}
	
	drawImageCenter(bkgImg, 0, 0, 0, 0, 157/bkgImg.height*2)
	drawImageCenter(truckImg, 0, (rampOrigin.y) - (76), 0, 0, 76/truckImg.height*2)
	drawImageCenter(foreImg, 0, 0, 0, 0, 157/foreImg.height*2)

	let rampImg = tri.sideA == 72 ? rampB5Img : rampB6Img
	infoBox.innerHTML = `<div>Based on the input bed height, we recommend the 
		<span id="recommendedRampModel">${ (tri.sideB <= 37 ? 'SR-B5' : 'SR-B6') }
		</span> model Step Ramp.</div>
		<div>Estimated slope angle: ${Math.round((tri.angC * 180/Math.PI) * 10)/10}&#176;</div>`

	// Ramp Triangle Wireframe
	// ctx.beginPath()
	// ctx.lineJoin = "round"
	// ctx.moveTo(rampOrigin.x, rampOrigin.y) // Vertex - ang C
	// ctx.lineTo(rampOrigin.x, 237) // Vertex - ang A
	// ctx.lineTo(rampOrigin.x + tri.sideC * 2, 237) // Vertex - ang B
	// ctx.closePath()
	// ctx.stroke()

	// Drawing the rotated dirtbike image and ramp image
	// console.log(image.height, 45, 45/image.height)
	drawImageCenter(rampImg, rampOrigin.x, rampOrigin.y, 0, rampImg.height/2, tri.sideA/rampImg.width*2, tri.angC)
	drawImageCenter(bikeImg, rampOrigin.x, rampOrigin.y, 0, bikeImg.height, 45/bikeImg.height*2, tri.angC)
}



// console.log(ctx)
if(ctx) {
	bikeImg.addEventListener('load', update)
	truckImg.addEventListener('load', update)
	bkgImg.addEventListener('load', update)
	foreImg.addEventListener('load', update)
	rampB5Img.addEventListener('load', update)
	rampB6Img.addEventListener('load', update)
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
