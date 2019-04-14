'use strict';

cc.Class({
    extends: cc.Component,

    properties: {},

    startAction() {
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            moveCannon(event);
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            moveCannon(event);
        }, this);
    },

    // update (dt) {},

    onLoad() {
        cannonMoveBase = cc.view.getVisibleSize().width / 2;
        cannonWidthBase = this.node.width / 2;
    },
});

var cannonMoveBase = 375;
var cannonWidthBase = 0;

const moveCannon = (that) => {
    var cannon = that.target;
    var x = that.getLocation().x - cannonMoveBase;
    if (x < -(cannonMoveBase - cannonWidthBase)) {
        x = -(cannonMoveBase - cannonWidthBase); // 不能超过左边框
    }
    if (x > cannonMoveBase - cannonWidthBase) {
        x = cannonMoveBase - cannonWidthBase; // 不能超过右边框
    }
    cannon.setPosition(cc.v2(x, cannon.position.y));
    // FIXME: 还有一种方案，自己写 update 函数：https://blog.csdn.net/qq_42661974/article/details/86222179
};