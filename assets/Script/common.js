'use strict';

var areaWidth = 0;
var areaHeight = 0;

const init = (_areaWidth, _areaHeight) => {
    areaWidth = areaWidth;
    _areaHeight = _areaHeight;
};

const GameState = {
    none: 0,
    start: 1,
    stop: 2
};

const GetObjPoolName = (name) => {
    return '__pool__' + name;
};

// 初始化对象池，objInfo 需要有：name, initPoolCount, prefab
const InitObjPool = (that, objInfo) => {
    var name = objInfo.name;
    var poolName = GetObjPoolName(name);
    that[poolName] = new cc.NodePool();
    let initPoolCount = objInfo.initPoolCount;
    for (let ii = 0; ii < initPoolCount; ++ii) {
        let node = cc.instantiate(objInfo.prefab); // 创建节点
        that[poolName].put(node); // 通过 putInPool 接口放入对象池
    }
};

const BatchInitObjPool = (that, objArray) => {
    for (var i = 0; i < objArray.length; i++) {
        InitObjPool(that, objArray[i]);
    }
};

// pop 节点（从节点池中获取或是创建）
const PopPool = (that, name, prefab, nodeParent) => {
    var poolName = GetObjPoolName(name);
    var pool = that[poolName];
    var node;
    if (pool.size() > 0) {
        node = pool.get();
    } else {
        node = cc.instantiate(prefab);
    }
    nodeParent.addChild(node);
    return node;
};

// push 节点
const PushPool = (that, nodeInfo) => {
    var poolName = GetObjPoolName(nodeInfo.name);
    that[poolName].put(nodeInfo);
};

//时间格式化
const TimeFmt = (time, fmt) => { //author: meizz 
    var o = {
        'M+': time.getMonth() + 1, //月份 
        'd+': time.getDate(), //日 
        'h+': time.getHours(), //小时 
        'm+': time.getMinutes(), //分 
        's+': time.getSeconds(), //秒 
        'q+': Math.floor((time.getMonth() + 3) / 3), //季度 
        'S': time.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }
    return fmt;
};

module.exports = {
    init: init,
    GameState: GameState,
    GetObjPoolName: GetObjPoolName,
    InitObjPool: InitObjPool,
    PopPool: PopPool,
    PushPool: PushPool,
    TimeFmt: TimeFmt,
    BatchInitObjPool: BatchInitObjPool,
};