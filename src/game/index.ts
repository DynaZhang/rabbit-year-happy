import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import bus from './bus';
import Chest from './chest';
import Clouds from './clouds';
import {VS, FS} from './shander';

export default class Game {
    parentEl: HTMLElement;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    chest!: Chest;
    clock!: THREE.Clock;
    sun!: THREE.DirectionalLight;
    clouds!: Clouds;


    constructor(parentEl: HTMLElement) {
        this.parentEl = parentEl;
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.camera = new THREE.PerspectiveCamera(60, 1920/1080, 1, 10000);
        this.scene = new THREE.Scene();
        this.init();
    }

    init() {
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        (this.renderer as any).gammaFactor = 3;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.id = 'game-canvas';
        this.parentEl.append(this.renderer.domElement);

        this.camera.position.set(0, 1.3, 5);
        this.camera.position.set(-0.25, 0, 0);

        this.scene.background = new THREE.Color(0x00000);
        this.scene.fog = new THREE.FogExp2(0x89b2eb, 0.002);

        const fov = 60;
        const aspect = 1920 / 1080;
        const near = 1.0;
        const far = 10000.0;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(0, 1.3, 5);
        this.camera.rotation.set(-0.25, 0, 0)

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        this.scene.fog = new THREE.FogExp2(0x89b2eb, 0.002);

        this.addSun();
        this.addPlane();
        this.addSky();
        // this.addClouds();
        this.addChest();

        const loadModNameList = []
        bus.$on("loaded", (name: string) => {
            loadModNameList.push(name)
            bus.$emit("progress", ~~(loadModNameList.length / 3 * 100))
            if (loadModNameList.length >= 3) {
                setTimeout(()=>{
                    this.chest.playGame()
                },500)
            }
        })

        this.clock = new THREE.Clock();
        this.update();

        window.addEventListener('resize', () => {
            this.resize()
        }, false);
        this.resize()
        
    }

    addClouds() {
        this.clouds = new Clouds(this)
    }

    addSky() {
        const hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFFF, 1);
        hemiLight.color.setHSL(0.6, 1, 0.6);
        hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        this.scene.add(hemiLight);

        const uniforms = {
            "topColor": { value: new THREE.Color(0x0077ff) },
            "bottomColor": { value: new THREE.Color(0xffffff) },
            "offset": { value: 33 },
            "exponent": { value: 0.6 }
        };
        uniforms["topColor"].value.copy(hemiLight.color);

        (this.scene.fog as any).color.copy(uniforms["bottomColor"].value);

        const skyGeo = new THREE.SphereBufferGeometry(1000, 32, 15);
        const skyMat = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: VS,
            fragmentShader: FS,
            side: THREE.BackSide
        });

        const sky = new THREE.Mesh(skyGeo, skyMat);
        this.scene.add(sky);
    }

    addSun() {
        this.sun = new THREE.DirectionalLight(0xFFFFFF, 1);
        this.sun.position.set(-10, 200, 10);
        this.sun.target.position.set(0, 0, 0);
        this.sun.castShadow = true;
        this.sun.shadow.bias = -0.001;
        this.sun.shadow.mapSize.width = 4096;
        this.sun.shadow.mapSize.height = 4096;
        this.sun.shadow.camera.near = 0.1;
        this.sun.shadow.camera.far = 1000.0;
        this.sun.shadow.camera.left = 100;
        this.sun.shadow.camera.right = -100;
        this.sun.shadow.camera.top = 100;
        this.sun.shadow.camera.bottom = -100;
        this.scene.add(this.sun);
    }

    addPlane() {
        // let plane_map = new THREE.TextureLoader().load("./assets/image/land.png");
        // plane_map.wrapS = THREE.RepeatWrapping;
        // plane_map.wrapT = THREE.RepeatWrapping;
        // plane_map.repeat.set(1000, 1000);

        // const plane = new THREE.Mesh(
        //     new THREE.PlaneGeometry(5000, 5000, 10, 10),
        //     new THREE.MeshStandardMaterial({
        //         // color: 0x1e601c,
        //         map: plane_map,
        //         side: THREE.DoubleSide,
        //     }));
        // plane.castShadow = false;
        // plane.receiveShadow = true;
        // plane.rotation.x = -Math.PI / 2;
        // this.scene.add(plane);

        let loader = new GLTFLoader();
        loader.load("./assets/mod/pokemon_center_scene/scene.gltf", gltf => {
            let target = gltf.scene;
            target.scale.set(1.2, 1.2, 1.2);
            target.position.set(3, 0, 6.5)
            target.rotation.set(0,-.8,0)
            target.traverse((c: any) => {
                c.castShadow = true;
                c.receiveShadow = true;
                if (c.material && c.material.map) {
                    c.material.map.encoding = THREE.sRGBEncoding;
                }
            });
            this.scene.add(target);
            bus.$emit("loaded","scene")
        })
    }

    addChest() {
        this.chest = new Chest(this);
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    update(t?: any) {
        requestAnimationFrame(dt => {
            this.update();
            let delta = this.clock.getDelta()

            if (this.chest) {
                this.chest.update(delta);
            }

            this.renderer.render(this.scene, this.camera);
        });
    }

    destroy() {}
}
