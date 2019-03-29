'use strict';

const common = require('./common');

const bPosition = cc.Class({
    name: 'bPosition',
    properties: {
        xAxis: {
            default: '',
            tooltip: 'default x, target to hero',
        },
        yAxis: {
            default: '',
            tooltip: 'default y, target to hero',
        },
    }
});

const bulletInfinite = cc.Class({
    name: 'bulletInfinite',
    properties: {
        name: '',
        freqTime: 0,
        initPoolCount: 0,
        prefab: cc.Prefab,
        position: {
            default: [],
            type: bPosition,
            tooltip: '多少排子弹',
        }
    }
});

cc.Class({
    extends: cc.Component,

    properties: {
        bulletInfinite: {
            default: null,
            type: bulletInfinite,
            tooltip: '无限时长子弹组'
        },
        cannon: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.gameState = common.gameState.none;
    },

    start() {

    },

    // update (dt) {},
});