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
    let initPoolCount = objInfo.initPoolCount || 3;
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
    if (name.startsWith('enemy')) {
        Global.existEnemy++;
    }
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
    if (nodeInfo.name.startsWith('enemy')) {
        Global.existEnemy--;
        if (Global.existEnemy < 0) {
            Global.existEnemy = 0;
        }
    }
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

// 重置节点和刚体的运动状态
const ResetNodeAction = (node) => {
    node.stopAllActions();
    node.setPosition(cc.v2(-1000, -1000));
    var rigidbody = node.getComponent(cc.RigidBody);
    rigidbody.linearVelocity = cc.v2(0, 0);
    rigidbody.angularVelocity = 0;
    rigidbody.gravityScale = 0;
    rigidbody.angularDamping = 0;
    rigidbody.fixedRotation = true;
    return node;
};

const ParseHP = (hp) => {
    let str = hp + '';
    if (hp > 999) {
        // str = 'k';
        if (hp > 99999) {
            return parseInt(hp / 1000) + 'k';
        }
        if (hp > 9999) {
            hp = parseInt(hp / 100) / 10; // 保证是一位小数
            let xsd = hp.toString().split('.');
            if (xsd.length === 1) {
                hp = hp.toString() + '.0';
            }
            return hp + 'k';
        }
        hp = parseInt(hp / 10) / 100; // 保证是两位小数
        let xsd = hp.toString().split('.');
        if (xsd.length === 1) {
            hp = hp.toString() + '.00';
        }
        if (xsd.length > 1) {
            if (xsd[1].length < 2) {
                hp = hp.toString() + '0';
            }
        }
        return hp + 'k';
    }
    return str;
};

const SwitchEnemyColor = (that) => {
    var remainHP = that.hp; // 敌人剩余 HP
    var bullet = Global.bulletATK * Global.bulletCount;
    var remainCount = parseInt(remainHP / bullet); // 敌人剩余打击数量
    var sprite = that.node.getComponent(cc.Sprite);
    if (remainCount < 3) {
        sprite.spriteFrame = that.sprArray[0];
        return;
    }
    if (remainCount < 8) {
        sprite.spriteFrame = that.sprArray[1];
        return;
    }
    if (remainCount < 15) {
        sprite.spriteFrame = that.sprArray[2];
        return;
    }
    if (remainCount >= 15) {
        sprite.spriteFrame = that.sprArray[3];
        return;
    }
    return false;
};

const CalculateBulletPosition = (margin, bulletWidth) => {
    if (Global.bulletPosition.length === Global.bulletCount) {
        return Global.bulletPosition;
    }
    // 计算子弹坐标
    var positions = [];
    var odd = Global.bulletCount % 2 === 0 ? false : true; // 子弹数是奇数还是偶数
    let leftPosition = 0;
    if (odd) {
        // 如果是奇数，那有一颗子弹是在中心位置，同时保持其他子弹的间距
        // 最左侧的子弹位置是：
        leftPosition = -parseInt(Global.bulletCount / 2) * (margin + bulletWidth);
    } else {
        leftPosition = -(Global.bulletCount / 2 - 0.5) * (margin + bulletWidth);
    }
    for (let i = 0; i < Global.bulletCount; i++) {
        positions.push({
            x: leftPosition,
            y: 0,
        });
        leftPosition += (margin + bulletWidth);
    }
    Global.bulletPosition = positions;
    return positions;
};

const GainScore = (num, set) => {
    if (set) {
        Global.scoreLabel.string = num;
    } else {
        Global.scoreLabel.string = parseInt(Global.scoreLabel.string) + num;
    }
};

const GainBulletCount = (num, set) => {
    if (set) {
        Global.bulletCountLabel.string = num;
    } else {
        Global.bulletCountLabel.string = parseInt(Global.bulletCountLabel.string) + num;
    }
};

const GainBulletATK = (num, set) => {
    if (set) {
        Global.bulletATKLabel.string = num;
    } else {
        Global.bulletATKLabel.string = parseInt(Global.bulletATKLabel.string) + num;
    }
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
    ResetEnemy: ResetNodeAction,
    ResetCoin: ResetNodeAction,
    ParseHP: ParseHP,
    SwitchEnemyColor: SwitchEnemyColor,
    CalculateBulletPosition: CalculateBulletPosition,
    GainScore: GainScore,
    GainBulletCount: GainBulletCount,
    GainBulletATK: GainBulletATK,
};