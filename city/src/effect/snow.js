import * as THREE from 'three';

export class Snow {
    constructor(scene) {
        this.scene = scene;

        // 范围
        this.range = 5000;
        // 雪花的个数
        this.count = 4500;

        this.pointList = [];
        
        // this.init();
    }

    init () {
        // 粒子系统
        // 材质
        this.material = new THREE.PointsMaterial({
            size: 30,
            map: new THREE.TextureLoader().load('../../src/assets/snow.png'),
            transparent: true,
            opacity: 0.8,
            depthTest: false
        });
        // 几何对象
        this.geometry = new THREE.BufferGeometry();

        // 添加顶点信息
        for(let i = 0; i < this.count; i++) {
            const position = new THREE.Vector3(Math.random() * this.range - this.range / 2, Math.random() * this.range, Math.random() * this.range - this.range / 2);
            position.speedX = Math.random() - 0.5;
            position.speedY = Math.random() + 0.4;
            position.speedZ = Math.random() - 0.5;
            this.pointList.push(position);
        }
        // console.log('走了这里了没', points)
        this.geometry.setFromPoints(this.pointList);

        this.point = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.point);
    }

    stopAnimation () {
        this.scene.remove(this.point);
    }

    startAnimation () {
        if (this.point) {
            this.scene.add(this.point);
        } else {
           
            this.init();
        }
    }

    animation () {
        if (!this.geometry || !this.pointList.length) return;
        // this.scene.remove(this.point)
        this.pointList.forEach(position => {
            position.x -= position.speedX;
            position.y -= position.speedY;
            position.z -= position.speedZ;

            if (position.y <= 0) {
                position.y = this.range / 2
            }
        })
        this.geometry.setFromPoints(this.pointList);
        // const point = new THREE.Points(this.geometry, this.material);
        // this.scene.add(point);
    }
}