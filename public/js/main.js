
// debugger

//Three.js rendering:
var camera, scene, renderer;
var effect, controls;
var element, container;
var cube, time, text, text_geo;
var avatars = [];

var particleSystem, particles, boxes,
particleSystemHeight = 500,
particleCount = 50;

var clock = new THREE.Clock();
var raycaster = new THREE.Raycaster();
var center = new THREE.Vector2(0,0);

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
    controls.autoFollowMouse(true);

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
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setClearColor( 0x000000, 0 );

  // create the three container:
  element = renderer.domElement;
  container = document.getElementById('threejs');
  container.appendChild(element);

  //stereo render effect:
  effect = new THREE.StereoEffect(renderer);
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2( 0x000000, 0.0025 );

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

  controls.autoFollowMouse(true);

  //add light to the scene
  var light = new THREE.HemisphereLight(0xffff00, 0x000000, 1);
  scene.add(light);

  particles = [];
  boxes = [];

  for(var i = 0; i < 20; i++){

    var word = getRandomNewWord();

    addWordToCloud(word);
  
  }
    
  //addPlayerAvatarToCanvas();

}



function addWordToCloud(word, vector){

  console.log('word added', word.word);

  var group = new THREE.Object3D();//create an empty container

  var text_geo = new THREE.TextGeometry(word.word, {size: 20, height: 1, font: 'gentilis'});
  var text = new THREE.Mesh( text_geo, new THREE.MeshLambertMaterial({color: 0x00ff00, transparent: true}) );

  var box = new THREE.BoundingBoxHelper( text, 0x00ff00 );
  box.visible = false;
  box.word = word;
  box.update(); 
  
  group.add( text );
  group.add( box );

  group.box = box;
  group.text = text;
   
  group.position.x = Math.random() * 450 - 225;
  group.position.y = Math.random() * 450 - 225;
  group.position.z = Math.random() * 450 - 225;
  
  if(vector){

    group.vector = vector;

  }else{
      function getRandomScalar() {
          if(Math.random() > 0.5){
              return (Math.random() - 1)/10;
          } else {
              return Math.random()/10;
          }
      }
    group.vector = new THREE.Vector3( getRandomScalar(), getRandomScalar(), getRandomScalar());
  }

  var i = particles.length;
  particles[i] = group;
  
  box.i = boxes.length;
  boxes[box.i] = box;

  word.particle = particles[i];

  scene.add( group );

}

function getAvatarFromParticlesByName(avatarName) {
    

}

function addPlayerAvatarToCanvas(player) {
    
    console.log('adding player to canvas', player);

    var test = THREE.ImageUtils.loadTexture(player.avatar, {}, buildAvatarAfterImageLoaded);

    // grab player.position
    
    
    function buildAvatarAfterImageLoaded(texture) {

        var group = new THREE.Object3D(); //create an empty container
        var img = new THREE.MeshBasicMaterial({
            map:texture,
            transparent: true
        });

        img.map.minFilter = THREE.NearestFilter;

        console.log('build after load', img, event);

        var avatar = new THREE.Mesh(new THREE.PlaneBufferGeometry(100, 100), img);
        var box = new THREE.BoundingBoxHelper( avatar, 0x00ff00 );
        
        group.add( avatar );
        group.add( box );

        group.box = box;
        group.avatar = avatar;
        group.name = player.name;

        group.position.x = player.positionX;
        group.position.y = player.positionY;
        group.position.z = player.positionZ;

        box.i = boxes.length;
        boxes[box.i] = box;

        group.i = avatars.length;

        avatars.push(group);
        scene.add(group);
    }
}

function removePlayerAvatarFromCanvas(playerName) {
    var avatar = getAvatarByName(playerName);
    
    scene.remove(avatar);
    
    boxes.splice(avatar.box.i, 1);
    avatars.splice(avatar.i, 1);
    //particles.splice(avatar.index, 1);
}

function getAvatarByName(avatarName) {
    for(var i=0; i<avatars.length; i++) {
        if(avatarName == avatars[i].name) {
            return avatars[i];
        }
    }
}

function updatePlayerAvatarPosition(player) {
    var playerAvatar = getAvatarByName(player.name);
    playerAvatar.position.x = player.positionX;
    playerAvatar.position.y = player.positionY;
    playerAvatar.position.z = player.positionZ;
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
  // text.quaternion.copy( camera.quaternion );
  for(var i=0; i< avatars.length; i++) {
        avatars[i].quaternion.copy( camera.quaternion );
        //avatars[i].position.x -= 0.02;
        //avatars[i].position.y -= 0.02;
        //avatars[i].position.z -= 0.02;
      if(avatars[i].box.intersected && avatars[i].box.intersected > 0){

        // avatars[i].avatar.color.set( 0xff0000 );
        avatars[i].box.object.material.color.set( 0xff0000 );
        avatars[i].box.intersected--;

      }else{

        avatars[i].box.intersected = false;

        avatars[i].box.object.material.color.set( 0xffffff );
      }
  }

  for(i = 0; i < particles.length; i++){

    if(particles[i]){

      particles[i].quaternion.copy( camera.quaternion );
        var pVector = particles[i].vector;
        var pPosition = particles[i].position;
        
        if(pPosition.x > 225) {
            console.log("reverse X for " + particles[i].box.word.word);
            pPosition.x = 224;
            pVector.setX(pVector.x * -1);
        }
        if(pPosition.y > 225) {
            console.log("reverse Y for " + particles[i].box.word.word);
            pPosition.y = 224;
            pVector.setY(pVector.y * -1);
        }
        if(pPosition.z > 225) {
            console.log("reverse Z for " + particles[i].box.word.word);
            pPosition.z = 224;
            pVector.setZ(pVector.z * -1);
        }
        
        if(pPosition.x < -225) {
            console.log("reverse X for " + particles[i].box.word.word);
            pPosition.x = -224;
            pVector.setX(pVector.x * -1);
        }
        if(pPosition.y < -225) {
            console.log("reverse Y for " + particles[i].box.word.word);
            pPosition.y = -224;
            pVector.setY(pVector.y * -1);
        }
        if(pPosition.z < -225) {
            console.log("reverse Z for " + particles[i].box.word.word);
            pPosition.z = -224;
            pVector.setZ(pVector.z * -1);
        }
        
      pPosition.add(pVector);

      if(particles[i].explode > 0){

        particles[i].explode--;

        particles[i].text.material.color.set( 0xff0000 );

        particles[i].box.object.material.wireframe = true;

        particles[i].scale.set( particles[i].scale.x * 0.99,particles[i].scale.y * 0.99, particles[i].scale.z * 0.99);

        particles[i].text.material.opacity -= 0.01;

        if(particles[i].explode <= 0){

          scene.remove(particles[i]);

          boxes.splice(particles[i].box.i, 1);

          delete(particles[i]);
        }
        
      }else if(particles[i].box.intersected && particles[i].box.intersected > 0){

        particles[i].text.material.color.set( 0xff0000 );

        particles[i].box.intersected--;

      }else{

        particles[i].box.intersected = false;

        particles[i].box.object.material.color.set( 0x00ff00 );
      }
    }
  }


  // update the picking ray with the camera and mouse position  
  raycaster.setFromCamera( center, camera ); 

  // calculate objects intersecting the picking ray
  var intersects = raycaster.intersectObjects( boxes );

  for ( var i = 0; i < intersects.length; i++ ) {

    // console.log('intersects', intersects);
    if(!intersects[ i ].object.explode){

      //intersects[ i ].object.explode = 300;

      intersects[ i ].object.intersected = 300;

    }
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



