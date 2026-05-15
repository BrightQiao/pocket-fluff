function startSignGame() {
    const game = document.createElement('div');
    game.className = 'sign-game';
    game.id = 'signGame';
    game.innerHTML = `
        <div style="font-size:24px;color:#5d4e37;margin-bottom:30px;">选择一个门牌挂起来吧</div>
        <div class="sign-options">
            <button class="sign-option" onclick="selectSign('请轻轻敲门')">请轻轻敲门</button>
            <button class="sign-option" onclick="selectSign('今天不在家')">今天不在家</button>
            <button class="sign-option" onclick="selectSign('只收抱抱')">只收抱抱</button>
        </div>
        <button class="exit-btn" style="top:20px;right:20px;" onclick="exitSignGame()">退出</button>
    `;
    document.body.appendChild(game);
}

function selectSign(text) {
    document.getElementById('signGame').remove();
    document.getElementById('doorSign').textContent = text;
    document.getElementById('doorSign').classList.add('show');
    
    const fluff = document.getElementById('fluff');
    fluff.classList.add('pos-3');
    
    showRestScreen(text);
}

function showRestScreen(text) {
    let timeLeft = 60;
    const restScreen = document.createElement('div');
    restScreen.className = 'sign-game';
    restScreen.innerHTML = `
        <button class="exit-btn" style="top:20px;right:20px;padding:8px 16px;font-size:14px;" onclick="exitRestScreen()">退出休息</button>
        <div class="hourglass">⏳</div>
        <div class="timer-display" id="restTimer">01:00</div>
        <div class="rest-text">休息中，先休息1分钟，此时没有人需要你回应。</div>
    `;
    document.body.appendChild(restScreen);
    
    const timer = setInterval(() => {
        timeLeft--;
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        document.getElementById('restTimer').textContent = 
            String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
        if (timeLeft <= 0) {
            clearInterval(timer);
            restScreen.innerHTML = `
                <div style="font-size:60px;">🐹</div>
                <div style="font-size:18px;color:#5d4e37;margin-top:20px;">休息好啦！又是新的开始～</div>
                <button class="sign-option" style="margin-top:30px;" onclick="document.getElementById('signGame').remove()">好啦</button>
            `;
            document.getElementById('doorSign').style.opacity = '0.5';
        }
    }, 1000);
}

function exitSignGame() {
    const game = document.getElementById('signGame');
    if (game) game.remove();
}

function exitRestScreen() {
    clearInterval(restTimer);
    const restScreen = document.querySelector('.sign-game');
    if (restScreen) restScreen.remove();
}
