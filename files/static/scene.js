var container, stats;

var camera, scene, renderer;
var group;

var targetRotation = 0;
var targetRotationOnMouseDown = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

	var h = document.getElementById('canvas').offsetHeight;
	var w = document.getElementById('canvas').offsetWidth;
var windowHalfX = w / 2;
var windowHalfY = h / 2;

var init = function() {

	var height = document.getElementById('canvas').offsetHeight;
	var width = document.getElementById('canvas').offsetWidth;

	camera = new THREE.PerspectiveCamera( 70, width / height, 1, 1000 );
	camera.position.z = 300;
	camera.position.x = 100;
	camera.position.y = 10;

	scene = new THREE.Scene();
	scene.add( new THREE.AmbientLight( 0x808080 ) );

	var light = new THREE.DirectionalLight( 0xffffff, 1 );
	light.position.set( 1, 1, 1 );
	scene.add( light );

	var grid = new THREE.GridHelper( 2000, 10 );
	grid.setColors( 0xff7777, 0xff7777 );
	scene.add( grid );

	group = new THREE.Group();
	group.position.y = 170;
	scene.add( group );

	// NURBS curve

	var nurbsControlPoints = [];
	nurbsControlPoints.push(new THREE.Vector4(125.672848, -138.790728, 0.000000, 1));
	nurbsControlPoints.push(new THREE.Vector4(125.672848, -152.597846, 0.000000, 1));
	nurbsControlPoints.push(new THREE.Vector4(118.957119, -163.790728, 0.000000, 1));
	nurbsControlPoints.push(new THREE.Vector4(110.672848, -163.790728, 0.000000, 1));
	nurbsControlPoints.push(new THREE.Vector4(102.388577, -163.790728, 0.000000, 1));
	nurbsControlPoints.push(new THREE.Vector4(95.672848, -152.597846, 0.000000, 1));
	nurbsControlPoints.push(new THREE.Vector4(95.672848, -138.790728, 0.000000, 1));
	nurbsControlPoints.push(new THREE.Vector4(95.672848, -124.983609, 0.000000, 1));
	nurbsControlPoints.push(new THREE.Vector4(102.388577, -113.790728, 0.000000, 1));
	nurbsControlPoints.push(new THREE.Vector4(110.672848, -113.790728, 0.000000, 1));
	nurbsControlPoints.push(new THREE.Vector4(118.957119, -113.790728, 0.000000, 1));
	nurbsControlPoints.push(new THREE.Vector4(125.672848, -124.983609, 0.000000, 1));
	nurbsControlPoints.push(new THREE.Vector4(125.672848, -138.790728, 0.000000, 1));
	var nurbsKnots = [0,0,0,0,1,1,1,2,2,2,3,3,3,4,4,4,4];
	var nurbsDegree = 3;

	//for ( var i = 0; i <= nurbsDegree; i ++ ) {
	//	nurbsKnots.push( 0 );
	//}

	//for ( var i = 0, j = 20; i < j; i ++ ) {

	//	nurbsControlPoints.push(
	//			new THREE.Vector4(
	//				Math.random() * 400 - 200,
	//				Math.random() * 400,
	//				Math.random() * 400 - 200,
	//				1 // weight of control point: higher means stronger attraction
	//				)
	//			);

	//	var knot = ( i + 1 ) / ( j - nurbsDegree );
	//	nurbsKnots.push( THREE.Math.clamp( knot, 0, 1 ) );

	//}

	var nurbsCurve = new THREE.NURBSCurve(nurbsDegree, nurbsKnots, nurbsControlPoints);

	var nurbsGeometry = new THREE.Geometry();
	nurbsGeometry.vertices = nurbsCurve.getPoints(200);
	triangles = THREE.Shape.Utils.triangulateShape(nurbsGeometry.vertices, []);

	for( var i = 0; i < triangles.length; i++ ){
		nurbsGeometry.faces.push( new THREE.Face3( triangles[i][0], triangles[i][1], triangles[i][2] ));
	}
	var nurbsMaterial = new THREE.MeshBasicMaterial( { color: 0x777777 } )

	var nurbsMesh = new THREE.Mesh( nurbsGeometry, nurbsMaterial );
	//nurbsLine.position.set( 200, -100, 0 );
	group.add( nurbsMesh );
	//camera.lookAt(nurbsMesh.position);

	var nurbsControlPointsGeometry = new THREE.Geometry();
	nurbsControlPointsGeometry.vertices = nurbsCurve.controlPoints;
	var nurbsControlPointsMaterial = new THREE.LineBasicMaterial( { linewidth: 2, color: 0x333333, opacity: 0.25, transparent: true } );
	var nurbsControlPointsLine = new THREE.Line( nurbsControlPointsGeometry, nurbsControlPointsMaterial );
	nurbsControlPointsLine.position.copy( nurbsMesh.position );
	group.add( nurbsControlPointsLine );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setClearColor( 0xf0f0f0 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( width, height );
	document.getElementById('canvas').appendChild( renderer.domElement );

	//
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );

	window.addEventListener( 'resize', onWindowResize, false );

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
