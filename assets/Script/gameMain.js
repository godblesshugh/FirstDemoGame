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
        bulletGroup: {
            default: null,
            type: require('./bulletGroup'),
        },
        cannon: {
            default: null,
            type: require('./cannon.js')
        },
    },

    start() {},

    // update (dt) {},

    onLoad() {
        this.eState = common.GameState.start;
        this.bulletGroup.startAction();
    },
});