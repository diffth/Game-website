export function initLevel1(container, onScore, onShowModal) {
    container.innerHTML = `
        <div class="level-intro">
            <h3>미션: 데이터 분류하기</h3>
            <p>인공지능은 정답(라벨)이 있는 데이터를 통해 학습합니다. <br> <strong>동물</strong>은 왼쪽 파란 칸으로, <strong>과일</strong>은 오른쪽 분홍 칸으로 분류하세요!</p>
        </div>
        <div class="game-board supervised-board">
            <div id="drop-zone-animal" class="drop-zone animal-zone">
                <span class="zone-label">동물 (Animal)</span>
                <div class="zone-counter" id="count-animal">0</div>
                <div class="sorted-items" id="sorted-animals"></div>
            </div>
            <div id="data-packet-container"></div>
            <div id="drop-zone-fruit" class="drop-zone fruit-zone">
                <span class="zone-label">과일 (Fruit)</span>
                <div class="zone-counter" id="count-fruit">0</div>
                <div class="sorted-items" id="sorted-fruits"></div>
            </div>
        </div>
    `;

    const packetContainer = document.getElementById('data-packet-container');
    const animalZone = document.getElementById('drop-zone-animal');
    const fruitZone = document.getElementById('drop-zone-fruit');

    const dataItems = [
        { icon: '🐱', type: 'animal' },
        { icon: '🐶', type: 'animal' },
        { icon: '🦁', type: 'animal' },
        { icon: '🍎', type: 'fruit' },
        { icon: '🍌', type: 'fruit' },
        { icon: '🍇', type: 'fruit' },
        { icon: '🐻', type: 'animal' },
        { icon: '🍊', type: 'fruit' }
    ];

    let itemsProcessed = 0;
    let counts = { animal: 0, fruit: 0 };
    let spawnInterval = null;

    function spawnPacket() {
        if (itemsProcessed >= 20) {
            clearInterval(spawnInterval);
            onShowModal('학습 완료!', '훌륭합니다! 당신은 데이터를 정확하게 분류하여 AI를 학습시켰습니다. 이것이 바로 <strong>지도 학습(Supervised Learning)</strong>의 기초입니다.');
            return;
        }

        const item = dataItems[Math.floor(Math.random() * dataItems.length)];
        const packet = document.createElement('div');
        packet.className = 'data-packet draggable';
        packet.textContent = item.icon;
        packet.draggable = true;
        packet.dataset.type = item.type;

        packetContainer.appendChild(packet);

        packet.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', item.type);
            packet.classList.add('dragging');
        });

        packet.addEventListener('dragend', () => {
            packet.classList.remove('dragging');
        });
    }

    // Setup drop zones
    [animalZone, fruitZone].forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('drag-over');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            const type = e.dataTransfer.getData('text/plain');
            const targetType = zone.id === 'drop-zone-animal' ? 'animal' : 'fruit';

            const draggingElement = document.querySelector('.dragging');
            if (draggingElement) {
                if (type === targetType) {
                    onScore(10);
                    
                    // Show sorted item
                    const sortedContainer = zone.querySelector('.sorted-items');
                    const itemIcon = document.createElement('span');
                    itemIcon.className = 'sorted-icon';
                    itemIcon.textContent = draggingElement.textContent;
                    sortedContainer.appendChild(itemIcon);

                    // Update counter
                    counts[targetType]++;
                    zone.querySelector('.zone-counter').textContent = counts[targetType];

                    draggingElement.remove();
                    itemsProcessed++;
                    showFeedback(zone, true);
                } else {
                    onScore(-5);
                    showFeedback(zone, false);
                }
            }
        });
    });

    function showFeedback(zone, isCorrect) {
        const feedback = document.createElement('div');
        feedback.className = `feedback ${isCorrect ? 'correct' : 'wrong'}`;
        feedback.innerHTML = isCorrect ? '<span>정답!</span><br>+10' : '<span>오답!</span><br>-5';
        zone.appendChild(feedback);
        setTimeout(() => feedback.remove(), 1000);
    }

    spawnInterval = setInterval(spawnPacket, 2000);
    spawnPacket(); // Initial spawn
}

export function cleanupLevel1() {
    // Any cleanup if needed
}
