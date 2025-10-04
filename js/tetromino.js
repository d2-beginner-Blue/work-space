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

const getRandomBlock = () => {
    const index = Math.floor(Math.random() * BLOCKS.length);
    return {
        row: -1,
        col: 4,
        shape: BLOCKS[index],
        type: index
    };
}

// 現在のブロックを格納
let currentBlock = getRandomBlock();

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
                context.strokeStyle = 'black';
                context.strokeRect(
                    (currentBlock.col + c) * BLOCK_SIZE,
                    (currentBlock.row + r) * BLOCK_SIZE,
                    BLOCK_SIZE, BLOCK_SIZE
                );
            }
        });
    });
}

const checkCollision = () => {
    let row = currentBlock.row;
    let col = currentBlock.col;
    let height = currentBlock.shape.length;
    let width = currentBlock.shape[0].length;
    let y = 0;
    let x = 0;

    // blockの底辺がboardの底辺を超える場合はture
    if(row + height >= window.board.length) {
        // console.log(`collision : over boards height`);
        return true;
    }

    for(let h = height; h > 0; h--){
        for(let w = width; w > 0; w--){
            // currentBlockのいづれかのマスが他のブロックに衝突する場合はtrue
            if(currentBlock.shape[y][x] == 1 && window.board[row + 1][col] == 1) {
                // console.log(`collision : collision with other blocks`);
                // console.log(`blockPos : y = ${row}, x = ${col} ,value = ${currentBlock.shape[y][x]}`);
                // console.log(`blockCell : y = ${x}, x = ${y} ,value = ${currentBlock.shape[y][x]}`);
                // console.log(`boardPos : y = ${row + 1}, x = ${col} ,value = ${window.board[row + 1][col]}`);
                return true;
            }
            col++;
            x++;
        }
        // 次の行へ移る際にパラメータをリセット
        col = currentBlock.col;
        x = 0;
        row++;
        y++;
    }
    //console.log("No Collision");
    return false;
}

const stop = () => {
    let row = currentBlock.row;
    let col = currentBlock.col;
    for(let r = 0; r < currentBlock.shape.length; r++){
        for(let c = 0; c < currentBlock.shape[0].length; c++){
            if(currentBlock.shape[r][c] == 1) window.board[row+r][col+c] = 1;
        }
    }
}

// ゲームオーバー判定
const checkGameOver = (newBlock) => {
    const blockShape = newBlock.shape;
    const blockRow = newBlock.row;
    const blockCol = newBlock.col;

    for(let r = 0; r < blockShape.length; r++){
        for(let c = 0; c < blockShape[0].length; c++){
            if(
                blockShape[r][c] === 1 &&
                window.board[blockRow + r] &&
                window.board[blockRow + r][blockCol + c] === 1
            ){
                return true; // 衝突している　＝　ゲームオーバー
            }
        }
    }

    return false; // 衝突なし
}

const drop = () => {
    currentBlock.row++;
    window.drawBoard();
    drawBlock();
    if(checkCollision()){
        stop();
        window.drawBoard();

        nextBlock = getRandomBlock();
        // TODO: gameover時の最上のブロックが表示された後にalertが出たり、表示される前にalertが出たりする。
        if (checkGameOver(nextBlock)){
            alert("GAME OVER!");
            clearInterval(dropInterval); // main.jsに定義されているインターバルを停止する
            window.location.reload(); // OKが押されたらブラウザをリフレッシュ
            return;
        }
        currentBlock = nextBlock;
    }
}

// グローバル関数として公開
window.drop = drop;

const moveRight = document.querySelector('#move-right');
const moveLeft = document.querySelector('#move-left');

// 右ボタン押下時のイベント
moveRight.addEventListener('click', () => {
    // ■が枠外にいかないようにしないといけない
    // つまり、右端のindexが10以上になる場合は、移動処理しない。
    const boardWidth = currentBlock.shape[0].length;
    let rightEdge = currentBlock.col + boardWidth;
    if(rightEdge < 10){
        currentBlock.col += 1;
    }else{
        //　右端到達し、処理なし
    }

    window.drawBoard();    
    drawBlock();
})

// 左ボタン押下時のイベント
moveLeft.addEventListener('click', () => {
    // 左端のインデックスが0以下になる場合は、移動処理しない
    let leftEdge = currentBlock.col;
    if(leftEdge > 0){
        currentBlock.col -= 1;
    }else{
        //　左端到達し、処理なし
    }
    window.drawBoard();
    drawBlock();
})