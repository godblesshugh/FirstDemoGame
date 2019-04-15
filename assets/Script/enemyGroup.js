'use strict';

var common = require('./common');

//敌机组
var enemyG = cc.Class({
    name: 'enemyG',
    properties: {
        name: '',
        freqTime: 0,
        initPoolCount: 0,
        prefab: cc.Prefab,
        position: new cc.v2(0, 0),
    }
});

var coin = cc.Class({
    name: 'coinObj',
    properties: {
        name: '',
        initPoolCount: 0,
        prefab: cc.Prefab,
    }
});

cc.Class({
    extends: cc.Component,

    properties: {
        enemyG: {
            default: [],
            type: enemyG,
        },
        coinObj: {
            default: null,
            type: coin
        }
    },

    onLoad: function () {
        this.eState = common.GameState.none;
        common.BatchInitObjPool(this, this.enemyG);
        common.InitObjPool(this, this.coinObj);
    },

    startAction: function () {
        this.eState = common.GameState.start;
        // TODO: 之后要改成顺序播放，频次改成概率来生成 enemy
        for (var i = 0; i < this.enemyG.length; i++) {
            var freqTime = this.enemyG[i].freqTime;
            var enemyName = 'enemy_callback_' + i;
            this[enemyName] = function (i) {
                this.getNewEnemy(i);
            }.bind(this, i);
            this.schedule(this[enemyName], freqTime);
        }
    },
    getNewEnemy: function (level) {
        if (Global.existEnemy > 5) {
            return;
        }
        let newNode = _getNewEnemy(this, level);
        newNode.getComponent('enemy').init(1000 + parseInt(Math.random() * 1000), level);
    },
    splitDown: function (position, baseHP, level) {
        // 数字是初始数字的一半，等级低一级，position 重合，给一个斜向上的冲量，向两边抛出
        if (level > 0) {
            level--;
            baseHP = Math.round(baseHP / 2);
            // TODO: 好像这里出现了 NaN 的情况？为啥
            let leftEnemy = _getNewEnemy(this, level);
            leftEnemy.getComponent('enemy').init(baseHP, level, cc.v2(-1000, 3000), position);
            let rightEnemy = _getNewEnemy(this, level);
            rightEnemy.getComponent('enemy').init(baseHP, level, cc.v2(1000, 3000), position);
        }
    },
    getNewEnemyPosition: function (newNode) {
        var randx = Math.random() > 0.5 ? this.node.parent.width / 2 - newNode.width / 2 - 10 : -this.node.parent.width / 2 + newNode.width / 2 + 10;
        var randy = this.node.parent.height / 2 - newNode.height / 2;
        return cc.v2(randx, randy);
    },
    enemyDestroy: function (nodeInfo) {
        common.PushPool(this, nodeInfo);
    },
    produceCoins: function (level, position, linearVelocity) {
        if (level > 0) {
            return;
        }
        // 打碎敌人以后，需要生产出金币，可以获取后，增加炮台的攻击力和子弹数
        let toRight = linearVelocity.x > 0 ? true : false; // 向左还是向右
        for (let index = 0; index < 3; index++) {
            let _coin = _getNewCoin(this);
            // position, type, value, toRight, index
            _coin.getComponent('coin').init(position, 0, 1, toRight, index);
        }
    },
    coinDestroy: function (nodeInfo) {
        common.PushPool(this, nodeInfo);
    },
});

const _getNewEnemy = (that, level) => {
    let enemyInfo = that.enemyG[level];
    let objName = enemyInfo.name;
    let newNode = common.PopPool(that, objName, enemyInfo.prefab, that.node);
    newNode.getComponent('enemy').enemyGroup = that;
    return newNode;
};

const _getNewCoin = (that) => {
    let objName = 'coin';
    let newNode = common.PopPool(that, objName, that.coinObj.prefab, that.node);
    return newNode;
};