function startBubbleGame() {
    const bubbles = [
        { text: '找工作', action: '今天只打开招聘APP看一眼，不看要求。' },
        { text: '考试', action: '写下明天要复习的第一个知识点。' },
        { text: '和别人比较', action: '把朋友圈入口关掉1小时。' }
    ];
    
    const game = document.createElement('div');
    game.className = 'star-game';
    game.id = 'bubbleGame';
    game.style.background = 'linear-gradient(180deg, #2d1b4e 0%, #1a1a2e 50%, #16213e 100%)';
    game.innerHTML = `
        <button class="exit-btn" onclick="exitBubbleGame()" style="top:10px; right:10px; padding:8px 16px; font-size:14px;">退出</button>
        <div class="game-text" id="bubbleText">点一下泡泡，戳破它，里面藏着一件小事</div>
        <div id="bubblesArea" style="position:fixed; top:0; left:0; right:0; bottom:0;"></div>
    `;
    document.body.appendChild(game);
    
    const bubblesArea = document.getElementById('bubblesArea');
    bubbles.forEach((bubble, i) => {
        const bubbleEl = document.createElement('div');
        bubbleEl.className = 'bubble';
        bubbleEl.style.cssText = `
            position: absolute;
            width: 110px;
            height: 110px;
            background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), rgba(255,182,193,0.4));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            color: #fff;
            text-align: center;
            cursor: pointer;
            box-shadow: 0 8px 30px rgba(0,0,0,0.3), inset 0 0 20px rgba(255,255,255,0.1);
            animation: floatBubble 3s ease-in-out infinite;
            animation-delay: ${i * 0.5}s;
            top: ${25 + i * 18}%;
            left: ${20 + i * 25}%;
            padding: 15px;
            line-height: 1.3;
        `;
        bubbleEl.textContent = bubble.text;
        bubbleEl.onclick = () => popBubble(bubbleEl, bubble.action);
        bubblesArea.appendChild(bubbleEl);
    });
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatBubble {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-15px) scale(1.05); }
        }
        .bubble.popped {
            animation: popBubbleAnim 0.3s forwards !important;
        }
        @keyframes popBubbleAnim {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.3); opacity: 0.5; }
            100% { transform: scale(0); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

function popBubble(el, action) {
    el.classList.add('popped');
    setTimeout(() => {
        el.remove();
        const actionCard = document.createElement('div');
        actionCard.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            padding: 30px 25px;
            border-radius: 20px;
            max-width: 280px;
            text-align: center;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            z-index: 200;
            animation: popIn 0.3s ease-out;
        `;
        actionCard.innerHTML = `
            <div style="font-size:40px;margin-bottom:15px;">💫</div>
            <div style="font-size:16px;color:#5d4e37;line-height:1.6;">${action}</div>
            <button onclick="this.parentElement.remove()" style="margin-top:20px;padding:10px 30px;background:#a8d5ba;border:none;border-radius:20px;color:#fff;cursor:pointer;">收到</button>
        `;
        document.getElementById('bubbleGame').appendChild(actionCard);
    }, 300);
}

function exitBubbleGame() {
    const game = document.getElementById('bubbleGame');
    if (game) game.remove();
}
