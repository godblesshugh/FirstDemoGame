'use strict';

var common = require('./common');

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad() {
        this.enemyGroup = this.node.parent.getComponent('enemyGroup');
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        this.bulletGroup.bulletDestroy(selfCollider.node);
    },

    start() {

    },

    update(dt) {
        // if (this.bulletGroup.eState !== common.GameState.start) {
        //     return;
        // }
        // this.node.x += dt * this.xSpeed;
        // this.node.y += dt * this.ySpeed;
        // if (this.node.y > cc.view.getVisibleSize().height / 2 - 5) {
        //     this.node.y = -cc.view.getVisibleSize().height;
        //     this.bulletGroup.bulletDestroy(this.node);
        // }
    },
});