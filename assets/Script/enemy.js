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
        xRange = cc.view.getVisibleSize().width / 2 - this.node.width * 0.3;
        xLimit = xRange * 2;
        yLimit = (cc.view.getVisibleSize().height / 2 - this.node.height * 0.3) * 2;
    },

    init: function (hp, level, linearImpulse, position) {
        if (isNaN(hp)) {
            hp = 1000;
        }
        if (this.node.group !== 'enemy') {
            this.node.group = 'enemy';
            return;
        }
        this.hp = hp;
        this.level = level;
        this.baseHP = this.hp; // 用来做分裂的时候，数据参考
        common.ResetEnemy(this.node);
        // init
        this.node.getComponentInChildren(cc.Label).string = common.ParseHP(this.hp);
        // TODO: 暂时用固定的重量，不知道为什么分裂的时候计算不出来重量
        // var rigidbody = this.node.getComponent(cc.RigidBody);
        // var mass = rigidbody.getMass();
        // this.weight = Math.ceil(mass / 10);
        this.weight = this.level + 1;
        common.SwitchEnemyColor(this);
        if (position) {
            // 传进来了坐标，意思是需要分裂了
            splitEnter(this, position, linearImpulse);
        } else {
            // 正常进入
            if (Math.random() > 0.5) {
                leftEnter(this);
            } else {
                rightEnter(this);
            }
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
        if (this.hp <= 0) {
            let position = this.node.position;
            let baseHP = this.baseHP;
            let level = this.level;
            let linearVelocity = this.node.getComponent(cc.RigidBody).linearVelocity;
            // position, baseHP, level
            this.enemyGroup.splitDown(position, baseHP, level);
            this.enemyGroup.produceCoins(level, position, linearVelocity);
            this.enemyGroup.produceBoom(level, position);
            this.enemyGroup.enemyDestroy(this.node);
        }
    },

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {
        switch (otherCollider.node.name) {
            case 'bullet': {
                this.hp -= Global.bulletATK;
                if (this.hp > 0) {
                    var label = this.node.getComponentInChildren(cc.Label);
                    label.string = common.ParseHP(this.hp);
                    common.SwitchEnemyColor(this);
                    common.GainScore(Global.bulletATK);
                } else {
                    common.GainScore(Global.bulletATK + this.hp);
                }
                break;
            }
            case 'leftWall': {
                // 撞到了左墙
                // 如果是从外侧碰到了，那就忽略
                if (selfCollider.body.getLinearVelocityFromWorldPoint(selfCollider.body.getWorldPosition()).x > 0) {
                    contact.disabled = true;
                }
                // 如果是一开始进入的时候碰撞了，也忽略
                if (selfCollider.body.getLinearVelocityFromWorldPoint(selfCollider.body.getWorldPosition()).x === 0 &&
                    selfCollider.body.getLinearVelocityFromWorldPoint(selfCollider.body.getWorldPosition()).y === 0) {
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
                    // 如果是一开始进入的时候碰撞了，也忽略
                    if (selfCollider.body.getLinearVelocityFromWorldPoint(selfCollider.body.getWorldPosition()).x === 0 &&
                        selfCollider.body.getLinearVelocityFromWorldPoint(selfCollider.body.getWorldPosition()).y === 0) {
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
                    if (selfCollider.body.linearVelocity.y < 600) {
                        selfCollider.body.applyLinearImpulse(cc.v2(0, 2000 * this.weight), selfCollider.body.getWorldCenter(), true);
                    }
                    // 每次默认都向中线推一下
                    if (selfCollider.node.position.x < 0) {
                        selfCollider.body.applyLinearImpulse(cc.v2(500 * this.weight, 0), selfCollider.body.getWorldCenter(), true);
                    } else {
                        selfCollider.body.applyLinearImpulse(cc.v2(-500 * this.weight, 0), selfCollider.body.getWorldCenter(), true);
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
    }
});

var leftEnter = (that) => {
    var rigidbody = that.node.getComponent(cc.RigidBody);
    var x = -(cc.view.getVisibleSize().width + that.node.width) / 2 - 5;
    var y = (cc.view.getVisibleSize().height - that.node.width) / 2 - 10;
    that.node.setPosition(cc.v2(x, y));
    var enterAction = cc.sequence(cc.moveTo(2, cc.v2(-(cc.view.getVisibleSize().width - that.node.width) / 2 + 5, y)), cc.callFunc(function () {
        rigidbody.fixedRotation = false;
        rigidbody.angularVelocity = 100;
        rigidbody.gravityScale = 1;
        rigidbody.angularDamping = 0.8;
        rigidbody.applyLinearImpulse(cc.v2(1000 * this.weight, 0), rigidbody.getWorldCenter(), true);
    }, that));
    that.node.runAction(enterAction);
};

var rightEnter = (that) => {
    var rigidbody = that.node.getComponent(cc.RigidBody);
    var x = (cc.view.getVisibleSize().width + that.node.width) / 2 + 5;
    var y = (cc.view.getVisibleSize().height - that.node.width) / 2 - 10;
    that.node.setPosition(cc.v2(x, y));
    var enterAction = cc.sequence(cc.moveTo(2, cc.v2((cc.view.getVisibleSize().width - that.node.width) / 2 - 5, y)), cc.callFunc(function () {
        rigidbody.fixedRotation = false;
        rigidbody.angularVelocity = -100;
        rigidbody.gravityScale = 1;
        rigidbody.angularDamping = 0.8;
        rigidbody.applyLinearImpulse(cc.v2(-1000 * this.weight, 0), rigidbody.getWorldCenter(), true);
    }, that));
    that.node.runAction(enterAction);
};

var splitEnter = (that, position, linearImpulse) => {
    var rigidbody = that.node.getComponent(cc.RigidBody);
    that.node.setPosition(position);
    rigidbody.fixedRotation = false;
    rigidbody.angularVelocity = 20;
    rigidbody.gravityScale = 1;
    rigidbody.angularDamping = 0.8;
    // 判断一下当前位置和受力方向，如果快要超出边界，则需要向中间施加冲量
    if (linearImpulse.x < 0) {
        if (position.x < -(cc.view.getVisibleSize().width + that.node.width) / 2 - 5) {
            linearImpulse.x = -linearImpulse.x;
        }
    } else {
        if (position.x > (cc.view.getVisibleSize().width + that.node.width) / 2 + 5) {
            linearImpulse.x = -linearImpulse.x;
        }
    }
    var enterAction = cc.callFunc(function () {
        rigidbody.applyLinearImpulse(cc.v2(linearImpulse.x * this.weight, linearImpulse.y * this.weight), rigidbody.getWorldCenter(), true);
    }, that);
    that.node.runAction(enterAction);
};