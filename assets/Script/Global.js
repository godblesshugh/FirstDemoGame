'use strict';

window.Global = {
    bulletCount: 5, // TODO: 之后需要根据这个参数，来决定一排有几发子弹，以及一发子弹代表多少颗（一发子弹可以表示多颗）
    bulletPosition: [
        {
            x: 0,
            y: 0,
        }
    ],
    existEnemy: 0,
    bulletATK: 201, // 根据这个参数，来决定每一颗子弹造成多少伤害
};