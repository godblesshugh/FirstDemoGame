'use strict';

var common = require('./common');
var screenHeightLimit = 0;
var screenWidthLimit = 0;
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
        screenHeightLimit = cc.find('Canvas').height / 2; // 正负
        screenWidthLimit = cc.find('Canvas').width / 2; // 正负
        this.enemyGroup = this.node.parent.getComponent('enemyGroup');
    },

    init: function (hp, level, position) {
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
        // node.getComponent(cc.RigidBody).getWorldCenter()
        var rigidbody = this.node.getComponent(cc.RigidBody);
        if (this.node.position.x > screenWidthLimit || this.node.position.x < -screenWidthLimit) {
            this.enemyGroup.enemyDestroy(this.node);
        }
    },

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {
    },

    // 只在两个碰撞体结束接触时被调用一次
    onEndContact: function (contact, selfCollider, otherCollider) {
        switch (otherCollider.node.name) {
            case 'ground':
                {
                    if (selfCollider.body.linearVelocity.y < 700) {
                        selfCollider.body.applyLinearImpulse(cc.v2(0, 300), selfCollider.body.getWorldCenter(), true);
                    } else {
                        selfCollider.body.applyLinearImpulse(cc.v2(0, 100), selfCollider.body.getWorldCenter(), true);
                    }
                    // 撞到了地面
                    break;
                }
            case 'leftWall':
                {
                    // 撞到了左墙
                    break;
                }
            case 'rightWall':
                {
                    // 撞到了右墙
                    break;
                }
            case 'bullet':
                {
                    // 被子弹打中了
                    break;
                }
        }
    },
});