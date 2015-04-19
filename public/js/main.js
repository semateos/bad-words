
// debugger

//Three.js rendering:
var camera, scene, renderer;
var effect, controls;
var element, container;
var cube, time, text, text_geo;

var particleSystem, particles,
particleSystemHeight = 500,
particleCount = 50;

var clock = new THREE.Clock();

var VR = false;

var full_button = document.getElementById('fullscreen');
full_button.addEventListener('click', fullscreen, false);

var vr_button = document.getElementById('vr-mode');
vr_button.addEventListener('click', toggleVR, false);

function toggleVR(){

  if(VR){

    VR = false;

    camera.position.set(0, 0, 0);

    controls = new THREE.OrbitControls(camera, element);
    controls.rotateUp(Math.PI / 4);
    controls.target.set(
      camera.position.x + 0.1,
      camera.position.y,
      camera.position.z
    );
    controls.noZoom = true;
    controls.noPan = true;
    controls.update();

  }else{

    VR = true;

    //if mobile device, user device orientation controls:
    if(window.DeviceOrientationEvent){

      camera.position.set(0, 0, 0);

      //console.log('orientation');
      controls = new THREE.DeviceOrientationControls(camera, true);
      controls.connect();
      controls.update();
    }
  }
}


//start three.js stuff
init();
animate();

function init() {
  
  //set up camera stuff:
  var errorCallback = function(e) {
    console.log('Reeeejected!', e);
  };

  navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;

  function gotSources(sourceInfos) {

    console.log(sourceInfos);

    var sourceId;

    //the back facing camera on nexus 5 is the 4th source:
    if(sourceInfos[4]){

      sourceId = sourceInfos[4].id;
    }

    //set the constraints for this preference
    var constraints = {
      audio: false,
      video: {
        optional: [{sourceId: sourceId}]
      }
    }

    /*
    //video containers for left and right eye
    var video1 = document.querySelector('video.left');
    var video2 = document.querySelector('video.right');

    //set the video source for both eyes to the same video stream:
    if (navigator.getUserMedia) {
      navigator.getUserMedia(constraints, function(stream) {
        video1.src = window.URL.createObjectURL(stream);
        video2.src = window.URL.createObjectURL(stream);

        //annyang.start();

      }, errorCallback);
    }
    */
  }

  if (typeof MediaStreamTrack === 'undefined'){
    alert('This browser does not support MediaStreamTrack.');
  } else {
    MediaStreamTrack.getSources(gotSources);
  }

  // make the three.js background transparent:
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setClearColor( 0x000000, 0 );

  // create the three container:
  element = renderer.domElement;
  container = document.getElementById('threejs');
  container.appendChild(element);

  //stereo render effect:
  effect = new THREE.StereoEffect(renderer);
  scene = new THREE.Scene();

  //set up the camera:
  camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
  camera.position.set(0, 0, 0);
  scene.add(camera);


  controls = new THREE.OrbitControls(camera, element);
  controls.rotateUp(Math.PI / 4);
  controls.target.set(
    camera.position.x + 0.1,
    camera.position.y,
    camera.position.z
  );
  controls.noZoom = true;
  controls.noPan = true;
  
  //controls.autoFollowMouse(true);

  //add light to the scene (this is red light)
  //var light = new THREE.HemisphereLight(0xff0000, 0x000000, 1);
  //scene.add(light);

  //add an object to the scene
  cube = new THREE.Mesh( new THREE.DodecahedronGeometry( 100 ), new THREE.MeshBasicMaterial( { color: 0xff00ff, wireframe: false } ));
  cube.position.x = 300;
  cube.position.y = 70;
  cube.position.z = 50;
  //scene.add( cube );

  /*
  text_geo = new THREE.TextGeometry("Testing", {size: 20, height: 1, font: 'gentilis'});
  text = new THREE.Mesh( text_geo, new THREE.MeshNormalMaterial() );
  text.position.x = 300;
  text.position.y = 70;
  text.position.z = 50;

  scene.add( text );
  */

  particles = [];

  for(var i = 0; i < particleCount; i++){

    var word = words[i % words.length];

    var text_geo = new THREE.TextGeometry(word.word, {size: 20, height: 1, font: 'gentilis'});
    var text = new THREE.Mesh( text_geo, new THREE.MeshNormalMaterial() );

    text.position.x = Math.random() * 500 - 250;
    text.position.y = Math.random() * 500 - 250;
    text.position.z = Math.random() * 500 - 250;

    particles[i] = text;

    scene.add( text );
  }

}

function resize() {
  var width = container.offsetWidth;
  var height = container.offsetHeight;

  camera.aspect = width / height;
  //camera.position.set(0, 0, 0);

  camera.updateProjectionMatrix();
  
  renderer.setSize(width, height);
  effect.setSize(width, height);
}

function update(dt) {
  
  resize();

  camera.updateProjectionMatrix();

  controls.update(dt);
}

function render(dt) {

  time = clock.getElapsedTime();

  //cube.rotation.x += 0.02;
  //cube.rotation.y += 0.02;
  //cube.rotation.z += 0.02;
  //cube.position.x  = 100 + 20 * Math.sin(time * 3);


  // simple billboard method
  //text.quaternion.copy( camera.quaternion );


  for(var i = 0; i < particleCount; i++){

    particles[i].quaternion.copy( camera.quaternion );

    particles[i].position.x -= 0.02;
    particles[i].position.y -= 0.02;
    particles[i].position.z -= 0.02;
  }

  if(VR){

    effect.render(scene, camera);

  }else{

    renderer.render(scene, camera);
  }

  
}


function animate(t) {
  requestAnimationFrame(animate);

  var dt = clock.getDelta();

  update(dt);
  render(dt);
}

function fullscreen() {
  if (document.body.requestFullscreen) {
    document.body.requestFullscreen();
  } else if (document.body.msRequestFullscreen) {
    document.body.msRequestFullscreen();
  } else if (document.body.mozRequestFullScreen) {
    document.body.mozRequestFullScreen();
  } else if (document.body.webkitRequestFullscreen) {
    document.body.webkitRequestFullscreen();
  }
}



