'use strict';

const common = require('./common');

const bPosition = cc.Class({
    name: 'bPosition',
    properties: {
        xAxis: {
            default: '',
            tooltip: 'default x, target to hero',
        },
        yAxis: {
            default: '',
            tooltip: 'default y, target to hero',
        },
    }
});

const bulletInfinite = cc.Class({
    name: 'bulletInfinite',
    properties: {
        name: '',
        freqTime: 0,
        initPoolCount: 0,
        initATK: 19,
        prefab: cc.Prefab,
        margin: 0,
    }
});

cc.Class({
    extends: cc.Component,

    properties: {
        bulletInfinite: {
            default: null,
            type: bulletInfinite,
            tooltip: '无限时长子弹组'
        },
        cannon: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.gameState = common.GameState.none;
        common.InitObjPool(this, this.bulletInfinite);
    },

    startAction() {
        this.eState = common.GameState.start;
        this.getNewBullet(this.bulletInfinite);
        this.bICallback = function () {
            this.getNewBullet(this.bulletInfinite);
        }.bind(this);
        this.schedule(this.bICallback, this.bulletInfinite.freqTime);
    },

    // update (dt) {},

    getNewBullet: function (bulletInfo) {
        var objName = bulletInfo.name;
        // 一共支持并排5发子弹
        // for (var i = 0; i < bulletInfo.position.length; i++) {
        //     var newNode = common.PopPool(this, objName, bulletInfo.prefab, this.node);
        //     var newV2 = this.getBulletPosition(bulletInfo.position[i]);
        //     newNode.setPosition(newV2);
        //     newNode.getComponent('bullet').bulletGroup = this;
        //     var rigidbody = newNode.getComponent(cc.RigidBody);
        //     rigidbody.linearVelocity = cc.v2(0, 1500);
        // }
        // 计算子弹坐标
        var odd = Global.bulletCount % 2 === 0 ? false : true; // 子弹数是奇数还是偶数
        for(let i = 0; i < Global.bulletCount; i++) {
            var newNode = common.PopPool(this, objName, bulletInfo.prefab, this.node);
            var newV2 = this.getBulletPosition(Global.bulletPosition[i]);
            newNode.setPosition(newV2);
            newNode.getComponent('bullet').bulletGroup = this;
            var rigidbody = newNode.getComponent(cc.RigidBody);
            rigidbody.linearVelocity = cc.v2(0, 1500);
        }
    },

    getBulletPosition: function (posInfo) {
        var position = this.cannon.getPosition();
        var v2_x = position.x + posInfo.x;
        var v2_y = position.y + posInfo.y;
        return cc.v2(v2_x, v2_y);
    },

    updateBullet: function(ATK, COUNT) {
        // 子弹攻击力增加
        Global.bulletATK += ATK;
        // TODO: 子弹数量增加
        Global.bulletCount += COUNT;
    },

    bulletDestroy: function (nodeInfo) {
        common.PushPool(this, nodeInfo);
    }
});