let starGameState = {
    starsCaught: 0,
    friends: [],
    active: false,
    fluffX: 50,
    catchTexts: ['+1 安慰', '+1 勇气', '+1 陪伴', '+1 温暖'],
    friendBubbles: ['我在呀', '陪着你呢', '不孤单', '绒毛也在'],
    catchIndex: 0,
    friendBubbleIndex: 0,
    spawnInterval: null
};

function startStarGame() {
    starGameState = {
        starsCaught: 0,
        friends: [],
        active: true,
        fluffX: 50,
        catchTexts: ['+1 安慰', '+1 勇气', '+1 陪伴', '+1 温暖'],
        friendBubbles: ['我在呀', '陪着你呢', '不孤单', '绒毛也在'],
        catchIndex: 0,
        friendBubbleIndex: 0,
        spawnInterval: null
    };

    const game = document.createElement('div');
    game.className = 'star-game';
    game.id = 'starGame';
    game.innerHTML = `
        <button class="exit-btn" onclick="exitStarGame()" style="top:10px; right:10px; padding:8px 16px; font-size:14px;">退出</button>
        <div id="startPopup" style="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:rgba(255,255,255,0.95); padding:30px 25px; border-radius:20px; text-align:center; max-width:300px; z-index:250; cursor:pointer;">
            <div style="font-size:16px; color:#5d4e37; line-height:1.8;">夜空里面藏着星星<br>抓住它们吧 ✨</div>
            <div style="margin-top:15px; font-size:14px; color:#888;">点击开始</div>
        </div>
        <div id="progressBarContainer" style="position:fixed; top:50px; left:50%; transform:translateX(-50%); width:200px; z-index:180;">
            <div style="text-align:center; font-size:14px; color:#fff; text-shadow:0 1px 3px rgba(0,0,0,0.5); margin-bottom:5px;">陪伴值 <span id="progressText">0%</span></div>
            <div style="background:rgba(255,255,255,0.3); border-radius:10px; height:12px; overflow:hidden;">
                <div id="progressBar" style="width:0%; height:100%; background:linear-gradient(90deg, #FFD700, #FFA500); border-radius:10px; transition:width 0.3s ease;"></div>
            </div>
        </div>
        <div class="game-text" id="starGameText" style="top:110px;">星星里藏着朋友，接住它们吧 ✨</div>
        <div class="moon" id="gameMoon">🌙</div>
        <div class="golden-star" id="goldenStar">⭐</div>
        <div id="friendsArea"></div>
        <div class="game-fluff-container" id="gameFluffContainer">
            <div id="fluffSmile" style="position:absolute; top:-40px; left:50%; transform:translateX(-50%); font-size:32px; opacity:0; transition: opacity 0.3s;">😊</div>
            <img class="game-fluff" id="gameFluff" src="透明绒.png" style="width:100px;height:100px;bottom:0;">
        </div>
        <div id="endingMessage" style="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:none; padding:0; border:none; border-radius:0; text-align:center; max-width:none; z-index:200; display:none;">
            <button class="exit-btn" onclick="exitStarGame()" style="background:none; border:none; position:relative;"><img src="睡觉.png" style="width:400px; height:auto; cursor:pointer; margin-left: 50px;"></button>
        </div>
    `;
    document.body.appendChild(game);

    document.getElementById('startPopup').addEventListener('click', function() {
        this.remove();
        setupStarControls();
        startSpawning();
    });

    const friendIcons = ['🐿️', '🐱', '🐰', '🦊', '🐻'];
    const friendsArea = document.getElementById('friendsArea');
    friendIcons.forEach((icon, i) => {
        const friend = document.createElement('div');
        friend.className = 'friend-icon';
        friend.id = 'friend' + i;
        friend.textContent = icon;
        friend.style.top = (100 + i * 35) + 'px';
        friend.style.left = (30 + (i % 2) * 40) + '%';
        friendsArea.appendChild(friend);
        starGameState.friends.push(friend);
    });
}

function startSpawning() {
    spawnStar();
    starGameState.spawnInterval = setInterval(() => {
        if (starGameState.active && starGameState.starsCaught < 5) {
            spawnStar();
            if (Math.random() < 0.25) spawnStone();
        } else {
            clearInterval(starGameState.spawnInterval);
        }
    }, 1800);
}

function spawnStar() {
    if (!starGameState.active || starGameState.starsCaught >= 5) return;

    const star = document.createElement('div');
    star.className = 'star';
    star.textContent = '⭐';
    star.style.left = (Math.random() * 60 + 20) + '%';
    star.style.animationDuration = '3s';
    document.getElementById('starGame').appendChild(star);

    let caught = false;
    let removed = false;

    const checkCatch = setInterval(() => {
        if (!starGameState.active) {
            clearInterval(checkCatch);
            return;
        }

        const rect = star.getBoundingClientRect();
        const fluffLeft = starGameState.fluffX;
        const starLeft = (rect.left / window.innerWidth) * 100;

        if (rect.bottom > window.innerHeight - 160 && rect.bottom < window.innerHeight - 80) {
            if (Math.abs(starLeft - fluffLeft) < 15 && !caught) {
                caught = true;
                removed = true;
                clearInterval(checkCatch);
                catchStar(star);
                return;
            }
        }

        if (rect.bottom > window.innerHeight - 50 && !caught && !removed) {
            caught = true;
            removed = true;
            clearInterval(checkCatch);
            missStar(star);
        }
    }, 50);

    star.addEventListener('animationend', () => {
        if (!removed) {
            removed = true;
            clearInterval(checkCatch);
            missStar(star);
        }
    });
}

function spawnStone() {
    if (!starGameState.active || starGameState.starsCaught >= 5) return;

    const stone = document.createElement('div');
    stone.className = 'star';
    stone.textContent = '🪨';
    stone.style.left = (Math.random() * 60 + 20) + '%';
    stone.style.animationDuration = '3.5s';
    document.getElementById('starGame').appendChild(stone);
    stone.style.fontSize = '28px';

    let caught = false;
    let removed = false;

    const checkCatch = setInterval(() => {
        if (!starGameState.active) {
            clearInterval(checkCatch);
            return;
        }
        const rect = stone.getBoundingClientRect();
        const fluffLeft = starGameState.fluffX;
        const stoneLeft = (rect.left / window.innerWidth) * 100;

        if (rect.bottom > window.innerHeight - 160 && rect.bottom < window.innerHeight - 80) {
            if (Math.abs(stoneLeft - fluffLeft) < 15 && !caught) {
                caught = true;
                removed = true;
                clearInterval(checkCatch);
                catchStone(stone);
                return;
            }
        }

        if (rect.bottom > window.innerHeight - 50 && !caught && !removed) {
            caught = true;
            removed = true;
            clearInterval(checkCatch);
            stone.remove();
        }
    }, 50);

    stone.addEventListener('animationend', () => {
        if (!removed) {
            removed = true;
            clearInterval(checkCatch);
            stone.remove();
        }
    });
}

function catchStone(stone) {
    stone.remove();
    showStoneText();
}

function showStoneText() {
    const stoneText = document.createElement('div');
    stoneText.style.cssText = `
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 22px;
        font-family: 宋体, serif;
        font-weight: bold;
        color: rgba(255,255,255,0.7);
        text-shadow: 0 2px 8px rgba(0,0,0,0.5);
        pointer-events: none;
        z-index: 160;
        animation: stoneFloatUp 1.2s ease-out forwards;
    `;
    stoneText.textContent = '这难道是伪装成星星的石头？';

    const style = document.createElement('style');
    style.id = 'stoneTextStyle';
    style.textContent = `
        @keyframes stoneFloatUp {
            0% { opacity: 0.7; transform: translate(-50%, -50%); }
            100% { opacity: 0; transform: translate(-50%, -120%); }
        }
    `;
    if (!document.getElementById('stoneTextStyle')) {
        document.head.appendChild(style);
    }

    document.body.appendChild(stoneText);
    setTimeout(() => stoneText.remove(), 1200);
}

function catchStar(star) {
    star.remove();
    starGameState.starsCaught++;

    const fluff = document.getElementById('gameFluff');
    fluff.classList.add('shake');
    setTimeout(() => fluff.classList.remove('shake'), 300);

    const text = starGameState.catchTexts[starGameState.catchIndex % starGameState.catchTexts.length];
    starGameState.catchIndex++;
    showCatchText(star, text);

    if (typeof recordBraveMoment === 'function') {
        recordBraveMoment('star', '接住了第' + starGameState.starsCaught + '颗星星');
    }

    if (starGameState.starsCaught <= 5) {
        const friend = starGameState.friends[starGameState.starsCaught - 1];
        if (friend) {
            friend.classList.add('colored');
            showFriendBubble(friend);
        }
    }

    const progressTexts = ['✨ 收到了一点光', '✨ 朋友在靠近', '✨ 温暖一点点', '✨ 再一颗', '✨ 够了够了'];
    document.getElementById('starGameText').textContent = progressTexts[Math.min(starGameState.starsCaught - 1, 4)];

    const progress = starGameState.starsCaught * 20;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('progressText').textContent = progress + '%';

    if (starGameState.starsCaught >= 5) {
        document.getElementById('progressBar').style.animation = 'progressGlow 0.5s ease-in-out 3';
        setTimeout(() => {
            document.getElementById('progressBar').style.animation = '';
        }, 1500);
        setTimeout(() => showEnding(), 600);
    }
}

function showCatchText(star, text) {
    const catchText = document.createElement('div');
    catchText.style.cssText = `
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 22px;
        font-family: 宋体, serif;
        font-weight: bold;
        color: rgba(255,255,255,0.7);
        text-shadow: 0 2px 8px rgba(0,0,0,0.5);
        pointer-events: none;
        z-index: 160;
        animation: floatUp 1.2s ease-out forwards;
    `;
    catchText.textContent = text;
    catchText.id = 'catchText';

    const style = document.createElement('style');
    style.id = 'catchTextStyle';
    style.textContent = `
        @keyframes floatUp {
            0% { opacity: 0.7; transform: translate(-50%, -50%); }
            100% { opacity: 0; transform: translate(-50%, -120%); }
        }
        @keyframes progressGlow {
            0%, 100% { box-shadow: 0 0 5px rgba(255,215,0,0.5); }
            50% { box-shadow: 0 0 20px rgba(255,215,0,1), 0 0 30px rgba(255,165,0,0.8); }
        }
    `;
    if (!document.getElementById('catchTextStyle')) {
        document.head.appendChild(style);
    }

    document.body.appendChild(catchText);
    setTimeout(() => {
        catchText.remove();
    }, 1200);
}

function showFriendBubble(friend) {
    const bubble = document.createElement('div');
    bubble.style.cssText = `
        position: absolute;
        top: -50px;
        left: 50%;
        transform: translateX(-50%);
        background: #fff;
        padding: 8px 14px;
        border-radius: 14px;
        font-size: 16px;
        font-family: 宋体, serif;
        font-weight: bold;
        color: #5d4e37;
        white-space: nowrap;
        box-shadow: 0 2px 10px rgba(0,0,0,0.15);
        animation: bubblePop 1.5s ease-out forwards;
        z-index: 20;
    `;

    const bubbleText = starGameState.friendBubbles[starGameState.friendBubbleIndex % starGameState.friendBubbles.length];
    starGameState.friendBubbleIndex++;
    bubble.textContent = bubbleText;

    friend.appendChild(bubble);
    setTimeout(() => bubble.remove(), 1500);
}

function showEnding() {
    starGameState.active = false;
    clearInterval(starGameState.spawnInterval);

    document.getElementById('gameMoon').classList.add('show');

    const fluffSmile = document.getElementById('fluffSmile');
    if (fluffSmile) {
        fluffSmile.style.opacity = '1';
        setTimeout(() => {
            fluffSmile.style.opacity = '0';
        }, 1500);
    }

    const endingMessage = document.getElementById('endingMessage');
    endingMessage.style.display = 'block';
    endingMessage.style.animation = 'popIn 0.4s ease-out';

    const fluff = document.getElementById('gameFluff');
    if (fluff) {
        fluff.classList.add('shake');
        setTimeout(() => fluff.classList.remove('shake'), 300);
    }
}

function missStar(star) {
    const rect = star.getBoundingClientRect();
    showMissText(rect.left, rect.top);
    star.remove();
}

function showMissText(x, y) {
    const missText = document.createElement('div');
    missText.style.cssText = `
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 22px;
        font-family: 宋体, serif;
        font-weight: bold;
        color: rgba(255,255,255,0.7);
        text-shadow: 0 2px 8px rgba(0,0,0,0.5);
        pointer-events: none;
        z-index: 160;
        animation: floatUp 1.2s ease-out forwards;
    `;
    missText.textContent = '没关系，下一颗 ✨';
    document.body.appendChild(missText);
    setTimeout(() => missText.remove(), 1200);
}

function setupStarControls() {
    const container = document.getElementById('gameFluffContainer');
    const fluff = document.getElementById('gameFluff');

    let touchStartX = 0;
    let lastTouchX = 0;

    container.addEventListener('touchstart', (e) => {
        e.preventDefault();
        touchStartX = e.touches[0].clientX;
        lastTouchX = e.touches[0].clientX;
    }, { passive: false });

    container.addEventListener('touchmove', (e) => {
        if (!starGameState.active) return;
        e.preventDefault();
        const deltaX = e.touches[0].clientX - lastTouchX;
        lastTouchX = e.touches[0].clientX;
        starGameState.fluffX = Math.max(10, Math.min(90, starGameState.fluffX + deltaX / 5));
        fluff.style.left = starGameState.fluffX + '%';
    }, { passive: false });

    container.addEventListener('mousedown', (e) => {
        touchStartX = e.clientX;
        lastTouchX = e.clientX;

        const moveHandler = (e) => {
            if (!starGameState.active) return;
            const deltaX = e.clientX - lastTouchX;
            lastTouchX = e.clientX;
            starGameState.fluffX = Math.max(10, Math.min(90, starGameState.fluffX + deltaX / 5));
            fluff.style.left = starGameState.fluffX + '%';
        };

        const upHandler = () => {
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('mouseup', upHandler);
        };

        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', upHandler);
    });
}

function exitStarGame() {
    starGameState.active = false;
    clearInterval(starGameState.spawnInterval);
    const game = document.getElementById('starGame');
    if (game) game.remove();
}

function resetStarGame() {
    exitStarGame();
    startStarGame();
}
