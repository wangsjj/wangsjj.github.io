function getRandomByStr(l = 3, s) {
    if (typeof s !== 'string') { return }
    var len = +l;    var chars = '';

    while (len--) {
        chars += s[parseInt(Math.random() * s.length, 10)];
    }
    return chars;
}

function getPlate(total = 1) {
    var en = 'QWERTYUIOPASDFGHJKLZXCVBNM';
    var num = '1234567890';
    var len = +total;
    while (len--) {
        console.log(`车牌号 ${total - len}：`, getRandomByStr(2, en) + getRandomByStr(3, num));
    }
}

getPlate();
