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
        this.eState = common.GameState.start;
        this.cannon.startAction();
        this.bulletGroup.startAction();
        this.enemyGroup.startAction();
    },
});