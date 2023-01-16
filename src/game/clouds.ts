import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import bus from './bus';
import {rand_int} from './math';

export default class Clouds {
    constructor(game) {
        this.game = game;
        this.scene = game.scene;
        this.camera = game.camera;
        this.target = null;
        this.init();
    }
    init() {
        let loader = new GLTFLoader();

        for (let i = 0; i < 20; ++i) {
            let index = rand_int(1, 3);
            let scale = rand_int(5, 12);
            loader.load("./assets/mod/cloud/Cloud" + index + ".glb", gltf => {
                this.target = gltf.scene;
                this.target.position.set((Math.random() * 2.0 - 1.0) * 300,rand_int(30,80),(Math.random() * 2.0 - 1.0) * 300);
                this.target.scale.set(scale,scale,scale)
                this.target.traverse(c => {
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
    update(delta) {

    }
}