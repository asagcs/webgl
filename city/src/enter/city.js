import { loadFBX } from '../utils';
import { SurrentLine } from '../effect/surrountLine';
import { Background } from '../effect/background';
import * as THREE from 'three';
import * as Tween from '@tweenjs/tween.js'
import { Radar } from '../effect/radar';
import { wall } from '../effect/wall';
import Circle from '../effect/circle';
import Ball from '../effect/ball';
import Cone from '../effect/cone';
import Fly from '../effect/fly';
import Road from '../effect/raod';
import { Font } from '../effect/font';
import { Snow } from '../effect/snow';
import { Rain } from '../effect/rain';
import Smoke from '../effect/smoke';

export class City {
    constructor(scene, camera, controls, changeName) {
        this.scene = scene;
        this.camera = camera;
        this.controls = controls;
        this.changeName = changeName;

        this.tweenPosition = null;
        this.tweenRotation = null;

        this.flag = false;

        this.height = {
            value: 5
        }

        this.time = {
            value: 0
        }

        this.top = {
            value: 0
        }

        this.effect = {}

        this.loadCity();
    }

    loadCity () {
        // 加载模型，并渲染到画布上
        loadFBX('/src/model/lzh.fbx').then(object => {
            // console.log('拿到数据了', object)
            // this.scene.add(object);
            object.traverse((child) => {
                // console.log('我想看看每一项', child)
                if (child.isMesh) {
                    new SurrentLine(this.scene, child, this.height, this.time);
                }
            });

            this.initEffect();
        })
    }

    initEffect () {
        new Background(this.scene);
        new Radar(this.scene, this.time);
        new wall(this.scene, this.time);
        new Circle(this.scene, this.time);
        new Ball(this.scene, this.time);
        new Cone(this.scene, this.top, this.height);
        new Fly(this.scene, this.time);
        new Road(this.scene, this.time);
        new Font(this.scene);
        this.effect.snow = new Snow(this.scene);
        this.effect.snowAnimation = false;
        this.effect.rain = new Rain(this.scene);
        this.effect.rainAnimation = false;
        this.effect.smoke = new Smoke(this.scene);
        this.effect.smokeAnimation = false;

        this.addClick();
        this.addWheel();
    }

    startOrStopSnow () {
        this.effect.snowAnimation = !this.effect.snowAnimation;
        if (this.effect.snowAnimation) {
            this.effect.snow.startAnimation();
        } else {
            this.effect.snow.stopAnimation();
        }
    }

    startOrStopRain () {
        this.effect.rainAnimation = !this.effect.rainAnimation;
        if (this.effect.rainAnimation) {
            this.effect.rain.startAnimation();
        } else {
            this.effect.rain.stopAnimation();
        }
    }

    startOrStopSmoke () {
        this.effect.smokeAnimation = !this.effect.smokeAnimation;
        if (this.effect.smokeAnimation) {
            this.effect.smoke.startAnimation();
        } else {
            this.effect.smoke.stopAnimation();
        }
    }

    // 让场景跟随鼠标缩放
    addWheel () {
        const body = document.body;
        body.onmousewheel = (event) => {
            const value = 100;
            // 鼠标当前的坐标信息
            const x = (event.clientX / window.innerWidth) * 2 - 1;
            const y = -(event.clientY / window.innerHeight) * 2 + 1;

            const vector = new THREE.Vector3(x, y, 0.5);
            vector.unproject(this.camera);
            vector.sub(this.camera.position).normalize();

            if (event.wheelDelta > 0) {
                this.camera.position.x += vector.x * value;
                this.camera.position.y += vector.y * value;
                this.camera.position.z += vector.z * value;

                this.controls.target.x += vector.x * value;
                this.controls.target.y += vector.y * value;
                this.controls.target.z += vector.z * value;
            } else {
                this.camera.position.x -= vector.x * value;
                this.camera.position.y -= vector.y * value;
                this.camera.position.z -= vector.z * value;

                this.controls.target.x -= vector.x * value;
                this.controls.target.y -= vector.y * value;
                this.controls.target.z -= vector.z * value;
            }
        }
    }

    addClick() {
        let flag = true;
        const dom = document.getElementById('webgl');
        dom.onmousedown = () => {
            flag = true;
            dom.onmousemove = () => {
                flag = false;
            }
        }

        dom.onmouseup = (event) => {
            if (flag) {
                this.clickEvent(event)
            }

            dom.onmousemove = null;
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

                this.changeName(point3d.object.geometry.name)
                console.log('我点中了什么', point3d)

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

    start(delta) {

        if (this.effect.snowAnimation) {
            this.effect.snow && this.effect.snow.animation();
        }

        if (this.effect.rainAnimation) {
            this.effect.rain && this.effect.rain.animation();
        }
        
        if (this.effect.smokeAnimation) {
            this.effect.smoke && this.effect.smoke.animation();
        }

        if (this.tweenPosition && this.tweenRotation) {
            this.tweenPosition.update();
            this.tweenRotation.update();
        }
        // 处理前的模型用0.4
        this.height.value += 0.04;
        this.time.value += delta;

        // 处理前的模型最高80， 处理后的模型最高为7
        // 因此初始最低值在处理前用5，处理后用0.1比较合适
        if (this.height.value > 7) {
            this.height.value = 0.1;
        }

        if (this.top.value > 15 || this.top.value < 0) {
            this.flag = !this.flag;
        }
        this.top.value += (this.flag ? -0.8 : 0.8) ;
    }
}