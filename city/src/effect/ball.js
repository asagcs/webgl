import * as THREE from 'three';
import { color } from '../config';

export default class Ball{
    constructor(scene, time) {
        this.scene = scene;
        this.time = time;

        const options = {
            radius: 50,
            color: color.ball,
            opacity: 0.6,
            height: 60,
            position: {
                x: 300,
                y: 0,
                z: -200
            },
            speed: 4.0
        }
        this.createBall(options);
    }

    createBall (options) {
        const geometry = new THREE.SphereGeometry(options.radius, 32, 32, Math.PI / 2, Math.PI * 2, 0,  Math.PI / 2);

        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_color: {
                    value: new THREE.Color(options.color)
                },
                u_height: {
                    value: options.height
                },
                u_opacity: {
                    value: options.opacity
                },
                u_speed: {
                    value: options.speed
                },
                u_time: this.time
            },
            transparent: true,
            side: THREE.DoubleSide,
            depthTest: false,
            vertexShader: `
                uniform float u_time;
                uniform float u_height;
                uniform float u_speed;

                varying float v_opacity;

                void main () {
                    vec3 v_position = position * mod(u_time / u_speed, 1.0);
                    v_opacity = mix(1.0, 0.0, position.y / u_height);

                    gl_Position = projectionMatrix * modelViewMatrix * vec4(v_position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 u_color;
                uniform float u_opacity;

                varying float v_opacity;
                
                void main () {
                    gl_FragColor = vec4(u_color, u_opacity * v_opacity);
                }
            `
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(options.position);

        this.scene.add(mesh);
    }
}