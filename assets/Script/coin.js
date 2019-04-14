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
        }
    },
    init: function (position, type, value, toRight, index) {
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
        // FIXME: 这里很有可能出问题，因为这个 setTimeout 应该会持有这个节点，导致它始终无法释放
        setTimeout(function () {
            this.enemyGroup.coinDestroy(this.node);
        }.bind(this), 10000);
    },

    start() {
    },

    update(dt) {
    },
});