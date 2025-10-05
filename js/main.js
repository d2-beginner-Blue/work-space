// ゲーム起動・ループ

// ページ読み込み時に初期画面を描画
window.addEventListener('load', () => {
    window.drawBoard();
    window.drawNextBoard();
});

const startButton = document.querySelector("#start-button");
const pauseButton = document.querySelector("#pause-button");
const restartButton = document.querySelector('#restart-button');

// タイマー宣言
// TODO:一時停止ボタンを押した時に、dropIntervalを止めたら、ミノの停止も止まるようにしたい。
let dropInterval;

startButton.addEventListener('click', () => {
    // 既にタイマーが動いていたら一旦クリア
    if(dropInterval) clearInterval(dropInterval);

    // 500msごとにブロックを落とす
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

    pauseButton.classList.add('d-none');
    restartButton.classList.remove('d-none');
})

restartButton.addEventListener('click', () => {
    // 500msごとにブロックを落とす
    dropInterval = setInterval(() => {
        window.drawBoard();
        window.drop();
    }, 300);

    restartButton.classList.add('d-none');
    pauseButton.classList.remove('d-none'); 
})

