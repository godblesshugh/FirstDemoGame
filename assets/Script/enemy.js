'use strict';

var common = require('./common');
var screenHeightLimit = 0;
var xSpeed = 10;

cc.Class({
    extends: cc.Component,

    properties: {
        level: {
            default: 1,
            type: cc.Integer,
            tooltip: '敌人的等级，1/2/3/4 用来区分六边形的大小'
        },
        hp: {
            default: 1,
            type: cc.Integer,
            tooltip: '敌人的血量'
        },
        label: {
            default: '1',
            tooltip: '敌人的显示出来的血量，4位数'
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        var collisionManager = cc.director.getCollisionManager();
        collisionManager.enabled = true;
        collisionManager.enabledDebugDraw = true; // FIXME: 测试的时候，先绘制出来碰撞边界
        screenHeightLimit = cc.find('Canvas').height / 2; // 正负
        this.enemyGroup = this.node.parent.getComponent('enemyGroup');
    },

    onCollisionEnter: function (other, self) {
        this.enemyGroup.enemyDestroy(self.node);
    },

    init: function (hp, level) {
        if (this.node.group !== 'enemy') {
            this.node.group = 'enemy';
        }
        this.hp = hp || this.hp;
        this.level = level || this.level;
    },

    start() {

    },

    update(dt) {
        if (this.enemyGroup.eState !== common.GameState.start) {
            return;
        }
        // this.node.x += dt * xSpeed;
        // this.node.x += dt * this.xSpeed;
        // this.node.y += dt * this.ySpeed;
        // if (this.node.y > screenHeightLimit) {
        //     this.enemyGroup.enemyDestroy(this.node);
        // }
    },
});