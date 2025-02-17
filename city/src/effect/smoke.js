/**
 * 烟雾预警  粒子
 */
import * as THREE from 'three';

export default class Smoke {
    constructor(scene) {
        this.scene = scene;

        this.smokes = [];

        // this.init();
    }

    init () {
        this.geometry = new THREE.BufferGeometry();

        

        this.material = new THREE.PointsMaterial({
            size: 50,
            map: new THREE.TextureLoader().load('../../src/assets/smoke.png'),
            transparent: true,
            // opacity: 0.6,
            depthWrite: false, //进制深度写入
        });

        this.material.onBeforeCompile = function (shader) {
            const vertex1 = `
                attribute float a_opacity;
                attribute float a_size;
                attribute float a_scale;

                void main () {


            `;

            const glPosition = `
                    gl_PointSize = a_size * a_scale;
            `

            shader.vertexShader = shader.vertexShader.replace(`void main() {`, vertex1);
            shader.vertexShader = shader.vertexShader.replace(`gl_PointSize = size`, glPosition);

            const fragment1 = `
                varying float v_opacity;

                void main () {

            `

            const fragment2 = `
                    gl_FragColor = vec4(outgoingLight, diffuseColor.a * v_opacity);
            `
            shader.fragmentShader = shader.fragmentShader.replace(`void main() {`, fragment1);
            shader.fragmentShader = shader.fragmentShader.replace(`gl_FragColor = vec4(outgoingLight, diffuseColor.a)`, fragment2);
        }   

        this.points = new THREE.Points(this.geometry, this.material);

        this.scene.add(this.points);
    }

    createParticle () {
        this.smokes.push({
            size: 50,
            opacity: 1,
            x: 0,
            y: 0,
            z: 0,
            speed: {
                x: Math.random(),
                y: Math.random() + 0.3,
                z: Math.random()
            },
            scale: 1,
        })
    }

    setAttribute (positionList, opacityList, sizeList, scaleList) {
        // 坐标， 纹理，变量等信息
        this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positionList), 3));
        this.geometry.setAttribute('a_opacity', new THREE.BufferAttribute(new Float32Array(opacityList), 1));
        this.geometry.setAttribute('a_size', new THREE.BufferAttribute(new Float32Array(sizeList), 1));
        this.geometry.setAttribute('a_scale', new THREE.BufferAttribute(new Float32Array(scaleList), 1));
    }

    update () {
        const positionList = [];
        const sizeList = [];
        const scaleList = [];
        const opacityList = [];

        this.smokes = this.smokes.filter((item) => {
            // 如果达到某一个条件， 就抛弃当前粒子 opacity < 0
            if (item.opacity < 0) {
                return false;
            }
            item.opacity -= 0.01;

            item.scale += 0.01;

            item.x = item.x + item.speed.x;
            item.y = item.y + item.speed.y;
            item.z = item.z + item.speed.z;

            positionList.push(item.x, item.y, item.z);
            sizeList.push(item.size);
            scaleList.push(item.scale);
            opacityList.push(item.opacity);
            return true;
        })

        this.setAttribute(positionList, opacityList, sizeList, scaleList);
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
        this.createParticle();
        this.update();
    }
}