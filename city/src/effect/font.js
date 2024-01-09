import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

export class Font {
    constructor(scene) {
        this.scene = scene;
        this.font = null;

        this.init();
    }

    init () {
        const loader = new FontLoader();
        loader.load('/font.json', (font) => {

            this.font = font;
            this.createTextQueue();
        });

        // 创建字体几何体
        // this.createTextQueue();
    }

    createTextQueue() {
        [
            {
                text: '最高的楼',
                size: 20,
                position: {
                    x: -400,
                    y: 600,
                    z: 800,
                },
                rotate: Math.PI / 2,
                color: '#fff60f'
            },
            {
                text: '不是高的楼',
                size: 20,
                position: {
                    x: 180,
                    y: 110,
                    z: -70,
                },
                rotate: Math.PI / 2,
                color: '#fff60f'
            }
        ].forEach(item => {
            this.createText(item);
        })
    }

    createText (data) {
        const geometry = new TextGeometry(data.text, {
            font: this.font,
            size: data.size,
            height: 20,
        })
        const material = new THREE.ShaderMaterial({
            vertexShader: `
                void main () {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                void main () {
                    gl_FragColor = vec4(1.0, 0.0, 0.6, 1.0);
                }
            `
        })

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(data.position);
        mesh.rotateY(data.rotate);
        this.scene.add(mesh);
    }
}