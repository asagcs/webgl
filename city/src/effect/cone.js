import * as THREE from 'three';
import { color } from '../config';

// 旋转四棱锥
export default class Cone{
    constructor(scene, top, height) {
        this.scene = scene;
        this.top = top;
        this.height = height

        const options = {
            radius: 15,
            color: color.cone,
            opacity: 0.6,
            height: 30,
            position: {
                x: 0,
                y: 50,
                z: 0
            },
            speed: 4.0
        }
        this.createCone(options);
    }

    createCone (options) {
        const geometry = new THREE.ConeGeometry(options.radius, options.height, 4);

        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_color: {
                    value: new THREE.Color(options.color)
                },
                u_height: this.height,
                u_top: this.top
            },
            transparent: true,
            side: THREE.DoubleSide,
            depthTest: false,
            vertexShader: `
                uniform float u_top;
                uniform float u_height;

                void main () {
                    float f_angle = u_height / 10.0;
                    float new_x = position.x * cos(f_angle) - position.z * sin(f_angle);
                    float new_y = position.y;
                    float new_z = position.z * cos(f_angle) + position.x * sin(f_angle);

                    vec4 v_position = vec4(new_x, new_y + u_top, new_z, 1.0);

                    gl_Position = projectionMatrix * modelViewMatrix * v_position;
                }
            `,
            fragmentShader: `
                uniform vec3 u_color;
                
                void main () {
                    gl_FragColor = vec4(u_color, 0.6);
                }
            `
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(options.position);
        mesh.rotateZ(Math.PI)

        this.scene.add(mesh);
    }
}