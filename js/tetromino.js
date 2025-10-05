// ブロック定義・回転

const BLOCKS = [
    [[1,1,1,1]],
    [[1,1],[1,1]],
    [[0,1,0],[1,1,1]],
    [[0,1,1],[1,1,0]],
    [[1,1,0],[0,1,1]],
    [[1,0,0],[1,1,1]],
    [[0,0,1],[1,1,1]]
];

const COLORS = [
    'cyan', 
    'yellow',
    'purple',
    'green',
    'red',
    'blue',
    'orange'
];

window.COLORS = COLORS;

let score = 0;

const updateScoreDisplay = () => {
    const scoreElement = document.querySelector('#score');
    if(scoreElement){
        scoreElement.textContent = score;
    }
}

const getRandomBlock = () => {
    const index = Math.floor(Math.random() * BLOCKS.length);
    return {
        row: 0,
        col: 4,
        shape: BLOCKS[index],
        type: index
    };
}

// 現在のブロックを格納
let currentBlock = getRandomBlock();

// nextブロックを格納
let nextBlock = getRandomBlock();
const nextCanvas = document.querySelector('#next-canvas');
const nextContext = nextCanvas.getContext('2d');
const NEXT_BLOCK_SIZE = 30;

// nextブロックを描画する関数
const drawNextBlock = () => {
    // まずcanvasをクリア
    nextContext.fillStyle = 'white';
    nextContext.fillRect(0,0,nextCanvas.width,nextCanvas.height);

    const block = nextBlock;
    const offsetX = 1;
    const offsetY = 1;

    block.shape.forEach((row,r) => {
        row.forEach((value,c) => {
            if(value){
                nextContext.fillStyle = COLORS[block.type];
                nextContext.fillRect(
                    (offsetX + c) * NEXT_BLOCK_SIZE,
                    (offsetY + r) * NEXT_BLOCK_SIZE,
                    NEXT_BLOCK_SIZE,NEXT_BLOCK_SIZE
                );
                nextContext.strokeStyle = 'black';
                nextContext.strokeRect(
                    (offsetX + c) * NEXT_BLOCK_SIZE,
                    (offsetY + r) * NEXT_BLOCK_SIZE,
                    NEXT_BLOCK_SIZE,NEXT_BLOCK_SIZE
                );
            }
        });
    });
}


const drawBlock = () => {
    const context = window.gameContext;
    currentBlock.shape.forEach((row, r) => {
        row.forEach((value, c) => {
            if(value){
                context.fillStyle = COLORS[currentBlock.type];
                context.fillRect(
                    (currentBlock.col + c) * BLOCK_SIZE,
                    (currentBlock.row + r) * BLOCK_SIZE,
                    BLOCK_SIZE, BLOCK_SIZE
                );
                context.strokeStyle = '#black'; // 落下中のブロックは黒い線
                context.strokeRect(
                    (currentBlock.col + c) * BLOCK_SIZE,
                    (currentBlock.row + r) * BLOCK_SIZE,
                    BLOCK_SIZE, BLOCK_SIZE
                );
            }
        });
    });
}

// 衝突する場合はture、しない場合はfalse
const checkCollision = (block, targetRow, targetCol) => {
    const blockShape = block.shape;
    const BOARD_ROWS = window.board.length;
    const BOARD_COLS = window.board[0].length;

    // ブロック形状内の各マスをチェック
    for(let r = 0; r < blockShape.length; r++){
        for(let c = 0; c < blockShape[0].length; c++){

            // そのマスにブロックの構成要素が存在する場合
            if(blockShape[r][c] === 1){

                // ブロックの絶対位置
                const boardRow = targetRow + r;
                const boardCol = targetCol + c;

                // 床との衝突チェック
                if(boardRow >= BOARD_ROWS){
                    return true; 
                }

                // 左右の壁との衝突チェック
                // moveright,moveleftのチェックもここで行う
                if(boardCol < 0 || boardCol >= BOARD_COLS){
                    return true; 
                }

                // ボードの上端を超えていないかチェック
                if(boardRow < 0){
                    continue;
                }

                // 既存ブロックとの衝突チェック
                if(window.board[boardRow][boardCol] !== 0){
                    return true;
                }
            }
        }
    }

    return false;
}

const stop = () => {
    let row = currentBlock.row;
    let col = currentBlock.col;
    for(let r = 0; r < currentBlock.shape.length; r++){
        for(let c = 0; c < currentBlock.shape[0].length; c++){
            if(currentBlock.shape[r][c] == 1) {
                window.board[row+r][col+c] = currentBlock.type + 1;
            }
        }
    }
}

// 行削除とスコア加点処理
const clearLines = () => {
    let lineCleared = 0;
    const ROWS = window.board.length;
    const COLUMNS = window.board[0].length;

    // 盤面を上から下へ走査
    for(let r = ROWS-1; r>=0; r--){
        let isRowFull = true;

        // 行が埋まっているかチェック
        for(let c = 0; c < COLUMNS; c++){
            if(window.board[r][c] === 0){
                isRowFull = false;
                break;
            }
        }

        if(isRowFull){
            lineCleared++;

            // 行を削除、上の行をシフトダウン
            // r行目から上を1行ずつしたにコピー
            for(let k = r; k > 0; k--){
                window.board[k] = window.board[k-1];
            }
            // 最上行を新しいカラの行にする
            window.board[0] = new Array(COLUMNS).fill(0);

            // 行が削除され、上の行がシフトダウンしたため
            // 現在の行（r）を再度チェックする必要がある
            r++;
        }
    }

    if(lineCleared > 0){
        score += lineCleared;
        updateScoreDisplay();
    }
}

const rotateBlock = (shape) => {
    const rows = shape.length;
    const cols = shape[0].length;

    // 回転後の新しい形状を格納する配列
    const newShape = [];
    for(let c = 0; c < cols ; c++){
        newShape[c] = new Array(rows).fill(0);
    }

    // 90度右回転
    for(let r =0 ; r < rows ; r++){
        for(let c = 0; c < cols; c++){
            newShape[c][rows -1 - r] = shape[r][c];
        }
    }

    return newShape;
}

const drop = () => {
    // 次の行で衝突するかをチェック
    // 衝突する場合、ブロックを固定し、新しいブロックを生成
    if(checkCollision(currentBlock,currentBlock.row+1,currentBlock.col)){
        stop();

        clearLines();

        // 新しいブロックをnextBlockから取得
        let nextBlockSpawn = nextBlock; //nextブロックをスポーン予定のブロックとして一時保存
        nextBlock = getRandomBlock();

        // ゲームオーバー判定
        if(checkCollision(nextBlockSpawn,nextBlockSpawn.row,nextBlockSpawn.col)){
            currentBlock = nextBlockSpawn;
            drawBlock();
            clearInterval(dropInterval);
            alert("GAME OVER!");
            return;
        }
        currentBlock = nextBlockSpawn;
    }else{ // 衝突しない場合、一マス下へ移動
        currentBlock.row++;
    }

    window.drawBoard();
    drawBlock();
    drawNextBlock();
}

// グローバル関数として公開
window.drop = drop;

const moveRight = document.querySelector('#move-right');
const moveLeft = document.querySelector('#move-left');

// 右ボタン押下時のイベント
moveRight.addEventListener('click', () => {
    // 右端との衝突チェック
    const nextCol = currentBlock.col + 1;
    if(!checkCollision(currentBlock,currentBlock.row,nextCol)){
        currentBlock.col = nextCol; // 衝突しない場合は移動
    }

    window.drawBoard();    
    drawBlock();
})

// 左ボタン押下時のイベント
moveLeft.addEventListener('click', () => {
    // 左端との衝突チェック
    const nextCol = currentBlock.col -1;
    if(!checkCollision(currentBlock,currentBlock.row,nextCol)){
        currentBlock.col = nextCol;
    }

    window.drawBoard();
    drawBlock();
})

// 回転ボタン押下のイベント
const rotateButton = document.querySelector('#rotate');

rotateButton.addEventListener('click', () => {
    // 回転後の形状を取得
    const newShape = rotateBlock(currentBlock.shape);

    // 一時的に回転後のオブジェクトに置き換え、衝突チェックを行う。
    const tempBlock = {
        row: currentBlock.row,
        col: currentBlock.col,
        shape: newShape,
        type: currentBlock.type, 
    };
    if(!checkCollision(tempBlock,currentBlock.row,currentBlock.col)){
        currentBlock.shape = newShape; // 衝突がなければ置き換え
    }

    window.drawBoard();
    drawBlock();
})

