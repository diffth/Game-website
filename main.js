import { initLevel1, cleanupLevel1 } from './components/Level1.js';
import { initLevel2, cleanupLevel2 } from './components/Level2.js';
import { initLevel3, cleanupLevel3 } from './components/Level3.js';
import { initCommunity } from './components/Community.js';

document.addEventListener('DOMContentLoaded', () => {
    // Screens
    const startScreen = document.getElementById('start-screen');
    const levelSelectScreen = document.getElementById('level-select-screen');
    const gameScreen = document.getElementById('game-screen');
    const communityScreen = document.getElementById('community-screen');
    
    // Buttons
    const btnStart = document.getElementById('btn-start');
    const btnBackToMenu = document.getElementById('btn-back-to-menu');
    const btnCommunity = document.getElementById('btn-community');
    const btnCommunityBack = document.getElementById('btn-community-back');
    const levelCards = document.querySelectorAll('.level-card');
    
    // Game Elements
    const gameContainer = document.getElementById('game-container');
    const currentLevelTitle = document.getElementById('current-level-title');
    const scoreValue = document.getElementById('score-value');
    
    // Modal
    const infoModal = document.getElementById('info-modal');
    const btnModalClose = document.getElementById('btn-modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalText = document.getElementById('modal-text');

    let currentLevel = null;

    // --- Screen Transitions ---
    function showScreen(screen) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        screen.classList.add('active');
    }

    btnStart.addEventListener('click', () => {
        showScreen(levelSelectScreen);
    });

    btnBackToMenu.addEventListener('click', () => {
        if (currentLevel === 1) cleanupLevel1();
        if (currentLevel === 2) cleanupLevel2();
        if (currentLevel === 3) cleanupLevel3();
        gameContainer.innerHTML = '';
        currentLevel = null;
        showScreen(levelSelectScreen);
    });

    btnCommunity.addEventListener('click', () => {
        showScreen(communityScreen);
        initCommunity();
    });

    btnCommunityBack.addEventListener('click', () => {
        showScreen(levelSelectScreen);
    });

    // --- Level Selection ---
    levelCards.forEach(card => {
        card.addEventListener('click', () => {
            const level = parseInt(card.dataset.level);
            startLevel(level);
        });
    });

    function startLevel(level) {
        currentLevel = level;
        scoreValue.textContent = '0';
        gameContainer.innerHTML = ''; // Clear previous level
        
        showScreen(gameScreen);

        if (level === 1) {
            currentLevelTitle.textContent = '모듈 1: 지도 학습';
            initLevel1(gameContainer, updateScore, showModal);
        } else if (level === 2) {
            currentLevelTitle.textContent = '모듈 2: 신경망 연결';
            initLevel2(gameContainer, updateScore, showModal);
        } else if (level === 3) {
            currentLevelTitle.textContent = '모듈 3: 미로 러너 (강화 학습)';
            initLevel3(gameContainer, updateScore, showModal);
        }
    }

    // --- Game Utilities ---
    function updateScore(points) {
        const currentScore = parseInt(scoreValue.textContent);
        scoreValue.textContent = currentScore + points;
    }

    function showModal(title, text) {
        modalTitle.textContent = title;
        modalText.innerHTML = text; // Allow HTML for formatting
        infoModal.classList.remove('hidden');
    }

    btnModalClose.addEventListener('click', () => {
        infoModal.classList.add('hidden');
    });
});
