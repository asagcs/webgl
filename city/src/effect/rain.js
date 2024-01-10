import *  as THREE from 'three';

export class Rain {
    constructor(scene) {
        this.scene = scene;

        this.range = 2000;
        this.count = 1800;

        this.pointsList = [];
    }

    init () {
        // 创建粒子
        this.material = new THREE.PointsMaterial({
            size: 30,
            map: new THREE.TextureLoader().load('../../src/assets/rain.png'),
            transparent: true,
            opacity: 0.4,
            depthTest: false
        });

        this.geometry = new THREE.BufferGeometry();

        for (let i = 0; i < this.count; i++) {
            const position = new THREE.Vector3(Math.random() * this.range - this.range / 2, Math.random() * this.range, Math.random() * this.range - this.range / 2);
            position.speedY = 20;
            this.pointsList.push(position);
        }

        this.geometry.setFromPoints(this.pointsList);
        this.points = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.points);
    }

    stopAnimation () {
        this.scene.remove(this.points);
    }

    startAnimation () {
        if (this.points) {
            this.scene.add(this.points);
        } else {
            this.init();
        }
    }

    animation () {
        this.pointsList.forEach(position => {
            position.y -= position.speedY;
            if (position.y <= 0) {
                position.y = this.range / 2;
            }
        });
        this.points.geometry.setFromPoints(this.pointsList);
    }
}