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
}

const itemType = {
    SpotLight: ['color', 'intensity', 'distance', 'angle', 'decay'], // 聚光灯
    AmbientLight: ['color'], // 环境光
    PointLight: ['color', 'intensity', 'distance', 'decay'],
    DirectionalLight: ['color', 'intensity'],
    HemisphereLight: ['color', 'groundColor', 'intensity']
}

function initControls (item) {
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