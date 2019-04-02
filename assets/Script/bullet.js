'use strict';

var common = require('./common');
var screenHeightLimit = 0;

// // FIXME: dt 每隔7次都会变换一下，所以取一个相对较短的时间来平衡一下
// var dt = 0.015;

cc.Class({
    extends: cc.Component,

    properties: {
        xSpeed: cc.Integer,
        ySpeed: cc.Integer,
        hpDrop: cc.Integer,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.getCollisionManager().enabled = true;
        screenHeightLimit = cc.find('Canvas').height / 2; // 正负
    },

    onCollisionEnter: function (other, self) {
        this.bulletGroup.bulletDestroy(self.node);
    },

    start() {

    },

    update(dt) {
        if (this.bulletGroup.eState !== common.GameState.start) {
            return;
        }
        this.node.x += dt * this.xSpeed;
        this.node.y += dt * this.ySpeed;
        if (this.node.y > screenHeightLimit) {
            this.bulletGroup.bulletDestroy(this.node);
        }
    },
});