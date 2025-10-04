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
        row: 0,
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

const drop = () => {
    currentBlock.row++;
    window.drawBoard();
    drawBlock();
    if(checkCollision()){
        stop();
        drawBlock();
        currentBlock = getRandomBlock();
    }
}

// グローバル関数として公開
window.drop = drop;
