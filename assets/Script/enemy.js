'use strict';

var common = require('./common');

cc.Class({
    extends: cc.Component,

    properties: {
        sprArray: {
            default: [],
            type: [cc.SpriteFrame]
        },
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
        this.enemyGroup = this.node.parent.getComponent('enemyGroup');
    },

    init: function (hp, level) {
        if (this.node.group !== 'enemy') {
            this.node.group = 'enemy';
        }
        this.hitCount = 0;
        this.hp = hp || this.hp;
        this.level = level || this.level;
        this.baseHP = this.hp; // 用来做分裂的时候，数据参考
        common.ResetEnemy(this.node);
        // init
        this.node.getComponentInChildren(cc.Label).string = common.ParseHP(this.hp);
        if (Math.random() > 0.5) {
            leftEnter(this);
        } else {
            rightEnter(this);
        }
        var rigidbody = this.node.getComponent(cc.RigidBody);
        var mass = rigidbody.getMass();
        this.weight = Math.ceil(mass / 10);
        common.switchEnemyColor(this);
    },

    start() {},

    update(dt) {
        if (this.enemyGroup.eState !== common.GameState.start) {
            return;
        }
    },

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === 'bullet') {
            // 被子弹打中了
            this.hp -= Global.bulletATK;
            if (this.hp < 0) {
                this.enemyGroup.enemyDestroy(this.node);
            }
            var label = this.node.getComponentInChildren(cc.Label);
            label.string = common.ParseHP(this.hp);
            common.switchEnemyColor(this);
        }
    },

    // 只在两个碰撞体结束接触时被调用一次
    onEndContact: function (contact, selfCollider, otherCollider) {
        switch (otherCollider.node.name) {
            case 'ground':
                {
                    if (selfCollider.body.linearVelocity.y < 500) {
                        selfCollider.body.applyLinearImpulse(cc.v2(200 * this.weight, 2000 * this.weight), selfCollider.body.getWorldCenter(), true);
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
        }
    },
});

var leftEnter = (that) => {
    var rigidbody = that.node.getComponent(cc.RigidBody);
    var x = -(cc.view.getVisibleSize().width / 2 + that.node.width / 2) - 5;
    var y = (cc.view.getVisibleSize().height / 2 - that.node.height / 2) - 10;
    that.node.setPosition(cc.v2(x, y));
    var enterAction = cc.sequence(cc.moveBy(2, that.node.width * 1.5, 0), cc.callFunc(function () {
        rigidbody.fixedRotation = false;
        rigidbody.angularVelocity = 50;
        rigidbody.gravityScale = 1;
        rigidbody.angularDamping = 0.8;
        rigidbody.applyLinearImpulse(cc.v2(500 * this.weight, 0), rigidbody.getWorldCenter(), true);
    }, that));
    that.node.runAction(enterAction);
};

var rightEnter = (that) => {
    var rigidbody = that.node.getComponent(cc.RigidBody);
    var x = (cc.view.getVisibleSize().width / 2 + that.node.width / 2) + 5;
    var y = (cc.view.getVisibleSize().height / 2 - that.node.height / 2) - 10;
    that.node.setPosition(cc.v2(x, y));
    var enterAction = cc.sequence(cc.moveBy(2, -(that.node.width * 1.5), 0), cc.callFunc(function () {
        rigidbody.fixedRotation = false;
        rigidbody.angularVelocity = -20;
        rigidbody.gravityScale = 1;
        rigidbody.angularDamping = 0.8;
        rigidbody.applyLinearImpulse(cc.v2(-500 * this.weight, 0), rigidbody.getWorldCenter(), true);
    }, that));
    that.node.runAction(enterAction);
};