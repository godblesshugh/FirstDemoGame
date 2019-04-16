'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad() {
        this.enemyGroup = this.node.parent.getComponent('enemyGroup');
    },
    init: function (level, position) {
        switch (level) {
            case 0: this.node.width = 320;
                this.node.height = 320;
                break;
            case 1: this.node.width = 500;
                this.node.height = 500;
                break;
            case 2: this.node.width = 700;
                this.node.height = 700;
                break;
            default: this.node.width = 320;
                this.node.height = 320;
                break;
        }
        this.node.setPosition(position);
        var animation = this.node.getComponent(cc.Animation);
        animation.on('finished', function () {
            this.enemyGroup.boomDestroy(this.node);
        }, this);
        animation.play();
    },

    start() {
    },

    update(dt) {
    },
});