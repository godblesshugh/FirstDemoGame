'use strict';

var userInfo = {
    bulletCount: 1, // TODO: 之后需要根据这个参数，来决定一排有几发子弹，以及一发子弹代表多少颗（一发子弹可以表示多颗）
    bulletHP: 1, // 根据这个参数，来决定每一颗子弹造成多少伤害
};

window.Global = {
    userInfo: userInfo,
    existEnemy: 0,
};