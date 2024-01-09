import * as THREE from 'three';
import { color } from '../config';
import Cylinder from './cylinder';

export class wall {
    constructor(scene, time) {
        this.scene = scene;
        this.time = time;

        this.config = {
            radius: 50,
            height: 50,
            open: true,
            color: color.wallColor,
            opacity: 0.6,
            position: {
                x: 0,
                y: 0,
                z: 0
            },
            speed: 1.0
        }

        new Cylinder(this.scene, this.time).createCylinder(this.config);
    }
}