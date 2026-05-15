let gameData = {
    nickname: '',
    playCount: 0,
    unlockedPages: [0],
    letters: [],
    lastStickerDate: '',
    hasGoldenStar: false,
    firstDate: '',
    avatar: ''
};

const stickers = [
    '绒毛今天帮你挡了一条消息',
    '绒毛在充电口睡了一觉',
    '绒毛把你的焦虑滚成小球踢走了',
    '绒毛对着窗外的月亮发了会儿呆',
    '绒毛用尾巴扫了扫你的手机屏幕',
    '绒毛偷喝了一口你的饮料',
    '绒毛在键盘上踩了一串小脚印',
    '绒毛帮你暖了暖手机',
    '绒毛数了数你屏幕上的光斑',
    '绒毛把你的烦恼都藏进了树洞',
    '绒毛在你耳机旁听了听音乐',
    '绒毛帮你接了半杯星星',
    '绒毛在闹钟响之前醒了',
    '绒毛给你留了一颗小瓜子',
    '绒毛把你的坏心情织成了小围巾',
    '绒毛在窗台上晒了晒毛',
    '绒毛帮你吹走了一片乌云',
    '绒毛把你的微笑存进了储蓄罐',
    '绒毛在书里夹了一片四叶草',
    '绒毛对着镜子做了个鬼脸'
];

const presetReplies = [
    '绒毛收到啦～虽然绒毛不太懂，但绒毛觉得你已经很棒了！今天也要好好吃饭哦，绒毛在树屋等你。',
    '抱抱你呀。这些事确实很难对吧？不过没关系，绒毛会一直陪着你的。想不想看看今天的星星？',
    '绒毛认真听完了哦。你能说出来就已经很勇敢了！来，让绒毛蹭蹭你。',
    '哇，谢谢你愿意告诉绒毛这些！绒毛给你留了一颗小糖果在树屋里，记得来找哦。',
    '嗯嗯，绒毛都明白的。累了就休息一下吧，绒毛哪里也不去。'
];

const albumMilestones = [0, 3, 7, 14, 21, 30, 40, 50];

function saveData() {
    localStorage.setItem('pocketFluff', JSON.stringify(gameData));
}

function loadData() {
    const saved = localStorage.getItem('pocketFluff');
    if (saved) {
        gameData = JSON.parse(saved);
    }
    return gameData;
}

function addPlayCount() {
    gameData.playCount++;
    checkAlbumUnlock();
    saveData();
}

function checkAlbumUnlock() {
    for (let i = 0; i < albumMilestones.length; i++) {
        if (gameData.playCount >= albumMilestones[i] && !gameData.unlockedPages.includes(i)) {
            gameData.unlockedPages.push(i);
        }
    }
}
