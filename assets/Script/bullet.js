'use strict';

var common = require('./common');
var screenHeightLimit = 0;

cc.Class({
    extends: cc.Component,

    properties: {
        xSpeed: {
            default: 0,
            type: cc.Integer
        },
        ySpeed: {
            default: 0,
            type: cc.Integer
        },
        hpDrop: {
            default: 0,
            type: cc.Integer
        },
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