console.log('cosmos');

function buildTrixelDisplay (world,scene,data) {
// debugger
	// from included file
	// var color = Math.random() * 0xffffff;

	// var box1 = new maketrixel(0.3392934,0.3392934,40.3392934,40.3392934,
	// 	-40.3392934,40.3392934,-40.3392934,40.3392934, color, 0.9);

	var DATA = JSON.parse(savedTrixelViewer);

	for (var i = 0; i < DATA.trixels.length; i++) {
		
		var color = DATA.trixels[i].color;
		var opacity = DATA.trixels[i].opacity;
		// debugger
		var box1 = new maketrixel(
			DATA.trixels[i].position[0].x, DATA.trixels[i].position[0].y,
			DATA.trixels[i].position[1].x, DATA.trixels[i].position[1].y,
			DATA.trixels[i].position[2].x, DATA.trixels[i].position[2].y,
			color, opacity);

		// box1.position.setZ = -100;
		world.add(box1);
	};

}

function maketrixel (p1x,p1y,p2x,p2y,p3x,p3y,color,opacity) {
	// simple 2d shape like all canvas systems
	var R = new THREE.Shape();

	var S_ = 1.01;
	// var color = Math.random() * 0xffffff;
	R.moveTo(  p1x, p1y );
	R.lineTo(  p2x, p2y );
	R.lineTo( p3x, p3y );
	// R.lineTo(  p4x, p4y );


	var points = R.createPointsGeometry();
	var geometry = new THREE.ShapeGeometry( R );
	// var material = new THREE.MeshBasicMaterial({ color: color });
	var material = new THREE.MeshBasicMaterial();
	material.side = THREE.DoubleSide;

	var mesh = new THREE.Mesh(geometry, material);
	// debugger
	mesh.material.color.setStyle(color);
	mesh.material.transparent = true;
	mesh.material.opacity = opacity;
	
	return mesh;
}
