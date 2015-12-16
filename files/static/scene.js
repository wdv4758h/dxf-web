var container, stats;

var camera, scene, renderer;
var group, grid_xz, grid_xy;

var targetRotation = 0;
var targetRotationOnMouseDown = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

	var h = document.getElementById('canvas').offsetHeight;
	var w = document.getElementById('canvas').offsetWidth;
var windowHalfX = w / 2;
var windowHalfY = h / 2;

var max = {
	x: 0,
	y: 0,
	z: 0
}
var min = {
	x: 0,
	y: 0,
	z: 0
}

// init base grid
var init = function() {

	var height = document.getElementById('canvas').offsetHeight;
	var width = document.getElementById('canvas').offsetWidth;

	camera = new THREE.PerspectiveCamera( 70, width / height, 1, 2000 );
	camera.position.z = 300;
	camera.position.x = 100;
	camera.position.y = 10;

	scene = new THREE.Scene();
	scene.add( new THREE.AmbientLight( 0x808080 ) );

	var light = new THREE.DirectionalLight( 0xffffff, 1 );
	light.position.set( 1, 1, 1 );
	scene.add( light );

	grid_xy = new THREE.GridHelper( 2000, 100 );
	//grid_xy.setColors( 0xff7777, 0xf0f0f0 );
	grid_xy.setColors(0xff7777, 0x109910);
	grid_xy.rotateOnAxis(new THREE.Vector3(1,0,0), 90* Math.PI/180)
	scene.add( grid_xy );
	grid_xz = new THREE.GridHelper( 2000, 100 );
	grid_xz.setColors( 0x7777ff, 0xccccff );
	scene.add( grid_xz );

	group = new THREE.Group();
	//group.position.y = 170;
	scene.add( group );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setClearColor( 0xf0f0f0 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( width, height );
	document.getElementById('canvas').appendChild( renderer.domElement );

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );

	window.addEventListener( 'resize', onWindowResize, false );

}

function load_splines(splines) {
	console.log("Loading splines");
	for (spline of splines) {
		var nurbsControlPoints = [];
		for (c of spline.ctrlp) {
			c.push(1); // add weight=1 information
			if ( c[0] < min.x ) {
				min.x = c[0];
			}
			if ( c[1] < min.y ) {
				min.y = c[0];
			}
			if ( c[2] < min.z ) {
				min.z = c[0];
			}
			if ( c[0] > max.x ) {
				max.x = c[0];
			}
			if ( c[1] > max.y ) {
				max.y = c[0];
			}
			if ( c[2] > max.z ) {
				max.z = c[0];
			}
			vec = new THREE.Vector4();
			vec.fromArray(c);
			nurbsControlPoints.push(vec);
		}
		var nurbsDegree = 3;
		var nurbsCurve = new THREE.NURBSCurve(nurbsDegree, spline.knot, nurbsControlPoints);

		var nurbsGeometry = new THREE.Geometry();
		nurbsGeometry.vertices = nurbsCurve.getPoints(200);
		triangles = THREE.Shape.Utils.triangulateShape(nurbsGeometry.vertices, []);

		for( var i = 0; i < triangles.length; i++ ){
			nurbsGeometry.faces.push( new THREE.Face3( triangles[i][0], triangles[i][1], triangles[i][2] ));
		}
		var nurbsMaterial = new THREE.MeshBasicMaterial( { color: 0x777777 } );
		var nurbsMesh = new THREE.Mesh( nurbsGeometry, nurbsMaterial );
		group.add( nurbsMesh );

		var nurbsControlPointsGeometry = new THREE.Geometry();
		nurbsControlPointsGeometry.vertices = nurbsCurve.controlPoints;
		var nurbsControlPointsMaterial = new THREE.LineBasicMaterial( { linewidth: 2, color: 0x333333, opacity: 0.25, transparent: true } );
		var nurbsControlPointsLine = new THREE.Line( nurbsControlPointsGeometry, nurbsControlPointsMaterial );
		nurbsControlPointsLine.position.copy( nurbsMesh.position );
		group.add( nurbsControlPointsLine );
	}

	reposition_camera();
}

function reposition_camera() {
	x_length = max.x - min.x;
	y_length = max.y - min.y;
	var longest_dimension = (x_length > y_length) ? x_length : y_length;
	console.log(longest_dimension);
	var deg=35;
	z_shouldbe = (longest_dimension / 2 ) / Math.tan(deg * Math.PI/180);
	console.log(z_shouldbe);
	camera.position.x = (max.x+min.x)/2;
	camera.position.y = (max.y+min.y)/2;
	camera.position.z = z_shouldbe;
}

function onWindowResize() {

	var h = document.getElementById('canvas').offsetHeight;
	var w = document.getElementById('canvas').offsetWidth;
	windowHalfX = w / 2;
	windowHalfY = h / 2;

	camera.aspect = w / h;
	camera.updateProjectionMatrix();

	renderer.setSize( w, h );

}

//

function onDocumentMouseDown( event ) {

	event.preventDefault();

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );
	document.addEventListener( 'mouseout', onDocumentMouseOut, false );

	mouseXOnMouseDown = event.clientX - windowHalfX;
	targetRotationOnMouseDown = targetRotation;

}

function onDocumentMouseMove( event ) {

	mouseX = event.clientX - windowHalfX;

	targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;

}

function onDocumentMouseUp( event ) {

	document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

}

function onDocumentMouseOut( event ) {

	document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

}

function onDocumentTouchStart( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
		targetRotationOnMouseDown = targetRotation;

	}

}

function onDocumentTouchMove( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;

	}

}

//

var animate = function() {

	requestAnimationFrame( animate );

	render();

}

function render() {

	group.rotation.y += ( targetRotation - group.rotation.y ) * 0.05;
	renderer.render( scene, camera );

}
