cc.Class({
    extends: cc.Component,

    properties: {
        defaultY: 12,
        // cannon: {
        //     default: null,
        //     type: cc.Sprite,
        // }
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

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