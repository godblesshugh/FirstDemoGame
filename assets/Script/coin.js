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
                this.__destroy = true;
                return;
            }
            case 'coinground': {
                if (!this.timeout) {
                    // 将这个计时器句柄保留在当前对象中，为了下一次从对象池获取对象时，可以清空计时器
                    this.timeout = setTimeout(function () {
                        this.__destroy = true;
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
        this.toRight = toRight ? 1 : -1;
        this.index = index;
        this.__init = true;
        this.viewSize = {
            width: cc.view.getVisibleSize().width,
            height: cc.view.getVisibleSize().height
        };
        let rigidbody = this.node.getComponent(cc.RigidBody);
        common.ResetCoin(this.node);
        try {
            this.node.setPosition(this.position);
        } catch (error) {
            // 无关紧要的错误，直接忽略吧
            console.log('init coin error: ', this.position);
        }
        rigidbody.fixedRotation = false;
        rigidbody.angularVelocity = 10;
        rigidbody.gravityScale = 2;
        rigidbody.linearDamping = 0.3;
        rigidbody.angularDamping = 0.8;
        let enterAction = cc.callFunc(function () {
            rigidbody.applyLinearImpulse(cc.v2(this.toRight * 200 + this.index * 100, 200 + this.index * 100), rigidbody.getWorldCenter(), true);
        }, this);
        this.node.runAction(enterAction);
    },

    start() {
    },

    update(dt) {
        let rigidbody = this.node.getComponent(cc.RigidBody);
        if (this.__destroy) {
            this.__destroy = false;
            this.enemyGroup.coinDestroy(this.node);
            return;
        }
        if (this.__init) {
            this.__init = false;
        }

        // 刚体数量多了以后，会出现早期的刚体休眠的情况，这里做一个唤醒（通过设置刚体的速度来唤醒它）
        if (!rigidbody.awake) {
            rigidbody.linearVelocity = cc.v2(5, 5);
        }

        if (this.node.position.y < -this.viewSize.height) {
            this.__destroy = true;
        }
    },
});