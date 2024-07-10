function renderGrid() {
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    for (let i = 0; i < GRID_SIZE; i++) {
        const row = document.createElement('div');
        row.style.display = 'flex';
        for (let j = 0; j < GRID_SIZE; j++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.onclick = () => handleTileClick(i, j);
            updateTileContent(tile, grid[i][j]);
            row.appendChild(tile);
        }
        gridContainer.appendChild(row);
    }
}

function updateTileContent(tileElement, tileType) {
    tileElement.textContent = '';
    tileElement.className = 'tile';
    tileElement.style.backgroundColor = '';
    tileElement.style.color = 'white';

    const isConveyor = tileType >= TILE_TYPES.CONVEYOR_RIGHT && tileType <= TILE_TYPES.CONVEYOR_UP;
    const isConverter = tileType >= TILE_TYPES.CONVERT_CRIMSON_RIGHT && tileType <= TILE_TYPES.CONVERT_WHITE_UP;
    const isCreator = tileType >= TILE_TYPES.CREATE_BLUE_RIGHT && tileType <= TILE_TYPES.CREATE_PURPLE_UP;

    if (isConveyor) {
        tileElement.classList.add('conveyor');
    }

    if (isConverter) {
        const color = ['crimson', 'blue', 'yellow', 'white'][(tileType - TILE_TYPES.CONVERT_CRIMSON_RIGHT) >> 2];
        const direction = ['⇉', '⇊', '⇇', '⇈'][(tileType - TILE_TYPES.CONVERT_CRIMSON_RIGHT) % 4];
        tileElement.style.backgroundColor = color;
        tileElement.style.color = color === 'yellow' || color === 'white' ? 'black' : 'white';
        tileElement.textContent = `${direction}`;
    } else if (isCreator) {
        const color = ['blue', 'crimson', 'yellow', 'green', 'orange', 'white', 'purple'][(tileType - TILE_TYPES.CREATE_BLUE_RIGHT) >> 2];
        const direction = ['►', '▼', '◄', '▲'][(tileType - TILE_TYPES.CREATE_BLUE_RIGHT) % 4];
        tileElement.style.backgroundColor = color;
        tileElement.style.color = color === 'yellow' || color === 'white' || color === 'orange' ? 'black' : 'white';
        tileElement.textContent = `${direction}`;
    } else {
        switch (tileType) {
            case TILE_TYPES.CONVEYOR_RIGHT:
                tileElement.textContent = '→';
                break;
            case TILE_TYPES.CONVEYOR_DOWN:
                tileElement.textContent = '↓';
                break;
            case TILE_TYPES.CONVEYOR_LEFT:
                tileElement.textContent = '←';
                break;
            case TILE_TYPES.CONVEYOR_UP:
                tileElement.textContent = '↑';
                break;
            case TILE_TYPES.END_CRIMSON:
            case TILE_TYPES.END_GREEN:
            case TILE_TYPES.END_BLUE:
            case TILE_TYPES.END_YELLOW:
            case TILE_TYPES.END_PURPLE:
            case TILE_TYPES.END_ORANGE:
            case TILE_TYPES.END_WHITE:
                tileElement.textContent = '◯';
                tileElement.style.backgroundColor = getEndTileColor(tileType);
                tileElement.style.color = ['yellow', 'white', 'orange'].includes(getEndTileColor(tileType)) ? 'black' : 'white';
                break;
            case TILE_TYPES.WALL:
                tileElement.classList.add('wall');
                break;
            case TILE_TYPES.DIRECTION_CHANGE_RIGHT_DOWN:
            case TILE_TYPES.DIRECTION_CHANGE_RIGHT_UP:
            case TILE_TYPES.DIRECTION_CHANGE_RIGHT_LEFT:
            case TILE_TYPES.DIRECTION_CHANGE_LEFT_DOWN:
            case TILE_TYPES.DIRECTION_CHANGE_LEFT_UP:
            case TILE_TYPES.DIRECTION_CHANGE_LEFT_RIGHT:
            case TILE_TYPES.DIRECTION_CHANGE_DOWN_RIGHT:
            case TILE_TYPES.DIRECTION_CHANGE_DOWN_LEFT:
            case TILE_TYPES.DIRECTION_CHANGE_DOWN_UP:
            case TILE_TYPES.DIRECTION_CHANGE_UP_RIGHT:
            case TILE_TYPES.DIRECTION_CHANGE_UP_LEFT:
            case TILE_TYPES.DIRECTION_CHANGE_UP_DOWN:
                tileElement.classList.add('direction-change');
                const currentArrow = document.createElement('span');
                currentArrow.className = 'current-direction';
                const nextArrow = document.createElement('span');
                nextArrow.className = 'next-direction';
                const [curr, next] = getDirectionChangeArrows(tileType);
                currentArrow.textContent = curr;
                nextArrow.textContent = next;
                tileElement.appendChild(currentArrow);
                tileElement.appendChild(nextArrow);
                break;
        }
    }
}

function getDirectionChangeArrows(tileType) {
    const arrowMap = {
        [TILE_TYPES.DIRECTION_CHANGE_RIGHT_DOWN]: ['→', '↓'],
        [TILE_TYPES.DIRECTION_CHANGE_RIGHT_UP]: ['→', '↑'],
        [TILE_TYPES.DIRECTION_CHANGE_RIGHT_LEFT]: ['→', '←'],
        [TILE_TYPES.DIRECTION_CHANGE_LEFT_DOWN]: ['←', '↓'],
        [TILE_TYPES.DIRECTION_CHANGE_LEFT_UP]: ['←', '↑'],
        [TILE_TYPES.DIRECTION_CHANGE_LEFT_RIGHT]: ['←', '→'],
        [TILE_TYPES.DIRECTION_CHANGE_DOWN_RIGHT]: ['↓', '→'],
        [TILE_TYPES.DIRECTION_CHANGE_DOWN_LEFT]: ['↓', '←'],
        [TILE_TYPES.DIRECTION_CHANGE_DOWN_UP]: ['↓', '↑'],
        [TILE_TYPES.DIRECTION_CHANGE_UP_RIGHT]: ['↑', '→'],
        [TILE_TYPES.DIRECTION_CHANGE_UP_LEFT]: ['↑', '←'],
        [TILE_TYPES.DIRECTION_CHANGE_UP_DOWN]: ['↑', '↓'],
    };
    return arrowMap[tileType] || ['', ''];
}

function renderInventory() {
    const inventoryGrid = document.getElementById('inventory-grid');
    inventoryGrid.innerHTML = '';
    for (const [tileType, count] of Object.entries(inventory)) {
        const item = document.createElement('div');
        item.className = 'inventory-item';
        if (parseInt(tileType) === selectedTile) {
            item.classList.add('selected');
        }
        const tile = document.createElement('div');
        tile.className = 'tile';
        updateTileContent(tile, parseInt(tileType));
        tile.onclick = () => handleInventoryClick(parseInt(tileType));
        item.appendChild(tile);
        const countSpan = document.createElement('span');
        countSpan.textContent = `x${count}`;
        item.appendChild(countSpan);

        const modifyQuantityDiv = document.createElement('div');
        modifyQuantityDiv.className = 'modify-quantity';
        const increaseButton = document.createElement('button');
        increaseButton.textContent = '+';
        increaseButton.onclick = () => modifyInventoryQuantity(tileType, 1);
        const decreaseButton = document.createElement('button');
        decreaseButton.textContent = '-';
        decreaseButton.onclick = () => modifyInventoryQuantity(tileType, -1);
        modifyQuantityDiv.appendChild(increaseButton);
        modifyQuantityDiv.appendChild(decreaseButton);
        item.appendChild(modifyQuantityDiv);

        inventoryGrid.appendChild(item);
    }
}

function renderObjects() {
    const gridContainer = document.getElementById('grid-container');
    const tiles = gridContainer.querySelectorAll('.tile');
    
    // Remove all existing objects
    tiles.forEach(tile => {
        const objectElement = tile.querySelector('.object');
        if (objectElement) {
            objectElement.remove();
        }
    });

    // Add new objects
    objects.forEach(obj => {
        const tileIndex = obj.row * GRID_SIZE + obj.col;
        const tile = tiles[tileIndex];
        const objectElement = document.createElement('div');
        objectElement.className = 'object';
        objectElement.style.backgroundColor = obj.color;
        tile.appendChild(objectElement);
    });
}
function handleInventoryClick(tileType) {
    if (inventory[tileType] > 0) {
        selectedTile = tileType;
        renderInventory();
    }
}

function modifyInventoryQuantity(tileType, amount) {
    inventory[tileType] = Math.max(0, inventory[tileType] + amount);
    renderInventory();
}

function clearInventory() {
    for (const tileType in inventory) {
        inventory[tileType] = 0;
    }
    renderInventory();
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the game
    initializeGrid();
    renderObjects();

    // Set up event listeners for buttons
    document.getElementById('start-btn').addEventListener('click', startSimulation);
    document.getElementById('stop-btn').addEventListener('click', stopSimulation);
    document.getElementById('reset-btn').addEventListener('click', resetGame);
    document.getElementById('undo-btn').addEventListener('click', undo);
    document.getElementById('play-again-btn').addEventListener('click', resetGame);
    document.getElementById('save-btn').addEventListener('click', saveLevel);
    document.getElementById('load-btn').addEventListener('click', () => document.getElementById('file-input').click());
    document.getElementById('file-input').addEventListener('change', loadLevel);
    document.getElementById('clear-inventory-btn').addEventListener('click', clearInventory);
    document.getElementById('crimson-goal').addEventListener('input', updateGoals);
    document.getElementById('green-goal').addEventListener('input', updateGoals);
    document.getElementById('blue-goal').addEventListener('input', updateGoals);
    document.getElementById('yellow-goal').addEventListener('input', updateGoals);
    document.getElementById('purple-goal').addEventListener('input', updateGoals);
    document.getElementById('orange-goal').addEventListener('input', updateGoals);
    document.getElementById('white-goal').addEventListener('input', updateGoals);
    document.getElementById('crimson-waste-limit').addEventListener('input', updateWasteLimits);
    document.getElementById('green-waste-limit').addEventListener('input', updateWasteLimits);
    document.getElementById('blue-waste-limit').addEventListener('input', updateWasteLimits);
    document.getElementById('yellow-waste-limit').addEventListener('input', updateWasteLimits);
    document.getElementById('purple-waste-limit').addEventListener('input', updateWasteLimits);
    document.getElementById('orange-waste-limit').addEventListener('input', updateWasteLimits);
    document.getElementById('white-waste-limit').addEventListener('input', updateWasteLimits);
});
