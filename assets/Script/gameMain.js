'use strict';

var common = require('./common');

cc.Class({
    extends: cc.Component,

    properties: {
        pause: cc.Button,
        btnSprite: {
            default: [],
            type: cc.SpriteFrame,
            tooltip: '暂停按钮不同状态的图片'
        },
        cannon: {
            default: null,
            type: require('./cannon')
        },
        bulletGroup: {
            default: null,
            type: require('./bulletGroup'),
        },
        enemyGroup: {
            default: null,
            type: require('./enemyGroup'),
        },
    },

    start() {},

    // update (dt) {},

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        this.enabledContactListener = true; // 刚体的碰撞检测

        // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_shapeBit;

        // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        //     cc.PhysicsManager.DrawBits.e_pairBit |
        //     cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        //     cc.PhysicsManager.DrawBits.e_jointBit |
        //     cc.PhysicsManager.DrawBits.e_shapeBit;

        var area = cc.find('Canvas/background');
        common.init(area.width, area.height);
        this.eState = common.GameState.start;
        this.cannon.startAction();
        this.bulletGroup.startAction();
        this.enemyGroup.startAction();
    },
});