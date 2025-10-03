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
        console.log(`collision : over boards height`);
        return true;
    }

    for(let h = height; h > 0; h--){
        for(let w = width; w > 0; w--){
            // currentBlockのいづれかのマスが他のブロックに衝突する場合はtrue
            if(currentBlock.shape[y][x] !== 0 && window.board[row + h][col] !== 0) {
                console.log(`collision : collision with other blocks`);
                return true;
            }
            col++;
            x++;
        }
        col = currentBlock.col;
        row++;
        y++;
    }
    console.log("No Collision");
    return false;
}

const drop = () => {
    currentBlock.row++;
    window.drawBoard();
    drawBlock();
    checkCollision();
}

// グローバル関数として公開
window.drop = drop;
