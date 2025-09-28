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

const drop = () => {
    currentBlock.row++;
    window.drawBoard();
    drawBlock();
}

// グローバル関数として公開
window.drop = drop;
