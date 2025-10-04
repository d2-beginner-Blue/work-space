// ボード

// 幅と高さは、HTMLのスタイルに合わせる
// 幅 10 * 30 = 300px
const COLUMNS = 10;
// 高さ 20 * 30 = 600px
const ROWS = 20;
//　 1マス分の幅・高さ
const BLOCK_SIZE = 30;

// 盤面配列を作成
let board = [];
for(let r = 0; r < ROWS; r++){
    board[r] = [];
    for(let c = 0; c < COLUMNS; c++){
        board[r][c] = 0;
    }
}

//グローバル変数として公開
window.board = board;

// canvas取得
const canvas = document.querySelector('#main-canvas');
const context = canvas.getContext('2d');

// グローバル変数として公開
window.gameContext = context;

// 描画関数
// fillRect：塗りつぶした四角形を描く
// strokeRect:枠線だけの四角形を描く
const drawBoard = () => {
    // 背景全体を灰色に塗る
    context.fillStyle = 'lightgray'
    context.fillRect( 0, 0, canvas.width, canvas.height);

    for(let r = 0; r < ROWS; r++){
        for(let c = 0; c < COLUMNS; c++){
            if(board[r][c] !== 0){
                context.fillStyle = 'blue';
                context.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            } else {
                context.fillStyle = 'lightgray';
                context.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                context.strokeStyle = '#f5f5f5';
                context.strokeRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

// グローバル関数として公開
window.drawBoard = drawBoard;
