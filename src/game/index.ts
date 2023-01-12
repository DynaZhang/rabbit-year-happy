import * as THREE from 'three';

export default class Game {
    parentEl: HTMLElement;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;



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
        this.renderer.gammaFactor = 3;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.id = 'game-canvas';
        this.parentEl.append(this.renderer.domElement);
    }

    destory() {}
}
