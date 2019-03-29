'use strict';

const gameState = {
    none: 0,
    start: 1,
    stop: 2
};

// 初始化对象池，objInfo 需要有：name, initPoolCount, prefab
const initObjPool = (that, objInfo) => {
    var name = objInfo.name;
    var poolName = '__pool__' + name;
    that[poolName] = new cc.NodePool();
    let initPoolCount = objInfo.initPoolCount;
    for (let ii = 0; ii < initPoolCount; ++ii) {
        let node = cc.instantiate(objInfo.prefab); // 创建节点
        that[poolName].put(node); // 通过 putInPool 接口放入对象池
    }
};

module.exports = {
    gameState: gameState,
    initObjPool: initObjPool,
};