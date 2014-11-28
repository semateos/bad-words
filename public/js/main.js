var camera, scene, renderer;
var effect, controls;
var element, container;
var cube, time;

var particleSystem, particles,
particleSystemHeight = 500,
particleCount = 2000;

var clock = new THREE.Clock();

init();
animate();

function init() {
  
  var errorCallback = function(e) {
    console.log('Reeeejected!', e);
  };

  navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;

  var video1 = document.querySelector('video.left');
  var video2 = document.querySelector('video.right');

  if (navigator.getUserMedia) {
    navigator.getUserMedia({audio: false, video: true}, function(stream) {
      video1.src = window.URL.createObjectURL(stream);
      video2.src = window.URL.createObjectURL(stream);
    }, errorCallback);
  } else {
    //video.src = 'somevideo.webm'; // fallback.
  }


  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setClearColor( 0x000000, 0 );

  element = renderer.domElement;
  container = document.getElementById('example');
  container.appendChild(element);

  effect = new THREE.StereoEffect(renderer);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
  camera.position.set(0, 10, 100);
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

  function setOrientationControls(e) {
    if (!e.alpha) {
      return;
    }

    controls = new THREE.DeviceOrientationControls(camera, true);
    controls.connect();
    controls.update();

    element.addEventListener('click', fullscreen, false);

    window.removeEventListener('deviceorientation', setOrientationControls);
  }
  window.addEventListener('deviceorientation', setOrientationControls, true);
  

  var light = new THREE.HemisphereLight(0xff0000, 0x000000, 1);
  scene.add(light);


  cube = new THREE.Mesh( new THREE.DodecahedronGeometry( 100 ), new THREE.MeshBasicMaterial( { color: 0xff00ff, wireframe: true } ));
  cube.position.x = 300;
  cube.position.y = 70;
  cube.position.z = 50;

  scene.add( cube );

  //scene.fog = new THREE.Fog( 0x0000ff, 1, 1000 );
  scene.autoUpdate = false;

  // create the particle variables
  
  particles = new THREE.Geometry();

  pMaterial = new THREE.PointCloudMaterial({
    color: 0xFF0000,
    size: 3,
    
    fog: true, 
    blending: THREE.AdditiveBlending,
    transparent: true
  });

  // now create the individual particles
  for (var p = 0; p < particleCount; p++) {

    // create a particle with random
    // position values, -250 -> 250
    var pX = Math.random() * particleSystemHeight * 2 - particleSystemHeight,
        pY = Math.random() * particleSystemHeight * 2 - particleSystemHeight,
        pZ = Math.random() * particleSystemHeight * 2 - particleSystemHeight,
        particle = new THREE.Vector3(pX, pY, pZ);

        particle.velocity = new THREE.Vector3(
          0,              // x
          -Math.random() / 3, // y: random vel
          0);             // z

    // add it to the geometry
    particles.vertices.push(particle);
  }

  // create the particle system
  particleSystem = new THREE.PointCloud(
      particles,
      pMaterial);

  particleSystem.sortParticles = true;

  // add it to the scene
  scene.add(particleSystem);

  //var text = new THREE.Mesh( new THREE.TextGeometry("Testing", {size: 20, height: 30}), new THREE.MeshNormalMaterial() );
  //scene.add( text );


  window.addEventListener('resize', resize, false);
  setTimeout(resize, 1);
}

function resize() {
  var width = container.offsetWidth;
  var height = container.offsetHeight;

      camera.aspect = width / height;
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

      cube.rotation.x += 0.02;
      cube.rotation.y += 0.02;
      cube.rotation.z += 0.02;
      cube.position.y  = 100 + 20 * Math.sin(time * 3);

      //particleSystem.rotation.y += 0.01;

      
      var pCount = particleCount;
      while (pCount--) {

        // get the particle
        var particle =
          particles.vertices[pCount];

        // check if we need to reset
        if (particle.y < -1 * particleSystemHeight ) {
          particle.y = particleSystemHeight;
          particle.velocity.y = 0;
        }

        // update the velocity with
        // a splat of randomniz
        particle.velocity.y -= Math.random() * .05;

        // and the position
        particle.add(particle.velocity);
      }

      // flag to the particle system
      // that we've changed its vertices.
      particleSystem.
        geometry.
        __dirtyVertices = true;
      

      effect.render(scene, camera);
    }

    function animate(t) {
      requestAnimationFrame(animate);

      var dt = clock.getDelta();

      update(dt);
      render(dt);
    }

    function fullscreen() {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      }
    }