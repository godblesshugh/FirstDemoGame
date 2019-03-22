cc.Class({
    extends: cc.Component,

    properties: {
        defaultY: 12
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

    onLoad () {
        var that = this;
        this.node.on('mousedown', function(event) {
            moveCannon(that, 100);
        });
    },

    start() {
        // moveCannon(this, 100);
    },

    // update (dt) {},
});

const moveCannon = (that, x) => {
    var cannon = cc.find('Canvas/CannonLayout/cannon');
    console.log(cannon);
    console.log(cannon.position);
    var action = cc.moveTo(0.5, cc.v2(100, 100));
    cannon.runAction(action);
};