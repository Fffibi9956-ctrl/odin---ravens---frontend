// Конфигурация игры
const tarotCards = [
    { name: "ШУТ", correct: "Начало пути, невинность, спонтанность", hint: "Карта новых начинаний." },
    { name: "ВЕЛЕС", correct: "Магия, природа, скрытые знания", hint: "Языческий бог, хранитель тайн леса." },
    { name: "СОЛНЦЕ", correct: "Радость, успех, жизненная сила", hint: "Свет истины, разгоняющий тьму." },
    { name: "ЛУНА", correct: "Иллюзии, подсознание, тайны", hint: "Отражение снов и древних страхов." },
    { name: "СМЕРТЬ", correct: "Преображение, конец цикла, возрождение", hint: "Не физическая смерть, а глубокое изменение." }
];
const wrongAnswers = [ "Одиночество, потеря", "Богатство, карьера", "Предательство, обман", "Стабильность, застой", "Болезнь, слабость" ];

// Состояние игры
let currentCard, score = 0, gameTime = 0, revealedFrags = 1, gameActive = false, gameTimer;
const totalFragments = 9, fragmentTimeLimit = 3;

// Основные функции
function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    selectRandomCard();
}
function selectRandomCard() {
    currentCard = tarotCards[Math.floor(Math.random() * tarotCards.length)];
    document.getElementById('cardName').textContent = currentCard.name;
    document.getElementById('cardHint').textContent = currentCard.hint;
    resetRound();
    createFragmentsGrid();
    createAnswerOptions();
    startRoundTimer();
}
function createFragmentsGrid() {
    const grid = document.getElementById('fragmentsGrid');
    grid.innerHTML = '';
    for (let i = 0; i < totalFragments; i++) {
        const frag = document.createElement('div');
        frag.className = 'fragment';
        frag.textContent = i < revealedFrags ? '🦅' : '?';
        if (i < revealedFrags) frag.classList.add('revealed');
        grid.appendChild(frag);
    }
}
function createAnswerOptions() {
    const answers = [currentCard.correct];
    const randomWrongs = [...wrongAnswers].sort(() => Math.random() - 0.5).slice(0, 3);
    answers.push(...randomWrongs);
    answers.sort(() => Math.random() - 0.5);

    const container = document.getElementById('answersContainer');
    container.innerHTML = '';
    answers.forEach(answer => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = answer;
        btn.onclick = () => handleAnswer(answer);
        container.appendChild(btn);
    });
}
function startRoundTimer() {
    gameActive = true;
    gameTime = 0;
    clearInterval(gameTimer);
    gameTimer = setInterval(() => {
        if (!gameActive) return;
        gameTime += 0.1;
        document.getElementById('timerSpan').textContent = gameTime.toFixed(1);
        if (gameTime >= fragmentTimeLimit && revealedFrags < totalFragments) {
            revealedFrags++;
            updateGameState();
            gameTime = 0;
        }
        if (revealedFrags === totalFragments && gameActive) {
            endRound(false, false);
        }
    }, 100);
}
function handleAnswer(selectedAnswer) {
    if (!gameActive) return;
    const isCorrect = selectedAnswer === currentCard.correct;
    endRound(isCorrect, true);
}
function endRound(isCorrect, answered) {
    gameActive = false;
    clearInterval(gameTimer);
    let pointsEarned = 0;
    if (answered && isCorrect) {
        pointsEarned = Math.max(50, 500 - Math.floor(gameTime * 20)) + (totalFragments - revealedFrags) * 30;
        score += pointsEarned;
    } else if (answered && !isCorrect) {
        pointsEarned = -200;
        score = Math.max(0, score + pointsEarned);
    }
    document.getElementById('scoreSpan').textContent = score;
    showResult(isCorrect, answered, pointsEarned);
}
function showResult(isCorrect, answered, points) {
    const title = document.getElementById('resultTitle');
    const answerText = document.getElementById('resultCorrectAnswer');
    if (answered && isCorrect) {
        title.textContent = `Правильно! +${points} очков`;
    } else if (answered && !isCorrect) {
        title.textContent = `Ошибка! ${points} очков`;
    } else {
        title.textContent = 'Время вышло! 0 очков';
    }
    answerText.textContent = `Значение карты: ${currentCard.correct}`;
    document.getElementById('resultPanel').style.display = 'block';
}
function nextCard() {
    document.getElementById('resultPanel').style.display = 'none';
    selectRandomCard();
}
function resetRound() {
    revealedFrags = 1;
    updateGameState();
}
function updateGameState() {
    document.getElementById('fragmentsSpan').textContent = revealedFrags;
    createFragmentsGrid();
}

// Инициализация Telegram Mini App
let tg = window.Telegram.WebApp;
tg.ready();
tg.expand();
