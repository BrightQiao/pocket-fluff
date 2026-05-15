let papersCrumbled = 0;

function startPaperGame() {
    papersCrumbled = 0;
    const negativePapers = [
        { text: '我真没用', positive: '我今天已经做了', needInput: true },
        { text: '我又搞砸了', positive: '可搞砸是学习的一部分，绒毛也经常摔跤', needInput: false },
        { text: '别人都比我强', positive: gameData.nickname + '愿意陪绒毛玩，' + gameData.nickname + '真好！', needInput: false }
    ];
    
    const game = document.createElement('div');
    game.className = 'paper-game';
    game.id = 'paperGame';
    game.innerHTML = `
        <div style="position:absolute; top:30px; left:50%; transform:translateX(-50%); text-align:center; font-size:16px; color:#5d4e37; line-height:1.6;">
            把这些坏纸条揉成团扔掉吧！
        </div>
        <div class="paper-bin"></div>
    `;
    document.body.appendChild(game);
    
    const positions = [
        { top: '27%', left: '50%' },
        { top: '47%', left: '50%' },
        { top: '67%', left: '50%' }
    ];
    
    negativePapers.forEach((paper, i) => {
        const paperEl = document.createElement('img');
        paperEl.className = 'paper';
        paperEl.src = ['条1.png', '条3.png', '条2.png'][i];
        paperEl.style.top = positions[i].top;
        paperEl.style.left = positions[i].left;
        paperEl.style.transform = 'translate(-50%, -50%) rotate(' + (Math.random() * 10 - 5) + 'deg)';
        paperEl.onclick = () => crumplePaper(paperEl, paper, i);
        game.appendChild(paperEl);
    });
    
    const fluff = document.getElementById('fluff');
    fluff.classList.add('pos-3');
}

function crumplePaper(el, data, index) {
    el.classList.add('crumpled');
    papersCrumbled++;
    
    if (typeof recordBraveMoment === 'function') {
        recordBraveMoment('paper', '揉掉了"' + data.text + '"这张纸条');
    }
    
    setTimeout(() => {
        el.remove();
        showPositivePaper(data);
    }, 400);
}

function showPositivePaper(data) {
    const container = document.createElement('div');
    container.className = 'positive-paper';
    container.id = 'positivePaper';
    
    if (data.needInput) {
        container.innerHTML = `
            <div>${data.positive}</div>
            <input type="text" id="goodThingInput" placeholder="一件小事（比如好好吃饭）">
            <button onclick="confirmGoodThing()">真好呀！</button>
        `;
    } else {
        container.innerHTML = `
            <div>${data.positive}</div>
            <button onclick="closePositivePaper()">继续</button>
        `;
    }
    document.getElementById('paperGame').appendChild(container);
}

function confirmGoodThing() {
    const input = document.getElementById('goodThingInput');
    if (input.value.trim()) {
        closePositivePaper();
    } else {
        alert('想一想嘛，哪怕很小的事也可以～');
    }
}

function closePositivePaper() {
    document.getElementById('positivePaper').remove();
    if (papersCrumbled >= 3) {
        const finish = document.createElement('div');
        finish.className = 'positive-paper';
        finish.style.top = '50%';
        finish.innerHTML = '<div>干净啦。这些话不属于你。</div><button onclick="exitPaperGame()">好啦</button>';
        document.getElementById('paperGame').appendChild(finish);
    }
}

function exitPaperGame() {
    const game = document.getElementById('paperGame');
    if (game) game.remove();
    papersCrumbled = 0;
    const fluff = document.getElementById('fluff');
    fluff.classList.remove('pos-3');
}
