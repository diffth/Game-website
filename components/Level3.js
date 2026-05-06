export function initLevel3(container, onScore, onShowModal) {
    const gridSize = 5;
    container.innerHTML = `
        <div class="level-intro">
            <h3>미션: AI 길들이기</h3>
            <p>강화 학습은 <strong>보상(Reward)</strong>을 통해 학습합니다.<br>빈 칸을 클릭하여 보상(🍪)이나 장애물(🔥)을 배치하세요. AI 로봇이 쿠키를 찾아가도록 유도하세요!</p>
        </div>
        <div id="rl-grid" class="maze-grid"></div>
        <div class="controls">
            <button id="btn-start-rl" class="cyber-btn small">학습 시작</button>
            <button id="btn-reset-rl" class="cyber-btn small">초기화</button>
        </div>
    `;

    const gridEl = document.getElementById('rl-grid');
    const grid = [];
    let agentPos = { x: 0, y: 0 };
    let moveInterval = null;

    // Initialize grid
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            gridEl.appendChild(cell);
            grid.push({ x, y, type: 'empty', el: cell });

            cell.addEventListener('click', () => {
                if (x === 0 && y === 0) return; // Agent start pos
                const item = grid.find(c => c.x === x && c.y === y);
                if (item.type === 'empty') {
                    item.type = 'reward';
                    cell.textContent = '🍪';
                    cell.classList.add('reward');
                } else if (item.type === 'reward') {
                    item.type = 'obstacle';
                    cell.textContent = '🔥';
                    cell.classList.remove('reward');
                    cell.classList.add('obstacle');
                } else {
                    item.type = 'empty';
                    cell.textContent = '';
                    cell.classList.remove('obstacle');
                }
            });
        }
    }

    const agentEl = document.createElement('div');
    agentEl.className = 'agent';
    agentEl.textContent = '🤖';
    updateAgentPos();
    gridEl.appendChild(agentEl);

    function updateAgentPos() {
        const cellSize = 60; // Assuming cell size in CSS
        agentEl.style.left = `${agentPos.x * 70 + 10}px`;
        agentEl.style.top = `${agentPos.y * 70 + 10}px`;
    }

    function moveAgent() {
        const directions = [
            { x: 0, y: 1 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0 }
        ];

        // Simple greedy logic: move towards reward
        const rewards = grid.filter(c => c.type === 'reward');
        let move;

        if (rewards.length > 0) {
            // Find closest reward
            const target = rewards[0];
            const dx = target.x - agentPos.x;
            const dy = target.y - agentPos.y;

            if (Math.abs(dx) > Math.abs(dy)) {
                move = { x: Math.sign(dx), y: 0 };
            } else {
                move = { x: 0, y: Math.sign(dy) };
            }
        } else {
            move = directions[Math.floor(Math.random() * directions.length)];
        }

        const newX = Math.max(0, Math.min(gridSize - 1, agentPos.x + move.x));
        const newY = Math.max(0, Math.min(gridSize - 1, agentPos.y + move.y));

        agentPos.x = newX;
        agentPos.y = newY;
        updateAgentPos();

        const currentCell = grid.find(c => c.x === agentPos.x && c.y === agentPos.y);
        if (currentCell.type === 'reward') {
            onScore(100);
            clearInterval(moveInterval);
            onShowModal('목표 달성!', '로봇이 보상을 찾아냈습니다! <strong>강화 학습(Reinforcement Learning)</strong>은 이렇게 시행착오를 거치며 보상을 최대화하는 방향으로 학습합니다.');
        } else if (currentCell.type === 'obstacle') {
            onScore(-20);
            agentPos = { x: 0, y: 0 };
            updateAgentPos();
        }
    }

    document.getElementById('btn-start-rl').addEventListener('click', () => {
        if (moveInterval) return;
        moveInterval = setInterval(moveAgent, 500);
    });

    document.getElementById('btn-reset-rl').addEventListener('click', () => {
        clearInterval(moveInterval);
        moveInterval = null;
        agentPos = { x: 0, y: 0 };
        updateAgentPos();
    });
}

export function cleanupLevel3() {
    // Clear intervals if any
}
