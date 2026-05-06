export function initLevel2(container, onScore, onShowModal) {
    container.innerHTML = `
        <div class="level-intro">
            <h3>미션: 시냅스 연결하기</h3>
            <p>신경망은 뉴런들이 연결되어 신호를 전달하며 작동합니다.<br>각 연결을 클릭하여 <strong>가중치(Weight)</strong>를 높여보세요. 신호가 오른쪽 끝까지 전달되어야 합니다!</p>
        </div>
        <div class="game-board nn-board">
            <svg id="nn-svg" width="600" height="400"></svg>
            <div id="nn-nodes-container"></div>
        </div>
        <button id="btn-fire-signal" class="cyber-btn small">신호 발사!</button>
    `;

    const svg = document.getElementById('nn-svg');
    const nodesContainer = document.getElementById('nn-nodes-container');
    const btnFire = document.getElementById('btn-fire-signal');

    const layers = [
        { id: 'input', count: 2, x: 50 },
        { id: 'hidden', count: 3, x: 300 },
        { id: 'output', count: 1, x: 550 }
    ];

    const nodes = [];
    const connections = [];

    // Create nodes
    layers.forEach((layer, lIdx) => {
        for (let i = 0; i < layer.count; i++) {
            const y = (400 / (layer.count + 1)) * (i + 1);
            const node = { id: `${layer.id}-${i}`, x: layer.x, y: y, layer: lIdx };
            nodes.push(node);

            const nodeEl = document.createElement('div');
            nodeEl.className = 'nn-node';
            nodeEl.style.left = `${node.x}px`;
            nodeEl.style.top = `${node.y}px`;
            nodeEl.id = node.id;
            nodesContainer.appendChild(nodeEl);
        }
    });

    // Create connections between layers
    for (let l = 0; l < layers.length - 1; l++) {
        const currentLayerNodes = nodes.filter(n => n.layer === l);
        const nextLayerNodes = nodes.filter(n => n.layer === l + 1);

        currentLayerNodes.forEach(source => {
            nextLayerNodes.forEach(target => {
                const conn = {
                    source,
                    target,
                    weight: 0.2, // Default low weight
                    id: `conn-${source.id}-${target.id}`
                };
                connections.push(conn);

                // Invisible thick line for easier clicking
                const clickArea = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                clickArea.setAttribute('x1', source.x);
                clickArea.setAttribute('y1', source.y);
                clickArea.setAttribute('x2', target.x);
                clickArea.setAttribute('y2', target.y);
                clickArea.setAttribute('stroke', 'transparent');
                clickArea.setAttribute('stroke-width', '20');
                clickArea.style.cursor = 'pointer';

                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', source.x);
                line.setAttribute('y1', source.y);
                line.setAttribute('x2', target.x);
                line.setAttribute('y2', target.y);
                line.setAttribute('class', 'nn-connection');
                line.setAttribute('stroke-width', conn.weight * 8 + 2);
                line.setAttribute('stroke', `rgba(0, 243, 255, ${0.2 + conn.weight})`);
                line.id = conn.id;

                const updateWeight = () => {
                    conn.weight = (conn.weight + 0.3) % 1.5;
                    if (conn.weight < 0.2) conn.weight = 0.2;
                    line.setAttribute('stroke-width', conn.weight * 8 + 2);
                    line.setAttribute('stroke', `rgba(0, 243, 255, ${0.2 + conn.weight})`);
                    
                    // Visual pop effect
                    line.style.filter = 'brightness(2)';
                    setTimeout(() => line.style.filter = 'none', 100);
                };

                clickArea.addEventListener('click', updateWeight);
                line.addEventListener('click', updateWeight);

                svg.appendChild(line);
                svg.appendChild(clickArea);
            });
        });
    }

    btnFire.addEventListener('click', () => {
        btnFire.disabled = true;
        
        // Signal Animation
        const signalCircles = [];
        connections.forEach(conn => {
            if (conn.weight > 0.5) {
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('r', '4');
                circle.setAttribute('fill', 'var(--neon-blue)');
                circle.style.filter = 'blur(2px)';
                
                const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
                animate.setAttribute('dur', '0.8s');
                animate.setAttribute('repeatCount', '1');
                animate.setAttribute('path', `M ${conn.source.x} ${conn.source.y} L ${conn.target.x} ${conn.target.y}`);
                
                circle.appendChild(animate);
                svg.appendChild(circle);
                signalCircles.push(circle);
            }
        });

        setTimeout(() => {
            signalCircles.forEach(c => c.remove());
            
            let totalSignal = 0;
            const inputToHidden = connections.filter(c => c.source.layer === 0);
            const hiddenToOutput = connections.filter(c => c.source.layer === 1);

            const hiddenStrengths = [0, 0, 0];
            inputToHidden.forEach(c => {
                const hIdx = parseInt(c.target.id.split('-')[1]);
                hiddenStrengths[hIdx] += c.weight;
            });

            hiddenStrengths.forEach((strength, hIdx) => {
                if (strength > 0.7) { // Increased threshold for challenge
                    const conns = hiddenToOutput.filter(c => c.source.id === `hidden-${hIdx}`);
                    conns.forEach(c => totalSignal += c.weight);
                }
            });

            if (totalSignal > 1.2) {
                onScore(50);
                onShowModal('활성화 성공!', '축하합니다! 시냅스 연결을 강화하여 신호를 성공적으로 전달했습니다. 신경망은 이렇게 <strong>가중치(Weights)</strong>를 조정하며 패턴을 학습합니다.');
            } else {
                onShowModal('신호 미달', '신호가 너무 약해서 출력 노드에 도달하지 못했습니다. 연결선을 클릭하여 가중치를 더 높여보세요! (현재 신호 세기: ' + totalSignal.toFixed(2) + ')');
            }
            btnFire.disabled = false;
        }, 800);
    });
}

export function cleanupLevel2() {}

