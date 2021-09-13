/**@type {HTMLCanvasElement} */
let canvas = document.getElementsByTagName('canvas').namedItem('rampCanvas')
let ctx = canvas.getContext('2d')
let infoBox = document.getElementById('infoBox')
let formElem = $('#rampForm')
let drawWireframe = false

let renderResolution = { width: 2000, height: 1200 }
let canvasSize = { width: 500, height: 300 }

//  Prevent form submission from redirecting or refreshing
formElem.on('submit', (e) => {
	e.preventDefault()
})

canvas.width = renderResolution.width
canvas.height = renderResolution.height
canvas.style.width = canvasSize.width + 'px'
canvas.style.height = canvasSize.height + 'px'

let globalScale = renderResolution.width / canvasSize.width
ctx.setTransform(globalScale, 0, 0, globalScale, 0, 0)

// The dirt bike in the image is 45.3in tall
let bikeImg = new Image()
bikeImg.src = './assets/img/dirtbike.png'
let truckImg = new Image()
truckImg.src = './assets/img/truck.png'
let bkgImg = new Image()
bkgImg.src = './assets/img/truck_background.png'
let foreImg = new Image()
foreImg.src = './assets/img/truck_foreground.png'
let rampB5Img = new Image()
rampB5Img.src = './assets/img/stepRamp.png'
let rampB6Img = new Image()
rampB6Img.src = './assets/img/stepRamp_B6.png'
let shadowImg = new Image()
shadowImg.src = './assets/img/bikeShadow.png'

function drawImageCenter(
	image, x, y, cx, cy, scale, rotation = 0, scaleX = scale
) {
	scale *= globalScale
	scaleX *= globalScale
	x *= globalScale
	y *= globalScale
	ctx.setTransform(scaleX, 0, 0, scale, x, y) // sets scale and origin
	ctx.rotate(rotation)
	ctx.drawImage(image, -cx, -cy)
	ctx.setTransform(1, 0, 0, 1, 0, 0)
}

let update = function () {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	let form = $('#rampForm').serializeArray()
	// console.log(form)
	let tri = {
		angA: 90, // Ground Bed
		angB: undefined, // Ground Ramp
		angC: undefined, // Bed Ramp
		sideA: Number(form.find((o) => o.name == 'rampModel').value), // Ramp Length
		sideB: Math.max(
			30,
			Math.min(44, Number(form.find((o) => o.name == 'bedHeight').value))
		), // Bed Height
		sideC: undefined, // Ground Depth
	}

	tri.sideC = Math.sqrt(Math.pow(tri.sideA, 2) - Math.pow(tri.sideB, 2))
	tri.angC = Math.asin(tri.sideC / tri.sideA)
	tri.angC = (90 * Math.PI) / 180 - tri.angC
	// console.log(tri.angC, tri.angC * (180/Math.PI))
	// console.log(Math.pow(tri.sideA, 2), Math.pow(tri.sideB, 2), (Math.pow(tri.sideA, 2) - Math.pow(tri.sideB, 2)))

	let rampOrigin = { x: 230, y: 230 - tri.sideB * 2 }
	let rampImg = tri.sideA == 72 ? rampB5Img : rampB6Img
	infoBox.innerHTML = `<div>Based on the input bed height, we recommend the 
		<span id="recommendedRampModel">${tri.sideB <= 35 ? 'SR-B5' : tri.sideB <= 38 ? 'SR-B5 Or SR-B6' : 'SR-B6'}
		</span></div>
		<div>Estimated slope angle: ${
	Math.round(((tri.angC * 180) / Math.PI) * 10) / 10
}&#176</div>`

	if (!drawWireframe) {
		// Draw the background, then the truck, then the foreground tire
		drawImageCenter(bkgImg, 0, 0, 0, 0, (157 / bkgImg.height) * 2)
		drawImageCenter(
			truckImg,
			0,
			rampOrigin.y - 76,
			0,
			0,
			(76 / truckImg.height) * 2
		)
		drawImageCenter(foreImg, 0, 0, 0, 0, (157 / foreImg.height) * 2)

		// Drawing the rotated ramp and dirt bike
		drawImageCenter(
			shadowImg,
			rampOrigin.x,
			200,
			0,
			0,
			(80 / shadowImg.width) * 2,
			0,
			((tri.sideC + 21) / shadowImg.width) * 2
		)
		drawImageCenter(
			rampImg,
			rampOrigin.x,
			rampOrigin.y,
			0,
			rampImg.height / 2,
			(tri.sideA / rampImg.width) * 2,
			tri.angC
		)
		drawImageCenter(
			bikeImg,
			rampOrigin.x,
			rampOrigin.y,
			0,
			bikeImg.height,
			(45 / bikeImg.height) * 2,
			tri.angC
		)
	} else {
		// Ramp Triangle Wireframe
		ctx.beginPath()
		ctx.lineJoin = 'round'
		ctx.moveTo(rampOrigin.x, rampOrigin.y) // Vertex - ang C
		ctx.lineTo(rampOrigin.x, 237) // Vertex - ang A
		ctx.lineTo(rampOrigin.x + tri.sideC * 2, 237) // Vertex - ang B
		ctx.closePath()
		// Draw the ground level line
		ctx.moveTo(0, 237)
		ctx.lineTo(400, 237)
		ctx.stroke()
	}
}

// console.log(ctx)
if (ctx) {
	bikeImg.addEventListener('load', update)
	truckImg.addEventListener('load', update)
	bkgImg.addEventListener('load', update)
	foreImg.addEventListener('load', update)
	rampB5Img.addEventListener('load', update)
	rampB6Img.addEventListener('load', update)
	shadowImg.addEventListener('load', update)
	$('form').on('change', update)
} else {
	console.error('Canvas did not return a context')
}
