'use strict';

var common = require('./common');

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad() {
        this.enemyGroup = this.node.parent.getComponent('enemyGroup');
    },

    onEndContact: function (contact, selfCollider, otherCollider) {
        switch (otherCollider.node.name) {
            case 'cannon': {
                // TODO: 增加攻击力和子弹数量
                this.enemyGroup.coinDestroy(selfCollider.node);
                return;
            }
        }
    },
    init: function (position, type, value, toRight, index) {
        this.type = type;
        this.value = value;
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
        setTimeout(function () {
            this.enemyGroup.coinDestroy(this.node);
        }.bind(this), 10000);
    },

    start() {

    },

    update(dt) {
    },
});