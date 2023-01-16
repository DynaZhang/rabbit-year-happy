import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import Game from '.';
import bus from './bus';
import {randInt} from './math';

export default class Clouds {
    game: Game;
    scene: THREE.Scene;
    camera: THREE.Camera;
    target: any;

    constructor(game: Game) {
        this.game = game;
        this.scene = game.scene;
        this.camera = game.camera;
        this.target = null;
        this.init();
    }
    init() {
        let loader = new GLTFLoader();

        for (let i = 0; i < 20; ++i) {
            let index = randInt(1, 3);
            let scale = randInt(5, 12);
            loader.load("./assets/mod/cloud/Cloud" + index + ".glb", gltf => {
                this.target = gltf.scene;
                this.target.position.set((Math.random() * 2.0 - 1.0) * 300,randInt(30,80),(Math.random() * 2.0 - 1.0) * 300);
                this.target.scale.set(scale,scale,scale)
                this.target.traverse((c: any) => {
                    let materials = c.material;
                    if (!(c.material instanceof Array)) {
                        materials = [c.material];
                    }
                    for (let m of materials) {
                        if (m) {
                            m.emissive = new THREE.Color(0x808080);
                        }
                    }
                });
                this.scene.add(this.target)
            });
        }


    }
    update(delta: number) {

    }
}