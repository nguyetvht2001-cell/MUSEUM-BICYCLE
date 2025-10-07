(function(){
  const models = ["assets/bicycle1.glb", "assets/bicycle2.glb", "assets/bicycle3.glb", "assets/bicycle4.glb"];
  const audioSrc = "assets/bicycle.mp3";
  const subtitles = [{"time": 0, "text": "Xin chào các em! Bắt đầu tham quan."}, {"time": 15, "text": "Đây là mô tả chính của hiện vật."}, {"time": 40, "text": "Cảm ơn các em đã lắng nghe."}];

  const container = document.getElementById('viewer');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0a);
  const camera = new THREE.PerspectiveCamera(50, container.clientWidth/container.clientHeight, 0.1, 1000);
  camera.position.set(0,1.4,3.2);

  const renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', ()=>{
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth/container.clientHeight;
    camera.updateProjectionMatrix();
  });

  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight(0xffffff, 0.7);
  dir.position.set(5,10,7);
  scene.add(dir);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(50,50), new THREE.MeshStandardMaterial({color:0x101214}));
  ground.rotation.x = -Math.PI/2;
  ground.position.y = -0.001;
  scene.add(ground);

  let isPointerDown=false, startX=0, startY=0, rotX=0, rotY=0;
  renderer.domElement.addEventListener('pointerdown', (e)=>{ isPointerDown=true; startX=e.clientX; startY=e.clientY; renderer.domElement.setPointerCapture(e.pointerId); });
  renderer.domElement.addEventListener('pointerup', (e)=>{ isPointerDown=false; renderer.domElement.releasePointerCapture(e.pointerId); });
  renderer.domElement.addEventListener('pointermove', (e)=>{ if(!isPointerDown) return; const dx=(e.clientX-startX)/200; const dy=(e.clientY-startY)/200; startX=e.clientX; startY=e.clientY; rotY+=dx; rotX+=dy; });

  const loader = new THREE.GLTFLoader();
  let group = new THREE.Group();
  scene.add(group);

  models.forEach((m,i)=>{
    loader.load(m, function(gltf){
      const obj = gltf.scene || gltf.scenes[0];
      const box = new THREE.Box3().setFromObject(obj);
      const size = box.getSize(new THREE.Vector3()).length();
      const center = box.getCenter(new THREE.Vector3());
      obj.position.x -= center.x;
      obj.position.y -= center.y;
      obj.position.z -= center.z;
      const scale = size === 0 ? 1 : (1.0 / size * 1.2);
      obj.scale.setScalar(scale);
      obj.position.set(i*1.8 - (models.length-1)*0.9, 0, 0);
      group.add(obj);
    }, undefined, function(err){ console.warn('Không load được model', m, err); });
  });

  function animate(){
    requestAnimationFrame(animate);
    group.rotation.y = rotY;
    group.rotation.x = rotX;
    renderer.render(scene, camera);
  }
  animate();

  const audio = new Audio(audioSrc);
  audio.crossOrigin = "anonymous";
  const playBtn = document.getElementById('playBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const subtitleEl = document.getElementById('subtitle');
  playBtn.addEventListener('click', ()=>{ audio.play(); playBtn.disabled=true; pauseBtn.disabled=false; });
  pauseBtn.addEventListener('click', ()=>{ audio.pause(); playBtn.disabled=false; pauseBtn.disabled=true; });

  audio.addEventListener('timeupdate', ()=>{
    const t = audio.currentTime;
    let last = '';
    for(let i=0;i<subtitles.length;i++){ if(t >= subtitles[i].time) last = subtitles[i].text; }
    subtitleEl.textContent = last;
  });

})();