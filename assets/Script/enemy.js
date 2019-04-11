'use strict';

var common = require('./common');
var xRange = 0;
var xLimit = 0;
var yLimit = 0;

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
        xRange = cc.view.getVisibleSize().width / 2 - this.node.width * 0.3;
        xLimit = xRange * 2;
        yLimit = (cc.view.getVisibleSize().height / 2 - this.node.height * 0.3) * 2;
    },

    init: function (hp, level) {
        if (this.node.group !== 'enemy') {
            this.node.group = 'enemy';
            return;
        }
        this.hitCount = 0;
        this.hp = hp || this.hp;
        this.level = level || this.level;
        this.baseHP = this.hp; // 用来做分裂的时候，数据参考
        common.ResetEnemy(this.node);
        // init
        this.node.getComponentInChildren(cc.Label).string = common.ParseHP(this.hp);
        var rigidbody = this.node.getComponent(cc.RigidBody);
        var mass = rigidbody.getMass();
        this.weight = Math.ceil(mass / 10);
        common.switchEnemyColor(this);
        if (Math.random() > 0.5) {
            leftEnter(this);
        } else {
            rightEnter(this);
        }
    },

    start() { },

    update(dt) {
        if (this.enemyGroup.eState !== common.GameState.start) {
            return;
        }
        var x = this.node.position.x;
        x = x > 0 ? x : -x;
        var y = this.node.position.y;
        y = y > 0 ? y : -y;
        if (x > xLimit || y > yLimit) {
            // 避免超出太多，就直接销毁
            this.enemyGroup.enemyDestroy(this.node);
            return;
        }
        // 如果是在屏幕外，那就先改变一下enemy的属性，让它可以通过两侧的墙？
        // if (x > xRange && this.node.group !== 'outScreenEnemy') {
        //     this.node.group = 'outScreenEnemy';
        //     return;
        // }
    },

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {
        switch (otherCollider.node.name) {
            case 'bullet': {
                this.hp -= Global.bulletATK;
                if (this.hp < 0) {
                    this.enemyGroup.enemyDestroy(this.node);
                }
                var label = this.node.getComponentInChildren(cc.Label);
                label.string = common.ParseHP(this.hp);
                common.switchEnemyColor(this);
                break;
            }
            case 'leftWall':
                {
                    // 撞到了左墙
                    // 如果是从外侧碰到了，那就忽略
                    if (selfCollider.body.getLinearVelocityFromWorldPoint(selfCollider.body.getWorldPosition()).x > 0) {
                        contact.disabled = true;
                    }
                    break;
                }
            case 'rightWall':
                {
                    // 撞到了右墙
                    // 如果是从外侧碰到了，那就忽略
                    if (selfCollider.body.getLinearVelocityFromWorldPoint(selfCollider.body.getWorldPosition()).x < 0) {
                        contact.disabled = true;
                    }
                    break;
                }
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