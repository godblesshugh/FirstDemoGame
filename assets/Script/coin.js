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
        // TODO: 增加攻击力和子弹数量
        this.enemyGroup.coinDestroy(selfCollider.node);
    },
    init: function (position, type, value, toRight, index) {
        this.type = type;
        this.value = value;
        common.ResetCoin(this.node);

        var rigidbody = this.node.getComponent(cc.RigidBody);
        this.node.setPosition(position);
        rigidbody.fixedRotation = false;
        rigidbody.angularVelocity = 10;
        rigidbody.gravityScale = 1;
        rigidbody.linearDamping = 0.8;
        rigidbody.angularDamping = 0.8;
        toRight = toRight ? 1 : -1;
        rigidbody.applyLinearImpulse(cc.v2(toRight * 200, 100), rigidbody.getWorldCenter(), true);
    },

    start() {

    },

    update(dt) {
    },
});