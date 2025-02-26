const cursor = document.querySelector('.cursor')
const holes = [...document.querySelectorAll('.hole')]
const scoreEl = document.querySelector('.score span')
const gameOverElement = document.querySelector('.game-over');
const restartTextElement = document.querySelector('.restart-text');
const startTextElement = document.querySelector('.start-text');
const bestScoresList = document.getElementById('best-scores-list');
let score = 0
let missed = 0;
const maxMisses = 1;
let moleInterval = 1500;
const sound = new Audio("assets/smash.mp3")
const laughSound = new Audio("assets/laugh.mp3")
const backgroundMusic = new Audio("assets/music.mp3")
backgroundMusic.loop = true;

function updateScore() {
    scoreEl.textContent = score;
}

function showGameOver() {
    gameOverElement.style.display = 'block';
    restartTextElement.style.display = 'block';
    laughSound.play();
    updateBestScores();
}

function hideGameOver() {
    gameOverElement.style.display = 'none';
    restartTextElement.style.display = 'none';
}

function resetGame() {
    score = 0;
    missed = 0;
    moleInterval = 1500;
    updateScore();
    hideGameOver();
    run();
}

function applyScreenShake() {
    document.body.classList.add('shake');
    setTimeout(() => {
        document.body.classList.remove('shake');
    }, 500);
}

function run(){
    const i = Math.floor(Math.random() * holes.length)
    const hole = holes[i]
    let timer = null

    const img = document.createElement('img')
    img.classList.add('mole')
    img.src = 'assets/mole.png'

    img.addEventListener('click', () => {
        score += 10
        sound.play()
        updateScore();
        img.src = 'assets/mole-whacked.png'
        applyScreenShake();
        clearTimeout(timer)
        setTimeout(() => {
            hole.removeChild(img)
            run()
        }, 500)
    })

    hole.appendChild(img)

    timer = setTimeout(() => {
        hole.removeChild(img)
        missed++;
        if (missed >= maxMisses) {
            showGameOver();
            document.querySelector('.board').removeEventListener('click', handleClick);
        } else {
            run();
        }
    }, moleInterval)
}


setInterval(() => {
    if (moleInterval > 500) {
        moleInterval -= 100;
    }
}, 5000);

function updateBestScores() {
    let bestScores = JSON.parse(localStorage.getItem('bestScores')) || [0, 0, 0];
    bestScores.push(score);
    bestScores.sort((a, b) => b - a);
    bestScores = bestScores.slice(0, 3);
    localStorage.setItem('bestScores', JSON.stringify(bestScores));
    bestScoresList.innerHTML = bestScores.map(score => `<li>${score}</li>`).join('');
}


window.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && startTextElement.style.display !== 'none') {
        startTextElement.style.display = 'none';
        backgroundMusic.play();
        resetGame();
    } else if (event.code === 'Space' && gameOverElement.style.display === 'block') {
        resetGame();
    }
});

window.addEventListener('mousemove', e => {
    cursor.style.top = e.pageY + 'px'
    cursor.style.left = e.pageX + 'px'
})
window.addEventListener('mousedown', () => {
    cursor.classList.add('active')
})
window.addEventListener('mouseup', () => {
    cursor.classList.remove('active')
})

function handleClick(event) {
    if (event.target.classList.contains('mole')) {
        score++;
        updateScore();
    } else {
        missed++;
        if (missed >= maxMisses) {
            showGameOver();
            document.querySelector('.board').removeEventListener('click', handleClick);
        }
    }
}


document.querySelector('.board').addEventListener('click', handleClick);

function createRain() {
    const rainContainer = document.createElement('div');
    rainContainer.classList.add('rain');
    document.body.appendChild(rainContainer);

    for (let i = 0; i < 200; i++) { 
        const drop = document.createElement('div');
        drop.classList.add('drop');
        rainContainer.appendChild(drop);
    }
}

function createLightning() {
    const lightning = document.createElement('div');
    lightning.classList.add('lightning');
    document.body.appendChild(lightning);

    setTimeout(() => {
        lightning.remove();
    }, 200);
}


setTimeout(createLightning, 15000);


setTimeout(createRain, 20000);