'use strict';

var common = require('./common');

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
        hp: {
            default: 0,
            type: cc.Integer
        },
    },

    onLoad() {
        this.enemyGroup = this.node.parent.getComponent('enemyGroup');
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        this.bulletGroup.bulletDestroy(selfCollider.node);
    },

    // 每次将要处理碰撞体接触逻辑时被调用
    onPreSolve: function (contact, selfCollider, otherCollider) {
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