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
        prefab: cc.Prefab,
        position: {
            default: [],
            type: bPosition,
            tooltip: '多少排子弹',
        }
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
        for (var i = 0; i < bulletInfo.position.length; i++) {
            var newNode = common.PopPool(this, objName, bulletInfo.prefab, this.node);
            var newV2 = this.getBulletPosition(bulletInfo.position[i]);
            newNode.setPosition(newV2);
            newNode.getComponent('bullet').bulletGroup = this;
        }
    },

    getBulletPosition: function (posInfo) {
        var position = this.cannon.getPosition();
        var v2_x = position.x + eval(posInfo.xAxis);
        var v2_y = position.y + eval(posInfo.yAxis);
        return cc.v2(v2_x, v2_y);
    },

    bulletDestroy: function (nodeInfo) {
        common.PushPool(this, nodeInfo);
    }
});