import * as THREE from 'three';
import { color } from '../config';

export default class Road {
    constructor(scene, time) {
        this.scene = scene;
        this.time = time;

        this.createRoad({

            range: 200,
            height: 300,
            color: color.fly,
            size: 30
        });
    }

    createRoad (options) {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-800, 0, 0),
            new THREE.Vector3(-300, 0, 0),
            new THREE.Vector3(-300, 0, 450),
            new THREE.Vector3(-200, 0, 450),
            new THREE.Vector3(-200, 0, 700),
            new THREE.Vector3(100, 0, 700),
        ])
        // 获取粒子
        const points = curve.getPoints(400);

        const positions = [];
        const aPositions = [];

        points.forEach((item, index) => {
            positions.push(item.x, item.y, item.z);
            aPositions.push(index);
        });

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('a_position', new THREE.Float32BufferAttribute(aPositions, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_color: {
                    value: new THREE.Color(options.color)
                },
                u_range: {
                    value: options.range
                },
                u_size: {
                    value: options.size
                },
                u_total: {
                    value: 400
                },
                u_time: this.time
            },
            vertexShader: `
                attribute float a_position;

                uniform float u_time;
                uniform float u_size;
                uniform float u_range;
                uniform float u_total;

                varying float v_opacity;

                void main () {
                    float size = u_size / 10.0;
                    float total_number = u_total * mod(u_time, 1.0);

                    if (total_number  > a_position && total_number < a_position + u_range) {

                        // index实现拖尾效果
                        float index = (a_position + u_range - total_number) / u_range;
                        size *= index;
                        v_opacity = 1.0;
                    } else {
                        v_opacity = 0.0;
                    }

                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size;
                }
            `,
            fragmentShader: `
                precision lowp float;
                uniform vec3 u_color;
                varying float v_opacity;

                void main () {
                    gl_FragColor = vec4(u_color, v_opacity);
                }
            `,
            transparent: true
        });

        const point = new THREE.Points(geometry, material);
        this.scene.add(point);
    }
}