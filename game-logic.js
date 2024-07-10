const GRID_SIZE = 12;
const GENERATOR_INTERVAL = 5;
const MAX_UNDO_STEPS = 10;

const TILE_TYPES = {
    EMPTY: 0,
    CONVEYOR_RIGHT: 1,
    CONVEYOR_DOWN: 2,
    CONVEYOR_LEFT: 3,
    CONVEYOR_UP: 4,
    CREATE_BLUE_RIGHT: 5,
    CREATE_BLUE_DOWN: 6,
    CREATE_BLUE_LEFT: 7,
    CREATE_BLUE_UP: 8,
    CREATE_CRIMSON_RIGHT: 9,
    CREATE_CRIMSON_DOWN: 10,
    CREATE_CRIMSON_LEFT: 11,
    CREATE_CRIMSON_UP: 12,
    CREATE_YELLOW_RIGHT: 13,
    CREATE_YELLOW_DOWN: 14,
    CREATE_YELLOW_LEFT: 15,
    CREATE_YELLOW_UP: 16,
    CREATE_GREEN_RIGHT: 17,
    CREATE_GREEN_DOWN: 18,
    CREATE_GREEN_LEFT: 19,
    CREATE_GREEN_UP: 20,
    CREATE_ORANGE_RIGHT: 21,
    CREATE_ORANGE_DOWN: 22,
    CREATE_ORANGE_LEFT: 23,
    CREATE_ORANGE_UP: 24,
    CREATE_WHITE_RIGHT: 25,
    CREATE_WHITE_DOWN: 26,
    CREATE_WHITE_LEFT: 27,
    CREATE_WHITE_UP: 28,
    CREATE_PURPLE_RIGHT: 29,
    CREATE_PURPLE_DOWN: 30,
    CREATE_PURPLE_LEFT: 31,
    CREATE_PURPLE_UP: 32,
    CONVERT_CRIMSON_RIGHT: 33,
    CONVERT_CRIMSON_DOWN: 34,
    CONVERT_CRIMSON_LEFT: 35,
    CONVERT_CRIMSON_UP: 36,
    CONVERT_BLUE_RIGHT: 37,
    CONVERT_BLUE_DOWN: 38,
    CONVERT_BLUE_LEFT: 39,
    CONVERT_BLUE_UP: 40,
    CONVERT_YELLOW_RIGHT: 41,
    CONVERT_YELLOW_DOWN: 42,
    CONVERT_YELLOW_LEFT: 43,
    CONVERT_YELLOW_UP: 44,
    CONVERT_WHITE_RIGHT: 45,
    CONVERT_WHITE_DOWN: 46,
    CONVERT_WHITE_LEFT: 47,
    CONVERT_WHITE_UP: 48,
    END_CRIMSON: 49,
    END_GREEN: 50,
    END_BLUE: 51,
    END_YELLOW: 52,
    END_PURPLE: 53,
    END_ORANGE: 54,
    END_WHITE: 55,
    WALL: 56,
    DIRECTION_CHANGE_RIGHT_DOWN: 57,
    DIRECTION_CHANGE_RIGHT_UP: 58,
    DIRECTION_CHANGE_RIGHT_LEFT: 59,
    DIRECTION_CHANGE_LEFT_DOWN: 60,
    DIRECTION_CHANGE_LEFT_UP: 61,
    DIRECTION_CHANGE_LEFT_RIGHT: 62,
    DIRECTION_CHANGE_DOWN_RIGHT: 63,
    DIRECTION_CHANGE_DOWN_LEFT: 64,
    DIRECTION_CHANGE_DOWN_UP: 65,
    DIRECTION_CHANGE_UP_RIGHT: 66,
    DIRECTION_CHANGE_UP_LEFT: 67,
    DIRECTION_CHANGE_UP_DOWN: 68,
};

let grid = [];
let inventory = {
    [TILE_TYPES.CONVEYOR_RIGHT]: 10,
    [TILE_TYPES.CONVEYOR_DOWN]: 10,
    [TILE_TYPES.CONVEYOR_LEFT]: 10,
    [TILE_TYPES.CONVEYOR_UP]: 10,
    [TILE_TYPES.CONVERT_CRIMSON_RIGHT]: 5,
    [TILE_TYPES.CONVERT_CRIMSON_DOWN]: 5,
    [TILE_TYPES.CONVERT_CRIMSON_LEFT]: 5,
    [TILE_TYPES.CONVERT_CRIMSON_UP]: 5,
    [TILE_TYPES.CONVERT_BLUE_RIGHT]: 5,
    [TILE_TYPES.CONVERT_BLUE_DOWN]: 5,
    [TILE_TYPES.CONVERT_BLUE_LEFT]: 5,
    [TILE_TYPES.CONVERT_BLUE_UP]: 5,
    [TILE_TYPES.CONVERT_YELLOW_RIGHT]: 5,
    [TILE_TYPES.CONVERT_YELLOW_DOWN]: 5,
    [TILE_TYPES.CONVERT_YELLOW_LEFT]: 5,
    [TILE_TYPES.CONVERT_YELLOW_UP]: 5,
    [TILE_TYPES.CONVERT_WHITE_RIGHT]: 5,
    [TILE_TYPES.CONVERT_WHITE_DOWN]: 5,
    [TILE_TYPES.CONVERT_WHITE_LEFT]: 5,
    [TILE_TYPES.CONVERT_WHITE_UP]: 5,
    [TILE_TYPES.CREATE_BLUE_RIGHT]: 3,
    [TILE_TYPES.CREATE_BLUE_DOWN]: 3,
    [TILE_TYPES.CREATE_BLUE_LEFT]: 3,
    [TILE_TYPES.CREATE_BLUE_UP]: 3,
    [TILE_TYPES.CREATE_CRIMSON_RIGHT]: 3,
    [TILE_TYPES.CREATE_CRIMSON_DOWN]: 3,
    [TILE_TYPES.CREATE_CRIMSON_LEFT]: 3,
    [TILE_TYPES.CREATE_CRIMSON_UP]: 3,
    [TILE_TYPES.CREATE_YELLOW_RIGHT]: 3,
    [TILE_TYPES.CREATE_YELLOW_DOWN]: 3,
    [TILE_TYPES.CREATE_YELLOW_LEFT]: 3,
    [TILE_TYPES.CREATE_YELLOW_UP]: 3,
    [TILE_TYPES.CREATE_GREEN_RIGHT]: 3,
    [TILE_TYPES.CREATE_GREEN_DOWN]: 3,
    [TILE_TYPES.CREATE_GREEN_LEFT]: 3,
    [TILE_TYPES.CREATE_GREEN_UP]: 3,
    [TILE_TYPES.CREATE_ORANGE_RIGHT]: 3,
    [TILE_TYPES.CREATE_ORANGE_DOWN]: 3,
    [TILE_TYPES.CREATE_ORANGE_LEFT]: 3,
    [TILE_TYPES.CREATE_ORANGE_UP]: 3,
    [TILE_TYPES.CREATE_WHITE_RIGHT]: 3,
    [TILE_TYPES.CREATE_WHITE_DOWN]: 3,
    [TILE_TYPES.CREATE_WHITE_LEFT]: 3,
    [TILE_TYPES.CREATE_WHITE_UP]: 3,
    [TILE_TYPES.CREATE_PURPLE_RIGHT]: 3,
    [TILE_TYPES.CREATE_PURPLE_DOWN]: 3,
    [TILE_TYPES.CREATE_PURPLE_LEFT]: 3,
    [TILE_TYPES.CREATE_PURPLE_UP]: 3,
    [TILE_TYPES.END_CRIMSON]: 3,
    [TILE_TYPES.END_GREEN]: 3,
    [TILE_TYPES.END_BLUE]: 3,
    [TILE_TYPES.END_YELLOW]: 3,
    [TILE_TYPES.END_PURPLE]: 3,
    [TILE_TYPES.END_ORANGE]: 3,
    [TILE_TYPES.END_WHITE]: 3,
    [TILE_TYPES.WALL]: 10,
};
let selectedTile = null;
let objects = [];
let isSimulating = false;
let intervalId = null;
let history = [];
let scores = { crimson: 0, green: 0, blue: 0, yellow: 0, purple: 0, orange: 0, white: 0 };
let goals = { crimson: 5, green: 5, blue: 5, yellow: 5, purple: 5, orange: 5, white: 5 };
let waste = { crimson: 0, green: 0, blue: 0, yellow: 0, purple: 0, orange: 0, white: 0 };
let wasteLimits = { crimson: 10, green: 10, blue: 10, yellow: 10, purple: 10, orange: 10, white: 10 };
let generatorCounters = {};

function initializeGrid() {
    grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(TILE_TYPES.EMPTY));
    history = [{ grid: JSON.parse(JSON.stringify(grid)), inventory: { ...inventory } }];
    renderGrid();
    renderInventory();
    updateScores();
    updateWaste();
}

function handleTileClick(row, col) {
    if (selectedTile) {
        const currentTile = grid[row][col];
        const isConveyor = (tileType) => tileType >= TILE_TYPES.CONVEYOR_RIGHT && tileType <= TILE_TYPES.CONVEYOR_UP;
        
        if (isConveyor(selectedTile) && isConveyor(currentTile) && currentTile !== selectedTile) {
            // Create direction change tile
            let newTile;
            switch (currentTile) {
                case TILE_TYPES.CONVEYOR_RIGHT:
                    switch (selectedTile) {
                        case TILE_TYPES.CONVEYOR_DOWN:
                            newTile = TILE_TYPES.DIRECTION_CHANGE_RIGHT_DOWN;
                            break;
                        case TILE_TYPES.CONVEYOR_UP:
                            newTile = TILE_TYPES.DIRECTION_CHANGE_RIGHT_UP;
                            break;
                        case TILE_TYPES.CONVEYOR_LEFT:
                            newTile = TILE_TYPES.DIRECTION_CHANGE_RIGHT_LEFT;
                            break;
                    }
                    break;
                case TILE_TYPES.CONVEYOR_LEFT:
                    switch (selectedTile) {
                        case TILE_TYPES.CONVEYOR_DOWN:
                            newTile = TILE_TYPES.DIRECTION_CHANGE_LEFT_DOWN;
                            break;
                        case TILE_TYPES.CONVEYOR_UP:
                            newTile = TILE_TYPES.DIRECTION_CHANGE_LEFT_UP;
                            break;
                        case TILE_TYPES.CONVEYOR_RIGHT:
                            newTile = TILE_TYPES.DIRECTION_CHANGE_LEFT_RIGHT;
                            break;
                    }
                    break;
                case TILE_TYPES.CONVEYOR_DOWN:
                    switch (selectedTile) {
                        case TILE_TYPES.CONVEYOR_RIGHT:
                            newTile = TILE_TYPES.DIRECTION_CHANGE_DOWN_RIGHT;
                            break;
                        case TILE_TYPES.CONVEYOR_LEFT:
                            newTile = TILE_TYPES.DIRECTION_CHANGE_DOWN_LEFT;
                            break;
                        case TILE_TYPES.CONVEYOR_UP:
                            newTile = TILE_TYPES.DIRECTION_CHANGE_DOWN_UP;
                            break;
                    }
                    break;
                case TILE_TYPES.CONVEYOR_UP:
                    switch (selectedTile) {
                        case TILE_TYPES.CONVEYOR_RIGHT:
                            newTile = TILE_TYPES.DIRECTION_CHANGE_UP_RIGHT;
                            break;
                        case TILE_TYPES.CONVEYOR_LEFT:
                            newTile = TILE_TYPES.DIRECTION_CHANGE_UP_LEFT;
                            break;
                        case TILE_TYPES.CONVEYOR_DOWN:
                            newTile = TILE_TYPES.DIRECTION_CHANGE_UP_DOWN;
                            break;
                    }
                    break;
            }
            grid[row][col] = newTile;
            inventory[selectedTile]--;
        } else if (currentTile === TILE_TYPES.EMPTY && inventory[selectedTile] > 0) {
            grid[row][col] = selectedTile;
            inventory[selectedTile]--;
        } else if (currentTile !== TILE_TYPES.EMPTY && !isConveyor(selectedTile)) {
            inventory[currentTile]++;
            grid[row][col] = TILE_TYPES.EMPTY;
        }
        
        history.push({ grid: JSON.parse(JSON.stringify(grid)), inventory: { ...inventory } });
        if (history.length > MAX_UNDO_STEPS) {
            history.shift();
        }

        renderGrid();
        renderInventory();
        document.getElementById('undo-btn').disabled = false;
    }
}

function convertColor(currentColor, converterType) {
    const converterColor = ['crimson', 'blue', 'yellow', 'white'][(converterType - TILE_TYPES.CONVERT_CRIMSON_RIGHT) >> 2];
    const conversionTable = {
        'blue': { 'crimson': 'purple', 'yellow': 'green', 'white': 'white' },
        'crimson': { 'blue': 'purple', 'yellow': 'orange', 'white': 'white' },
        'yellow': { 'crimson': 'orange', 'blue': 'green', 'white': 'white' },
        'white': { 'crimson': 'crimson', 'yellow': 'yellow', 'blue': 'blue' },
        'purple': { 'blue': 'purple', 'crimson': 'purple', 'yellow': 'purple', 'white': 'white' },
        'orange': { 'blue': 'orange', 'crimson': 'orange', 'yellow': 'orange', 'white': 'white' },
        'green': { 'blue': 'green', 'crimson': 'green', 'yellow': 'green', 'white': 'white' }
    };
    return conversionTable[currentColor][converterColor] || currentColor;
}

function moveObjects() {
    const newObjects = objects.map(obj => {
        const { row, col, color } = obj;
        let newRow = row;
        let newCol = col;
        let newColor = color;

        const currentTile = grid[row][col];
        const isConverter = currentTile >= TILE_TYPES.CONVERT_CRIMSON_RIGHT && currentTile <= TILE_TYPES.CONVERT_WHITE_UP;
        const isCreator = currentTile >= TILE_TYPES.CREATE_BLUE_RIGHT && currentTile <= TILE_TYPES.CREATE_PURPLE_UP;
        const isEnd = currentTile >= TILE_TYPES.END_CRIMSON && currentTile <= TILE_TYPES.END_WHITE;

        if (isConverter) {
            newColor = convertColor(color, currentTile);
            const direction = (currentTile - TILE_TYPES.CONVERT_CRIMSON_RIGHT) % 4;
            switch (direction) {
                case 0: newCol = Math.min(col + 1, GRID_SIZE - 1); break;
                case 1: newRow = Math.min(row + 1, GRID_SIZE - 1); break;
                case 2: newCol = Math.max(col - 1, 0); break;
                case 3: newRow = Math.max(row - 1, 0); break;
            }
        } else if (isCreator) {
            // Objects on creator tiles go to waste
            waste[color]++;
            updateWaste();
            checkLossCondition();
            return null;
        } else if (isEnd) {
            if (color === getEndTileColor(currentTile)) {
                scores[color]++;
                updateScores();
                checkWinCondition();
                return null;
            } else {
                // Wrong color reached the end, count as waste and despawn
                waste[color]++;
                updateWaste();
                checkLossCondition();
                return null;
            }
        } else if (currentTile === TILE_TYPES.EMPTY) {
            // Objects on empty tiles go to waste
            waste[color]++;
            updateWaste();
            checkLossCondition();
            return null;
        } else {
            let nextTile;
            switch (currentTile) {
                case TILE_TYPES.CONVEYOR_RIGHT:
                    nextTile = grid[row][Math.min(col + 1, GRID_SIZE - 1)];
                    if (nextTile !== TILE_TYPES.WALL) {
                        newCol = Math.min(col + 1, GRID_SIZE - 1);
                    }
                    break;
                case TILE_TYPES.CONVEYOR_DOWN:
                    nextTile = grid[Math.min(row + 1, GRID_SIZE - 1)][col];
                    if (nextTile !== TILE_TYPES.WALL) {
                        newRow = Math.min(row + 1, GRID_SIZE - 1);
                    }
                    break;
                case TILE_TYPES.CONVEYOR_LEFT:
                    nextTile = grid[row][Math.max(col - 1, 0)];
                    if (nextTile !== TILE_TYPES.WALL) {
                        newCol = Math.max(col - 1, 0);
                    }
                    break;
                case TILE_TYPES.CONVEYOR_UP:
                    nextTile = grid[Math.max(row - 1, 0)][col];
                    if (nextTile !== TILE_TYPES.WALL) {
                        newRow = Math.max(row - 1, 0);
                    }
                    break;
                case TILE_TYPES.DIRECTION_CHANGE_RIGHT_DOWN:
                    grid[row][col] = TILE_TYPES.DIRECTION_CHANGE_DOWN_RIGHT;
                    nextTile = grid[Math.min(row + 1, GRID_SIZE - 1)][col];
                    if (nextTile !== TILE_TYPES.WALL) {
                        newRow = Math.min(row + 1, GRID_SIZE - 1);
                    }
                    break;
                case TILE_TYPES.DIRECTION_CHANGE_RIGHT_UP:
                    grid[row][col] = TILE_TYPES.DIRECTION_CHANGE_UP_RIGHT;
                    nextTile = grid[Math.max(row - 1, 0)][col];
                    if (nextTile !== TILE_TYPES.WALL) {
                        newRow = Math.max(row - 1, 0);
                    }
                    break;
                case TILE_TYPES.DIRECTION_CHANGE_RIGHT_LEFT:
                    grid[row][col] = TILE_TYPES.DIRECTION_CHANGE_LEFT_RIGHT;
                    nextTile = grid[row][Math.max(col - 1, 0)];
                    if (nextTile !== TILE_TYPES.WALL) {
                        newCol = Math.max(col - 1, 0);
                    }
                    break;
                case TILE_TYPES.DIRECTION_CHANGE_LEFT_DOWN:
                    grid[row][col] = TILE_TYPES.DIRECTION_CHANGE_DOWN_LEFT;
                    nextTile = grid[Math.min(row + 1, GRID_SIZE - 1)][col];
                    if (nextTile !== TILE_TYPES.WALL) {
                        newRow = Math.min(row + 1, GRID_SIZE - 1);
                    }
                    break;
                case TILE_TYPES.DIRECTION_CHANGE_LEFT_UP:
                    grid[row][col] = TILE_TYPES.DIRECTION_CHANGE_UP_LEFT;
                    nextTile = grid[Math.max(row - 1, 0)][col];
                    if (nextTile !== TILE_TYPES.WALL) {
                        newRow = Math.max(row - 1, 0);
                    }
                    break;
                case TILE_TYPES.DIRECTION_CHANGE_LEFT_RIGHT:
                    grid[row][col] = TILE_TYPES.DIRECTION_CHANGE_RIGHT_LEFT;
                    nextTile = grid[row][Math.min(col + 1, GRID_SIZE - 1)];
                    if (nextTile !== TILE_TYPES.WALL) {
                        newCol = Math.min(col + 1, GRID_SIZE - 1);
                    }
                    break;
                case TILE_TYPES.DIRECTION_CHANGE_DOWN_RIGHT:
                    grid[row][col] = TILE_TYPES.DIRECTION_CHANGE_RIGHT_DOWN;
                    nextTile = grid[row][Math.min(col + 1, GRID_SIZE - 1)];
                    if (nextTile !== TILE_TYPES.WALL) {
                        newCol = Math.min(col + 1, GRID_SIZE - 1);
                    }
                    break;
                case TILE_TYPES.DIRECTION_CHANGE_DOWN_LEFT:
                    grid[row][col] = TILE_TYPES.DIRECTION_CHANGE_LEFT_DOWN;
                    nextTile = grid[row][Math.max(col - 1, 0)];
                    if (nextTile !== TILE_TYPES.WALL) {
                        newCol = Math.max(col - 1, 0);
                    }
                    break;
                case TILE_TYPES.DIRECTION_CHANGE_DOWN_UP:
                    grid[row][col] = TILE_TYPES.DIRECTION_CHANGE_UP_DOWN;
                    nextTile = grid[Math.max(row - 1, 0)][col];
                    if (nextTile !== TILE_TYPES.WALL) {
                        newRow = Math.max(row - 1, 0);
                    }
                    break;
                case TILE_TYPES.DIRECTION_CHANGE_UP_RIGHT:
                    grid[row][col] = TILE_TYPES.DIRECTION_CHANGE_RIGHT_UP;
                    nextTile = grid[row][Math.min(col + 1, GRID_SIZE - 1)];
                    if (nextTile !== TILE_TYPES.WALL) {
                        newCol = Math.min(col + 1, GRID_SIZE - 1);
                    }
                    break;
                case TILE_TYPES.DIRECTION_CHANGE_UP_LEFT:
                    grid[row][col] = TILE_TYPES.DIRECTION_CHANGE_LEFT_UP;
                    nextTile = grid[row][Math.max(col - 1, 0)];
                    if (nextTile !== TILE_TYPES.WALL) {
                        newCol = Math.max(col - 1, 0);
                    }
                    break;
                case TILE_TYPES.DIRECTION_CHANGE_UP_DOWN:
                    grid[row][col] = TILE_TYPES.DIRECTION_CHANGE_DOWN_UP;
                    nextTile = grid[Math.min(row + 1, GRID_SIZE - 1)][col];
                    if (nextTile !== TILE_TYPES.WALL) {
                        newRow = Math.min(row + 1, GRID_SIZE - 1);
                    }
                    break;
            }
        }

        // Check if new position is out of bounds
        if (newRow < 0 || newRow >= GRID_SIZE || newCol < 0 || newCol >= GRID_SIZE) {
            waste[color]++;
            updateWaste();
            checkLossCondition();
            return null;
        }

        // Check if new position is an empty tile or a creator tile
        const newTile = grid[newRow][newCol];
        if (newTile === TILE_TYPES.EMPTY || (newTile >= TILE_TYPES.CREATE_BLUE_RIGHT && newTile <= TILE_TYPES.CREATE_PURPLE_UP)) {
            waste[color]++;
            updateWaste();
            checkLossCondition();
            return null;
        }

        return { row: newRow, col: newCol, color: newColor };
    }).filter(Boolean);

    grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell >= TILE_TYPES.CREATE_BLUE_RIGHT && cell <= TILE_TYPES.CREATE_PURPLE_UP) {
                const generatorKey = `${rowIndex},${colIndex}`;
                if (!(generatorKey in generatorCounters)) {
                    generatorCounters[generatorKey] = 0;
                }
                
                generatorCounters[generatorKey]++;
                
                if (generatorCounters[generatorKey] >= GENERATOR_INTERVAL) {
                    generatorCounters[generatorKey] = 0;
                    const color = getCreatorColor(cell);
                    const direction = (cell - TILE_TYPES.CREATE_BLUE_RIGHT) % 4;
                    let newRow = rowIndex;
                    let newCol = colIndex;
                    switch (direction) {
                        case 0: newCol = Math.min(colIndex + 1, GRID_SIZE - 1); break;
                        case 1: newRow = Math.min(rowIndex + 1, GRID_SIZE - 1); break;
                        case 2: newCol = Math.max(colIndex - 1, 0); break;
                        case 3: newRow = Math.max(rowIndex - 1, 0); break;
                    }
                    newObjects.push({ row: newRow, col: newCol, color });
                }
            }
        });
    });

    objects = newObjects;
    renderObjects();
    renderGrid(); // Update direction change tiles
}

function getEndTileColor(tileType) {
    switch (tileType) {
        case TILE_TYPES.END_CRIMSON: return 'crimson';
        case TILE_TYPES.END_GREEN: return 'green';
        case TILE_TYPES.END_BLUE: return 'blue';
        case TILE_TYPES.END_YELLOW: return 'yellow';
        case TILE_TYPES.END_PURPLE: return 'purple';
        case TILE_TYPES.END_ORANGE: return 'orange';
        case TILE_TYPES.END_WHITE: return 'white';
        default: return null;
    }
}

function getCreatorColor(tileType) {
    const colors = ['blue', 'crimson', 'yellow', 'green', 'orange', 'white', 'purple'];
    return colors[(tileType - TILE_TYPES.CREATE_BLUE_RIGHT) >> 2];
}

function startSimulation() {
    if (!isSimulating) {
        isSimulating = true;
        intervalId = setInterval(() => {
            moveObjects();
            renderObjects();
        }, 200);
        document.getElementById('start-btn').disabled = true;
        document.getElementById('stop-btn').disabled = false;
        document.getElementById('undo-btn').disabled = true;
    }
}

function stopSimulation() {
    if (isSimulating) {
        isSimulating = false;
        clearInterval(intervalId);
        document.getElementById('start-btn').disabled = false;
        document.getElementById('stop-btn').disabled = true;
        document.getElementById('undo-btn').disabled = false;
        
        // Clear all circles on the grid
        objects = [];
        renderObjects();
    }
}

function resetGame() {
    stopSimulation();
    initializeGrid();
    objects = [];
    scores = { crimson: 0, green: 0, blue: 0, yellow: 0, purple: 0, orange: 0, white: 0 };
    waste = { crimson: 0, green: 0, blue: 0, yellow: 0, purple: 0, orange: 0, white: 0 };
    inventory = {
        [TILE_TYPES.CONVEYOR_RIGHT]: 10,
        [TILE_TYPES.CONVEYOR_DOWN]: 10,
        [TILE_TYPES.CONVEYOR_LEFT]: 10,
        [TILE_TYPES.CONVEYOR_UP]: 10,
        [TILE_TYPES.CONVERT_CRIMSON_RIGHT]: 5,
        [TILE_TYPES.CONVERT_CRIMSON_DOWN]: 5,
        [TILE_TYPES.CONVERT_CRIMSON_LEFT]: 5,
        [TILE_TYPES.CONVERT_CRIMSON_UP]: 5,
        [TILE_TYPES.CONVERT_BLUE_RIGHT]: 5,
        [TILE_TYPES.CONVERT_BLUE_DOWN]: 5,
        [TILE_TYPES.CONVERT_BLUE_LEFT]: 5,
        [TILE_TYPES.CONVERT_BLUE_UP]: 5,
        [TILE_TYPES.CONVERT_YELLOW_RIGHT]: 5,
        [TILE_TYPES.CONVERT_YELLOW_DOWN]: 5,
        [TILE_TYPES.CONVERT_YELLOW_LEFT]: 5,
        [TILE_TYPES.CONVERT_YELLOW_UP]: 5,
        [TILE_TYPES.CONVERT_WHITE_RIGHT]: 5,
        [TILE_TYPES.CONVERT_WHITE_DOWN]: 5,
        [TILE_TYPES.CONVERT_WHITE_LEFT]: 5,
        [TILE_TYPES.CONVERT_WHITE_UP]: 5,
        [TILE_TYPES.CREATE_BLUE_RIGHT]: 3,
        [TILE_TYPES.CREATE_BLUE_DOWN]: 3,
        [TILE_TYPES.CREATE_BLUE_LEFT]: 3,
        [TILE_TYPES.CREATE_BLUE_UP]: 3,
        [TILE_TYPES.CREATE_CRIMSON_RIGHT]: 3,
        [TILE_TYPES.CREATE_CRIMSON_DOWN]: 3,
        [TILE_TYPES.CREATE_CRIMSON_LEFT]: 3,
        [TILE_TYPES.CREATE_CRIMSON_UP]: 3,
        [TILE_TYPES.CREATE_YELLOW_RIGHT]: 3,
        [TILE_TYPES.CREATE_YELLOW_DOWN]: 3,
        [TILE_TYPES.CREATE_YELLOW_LEFT]: 3,
        [TILE_TYPES.CREATE_YELLOW_UP]: 3,
        [TILE_TYPES.CREATE_GREEN_RIGHT]: 3,
        [TILE_TYPES.CREATE_GREEN_DOWN]: 3,
        [TILE_TYPES.CREATE_GREEN_LEFT]: 3,
        [TILE_TYPES.CREATE_GREEN_UP]: 3,
        [TILE_TYPES.CREATE_ORANGE_RIGHT]: 3,
        [TILE_TYPES.CREATE_ORANGE_DOWN]: 3,
        [TILE_TYPES.CREATE_ORANGE_LEFT]: 3,
        [TILE_TYPES.CREATE_ORANGE_UP]: 3,
        [TILE_TYPES.CREATE_WHITE_RIGHT]: 3,
        [TILE_TYPES.CREATE_WHITE_DOWN]: 3,
        [TILE_TYPES.CREATE_WHITE_LEFT]: 3,
        [TILE_TYPES.CREATE_WHITE_UP]: 3,
        [TILE_TYPES.CREATE_PURPLE_RIGHT]: 3,
        [TILE_TYPES.CREATE_PURPLE_DOWN]: 3,
        [TILE_TYPES.CREATE_PURPLE_LEFT]: 3,
        [TILE_TYPES.CREATE_PURPLE_UP]: 3,
        [TILE_TYPES.END_CRIMSON]: 3,
        [TILE_TYPES.END_GREEN]: 3,
        [TILE_TYPES.END_BLUE]: 3,
        [TILE_TYPES.END_YELLOW]: 3,
        [TILE_TYPES.END_PURPLE]: 3,
        [TILE_TYPES.END_ORANGE]: 3,
        [TILE_TYPES.END_WHITE]: 3,
        [TILE_TYPES.WALL]: 10,
    };
    history = [];
    generatorCounters = {};
    renderGrid();
    renderInventory();
    updateScores();
    updateWaste();
    renderObjects();
    document.getElementById('undo-btn').disabled = true;
    document.getElementById('win-screen').style.display = 'none';
}

function undo() {
    if (history.length > 1 && !isSimulating) {
        history.pop();
        const previousState = history[history.length - 1];
        grid = JSON.parse(JSON.stringify(previousState.grid));
        inventory = { ...previousState.inventory };
        renderGrid();
        renderInventory();
        if (history.length <= 1) {
            document.getElementById('undo-btn').disabled = true;
        }
    }
}

function updateScores() {
    for (const color in scores) {
        document.getElementById(`${color}-score`).textContent = scores[color];
        document.getElementById(`${color}-goal`).value = goals[color];
    }
}

function updateWaste() {
    for (const color in waste) {
        document.getElementById(`${color}-waste`).textContent = waste[color];
        document.getElementById(`${color}-waste-limit`).value = wasteLimits[color];
    }
}

function updateGoals() {
    goals = {
        crimson: parseInt(document.getElementById('crimson-goal').value) || 0,
        green: parseInt(document.getElementById('green-goal').value) || 0,
        blue: parseInt(document.getElementById('blue-goal').value) || 0,
        yellow: parseInt(document.getElementById('yellow-goal').value) || 0,
        purple: parseInt(document.getElementById('purple-goal').value) || 0,
        orange: parseInt(document.getElementById('orange-goal').value) || 0,
        white: parseInt(document.getElementById('white-goal').value) || 0,
    };
}

function updateWasteLimits() {
    wasteLimits = {
        crimson: parseInt(document.getElementById('crimson-waste-limit').value) || 0,
        green: parseInt(document.getElementById('green-waste-limit').value) || 0,
        blue: parseInt(document.getElementById('blue-waste-limit').value) || 0,
        yellow: parseInt(document.getElementById('yellow-waste-limit').value) || 0,
        purple: parseInt(document.getElementById('purple-waste-limit').value) || 0,
        orange: parseInt(document.getElementById('orange-waste-limit').value) || 0,
        white: parseInt(document.getElementById('white-waste-limit').value) || 0,
    };
    updateWaste();
}

function checkWinCondition() {
    const allGoalsReached = Object.keys(goals).every(color => scores[color] >= goals[color]);
    if (allGoalsReached) {
        stopSimulation();
        document.getElementById('win-screen').style.display = 'flex';
    }
}

function checkLossCondition() {
    const wasteLimitExceeded = Object.keys(waste).some(color => waste[color] > wasteLimits[color]);
    if (wasteLimitExceeded) {
        stopSimulation();
        alert("Game Over: Waste limit exceeded!");
        // You might want to implement a more sophisticated game over screen
    }
}

function saveLevel() {
    updateGoals();
    updateWasteLimits();
    const gridContent = grid.map(row => row.join(',')).join('\n');
    const inventoryContent = Object.entries(inventory).map(([key, value]) => `${key}:${value}`).join(',');
    const goalsContent = Object.entries(goals).map(([key, value]) => `${key}:${value}`).join(',');
    const wasteLimitsContent = Object.entries(wasteLimits).map(([key, value]) => `${key}:${value}`).join(',');
    const csvContent = `${gridContent}\n${inventoryContent}\n${goalsContent}\n${wasteLimitsContent}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'level.csv';
    a.click();
    URL.revokeObjectURL(url);
}

function loadLevel(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const csvContent = e.target.result.trim();
        const lines = csvContent.split('\n');
        
        const gridSize = lines.length - 3; // Grid content, inventory, goals, and waste limits
        const gridContent = lines.slice(0, gridSize);
        const inventoryContent = lines[gridSize];
        const goalsContent = lines[gridSize + 1];
        const wasteLimitsContent = lines[gridSize + 2];

        grid = gridContent.map(row => row.split(',').map(Number));
        
        inventory = {};
        inventoryContent.split(',').forEach(item => {
            const [key, value] = item.split(':');
            inventory[parseInt(key)] = parseInt(value);
        });
        
        goals = {};
        goalsContent.split(',').forEach(item => {
            const [key, value] = item.split(':');
            goals[key] = parseInt(value);
        });

        wasteLimits = {};
        wasteLimitsContent.split(',').forEach(item => {
            const [key, value] = item.split(':');
            wasteLimits[key] = parseInt(value);
        });
        
        renderGrid();
        renderInventory();
        updateScores();
        updateWaste();
        renderObjects();
    };
    reader.readAsText(file);
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the game
    initializeGrid();
    renderObjects();

});
