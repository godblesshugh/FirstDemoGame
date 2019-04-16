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
        switch (otherCollider.node.name) {
            case 'cannon': {
                // TODO: 增加攻击力和子弹数量
                this.enemyGroup.coinDestroy(selfCollider.node);
                return;
            }
            case 'coinground': {
                if (!this.timeout) {
                    // 将这个计时器句柄保留在当前对象中，为了下一次从对象池获取对象时，可以清空计时器
                    this.timeout = setTimeout(function () {
                        this.enemyGroup.coinDestroy(this.node);
                    }.bind(this), 5000);
                }
            }
        }
    },
    init: function (position, type, value, toRight, index) {
        // 清空该对象中可能存在的，之前保留的计时器具柄
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.pool = true;
        this.position = position;
        this.type = type;
        this.value = value;
        this.toRight = toRight;
        this.index = index;
        common.ResetCoin(this.node);

        var rigidbody = this.node.getComponent(cc.RigidBody);
        try {
            this.node.setPosition(position);
        } catch (error) {
            console.log(error);
            console.log(position);
        }
        rigidbody.fixedRotation = false;
        rigidbody.angularVelocity = 10;
        rigidbody.gravityScale = 2;
        rigidbody.linearDamping = 0.3;
        rigidbody.angularDamping = 0.8;
        toRight = toRight ? 1 : -1;
        var enterAction = cc.callFunc(function () {
            rigidbody.applyLinearImpulse(cc.v2(toRight * 200 + index * 100, 200 + index * 100), rigidbody.getWorldCenter(), true);
        }, this);
        this.node.runAction(enterAction);
    },

    start() {
    },

    update(dt) {
        // 刚体数量多了以后，会出现早期的刚体休眠的情况，这里做一个唤醒（通过设置刚体的速度来唤醒它）
        var rigidbody = this.node.getComponent(cc.RigidBody);
        if (!rigidbody.awake) {
            rigidbody.linearVelocity = cc.v2(5, 5);
        }
    },
});