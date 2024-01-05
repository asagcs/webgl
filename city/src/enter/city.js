import { loadFBX } from '../utils';
import { SurrentLine } from '../effect/surrountLine';
import { Background } from '../effect/background';
import * as THREE from 'three';
import * as Tween from '@tweenjs/tween.js'

export class City {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;

        this.tweenPosition = null;
        this.tweenRotation = null;

        this.loadCity();
    }

    loadCity () {
        // 加载模型，并渲染到画布上
        loadFBX('/src/model/lzh.fbx').then(object => {
            // console.log('拿到数据了', object)
            // this.scene.add(object);
            object.traverse((child) => {
                if (child.isMesh) {
                    new SurrentLine(this.scene, child);
                }
            });

            this.initEffect();
        })
    }

    initEffect () {
        new Background(this.scene);

        this.addClick();
    }

    addClick() {
        let flag = true;
        document.onmousedown = () => {
            flag = true;
            document.onmousemove = () => {
                flag = false;
            }
        }

        document.onmouseup = (event) => {
            if (flag) {
                this.clickEvent(event)
            }

            document.onmousemove = null;
        }
    }

    clickEvent (event) {
            const x = (event.clientX / window.innerWidth) * 2 - 1;
            const y = (event.clientY / window.innerHeight) * -2 + 1;
    
            // 创建设备坐标
            const standardVector = new THREE.Vector3(x, y, 0.5);

            // 转换为世界坐标
            const worldVector = standardVector.unproject(this.camera);
            // 做序列化
            const ray = worldVector.sub(this.camera.position).normalize();
    
            // 如何实现点击选中
            // 创建一个射线发射器，用来发射一条射线
            const raycaster = new THREE.Raycaster(this.camera.position, ray);
    
            // 返回射线碰撞到的物体
            const intersects = raycaster.intersectObjects(this.scene.children, true);
    
            let point3d = null;
            if (intersects.length) {
                point3d = intersects[0]
            }
    
            if (point3d) {
                // 开始动画修改观察点
                const time = 1000;

                const proportion = 2;

                this.tweenPosition = new Tween.Tween(this.camera.position).to({
                    x: point3d.point.x * proportion,
                    y: point3d.point.y * proportion,
                    z: point3d.point.z * proportion
                }, time).start();

                this.tweenRotation = new Tween.Tween(this.camera.rotation).to({
                    x: this.camera.rotation.x,
                    y: this.camera.rotation.y,
                    z: this.camera.rotation.z
                }, time).start();
            }
    }

    start() {
        if (this.tweenPosition && this.tweenRotation) {
            this.tweenPosition.update();
            this.tweenRotation.update();
        }
    }
}