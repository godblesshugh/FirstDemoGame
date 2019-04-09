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
        common.ResetEnemy(this.node);
        // init
        this.node.getComponent(cc.Sprite).SpriteFrame = this.sprArray[3];
        this.hp = 110;
        this.node.getComponentInChildren(cc.Label).string = 110;
        if (Math.random() > 0.5) {
            leftEnter(this);
        } else {
            rightEnter(this);
        }
    },

    start() {},

    update(dt) {
        if (this.enemyGroup.eState !== common.GameState.start) {
            return;
        }
        var rigidbody = this.node.getComponent(cc.RigidBody);
    },

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === 'bullet') {
            // 被子弹打中了
            this.hp -= otherCollider.node.getComponent('bullet').hp;
            if (this.hp < 0) {
                this.enemyGroup.enemyDestroy(this.node);
            }
            var label = this.node.getComponentInChildren(cc.Label);
            label.string = this.hp;
            this.hitCount++;
            if (this.hitCount % 5 === 0) {
                switchEnemy(this);
            }
        }
    },

    // 只在两个碰撞体结束接触时被调用一次
    onEndContact: function (contact, selfCollider, otherCollider) {
        switch (otherCollider.node.name) {
            case 'ground':
                {
                    if (selfCollider.body.linearVelocity.y < 500) {
                        selfCollider.body.applyLinearImpulse(cc.v2(0, 2000), selfCollider.body.getWorldCenter(), true);
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

var switchEnemy = (that) => {
    var sprite = that.node.getComponent(cc.Sprite);
    switch (sprite.spriteFrame.name) {
        case 'hexagon_green':
            sprite.spriteFrame = that.sprArray[3];
            return true;
        case 'hexagon_red':
            sprite.spriteFrame = that.sprArray[2];
            return true;
        case 'hexagon_orange':
            sprite.spriteFrame = that.sprArray[1];
            return true;
        case 'hexagon_blue':
            sprite.spriteFrame = that.sprArray[0];
            return true;
    }
    return false;
};

var leftEnter = (that) => {
    var rigidbody = that.node.getComponent(cc.RigidBody);
    var x = -(cc.view.getVisibleSize().width / 2 + that.node.width / 2) - 5;
    var y = (cc.view.getVisibleSize().height / 2 - that.node.height / 2) - 10;
    that.node.setPosition(cc.v2(x, y));
    var enterAction = cc.sequence(cc.moveBy(2, that.node.width + 50, 0), cc.callFunc(function () {
        rigidbody.fixedRotation = false;
        rigidbody.angularVelocity = 50;
        rigidbody.gravityScale = 1;
        rigidbody.angularDamping = 0.8;
    }, that));
    that.node.runAction(enterAction);
};

var rightEnter = (that) => {
    var rigidbody = that.node.getComponent(cc.RigidBody);
    var x = (cc.view.getVisibleSize().width / 2 + that.node.width / 2) + 5;
    var y = (cc.view.getVisibleSize().height / 2 - that.node.height / 2) - 10;
    that.node.setPosition(cc.v2(x, y));
    var enterAction = cc.sequence(cc.moveBy(2, -(that.node.width + 50), 0), cc.callFunc(function () {
        rigidbody.fixedRotation = false;
        rigidbody.angularVelocity = -20;
        rigidbody.gravityScale = 1;
        rigidbody.angularDamping = 0.8;
    }, that));
    that.node.runAction(enterAction);
};