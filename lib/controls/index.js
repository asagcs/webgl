import * as THREE from '../threejs/three.module.js';

const basicType = {
    color: {
        method: 'addColor',
        getValue: (item) => item.color.getStyle(),
        setValue: (item, value) => item.color.setStyle(value)
    },
    groundColor: {
        method: 'addColor',
        getValue: (item) => item.groundColor.getStyle(),
        setValue: (item, value) => item.groundColor.setStyle(value)
    },
    intensity: {
        extends: [0, 100000],
        getValue: (item) => item.intensity,
        setValue: (item, value) => item.intensity = +value
    },
    distance: {
        extends: [0, 500],
        getValue: (item) => item.distance,
        setValue: (item, value) => item.distance = +value
    },
    angle: {
        extends: [0, Math.PI * 2],
        getValue: (item) => item.angle,
        setValue: (item, value) => item.angle = +value
    },
    decay: {
        extends: [0, 20],
        getValue: (item) => item.decay,
        setValue: (item, value) => item.decay = +value
    },
    opacity: {
        extends: [0, 1],
        getValue: (item) => item.opacity,
        setValue: (item, value) => item.opacity = +value
    },
    transparent: {
        getValue: (item) => item.transparent,
        setValue: (item, value) => item.transparent = value
    },
    wireframe: {
        getValue: (item) => item.wireframe,
        setValue: (item, value) => item.wireframe = value
    },
    visible: {
        getValue: (item) => item.visible,
        setValue: (item, value) => item.visible = value
    },
    cameraNear: {
        extends: [0, 50],
        getValue: (item, camera) => camera.near,
        setValue: (item, value, camera) => camera.near = value
    },
    cameraFar: {
        extends: [50, 1000],
        getValue: (item, camera) => camera.far,
        setValue: (item, value, camera) => camera.far = value
    },
    side: {
        extends: [['front', 'back', 'double']],
        getValue: (item, camera) => 'front',
        setValue: (item, value, camera) => {
            switch(value) {
                case 'front':
                    item.side = THREE.FrontSide;
                    break;
                case 'back':
                    item.side = THREE.BackSide;
                    break;
                case 'double':
                    item.side = THREE.DoubleSide;
                    break;
            }
        }
    },
    // 材料的环境颜色 ---- 已移除
    ambient: {
        method: 'addColor',
        getValue: (item) => item.ambient.getHex(),
        setValue: (item, value) => item.ambient = new THREE.Color(value)
    },
    // 物体本身的颜色
    emissive: {
        method: 'addColor',
        getValue: (item) => item.emissive.getHex(),
        setValue: (item, value) => item.emissive = new THREE.Color(value)
    },
    specular: {
        method: 'addColor',
        getValue: (item) => item.specular.getHex(),
        setValue: (item, value) => item.specular = new THREE.Color(value)
    },
    shininess: {
        extends: [0, 100],
        getValue: (item) => item.shininess,
        setValue: (item, value) => item.shininess = value
    },
    alpha: {
        extends: [0, 1],
        getValue: (item) => item.uniforms.a.value,
        setValue: (item, value) => item.uniforms.a.value = value
    },
    red: {
        extends: [0.0, 1.0],
        getValue: (item) => item.uniforms.r.value,
        setValue: (item, value) => item.uniforms.r.value = value
    },
    green: {
        extends: [0.0, 1.0],
        getValue: (item) => item.uniforms.g.value,
        setValue: (item, value) => item.uniforms.g.value = value
    },
    dashSize: {
        extends: [0, 5],
        getValue: (item) => item.dashSize,
        setValue: (item, value) => item.dashSize = +value
    },
    gapSize: {
        extends: [0, 5],
        getValue: (item) => item.gapSize,
        setValue: (item, value) => item.gapSize = +value
    },
}

const itemType = {
    SpotLight: ['color', 'intensity', 'distance', 'angle', 'decay'], // 聚光灯
    AmbientLight: ['color'], // 环境光
    PointLight: ['color', 'intensity', 'distance', 'decay'],
    DirectionalLight: ['color', 'intensity'],
    HemisphereLight: ['color', 'groundColor', 'intensity'],
    MeshBasicMaterial: ['color', 'opacity', 'transparent', 'wireframe', 'visible'],
    MeshDepthMaterial: ['wireframe', 'cameraNear', 'cameraFar'],
    MeshNormalMaterial: ['opacity', 'transparent', 'wireframe', 'visible', 'side'],
    MeshLambertMaterial: ['opacity', 'transparent', 'wireframe', 'visible', 'side', 'emissive', 'color'],
    MeshPhongMaterial: ['opacity', 'transparent', 'wireframe', 'visible', 'side', 'emissive', 'color', 'specular', 'shininess'],
    ShaderMaterial: ['red', 'green', 'alpha'],
    LineBasicMaterial: ['color'],
    LineDashedMaterial: ['color', 'dashSize', 'gapSize']
}

export function initControls (item, camera) {
    console.log(item)
    const typeList = itemType[item.type];
    const controls = {};
    const gui = new dat.GUI();

    if (!typeList || !typeList.length) return;

    for(let i = 0; i < typeList.length; i++) {
        const child = basicType[typeList[i]];
        if (child) {
            controls[typeList[i]] = child.getValue(item, camera);
            const childExtends = child.extends || [];

            gui[child.method || 'add'](controls, typeList[i], ...childExtends).onChange((value) => {
                child.setValue(item, value, camera);
            });
        }
    }

}