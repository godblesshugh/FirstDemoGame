'use strict';

var common = require('./common');

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad() {
        this.bulletGroup = this.node.parent.getComponent('bulletGroup');
    },

    init(position, linearVelocity) {
        var rigidbody = this.node.getComponent(cc.RigidBody);
        rigidbody.linearVelocity = linearVelocity;
        this.linearVelocity = linearVelocity;
        this.position = position;
        this.__frameCount = 0;
        this.__gapX = (this.position.x - this.node.position.x) / 2;
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        this.bulletGroup.bulletDestroy(selfCollider.node);
    },

    start() {

    },

    update(dt) {
        if (this.__frameCount <  2) {
            this.__frameCount ++;
            this.node.setPosition(cc.v2(this.node.position.x + this.__gapX, this.node.position.y));
        }
    },
});