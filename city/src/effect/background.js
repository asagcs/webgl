import * as THREE from 'three';

export class Background {
    constructor(scene) {
        this.url = '/src/assets/black-bg.png';
        this.scene = scene;
        this.init();
    }

    // 创建天空盒
    init () {
        const loader = new THREE.TextureLoader();

        const geometry = new THREE.SphereGeometry(11000, 32, 32);

        const material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: loader.load(this.url)
        })

        const sphere = new THREE.Mesh(geometry, material);

        sphere.position.copy({
            x: 0,
            y: 0,
            z: 0
        });
        this.scene.add(sphere);
    }
}