let currentAlbumPage = 0;

const albumData = [
    { img: '🐹', text: '这是绒毛，它刚搬进树屋', unlock: 0 },
    { img: '🐹✨', text: '睡不着的话，来和绒毛一起数星星吧', unlock: 3 },
    { img: '🐹💭', text: '绒毛正在思索未来，但它觉得，一切都会变好的', unlock: 7 },
    { img: '🐹📝', text: '绒毛找到了新的纸条，上面写着什么？', unlock: 14 },
    { img: '🐹🚪', text: '绒毛累了，绒毛允许自己睡觉', unlock: 21 },
    { img: '🐹🐿️', text: '书屋有朋友来拜访了！', unlock: 30 },
    { img: '🐹🐿️🐱☕', text: '越来越多的朋友过来了', unlock: 40 },
    { img: '🐹🌟', text: '绒毛学会了享受阳光', unlock: 50 }
];

let selectedMailFriend = '绒毛';

function init() {
    loadData();
    if (gameData.nickname) {
        showPage('home');
        document.getElementById('navBar').classList.add('visible');
        checkSticker();
    }
    
    setTimeout(demoFluffMovement, 2000);
    
    const fluff = document.getElementById('fluff');
    if (fluff) {
        fluff.addEventListener('click', function() {
            fluff.classList.remove('jump', 'shake');
            void fluff.offsetWidth;
            fluff.classList.add('jump');
            setTimeout(() => fluff.classList.remove('jump'), 400);
        });
    }
}

function moveFluffTo(left, top) {
    const fluff = document.getElementById('fluff');
    if (fluff) {
        fluff.style.left = left;
        fluff.style.top = top;
    }
}

function demoFluffMovement() {
    const positions = [
        { left: '28%', top: '98%' },
        { left: '56%', top: '89%' },
        { left: '75%', top: '93%' },
        { left: '51%', top: '100%' }
    ];
    let i = 0;
    setInterval(() => {
        moveFluffTo(positions[i].left, positions[i].top);
        i = (i + 1) % positions.length;
    }, 3000);
}

function enterHome() {
    const nickname = document.getElementById('nicknameInput').value.trim();
    if (!nickname) {
        alert('告诉绒毛你的名字吧～');
        return;
    }
    gameData.nickname = nickname;
    if (!gameData.firstDate) {
        gameData.firstDate = new Date().toISOString();
    }
    saveData();
    showPage('home');
    document.getElementById('navBar').classList.add('visible');
    checkSticker();
}

function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');
    document.querySelectorAll('.nav-item').forEach((n, i) => {
        n.classList.toggle('active', (page === 'home' && i === 0) || (page === 'album' && i === 1) || (page === 'mailbox' && i === 2) || (page === 'me' && i === 3));
    });
    if (page === 'album') updateAlbum();
    if (page === 'mailbox') updateMailbox();
    if (page === 'me') updateMePage();
}

function closeAllGames() {
    const starGame = document.getElementById('starGame');
    if (starGame) starGame.remove();
    if (typeof starGameState !== 'undefined') {
        starGameState.active = false;
        if (starGameState.spawnInterval) clearInterval(starGameState.spawnInterval);
    }
    
    const paperGame = document.getElementById('paperGame');
    if (paperGame) paperGame.remove();
    
    const bubbleGame = document.getElementById('bubbleGame');
    if (bubbleGame) bubbleGame.remove();
    
    const signGame = document.getElementById('signGame');
    if (signGame) signGame.remove();
    
    const signGameRest = document.querySelector('.sign-game');
    if (signGameRest) signGameRest.remove();
    
    const emoExit = document.getElementById('emoExit');
    if (emoExit) emoExit.remove();
    
    const house = document.getElementById('house');
    const light = document.getElementById('lightOverlay');
    if (house) house.classList.remove('house-dark');
    if (light) light.classList.remove('active');
}

function switchPage(page) {
    closeAllGames();
    showPage(page);
}

function updateMePage() {
    if (!gameData.nickname) {
        document.getElementById('nicknameDisplay').textContent = '昵称';
        return;
    }
    
    document.getElementById('nicknameDisplay').textContent = gameData.nickname;
    
    if (gameData.avatar) {
        const avatarImg = document.getElementById('avatarImg');
        avatarImg.src = gameData.avatar;
        avatarImg.style.display = 'block';
        document.getElementById('avatarIcon').style.display = 'none';
    }
    
    const firstDate = gameData.firstDate || new Date().toISOString();
    const today = new Date();
    const first = new Date(firstDate);
    const diffTime = Math.abs(today - first);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    document.getElementById('daysCount').textContent = diffDays;
    
    document.getElementById('interactCount').textContent = gameData.playCount || 0;
    document.getElementById('albumCount').textContent = (gameData.unlockedPages || [0]).length;
    
    let text = '你认识了绒毛，这是你的新朋友';
    if (gameData.playCount >= 30) {
        text = '谢谢你让绒毛的生活变得更幸福';
    } else if (gameData.playCount > 10) {
        text = '绒毛很开心有你陪伴';
    }
    document.getElementById('relationshipText').textContent = text;
}

function checkSticker() {
    const today = new Date().toDateString();
    if (gameData.lastStickerDate !== today && gameData.playCount > 0) {
        const stickerText = stickers[Math.floor(Math.random() * stickers.length)];
        document.getElementById('sticker').textContent = stickerText;
        document.getElementById('sticker').classList.remove('hidden');
        gameData.lastStickerDate = today;
        saveData();
    }
}

function hideSticker() {
    document.getElementById('sticker').classList.add('hidden');
}

function changeAvatar() {
    document.getElementById('avatarInput').click();
}

function uploadAvatar(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const avatarImg = document.getElementById('avatarImg');
            avatarImg.src = e.target.result;
            avatarImg.style.display = 'block';
            document.getElementById('avatarIcon').style.display = 'none';
            gameData.avatar = e.target.result;
            saveData();
        };
        reader.readAsDataURL(file);
    }
}

function changeNickname() {
    const newNickname = prompt('请输入新昵称：', gameData.nickname || '');
    if (newNickname && newNickname.trim()) {
        gameData.nickname = newNickname.trim();
        saveData();
        updateMePage();
    }
}

function startEmo() {
    const house = document.getElementById('house');
    const light = document.getElementById('lightOverlay');
    const fluff = document.getElementById('fluff');
    
    house.classList.add('house-dark');
    light.classList.add('active');
    fluff.classList.add('curled', 'pos-1');
    
    const text = document.createElement('div');
    text.className = 'emo-text';
    text.id = 'emoText';
    text.innerHTML = '没关系的<br>难过也可以<br>绒毛陪着你';
    document.getElementById('page-home').appendChild(text);
    
    const exitBtn = document.createElement('button');
    exitBtn.className = 'exit-btn';
    exitBtn.id = 'emoExit';
    exitBtn.textContent = '退出';
    exitBtn.onclick = exitEmo;
    document.getElementById('page-home').appendChild(exitBtn);
}

function exitEmo() {
    const house = document.getElementById('house');
    const light = document.getElementById('lightOverlay');
    const fluff = document.getElementById('fluff');
    
    house.classList.remove('house-dark');
    light.classList.remove('active');
    fluff.classList.remove('curled');
    
    const text = document.getElementById('emoText');
    const exitBtn = document.getElementById('emoExit');
    if (text) text.remove();
    if (exitBtn) exitBtn.remove();
}

function updateAlbum() {
    const container = document.getElementById('albumContainer');
    container.innerHTML = '';
    
    albumData.forEach((album, i) => {
        const isUnlocked = gameData.playCount >= album.unlock;
        const card = document.createElement('div');
        card.className = 'album-card' + (isUnlocked ? '' : ' locked');
        
        if (isUnlocked) {
            card.innerHTML = `
                <div class="album-img">${album.img}</div>
                <div class="album-text">${album.text}</div>
            `;
        } else {
            card.innerHTML = `
                <div class="album-img">🐹</div>
                <div class="album-text">🔒</div>
                <div class="lock-hint">多和绒毛互动解锁喔～</div>
            `;
        }
        
        container.appendChild(card);
    });
    
    document.getElementById('albumCount').textContent = albumData.filter((a, i) => gameData.playCount >= a.unlock).length;
}

function updateMailbox() {
}

function showWriteModal() {
    const modal = document.createElement('div');
    modal.className = 'letter-modal';
    modal.id = 'letterModal';
    modal.innerHTML = `
        <div class="letter-content">
            <div style="font-size:18px;color:#5d4e37;margin-bottom:15px;">写给${selectedMailFriend}</div>
            <textarea id="letterText" placeholder="说点什么吧..."></textarea>
            <div class="letter-buttons">
                <button class="cancel" onclick="document.getElementById('letterModal').remove()">取消</button>
                <button class="send" onclick="sendLetter()">寄出</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function sendLetter() {
    const text = document.getElementById('letterText').value.trim();
    if (!text) {
        alert('写点什么吧～');
        return;
    }
    
    gameData.letters.push({
        to: selectedMailFriend,
        content: text,
        date: new Date().toISOString(),
        hasReply: false,
        reply: null
    });
    saveData();
    
    document.getElementById('letterModal').innerHTML = `
        <div class="letter-content">
            <div style="font-size:60px;">📮</div>
            <div style="font-size:16px;color:#5d4e37;margin-top:20px;text-align:center;line-height:1.6;">
                绒毛收到啦。它说它会好好看的，明天给你回信。
            </div>
            <button class="sign-option" style="margin-top:30px;width:100%;" onclick="document.getElementById('letterModal').remove()">好的</button>
        </div>
    `;
    
    setTimeout(() => {
        const lastLetter = gameData.letters[gameData.letters.length - 1];
        lastLetter.hasReply = true;
        lastLetter.reply = presetReplies[Math.floor(Math.random() * presetReplies.length)];
        lastLetter.replyDate = new Date().toISOString();
        saveData();
        updateMailbox();
    }, 3000);
}

function checkMail() {
    const lastLetter = gameData.letters[gameData.letters.length - 1];
    if (lastLetter && lastLetter.hasReply) {
        const modal = document.createElement('div');
        modal.className = 'letter-modal';
        modal.innerHTML = `
            <div class="letter-content">
                <div style="font-size:24px;color:#5d4e37;margin-bottom:15px;">📬 ${lastLetter.to}的回信</div>
                <div class="reply-display">${lastLetter.reply}</div>
                <button class="sign-option" style="margin-top:20px;width:100%;" onclick="this.parentElement.parentElement.remove()">好温暖</button>
            </div>
        `;
        document.body.appendChild(modal);
    } else if (gameData.letters.length === 0) {
        alert('还没有写过信哦，写一封给绒毛吧～');
    } else {
        alert('绒毛还在写回信，明天再来看看吧～');
    }
}

document.addEventListener('DOMContentLoaded', init);
