'use strict';

cc.Class({
    extends: cc.Component,

    properties: {},

    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            moveCannon(event);
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            moveCannon(event);
        }, this);
    },

    // update (dt) {},

    onLoad() {
        cannonMoveBase = cc.find('Canvas/background').width / 2;
    },
});

var cannonMoveBase = 375;
var MOVE_CANNON_TAG = 1;
var moveAction;

const moveCannon = (that) => {
    var cannon = cc.find('Canvas/background/cannon');
    var y = cannon.position.y;
    cannon.position = cc.v2(that.getLocation().x - cannonMoveBase, y);
    // FIXME: 还有一种方案，自己写 update 函数：https://blog.csdn.net/qq_42661974/article/details/86222179
};