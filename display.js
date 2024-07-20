
function renderGrid() {
    console.log("Rendering grid. Grid state:", grid);

    const GRID_SIZE = 12; // Ensure grid size is always 12x12

    if (!grid || !Array.isArray(grid) || grid.length !== GRID_SIZE) {
        console.error("Grid is invalid or not 12x12");
        return;
    }

    const gridContainer = document.getElementById('grid-container');
    if (!gridContainer) {
        console.error("Grid container not found");
        return;
    }

    gridContainer.innerHTML = '';
    for (let i = 0; i < GRID_SIZE; i++) {
        const row = document.createElement('div');
        row.style.display = 'flex';
        for (let j = 0; j < GRID_SIZE; j++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.onclick = () => handleTileClick(i, j);
            updateTileContent(tile, grid[i][j] || TILE_TYPES.EMPTY, i, j);
            row.appendChild(tile);
        }
        gridContainer.appendChild(row);
    }
}
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (theme === 'colorblind') {
        isColorBlindMode = true;
        document.body.setAttribute('data-colorblind', 'true');
    } else {
        isColorBlindMode = false;
        document.body.setAttribute('data-colorblind', 'false');
    }

    localStorage.setItem('colorBlindMode', isColorBlindMode);
    renderGrid();
    renderInventory();
    renderObjects();
}
let isColorBlindMode = false;
const colorBlindNumbers = {
    'white': '0',
    'blue': '1',
    'crimson': '3',
    'yellow': '5',
    'orange': '8',
    'purple': '4',
    'green': '6'
};
function getColorForTileType(tileType) {
    if (tileType >= TILE_TYPES.CONVERT_CRIMSON_RIGHT && tileType <= TILE_TYPES.CONVERT_WHITE_UP) {
        const colors = ['crimson', 'blue', 'yellow', 'white'];
        return colors[(tileType - TILE_TYPES.CONVERT_CRIMSON_RIGHT) >> 2];
    } else if (tileType >= TILE_TYPES.CREATE_BLUE_RIGHT && tileType <= TILE_TYPES.CREATE_PURPLE_UP) {
        const colors = ['blue', 'crimson', 'yellow', 'green', 'orange', 'white', 'purple'];
        return colors[(tileType - TILE_TYPES.CREATE_BLUE_RIGHT) >> 2];
    } else if (tileType >= TILE_TYPES.END_CRIMSON && tileType <= TILE_TYPES.END_WHITE) {
        const colors = ['crimson', 'green', 'blue', 'yellow', 'purple', 'orange', 'white'];
        return colors[tileType - TILE_TYPES.END_CRIMSON];
    }
    return null;
}
// Add this function to toggle color blind mode
function toggleColorBlindMode() {
    isColorBlindMode = !isColorBlindMode;
    document.body.setAttribute('data-colorblind', isColorBlindMode);
    renderGrid();
    renderInventory();
    renderObjects();
}
function loadTheme() {
    const theme = localStorage.getItem('theme') || 'dark';
    setTheme(theme);
    document.getElementById('theme-select').value = theme;

    // Load color blind mode state
    isColorBlindMode = localStorage.getItem('colorBlindMode') === 'true';
    document.body.setAttribute('data-colorblind', isColorBlindMode);
    renderGrid();
    renderInventory();
    renderObjects();
}

function createAndDisplayGif() {
    console.log('createAndDisplayGif called');
    
    if (frames.length === 0) {
        console.error('No frames captured. Please run the simulation before exporting GIF.');
        alert('No frames captured. Please run the simulation before exporting the GIF.');
        return;
    }
    
    console.log(`Creating GIF with ${frames.length} frames`);
    
    const loadingAnimation = document.getElementById('loading-animation');
    const exportedGif = document.getElementById('exported-gif');
    const gifContainer = document.getElementById('gif-container');
    const loadingFill = document.querySelector('.loading-fill');
    const loadingText = document.querySelector('.loading-text');
    const loadingSquare = document.querySelector('.loading-square');
    
    loadingAnimation.style.display = 'block';
    gifContainer.style.display = 'block';
    exportedGif.style.display = 'none';
    loadingSquare.classList.add('active');

    const gif = new GIF({
        workers: 2,
        quality: 10,
        width: frames[0].width,
        height: frames[0].height
    });

    frames.forEach(frame => {
        const img = document.createElement('img');
        img.src = frame;
        gif.addFrame(img, {delay: 50});
    });

    gif.on('progress', (p) => {
        const percent = Math.round(p * 100);
        loadingFill.style.height = `${percent}%`;
        loadingText.textContent = `${percent}%`;
    });

    gif.on('finished', (blob) => {
        loadingAnimation.style.display = 'none';
        exportedGif.src = URL.createObjectURL(blob);
        exportedGif.style.display = 'block';
        loadingSquare.classList.remove('active');
    });

    gif.render();
}




function renderScoresWaste() {
    const scoresWasteContainer = document.getElementById('scores-waste');
    scoresWasteContainer.innerHTML = '';

    const colors = ['blue', 'crimson', 'yellow', 'purple', 'green', 'orange', 'white'];
    const emojis = ['🔵', '🔴', '🟡',  '🟣','🟢', '🟠', '⚪'];

    colors.forEach((color, index) => {
        const colorStats = document.createElement('div');
        colorStats.className = 'color-stats';
        colorStats.innerHTML = `
            <span class="emoji">${emojis[index]}</span> ${color.charAt(0).toUpperCase() + color.slice(1)}
            <div>Goal: <span id="${color}-score">${scores[color]}</span>/<input type="number" id="${color}-goal" value="${goals[color]}" min="0" ${isInFreeMode ? '' : 'disabled'}></div>
            <div>Waste: <span id="${color}-waste">${waste[color]}</span>/<input type="number" id="${color}-waste-limit" value="${wasteLimits[color]}" min="0" ${isInFreeMode ? '' : 'disabled'}></div>
        `;
        scoresWasteContainer.appendChild(colorStats);

        // Add event listeners for the input fields
        const goalInput = colorStats.querySelector(`#${color}-goal`);
        const wasteLimitInput = colorStats.querySelector(`#${color}-waste-limit`);

        goalInput.addEventListener('change', () => {
            goals[color] = parseInt(goalInput.value) || 0;
            updateGoals();
        });

        wasteLimitInput.addEventListener('change', () => {
            wasteLimits[color] = parseInt(wasteLimitInput.value) || 0;
            updateWasteLimits();
        });
    });
}

function updateTileContent(tileElement, tileType, row, col) {
    tileElement.textContent = '';
    tileElement.className = 'tile';
    tileElement.style.backgroundColor = '';
    tileElement.style.color = 'white';

    const isConveyor = tileType >= TILE_TYPES.CONVEYOR_RIGHT && tileType <= TILE_TYPES.CONVEYOR_UP;
    const isConverter = tileType >= TILE_TYPES.CONVERT_CRIMSON_RIGHT && tileType <= TILE_TYPES.CONVERT_WHITE_UP;
    const isCreator = tileType >= TILE_TYPES.CREATE_BLUE_RIGHT && tileType <= TILE_TYPES.CREATE_PURPLE_UP;
    const isPortal = tileType >= TILE_TYPES.PORTAL_RIGHT && tileType <= TILE_TYPES.PORTAL_UP;
    const isLockTile = tileType >= TILE_TYPES.LOCK_RIGHT && tileType <= TILE_TYPES.LOCK_UP;
    const isEndTile = tileType >= TILE_TYPES.END_CRIMSON && tileType <= TILE_TYPES.END_WHITE;

    if (isConveyor) {
        tileElement.classList.add('conveyor');
        const arrows = ['→', '↓', '←', '↑'];
        tileElement.textContent = arrows[tileType - TILE_TYPES.CONVEYOR_RIGHT];
    } else if (isConverter || isCreator || isEndTile) {
        const colors = isConverter ? ['crimson', 'blue', 'yellow', 'white'] :
                       isCreator ? ['blue', 'crimson', 'yellow', 'green', 'orange', 'white', 'purple'] :
                       ['crimson', 'green', 'blue', 'yellow', 'purple', 'orange', 'white'];
        const colorIndex = isConverter ? (tileType - TILE_TYPES.CONVERT_CRIMSON_RIGHT) >> 2 :
                           isCreator ? (tileType - TILE_TYPES.CREATE_BLUE_RIGHT) >> 2 :
                           tileType - TILE_TYPES.END_CRIMSON;
        const color = colors[colorIndex];
        tileElement.style.backgroundColor = color;
        tileElement.style.color = ['yellow', 'white', 'orange'].includes(color) ? 'black' : 'white';

        if (isConverter) {
            const arrows = ['⇉', '⇊', '⇇', '⇈'];
            tileElement.textContent = arrows[(tileType - TILE_TYPES.CONVERT_CRIMSON_RIGHT) % 4];
        } else if (isCreator) {
            const arrows = ['►', '▼', '◄', '▲'];
            tileElement.textContent = arrows[(tileType - TILE_TYPES.CREATE_BLUE_RIGHT) % 4];
        } else if (isEndTile) {
            tileElement.textContent = '◯';
        }

        if (isColorBlindMode) {
            const colorBlindNumber = document.createElement('span');
            colorBlindNumber.className = 'colorblind-number';
            colorBlindNumber.textContent = colorBlindNumbers[color];
            tileElement.appendChild(colorBlindNumber);
        }
    } else if (isPortal) {
        tileElement.classList.add('portal');
        tileElement.style.backgroundColor = '#0000'; // Semi-transparent black
        
        let portalColor = '#00fffb'; // Default cyan color
        let portalNumber = '';
        
        for (let number in portalPairs) {
            if (portalPairs[number].some(portal => portal.row === row && portal.col === col)) {
                portalNumber = number;
                // Check if this is the second portal in the pair
                const isSecondPortal = portalPairs[number][1] && 
                                       portalPairs[number][1].row === row && 
                                       portalPairs[number][1].col === col;
                if (isSecondPortal) {
                    portalColor = 'orange';
                }
                break;
            }
        }
        
        // Set the color for all portal elements
        tileElement.style.color = portalColor;
        
        // Add portal symbol
        const symbol = document.createElement('span');
        symbol.className = 'portal-symbol';
        symbol.textContent = '⦿';
        tileElement.appendChild(symbol);
        
        // Add an arrow to indicate direction
        const arrow = document.createElement('span');
        arrow.className = 'portal-direction';
        const arrows = ['→', '↓', '←', '↑'];
        arrow.textContent = arrows[tileType - TILE_TYPES.PORTAL_RIGHT];
        tileElement.appendChild(arrow);

        // Add portal number
        if (portalNumber !== '') {
            const numberElement = document.createElement('span');
            numberElement.className = 'portal-number';
            numberElement.textContent = portalNumber;
            tileElement.appendChild(numberElement);
        }
    } else if (isLockTile) {
        tileElement.classList.add('lock-tile');
        const arrows = ['→', '↓', '←', '↑'];
        tileElement.textContent = arrows[tileType - TILE_TYPES.LOCK_RIGHT];
        tileElement.style.backgroundColor = isSimulating && isLocked ? 'red' : 'lime';
        tileElement.style.color = 'black';
    } else if (isDirectionChangeTile(tileType)) {
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

        // Add specific classes for different direction change tiles
        if (tileType === TILE_TYPES.DIRECTION_CHANGE_LEFT_RIGHT || 
            tileType === TILE_TYPES.DIRECTION_CHANGE_RIGHT_LEFT) {
            tileElement.classList.add('left-right');
        } else if (tileType === TILE_TYPES.DIRECTION_CHANGE_UP_DOWN || 
                   tileType === TILE_TYPES.DIRECTION_CHANGE_DOWN_UP) {
            tileElement.classList.add('up-down');
        }

        const key = `${row},${col}`;
        if (isSimulating && isLocked && key in lockedDirections) {
            tileElement.classList.add('locked');
            // Show only the current direction (green arrow) when locked
            nextArrow.style.display = 'none';
            currentArrow.style.color = 'lime';
            // Update the current arrow to show the locked direction
            currentArrow.textContent = getDirectionArrow(lockedDirections[key]);
        } else {
            tileElement.classList.remove('locked');
            nextArrow.style.display = 'block';
            currentArrow.style.color = 'lime';
            nextArrow.style.color = 'red';
        }
    } else if (tileType === TILE_TYPES.WALL) {
        tileElement.classList.add('wall');
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
function getDirectionArrow(direction) {
    switch (direction) {
        case 'right': return '→';
        case 'down': return '↓';
        case 'left': return '←';
        case 'up': return '↑';
        default: return '→'; // Default arrow if something goes wrong
    }
}

function renderInventory() {
    const inventoryGrid = document.getElementById('inventory-grid');
    inventoryGrid.innerHTML = '';
    
    for (const tileType in TILE_TYPES) {
        const tileTypeValue = TILE_TYPES[tileType];
        
        if (tileTypeValue === TILE_TYPES.EMPTY) continue;
        
        const count = inventory[tileTypeValue] || 0;
        
        if (count === 0 && !isInFreeMode) continue;

        const item = document.createElement('div');
        item.className = 'inventory-item';
        if (tileTypeValue === selectedTile) {
            item.classList.add('selected');
        }
        
        const tile = document.createElement('div');
        tile.className = 'tile';
        updateTileContent(tile, tileTypeValue);
        tile.onclick = () => handleInventoryClick(tileTypeValue);
        
        if (isColorBlindMode) {
            const color = getColorForTileType(tileTypeValue);
            if (color) {
                const colorBlindLabel = document.createElement('span');
               
                colorBlindLabel.textContent = colorBlindNumbers[color];
                
            }
        }
        
        item.appendChild(tile);
        
        const countSpan = document.createElement('span');
        countSpan.textContent = `x${count}`;
        item.appendChild(countSpan);

        if (isInFreeMode) {
            const modifyQuantity = document.createElement('div');
            modifyQuantity.className = 'modify-quantity';
            
            const decreaseBtn = document.createElement('button');
            decreaseBtn.textContent = '-';
            decreaseBtn.dataset.tileType = tileTypeValue;
            
            const increaseBtn = document.createElement('button');
            increaseBtn.textContent = '+';
            increaseBtn.dataset.tileType = tileTypeValue;
            
            modifyQuantity.appendChild(decreaseBtn);
            modifyQuantity.appendChild(increaseBtn);
            item.appendChild(modifyQuantity);
        }

        inventoryGrid.appendChild(item);
    }

    console.log("Rendered inventory:", inventory);
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
        
        if (isColorBlindMode) {
            const colorBlindLabel = document.createElement('span');
            colorBlindLabel.className = 'colorblind-label';
            colorBlindLabel.textContent = colorBlindNumbers[obj.color];
            objectElement.appendChild(colorBlindLabel);
        }
        
        tile.appendChild(objectElement);
    });

    if (isPaused) {
        const rewindSlider = document.getElementById('rewind-slider');
        rewindSlider.value = currentStep;
        rewindSlider.max = gameStates.length - 1; // Ensure max is always up to date
    }
}
function handleInventoryClick(tileType) {
    if (inventory[tileType] > 0) {
        if (selectedTile === tileType) {
            // If the clicked tile is already selected, deselect it
            selectedTile = null;
        } else {
            // Otherwise, select the new tile
            selectedTile = tileType;
        }
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

function showSeedModal(seed) {
    const modal = document.getElementById('seed-modal');
    const seedText = document.getElementById('seed-text');
    const closeBtn = document.getElementsByClassName('close')[0];
    const copyBtn = document.getElementById('copy-seed');
    const copyFeedback = document.getElementById('copy-feedback');

    seedText.value = seed;
    modal.style.display = 'block';

    closeBtn.onclick = function() {
        modal.style.display = 'none';
        copyFeedback.style.display = 'none'; // Hide feedback when closing modal
    }

    copyBtn.onclick = function() {
        seedText.select();
        document.execCommand('copy');
        copyFeedback.style.display = 'inline'; // Show feedback
        setTimeout(() => {
            copyFeedback.style.display = 'none'; // Hide feedback after 3 seconds
        }, 3000);
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            copyFeedback.style.display = 'none'; // Hide feedback when closing modal
        }
    }
}

function showLoadSeedModal() {
    const modal = document.getElementById('load-seed-modal');
    if (!modal) {
        console.error("Load seed modal element not found");
        return;
    }

    const closeBtn = modal.querySelector('.close');
    if (!closeBtn) {
        console.error("Close button not found in load seed modal");
        return;
    }

    const loadBtn = document.getElementById('load-seed-btn');
    if (!loadBtn) {
        console.error("Load seed button not found");
        return;
    }

    const seedText = document.getElementById('load-seed-text');
    if (!seedText) {
        console.error("Seed text area not found");
        return;
    }

    modal.style.display = 'block';
    seedText.value = ''; // Clear any previous input

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    loadBtn.onclick = function() {
        const seed = seedText.value.trim();
        if (seed) {
            try {
                loadLevelFromSeed(seed);
                modal.style.display = 'none';
            } catch (error) {
                console.error("Error loading seed:", error);
                alert("Invalid seed. Please try again.");
            }
        } else {
            alert("Please enter a seed.");
        }
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}
document.addEventListener('DOMContentLoaded', function() {
    const tutorialBtn = document.getElementById('tutorial-btn');
    const tutorialModal = document.getElementById('tutorial-modal');
    const closeBtn = tutorialModal.querySelector('.close');

    tutorialBtn.onclick = function() {
        tutorialModal.style.display = 'block';
    }

    closeBtn.onclick = function() {
        tutorialModal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == tutorialModal) {
            tutorialModal.style.display = 'none';
        }
    }

    if (typeof html2canvas === 'undefined') {
        console.error('html2canvas library is not loaded. Please make sure it is included in your HTML file.');
        alert('An error occurred: html2canvas library is missing. Please contact the developer.');
    } else {
        console.log('html2canvas library is loaded successfully.');
    }
    // Initialize the game
    initializeGame();

    initializeGrid();
    renderObjects();
    populateLevelSelect();
    updateResetClearButton();
    const pauseBtn = document.getElementById('pause-btn');
    const rewindSlider = document.getElementById('rewind-slider');
    // Set up event listeners for buttons
    const addListener = (id, event, handler) => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener(event, handler);
        }
    };
    pauseBtn.addEventListener('click', function() {
        if (isPaused) {
            resumeSimulation();
        } else {
            pauseSimulation();
        }
    });
    setupWinScreenButtons();
    const colorBlindToggle = document.getElementById('colorblind-toggle');
    if (colorBlindToggle) {
        colorBlindToggle.addEventListener('click', toggleColorBlindMode);
    }

    rewindSlider.addEventListener('input', function() {
        rewindTo(parseInt(this.value));
    });
    const optionsMenuBtn = document.getElementById('options-menu-btn');
    const optionsMenu = document.getElementById('options-menu');

    optionsMenuBtn.addEventListener('click', function() {
        optionsMenu.classList.toggle('show');
    });

    // Close the dropdown menu if the user clicks outside of it
    window.addEventListener('click', function(event) {
        if (!event.target.matches('#options-menu-btn')) {
            if (optionsMenu.classList.contains('show')) {
                optionsMenu.classList.remove('show');
            }
        }
    });

    addListener('start-btn', 'click', startSimulation);
    addListener('stop-btn', 'click', stopSimulation);
    document.addEventListener('mouseup', handleInventoryMouseUp);
    setupLossScreenButton(); 
    
    addListener('undo-btn', 'click', undo);
    addListener('play-again-btn', 'click', resetGame);
    addListener('try-again-btn', 'click', resetGame);
    addListener('export-gif-btn', 'click', function() {
        const chartsContainer = document.getElementById('charts-container');
        const statsContainer = document.getElementById('win-stats');
        if (chartsContainer) chartsContainer.style.display = 'none';
        if (statsContainer) statsContainer.style.display = 'none';
        createAndDisplayGif();
    });
    document.getElementById('export-seed-btn').addEventListener('click', exportLevelSeed);

    // Add event listener for level select
    const levelSelect = document.getElementById('level-select');
    if (levelSelect) {
        levelSelect.addEventListener('change', (event) => {
            if (event.target.value) {
                loadLevel(event.target.value);
            }
        });
    }

    // Ensure loss screen is hidden on initial load
    document.getElementById('loss-screen').style.display = 'none';
    updateResetClearButton();
    const eraserBtn = document.getElementById('eraser-btn');
    if (eraserBtn) {
        eraserBtn.addEventListener('click', toggleEraser);
    }
    updateEditorButton();
    loadTheme();
    document.getElementById('theme-select').addEventListener('change', function() {
        setTheme(this.value);
    });
    
});

function updateSimulationControls(isSimulating) {
    document.getElementById('start-btn').disabled = isSimulating;
    document.getElementById('reset-clear-btn').disabled = isSimulating;
    document.getElementById('eraser-btn').disabled = isSimulating;
    document.getElementById('stop-btn').disabled = !isSimulating;
    document.getElementById('import-seed-btn').addEventListener('click', importLevelSeed);
    document.getElementById('options-menu-btn').disabled = isSimulating;
    document.getElementById('pause-btn').disabled = !isSimulating;

    document.getElementById('rewind-slider').disabled = !isPaused;
    document.getElementById('undo-btn').disabled = isSimulating;
    document.getElementById('level-select').disabled = isSimulating;
    document.querySelectorAll('#goal-controls input, #waste-limit-controls input').forEach(input => {
        input.addEventListener('change', () => {
            updateGoals();
            updateWasteLimits();
        });
    });
    
}