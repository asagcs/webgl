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
}

const itemType = {
    SpotLight: ['color', 'intensity', 'distance', 'angle', 'decay'], // 聚光灯
    AmbientLight: ['color'], // 环境光
    PointLight: ['color', 'intensity', 'distance', 'decay'],
    DirectionalLight: ['color', 'intensity'],
    HemisphereLight: ['color', 'groundColor', 'intensity'],
    MeshBasicMaterial: ['color', 'opacity', 'transparent', 'wireframe', 'visible']
}

function initControls (item) {
    console.log(item)
    const typeList = itemType[item.type];
    const controls = {};
    const gui = new dat.GUI();

    if (!typeList || !typeList.length) return;

    for(let i = 0; i < typeList.length; i++) {
        const child = basicType[typeList[i]];
        if (child) {
            controls[typeList[i]] = child.getValue(item);
            const childExtends = child.extends || [];

            gui[child.method || 'add'](controls, typeList[i], ...childExtends).onChange((value) => {
                child.setValue(item, value);
            });
        }
    }

}