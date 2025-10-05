// ゲーム起動・ループ

// ページ読み込み時に初期画面を描画
window.addEventListener('load', () => {
    window.drawBoard();
});

const startButton = document.querySelector("#start-button");
const pauseButton = document.querySelector("#pause-button");
const restartButton = document.querySelector('#restart-button');
const resetButton = document.querySelector('#reset-button');

// タイマー宣言
// TODO:一時停止ボタンを押した時に、dropIntervalを止めたら、ミノの停止も止まるようにしたい。
let dropInterval;

startButton.addEventListener('click', () => {
    // 既にタイマーが動いていたら一旦クリア
    if(dropInterval) clearInterval(dropInterval);

    // 300msごとにブロックを落とす
    dropInterval = setInterval(() => {
        window.drawBoard();
        window.drop();
    }, 300);

    // ボタン表示切り替え
    startButton.classList.add('d-none');
    pauseButton.classList.remove('d-none');
})

pauseButton.addEventListener('click', () => {
   clearInterval(dropInterval);
   dropInterval = null;

    pauseButton.classList.add('d-none');
    restartButton.classList.remove('d-none');
    resetButton.classList.remove('d-none');
})

restartButton.addEventListener('click', () => {
    // 400msごとにブロックを落とす
    dropInterval = setInterval(() => {
        window.drawBoard();
        window.drop();
    }, 400);

    restartButton.classList.add('d-none');
    resetButton.classList.add('d-none');
    pauseButton.classList.remove('d-none'); 
})

resetButton.addEventListener('click', () => {
    window.clearBoard();
    window.drawBoard();

    currentBlock = getRandomBlock();

    score = 0;

    document.querySelector('#score').textContent = score;

    restartButton.classList.add('d-none');
    resetButton.classList.add('d-none');
    startButton.classList.remove('d-none');
})

const downButton = document.querySelector("#move-down");

// 通常落下を止めて高速落下に切り替え
downButton.addEventListener('mousedown', () => {
    if(dropInterval) {
        clearInterval(dropInterval);
        dropInterval = null;
    };

    dropInterval = setInterval(() => {
        window.drawBoard();
        window.drop();
    }, 50);
});

// 指を離したら通常速度に戻す
downButton.addEventListener('mouseup', () => {
    if(dropInterval){
        clearInterval(dropInterval);
        dropInterval = null;
    };

    dropInterval = setInterval(() => {
        window.drawBoard();
        window.drop();
    }, 400);
})