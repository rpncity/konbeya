const GRID_SIZE = 12;
const GENERATOR_INTERVAL = 5;
const MAX_UNDO_STEPS = 10;
let frames = [];
let originalGrid = [];
let isCapturingFrames = false;
let stepCount = 0;
let tilesUsed = 0;
let gameStates = [];
let isPaused = false;
let currentStep = 0;
let inventoryIntervalId = null;
const CLICK_DELAY = 250; // ms
const REPEAT_DELAY = 50; // ms


let previousSolutions = JSON.parse(localStorage.getItem('previousSolutions')) || [];
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
    PORTAL_RIGHT: 69,
    PORTAL_DOWN: 70,
    PORTAL_LEFT: 71,
    PORTAL_UP: 72,
    LOCK_RIGHT: 73,
    LOCK_DOWN: 74,
    LOCK_LEFT: 75,
    LOCK_UP: 76
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
    [TILE_TYPES.PORTAL_RIGHT]: 5,
    [TILE_TYPES.LOCK_RIGHT]: 3,
    [TILE_TYPES.LOCK_DOWN]: 4,
    [TILE_TYPES.LOCK_LEFT]: 5,
    [TILE_TYPES.LOCK_UP]: 6
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
let portalPairs = {};
let nextPortalNumber = 1;
let initialState; 
let isInFreeMode = true;
function initializeInventory() {
    // Ensure all tile types (except EMPTY) are represented in the inventory
    for (const tileType in TILE_TYPES) {
        const tileTypeValue = TILE_TYPES[tileType];
        if (tileTypeValue !== TILE_TYPES.EMPTY && !(tileTypeValue in inventory)) {
            inventory[tileTypeValue] = 0;
        }
    }

    // Add lock tiles to the inventory
  

    // Remove items with zero quantity if not in free mode
    if (!isInFreeMode) {
        for (const tileType in inventory) {
            if (inventory[tileType] === 0) {
                delete inventory[tileType];
            }
        }
    }

    console.log("Initialized inventory:", inventory);
}
function initializeGame() {
    if (isInFreeMode) {
        initializeFreeMode();
    } else {
        initializeGrid();
    }
    renderGrid();
    renderInventory();
    renderScoresWaste();
    updateScores();
    updateWaste();
    renderObjects();
    updateUndoButton();
    updateFreeModeUI();
    updateEditorButton();
}
function initializeGame() {
    if (isInFreeMode) {
        initializeFreeMode();
    } else {
        initializeGrid();
    }
    renderGrid();
    renderInventory();
    renderScoresWaste();
    updateScores();
    updateWaste();
    renderObjects();
    updateUndoButton();
    updateFreeModeUI();
    updateEditorButton();
    updateResetClearButton(); // Add this line
}
function loadLevelFromSeed(seed) {
    const csvContent = base32Decode(seed);
    loadLevelFromCSV(csvContent);
    isInFreeMode = false;
    initializeInventory();
    renderInventory();
    updateFreeModeUI();
}

function showLoadSeedModal() {
    const modal = document.getElementById('load-seed-modal');
    const closeBtn = modal.getElementsByClassName('close')[0];
    const loadBtn = document.getElementById('load-seed-btn');
    const seedText = document.getElementById('load-seed-text');

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


function exportLevelSeed() {
    if (!isInFreeMode) return;
    const modal = document.getElementById('seed-modal');
    const gridContent = grid.map(row => row.join(',')).join('\n');
    const inventoryContent = Object.entries(inventory).map(([key, value]) => `${key}:${value}`).join(',');
    const goalsContent = Object.entries(goals).map(([key, value]) => `${key}:${value}`).join(',');
    const wasteLimitsContent = Object.entries(wasteLimits).map(([key, value]) => `${key}:${value}`).join(',');
    const closeBtn = modal.getElementsByClassName('close')[0];
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }
    
    // Add portal pairs information
    const portalPairsContent = Object.entries(portalPairs)
        .map(([number, pair]) => {
            return `${number}:${pair.map(portal => `${portal.row},${portal.col}`).join(',')}`;
        })
        .join(';');
    
    const csvContent = `${gridContent}\n${inventoryContent}\n${goalsContent}\n${wasteLimitsContent}\n${portalPairsContent}`;
    
    const base32Seed = base32Encode(csvContent);
    
    showSeedModal(base32Seed);
}
function updateResetClearButton() {
    const button = document.getElementById('reset-clear-btn');
    if (button) {
        // Remove any existing event listeners
        button.removeEventListener('click', clearGrid);
        button.removeEventListener('click', resetGame);

        if (isInFreeMode) {
            button.textContent = 'Clear Grid';
            button.addEventListener('click', clearGrid);
        } else {
            button.textContent = 'Reset';
            button.addEventListener('click', resetGame);
        }
    }
}
function initializeFreeMode() {
    // If there's a loaded level, use it as a starting point
    if (initialState) {
        grid = JSON.parse(JSON.stringify(initialState.grid));
        inventory = { ...initialState.inventory };
        goals = { ...initialState.goals };
        wasteLimits = { ...initialState.wasteLimits };
        portalPairs = JSON.parse(JSON.stringify(initialState.portalPairs || {}));
        nextPortalNumber = initialState.nextPortalNumber || 1;
    } else {
        // Start with an empty grid if no level is loaded
        grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(TILE_TYPES.EMPTY));
        inventory = {};
        for (let tileType in TILE_TYPES) {
            inventory[TILE_TYPES[tileType]] = 0;
        }
        goals = { crimson: 0, green: 0, blue: 0, yellow: 0, purple: 0, orange: 0, white: 0 };
        wasteLimits = { crimson: 10, green: 10, blue: 10, yellow: 10, purple: 10, orange: 10, white: 10 };
        portalPairs = {};
        nextPortalNumber = 1;
    }

    // Reset scores and waste
    scores = { crimson: 0, green: 0, blue: 0, yellow: 0, purple: 0, orange: 0, white: 0 };
    waste = { crimson: 0, green: 0, blue: 0, yellow: 0, purple: 0, orange: 0, white: 0 };
    
    history = [];
    objects = [];

    hideWinLossScreens();
    enableDragPlacement();
    setupInventoryControls();
}
function setupLossScreenButton() {
    const tryAgainBtn = document.getElementById('try-again-btn');
    if (tryAgainBtn) {
        tryAgainBtn.onclick = function() {
            if (isInFreeMode) {
                freeModeReset();
            } else {
                resetGame();
            }
            document.getElementById('loss-screen').style.display = 'none';
        };
    }
}


function setupWinScreenButtons() {
    const playAgainBtn = document.getElementById('play-again-btn');
    if (playAgainBtn) {
        playAgainBtn.onclick = function() {
            if (isInFreeMode) {
                document.getElementById('win-screen').style.display = 'none';
            } else {
                resetGame();
            }
        };
    }

    const exportGifBtn = document.getElementById('export-gif-btn');
    if (exportGifBtn) {
        exportGifBtn.style.display = isInFreeMode ? 'none' : 'inline-block';
        exportGifBtn.onclick = createAndDisplayGif;
    }
}

function toggleFreeMode() {
    isInFreeMode = !isInFreeMode;
    if (isInFreeMode) {
        // Switch to Free Mode
        initializeFreeMode();
        enableDragPlacement();
        setupInventoryControls();
    } else {
        // Switch to Player Mode
        if (isLevelLoaded && initialState) {
            // Restore the initial state of the loaded level
            grid = JSON.parse(JSON.stringify(initialState.grid));
            inventory = { ...initialState.inventory };
            scores = { ...initialState.scores };
            waste = { ...initialState.waste };
            goals = { ...initialState.goals };
            wasteLimits = { ...initialState.wasteLimits };
            portalPairs = JSON.parse(JSON.stringify(initialState.portalPairs || {}));
            nextPortalNumber = initialState.nextPortalNumber || 1;
        } else {
            // If no level loaded, reset to default values
            initializeGrid();
        }
        
        // Disable Free Mode specific features
        const gridContainer = document.getElementById('grid-container');
        gridContainer.removeEventListener('mousedown', startDragging);
        gridContainer.removeEventListener('mousemove', dragPlaceTile);
        gridContainer.removeEventListener('mouseup', stopDragging);
        gridContainer.removeEventListener('mouseleave', stopDragging);
    }
    
    // Update UI elements
    updateFreeModeUI();
    updateResetClearButton();
    updateEditorButton();
    renderGrid();
    renderInventory();
    renderScoresWaste();
    updateScores();
    updateWaste();
    renderObjects();
    updateUndoButton();
}

function updateFreeModeUI() {
    const freeModeElements = document.querySelectorAll('.free-mode-element');
    freeModeElements.forEach(element => {
        element.style.display = isInFreeMode ? 'block' : 'none';
    });

    // Enable/disable goal and waste limit inputs
    document.querySelectorAll('#scores-waste input[type="number"]').forEach(input => {
        input.disabled = !isInFreeMode;
    });
}
function updateEditorButton() {
    const editorButton = document.getElementById('toggle-free-mode-btn');
    if (editorButton) {
        if (isInFreeMode) {
            editorButton.textContent = 'Close Editor';
        } else {
            editorButton.textContent = 'Open Editor';
        }
    }
}

function updateInventoryInFreeMode(tileType, amount) {
    if (isInFreeMode) {
        inventory[tileType] = Math.max(0, (inventory[tileType] || 0) + amount);
        renderInventory();
    }
}

function importLevelSeed() {
    showLoadSeedModal();
}
function base32Encode(input) {
    const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = 0;
    let value = 0;
    let output = '';

    for (let i = 0; i < input.length; i++) {
        value = (value << 8) | input.charCodeAt(i);
        bits += 8;
        while (bits >= 5) {
            output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
            bits -= 5;
        }
    }

    if (bits > 0) {
        output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
    }

    return output;
}
function base32Decode(input) {
    const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = 0;
    let value = 0;
    let output = '';

    input = input.toUpperCase();

    for (let i = 0; i < input.length; i++) {
        value = (value << 5) | BASE32_ALPHABET.indexOf(input[i]);
        bits += 5;
        if (bits >= 8) {
            output += String.fromCharCode((value >>> (bits - 8)) & 255);
            bits -= 8;
        }
    }

    return output;
}
let isErasing = false;
let isLevelLoaded = false;
function adjustedStepCount(steps) {
    return Math.max(steps - 4, 0);  // Ensure we don't return negative values
}
function initializeGrid() {
    const GRID_SIZE = 12;
    grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(TILE_TYPES.EMPTY));
    originalGrid = JSON.parse(JSON.stringify(grid));
    history = [];
    objects = [];
    scores = { crimson: 0, green: 0, blue: 0, yellow: 0, purple: 0, orange: 0, white: 0 };
    waste = { crimson: 0, green: 0, blue: 0, yellow: 0, purple: 0, orange: 0, white: 0 };
    isSimulating = false;
    
    // Store the initial state
    initialState = {
        grid: JSON.parse(JSON.stringify(grid)),
        inventory: { ...inventory },
        scores: { ...scores },
        waste: { ...waste },
        goals: { ...goals },
        wasteLimits: { ...wasteLimits }
    };

    hideWinLossScreens();

    renderGrid();
    renderInventory();
    renderScoresWaste();
    updateScores();
    updateWaste();
    renderObjects();
    updateUndoButton();
}
let isLocked = false;
function rotateLockTile(tileType) {
    return TILE_TYPES.LOCK_RIGHT + (tileType - TILE_TYPES.LOCK_RIGHT + 1) % 4;
}
function hideWinLossScreens() {
    const winScreen = document.getElementById('win-screen');
    const lossScreen = document.getElementById('loss-screen');
    if (winScreen) winScreen.style.display = 'none';
    if (lossScreen) lossScreen.style.display = 'none';
}
function captureFrame() {
    console.log('captureFrame called. isCapturingFrames:', isCapturingFrames);
    if (!isCapturingFrames) return;
    
    const gridContainer = document.getElementById('grid-container');
    console.log('Grid container:', gridContainer);
    
    html2canvas(gridContainer, {
        backgroundColor: null,
        scale: 1,
    }).then(canvas => {
        frames.push(canvas.toDataURL());
        console.log(`Frame captured. Total frames: ${frames.length}`);
    }).catch(error => {
        console.error('Error capturing frame:', error);
    });
}

function getDirectionChangeTile(currentTile, selectedTile) {
    const directionChangeTiles = {
        [`${TILE_TYPES.CONVEYOR_RIGHT},${TILE_TYPES.CONVEYOR_DOWN}`]: TILE_TYPES.DIRECTION_CHANGE_RIGHT_DOWN,
        [`${TILE_TYPES.CONVEYOR_RIGHT},${TILE_TYPES.CONVEYOR_UP}`]: TILE_TYPES.DIRECTION_CHANGE_RIGHT_UP,
        [`${TILE_TYPES.CONVEYOR_RIGHT},${TILE_TYPES.CONVEYOR_LEFT}`]: TILE_TYPES.DIRECTION_CHANGE_RIGHT_LEFT,
        [`${TILE_TYPES.CONVEYOR_LEFT},${TILE_TYPES.CONVEYOR_DOWN}`]: TILE_TYPES.DIRECTION_CHANGE_LEFT_DOWN,
        [`${TILE_TYPES.CONVEYOR_LEFT},${TILE_TYPES.CONVEYOR_UP}`]: TILE_TYPES.DIRECTION_CHANGE_LEFT_UP,
        [`${TILE_TYPES.CONVEYOR_LEFT},${TILE_TYPES.CONVEYOR_RIGHT}`]: TILE_TYPES.DIRECTION_CHANGE_LEFT_RIGHT,
        [`${TILE_TYPES.CONVEYOR_DOWN},${TILE_TYPES.CONVEYOR_RIGHT}`]: TILE_TYPES.DIRECTION_CHANGE_DOWN_RIGHT,
        [`${TILE_TYPES.CONVEYOR_DOWN},${TILE_TYPES.CONVEYOR_LEFT}`]: TILE_TYPES.DIRECTION_CHANGE_DOWN_LEFT,
        [`${TILE_TYPES.CONVEYOR_DOWN},${TILE_TYPES.CONVEYOR_UP}`]: TILE_TYPES.DIRECTION_CHANGE_DOWN_UP,
        [`${TILE_TYPES.CONVEYOR_UP},${TILE_TYPES.CONVEYOR_RIGHT}`]: TILE_TYPES.DIRECTION_CHANGE_UP_RIGHT,
        [`${TILE_TYPES.CONVEYOR_UP},${TILE_TYPES.CONVEYOR_LEFT}`]: TILE_TYPES.DIRECTION_CHANGE_UP_LEFT,
        [`${TILE_TYPES.CONVEYOR_UP},${TILE_TYPES.CONVEYOR_DOWN}`]: TILE_TYPES.DIRECTION_CHANGE_UP_DOWN,
    };
    
    return directionChangeTiles[`${currentTile},${selectedTile}`];
}
function createGaussianChart(containerId, data, currentValue, color, title) {
    console.log(`Creating chart for ${containerId}`, { data, currentValue, color, title });

    const chartContainer = document.getElementById(containerId);
    if (!chartContainer) {
        console.error(`Chart container ${containerId} not found`);
        return;
    }
    chartContainer.innerHTML = '';

    if (!data || data.length === 0) {
        console.error(`No data provided for ${containerId}`);
        chartContainer.innerHTML = '<p>No data available</p>';
        return;
    }

    const stats = calculateMeanAndStdDev(data);
    console.log(`Stats for ${containerId}:`, stats);

    // Set up chart dimensions
    const margin = {top: 30, right: 30, bottom: 50, left: 60};
    const containerWidth = chartContainer.clientWidth;
    const width = Math.max(300, containerWidth - margin.left - margin.right);
    const height = Math.min(200, window.innerHeight * 0.25) - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(`#${containerId}`)
        .append('svg')
        .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Calculate domain
    let dataMin = Math.min(...data, currentValue);
    let dataMax = Math.max(...data, currentValue);
    
    if (dataMin === dataMax) {
        dataMin = Math.max(0, dataMin - 1);
        dataMax = dataMax + 1;
    }
    
    const range = dataMax - dataMin;
    const padding = Math.max(range * 0.2, 1);
    const xDomain = [Math.max(0, dataMin - padding), dataMax + padding];

    console.log(`Domain for ${containerId}:`, xDomain);

    const step = calculateStep(range);

    // Set up scales
    const x = d3.scaleLinear().range([0, width]).domain(xDomain);
    const yMax = gaussianFunction(stats.mean, stats.mean, Math.max(stats.stdDev, 0.1));
    const y = d3.scaleLinear().range([height, 0]).domain([0, yMax * 1.1]);

    // Generate points for the curve
    const points = d3.range(xDomain[0], xDomain[1], (xDomain[1] - xDomain[0]) / 200);

    // Draw the filled area and curve
    const area = d3.area()
        .x(d => x(d))
        .y0(height)
        .y1(d => y(gaussianFunction(d, stats.mean, Math.max(stats.stdDev, 0.1))));

    svg.append("path")
        .datum(points)
        .attr("fill", `${color}33`)
        .attr("d", area);

    svg.append("path")
        .datum(points)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("d", d3.line()
            .x(d => x(d))
            .y(d => y(gaussianFunction(d, stats.mean, Math.max(stats.stdDev, 0.1))))
        );

    // Add X axis
    const xAxis = d3.axisBottom(x)
        .tickValues(d3.range(Math.ceil(xDomain[0] / step) * step, xDomain[1], step))
        .tickFormat(d3.format("d"));

    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis);

    // Add Y axis
    svg.append('g')
        .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(".2f")));

    // Add current attempt marker
    if (currentValue >= xDomain[0] && currentValue <= xDomain[1]) {
        svg.append('line')
            .attr('x1', x(currentValue))
            .attr('y1', height)
            .attr('x2', x(currentValue))
            .attr('y2', 0)
            .attr('stroke', color)
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5,5');
    }

    // Add title and labels
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', 0 - (margin.top / 2))
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('fill', 'white')
        .text(title);

    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + margin.bottom - 10)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('fill', 'white')
        .text('Count');

    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('fill', 'white')
        .text('Probability');

    console.log(`Chart for ${containerId} created successfully`);
}


function calculateStep(range) {
    const magnitude = Math.floor(Math.log10(range));
    const normalizedRange = range / Math.pow(10, magnitude);
    
    if (normalizedRange <= 1) return Math.pow(10, magnitude - 1);
    if (normalizedRange <= 2) return 2 * Math.pow(10, magnitude - 1);
    if (normalizedRange <= 5) return 5 * Math.pow(10, magnitude - 1);
    return Math.pow(10, magnitude);
}

function handlePortalPlacement(row, col) {
    let unpairedPortal = findUnpairedPortal();
    if (unpairedPortal) {
        // Pair with existing unpaired portal
        let pairNumber = unpairedPortal.pairNumber;
        portalPairs[pairNumber].push({row, col});
    } else {
        // Create new portal pair
        portalPairs[nextPortalNumber] = [{row, col}];
        nextPortalNumber++;
    }
}
let dragChanges = [];
function handleObjectReachingEnd(object) {
    const color = object.color;
    if (scores[color] < goals[color]) {
        // If the score is less than the goal, increment the score
        scores[color]++;
        updateScores();
    } else {
        // If the score has reached or exceeded the goal, increment the waste
        waste[color]++;
        updateWaste();
    }
    checkWinCondition();
    checkLossCondition();
}
function freeModeReset() {
    stopSimulation();
    objects = [];
    scores = { crimson: 0, green: 0, blue: 0, yellow: 0, purple: 0, orange: 0, white: 0 };
    waste = { crimson: 0, green: 0, blue: 0, yellow: 0, purple: 0, orange: 0, white: 0 };
    
    // Clear the grid (optional, depending on your game design)
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (grid[i][j] !== TILE_TYPES.EMPTY) {
                inventory[grid[i][j]] = (inventory[grid[i][j]] || 0) + 1;
                grid[i][j] = TILE_TYPES.EMPTY;
            }
        }
    }
    
    renderGrid();
    renderObjects();
    updateScores();
    updateWaste();
    renderScoresWaste();
    renderInventory();
}

function findUnpairedPortal() {
    for (let [pairNumber, pair] of Object.entries(portalPairs)) {
        if (pair.length === 1) {
            return { pairNumber: parseInt(pairNumber), portal: pair[0] };
        }
    }
    return null;
}

function findUnpairedPortal() {
    for (let [pairNumber, pair] of Object.entries(portalPairs)) {
        if (pair.length === 1) {
            return { pairNumber: parseInt(pairNumber), portal: pair[0] };
        }
    }
    return null;
}
// Modify the handleTileClick function
function handleTileClick(row, col) {
    if (!isSimulating) {
        const currentTile = grid[row][col];
        
        // Handle erasing in Free Mode
        if (isErasing && isInFreeMode) {
            pushToHistory();
            
            // If erasing a portal tile, remove it from portalPairs
            if (currentTile >= TILE_TYPES.PORTAL_RIGHT && currentTile <= TILE_TYPES.PORTAL_UP) {
                for (let number in portalPairs) {
                    portalPairs[number] = portalPairs[number].filter(portal => 
                        portal.row !== row || portal.col !== col
                    );
                }
                managePortalNumbers();
            }
            
            grid[row][col] = TILE_TYPES.EMPTY;
            originalGrid[row][col] = TILE_TYPES.EMPTY;
            renderGrid();
            return;
        }
        
        // Handle portal rotation
        if (currentTile >= TILE_TYPES.PORTAL_RIGHT && currentTile <= TILE_TYPES.PORTAL_UP) {
            pushToHistory();
            grid[row][col] = rotatePortal(currentTile);
            originalGrid[row][col] = grid[row][col];
            renderGrid();
            return;
        }
        
        // Handle lock tile rotation
        if (currentTile >= TILE_TYPES.LOCK_RIGHT && currentTile <= TILE_TYPES.LOCK_UP) {
            pushToHistory();
            grid[row][col] = rotateLockTile(currentTile);
            originalGrid[row][col] = grid[row][col];
            renderGrid();
            return;
        }
        
        // Handle direction change tiles
        if (isDirectionChangeTile(currentTile)) {
            pushToHistory();
            grid[row][col] = getNextDirectionChangeTile(currentTile);
            originalGrid[row][col] = grid[row][col];
            renderGrid();
            return;
        }
        
        // Handle tile placement
        if (selectedTile !== null) {
            if (inventory[selectedTile] > 0 || isInFreeMode) {
                const isConveyor = (tileType) => tileType >= TILE_TYPES.CONVEYOR_RIGHT && tileType <= TILE_TYPES.CONVEYOR_UP;
                
                pushToHistory();

                let changed = false;

                if (isConveyor(selectedTile) && isConveyor(currentTile) && currentTile !== selectedTile) {
                    let newTile = getDirectionChangeTile(currentTile, selectedTile);
                    if (newTile) {
                        grid[row][col] = newTile;
                        originalGrid[row][col] = newTile;
                        changed = true;
                    }
                } else if (currentTile === TILE_TYPES.EMPTY || isInFreeMode) {
                    grid[row][col] = selectedTile;
                    originalGrid[row][col] = selectedTile;
                    changed = true;

                    if (selectedTile >= TILE_TYPES.PORTAL_RIGHT && selectedTile <= TILE_TYPES.PORTAL_UP) {
                        handlePortalPlacement(row, col);
                        managePortalNumbers();
                    }
                }
                
                if (changed) {
                    if (!isInFreeMode && inventory[selectedTile] > 0) {
                        inventory[selectedTile]--;
                        if (inventory[selectedTile] === 0) {
                            selectedTile = null;
                        }
                    }
                    renderGrid();
                    renderInventory();
                    updateUndoButton();
                } else {
                    history.pop();
                }
            } else {
                selectedTile = null;
                renderInventory();
            }
        }
    }
}
function resetFrames() {
    frames = [];
    console.log('Frames reset');
}

function updateWasteLimits() {
    const colors = ['crimson', 'green', 'blue', 'yellow', 'purple', 'orange', 'white'];
    colors.forEach(color => {
        const input = document.getElementById(`${color}-waste-limit`);
        if (input) {
            wasteLimits[color] = parseInt(input.value) || 0;
        }
    });
    renderScoresWaste();
}
// Update the event listeners in your main script
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
    populateLevelSelect();

    const addListener = (id, event, handler) => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener(event, handler);
        }
    };
    if (typeof html2canvas === 'undefined') {
        console.error('html2canvas library is not loaded. Please make sure it is included in your HTML file.');
        alert('An error occurred: html2canvas library is missing. Please contact the developer.');
    } else {
        console.log('html2canvas library is loaded successfully.');
    }
    addListener('start-btn', 'click', startSimulation);
    addListener('stop-btn', 'click', stopSimulation);
    addListener('reset-btn', 'click', resetGame);
    addListener('undo-btn', 'click', undo);
    addListener('play-again-btn', 'click', resetGame);
    addListener('try-again-btn', 'click', resetGame);
    addListener('export-gif-btn', 'click', createAndDisplayGif);
    addListener('toggle-free-mode-btn', 'click', toggleFreeMode);
    addListener('export-seed-btn', 'click', exportLevelSeed);
    addListener('import-seed-btn', 'click', importLevelSeed);

    const levelSelect = document.getElementById('level-select');
    if (levelSelect) {
        levelSelect.addEventListener('change', (event) => {
            if (event.target.value) {
                loadLevel(event.target.value);
            }
        });
    }

    document.getElementById('loss-screen').style.display = 'none';
    updateFreeModeUI();
});
function rotatePortal(tileType) {
    return TILE_TYPES.PORTAL_RIGHT + (tileType - TILE_TYPES.PORTAL_RIGHT + 1) % 4;
}
function toggleEraser() {
    isErasing = !isErasing;
    const eraserBtn = document.getElementById('eraser-btn');
    eraserBtn.textContent = isErasing ? 'Eraser Off' : 'Eraser';
    eraserBtn.classList.toggle('active', isErasing);
    selectedTile = null;
    renderInventory(); // Deselect any selected inventory item
}
function findNextPortal(currentRow, currentCol) {
    for (let number in portalPairs) {
        const pair = portalPairs[number];
        if (pair.length === 2) {
            if (pair[0].row === currentRow && pair[0].col === currentCol) {
                return pair[1];
            } else if (pair[1].row === currentRow && pair[1].col === currentCol) {
                return pair[0];
            }
        }
    }
    return null; // If no matching portal found, return null
}
function getNextDirectionChangeTile(currentTile) {
    const directionPairs = {
        [TILE_TYPES.DIRECTION_CHANGE_RIGHT_DOWN]: TILE_TYPES.DIRECTION_CHANGE_DOWN_RIGHT,
        [TILE_TYPES.DIRECTION_CHANGE_DOWN_RIGHT]: TILE_TYPES.DIRECTION_CHANGE_RIGHT_DOWN,
        [TILE_TYPES.DIRECTION_CHANGE_RIGHT_UP]: TILE_TYPES.DIRECTION_CHANGE_UP_RIGHT,
        [TILE_TYPES.DIRECTION_CHANGE_UP_RIGHT]: TILE_TYPES.DIRECTION_CHANGE_RIGHT_UP,
        [TILE_TYPES.DIRECTION_CHANGE_RIGHT_LEFT]: TILE_TYPES.DIRECTION_CHANGE_LEFT_RIGHT,
        [TILE_TYPES.DIRECTION_CHANGE_LEFT_RIGHT]: TILE_TYPES.DIRECTION_CHANGE_RIGHT_LEFT,
        [TILE_TYPES.DIRECTION_CHANGE_LEFT_DOWN]: TILE_TYPES.DIRECTION_CHANGE_DOWN_LEFT,
        [TILE_TYPES.DIRECTION_CHANGE_DOWN_LEFT]: TILE_TYPES.DIRECTION_CHANGE_LEFT_DOWN,
        [TILE_TYPES.DIRECTION_CHANGE_LEFT_UP]: TILE_TYPES.DIRECTION_CHANGE_UP_LEFT,
        [TILE_TYPES.DIRECTION_CHANGE_UP_LEFT]: TILE_TYPES.DIRECTION_CHANGE_LEFT_UP,
        [TILE_TYPES.DIRECTION_CHANGE_DOWN_UP]: TILE_TYPES.DIRECTION_CHANGE_UP_DOWN,
        [TILE_TYPES.DIRECTION_CHANGE_UP_DOWN]: TILE_TYPES.DIRECTION_CHANGE_DOWN_UP
    };
    
    return directionPairs[currentTile] || currentTile;
}

function updateUndoButton() {
    const undoBtn = document.getElementById('undo-btn');
    if (undoBtn) {
        undoBtn.disabled = history.length === 0;
    }
}

function undo() {
    if (history.length > 0) {
        const previousState = history.pop();
        grid = JSON.parse(JSON.stringify(previousState.grid));
        inventory = { ...previousState.inventory };
        scores = { ...previousState.scores };
        waste = { ...previousState.waste };
        renderGrid();
        renderInventory();
        renderScoresWaste();
        updateUndoButton();
    }
}
function updateScores() {
    for (const color in scores) {
        const scoreElement = document.getElementById(`${color}-score`);
        if (scoreElement) {
            scoreElement.textContent = Math.min(scores[color], goals[color]);
        }
    }
    renderScoresWaste();
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
let nextObjectId = 1;
function generateObjectId() {
    return `obj_${nextObjectId++}`;
}
function generateObjectId() {
    return `obj_${nextObjectId++}`;
}

function moveObjects() {
    console.log(`Starting moveObjects for step ${stepCount}`);
    
    try {
        const newObjects = objects.map((obj, index) => {
            console.log(`Processing object ${index}:`, obj);
            
            const { row, col, color, id } = obj;
            let newRow = row;
            let newCol = col;
            let newColor = color;

            const currentTile = grid[row][col];
            console.log(`Current tile at [${row},${col}]:`, currentTile);

            if (currentTile === undefined) {
                console.error(`Invalid tile at [${row},${col}]`);
                return null;
            }

            const isConverter = currentTile >= TILE_TYPES.CONVERT_CRIMSON_RIGHT && currentTile <= TILE_TYPES.CONVERT_WHITE_UP;
            const isCreator = currentTile >= TILE_TYPES.CREATE_BLUE_RIGHT && currentTile <= TILE_TYPES.CREATE_PURPLE_UP;
            const isEnd = currentTile >= TILE_TYPES.END_CRIMSON && currentTile <= TILE_TYPES.END_WHITE;
            const isPortal = currentTile >= TILE_TYPES.PORTAL_RIGHT && currentTile <= TILE_TYPES.PORTAL_UP;
            const isLockTile = currentTile >= TILE_TYPES.LOCK_RIGHT && currentTile <= TILE_TYPES.LOCK_UP;

            if (isConverter) {
                console.log(`Converting object at [${row},${col}]`);
                newColor = convertColor(color, currentTile);
                const direction = (currentTile - TILE_TYPES.CONVERT_CRIMSON_RIGHT) % 4;
                switch (direction) {
                    case 0: newCol = Math.min(col + 1, GRID_SIZE - 1); break;
                    case 1: newRow = Math.min(row + 1, GRID_SIZE - 1); break;
                    case 2: newCol = Math.max(col - 1, 0); break;
                    case 3: newRow = Math.max(row - 1, 0); break;
                }
            } else if (isCreator) {
                console.log(`Object on creator tile at [${row},${col}]`);
                handleOverflow(color);
                return null;
            } else if (isEnd) {
                console.log(`Object reached end tile at [${row},${col}]`);
                if (color === getEndTileColor(currentTile)) {
                    handleOverflow(color);
                    return null;
                } else {
                    waste[color]++;
                    updateWaste();
                    checkLossCondition();
                    return null;
                }
            } else if (currentTile === TILE_TYPES.EMPTY) {
                console.log(`Object fell off grid at [${row},${col}]`);
                waste[color]++;
                updateWaste();
                checkLossCondition();
                return null;
            } else if (isPortal) {
                console.log(`Object entered portal at [${row},${col}]`);
                const nextPortal = findNextPortal(row, col);
                if (nextPortal) {
                    newRow = nextPortal.row;
                    newCol = nextPortal.col;
                    const portalDirection = grid[newRow][newCol] - TILE_TYPES.PORTAL_RIGHT;
                    switch (portalDirection) {
                        case 0: newCol = Math.min(newCol + 1, GRID_SIZE - 1); break;
                        case 1: newRow = Math.min(newRow + 1, GRID_SIZE - 1); break;
                        case 2: newCol = Math.max(newCol - 1, 0); break;
                        case 3: newRow = Math.max(newRow - 1, 0); break;
                    }
                } else {
                    waste[color]++;
                    updateWaste();
                    checkLossCondition();
                    return null;
                }
            } else if (isLockTile) {
                console.log(`Object on lock tile at [${row},${col}]`);
                isLocked = !isLocked;
                if (isLocked) {
                    grid.forEach((row, r) => {
                        row.forEach((tile, c) => {
                            if (isDirectionChangeTile(tile)) {
                                lockedDirections[`${r},${c}`] = getActiveDirection(tile);
                            }
                        });
                    });
                } else {
                    lockedDirections = {};
                }
                const direction = currentTile - TILE_TYPES.LOCK_RIGHT;
                switch (direction) {
                    case 0: newCol = Math.min(col + 1, GRID_SIZE - 1); break;
                    case 1: newRow = Math.min(row + 1, GRID_SIZE - 1); break;
                    case 2: newCol = Math.max(col - 1, 0); break;
                    case 3: newRow = Math.max(row - 1, 0); break;
                }
            } else if (isDirectionChangeTile(currentTile)) {
                console.log(`Object on direction change tile at [${row},${col}]`);
                const key = `${row},${col}`;
                const direction = isLocked && key in lockedDirections ? lockedDirections[key] : getActiveDirection(currentTile);
                switch (direction) {
                    case 'right': newCol = Math.min(col + 1, GRID_SIZE - 1); break;
                    case 'down': newRow = Math.min(row + 1, GRID_SIZE - 1); break;
                    case 'left': newCol = Math.max(col - 1, 0); break;
                    case 'up': newRow = Math.max(row - 1, 0); break;
                }
                if (!isLocked) {
                    grid[row][col] = getNextDirectionChangeTile(currentTile);
                }
            } else {
                console.log(`Regular conveyor movement at [${row},${col}]`);
                switch (currentTile) {
                    case TILE_TYPES.CONVEYOR_RIGHT: newCol = Math.min(col + 1, GRID_SIZE - 1); break;
                    case TILE_TYPES.CONVEYOR_DOWN: newRow = Math.min(row + 1, GRID_SIZE - 1); break;
                    case TILE_TYPES.CONVEYOR_LEFT: newCol = Math.max(col - 1, 0); break;
                    case TILE_TYPES.CONVEYOR_UP: newRow = Math.max(row - 1, 0); break;
                }
            }

            if (newRow < 0 || newRow >= GRID_SIZE || newCol < 0 || newCol >= GRID_SIZE) {
                console.log(`Object moved off grid to [${newRow},${newCol}]`);
                waste[color]++;
                updateWaste();
                checkLossCondition();
                return null;
            }

            if (grid[newRow][newCol] === TILE_TYPES.WALL) {
                console.log(`Object hit wall at [${newRow},${newCol}]`);
                return { row, col, color: newColor, id };
            }

            const newTile = grid[newRow][newCol];
            if (newTile === TILE_TYPES.EMPTY || (newTile >= TILE_TYPES.CREATE_BLUE_RIGHT && newTile <= TILE_TYPES.CREATE_PURPLE_UP)) {
                console.log(`Object moved to empty or creator tile at [${newRow},${newCol}]`);
                waste[color]++;
                updateWaste();
                checkLossCondition();
                return null;
            }

            console.log(`New position for object ${index}: [${newRow},${newCol}]`);
            return { row: newRow, col: newCol, color: newColor, id };
        }).filter(Boolean);

        console.log(`Processed ${newObjects.length} objects`);

        // Handle generators
        grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell >= TILE_TYPES.CREATE_BLUE_RIGHT && cell <= TILE_TYPES.CREATE_PURPLE_UP) {
                    console.log(`Processing generator at [${rowIndex},${colIndex}]`);
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
                        newObjects.push({ row: newRow, col: newCol, color, id: generateObjectId() });
                    }
                }
            });
        });

        objects = newObjects;
        console.log(`moveObjects completed for step ${stepCount}, new object count: ${objects.length}`);
    } catch (error) {
        console.error(`Error in moveObjects at step ${stepCount}:`, error);
        stopSimulation(); // Stop the simulation if an error occurs
    }

    renderObjects();
    renderGrid();
    renderScoresWaste();
}
function getActiveDirection(tileType) {
    switch (tileType) {
        case TILE_TYPES.DIRECTION_CHANGE_RIGHT_DOWN:
        case TILE_TYPES.DIRECTION_CHANGE_RIGHT_UP:
        case TILE_TYPES.DIRECTION_CHANGE_RIGHT_LEFT:
            return 'right';
        case TILE_TYPES.DIRECTION_CHANGE_DOWN_RIGHT:
        case TILE_TYPES.DIRECTION_CHANGE_DOWN_LEFT:
        case TILE_TYPES.DIRECTION_CHANGE_DOWN_UP:
            return 'down';
        case TILE_TYPES.DIRECTION_CHANGE_LEFT_DOWN:
        case TILE_TYPES.DIRECTION_CHANGE_LEFT_UP:
        case TILE_TYPES.DIRECTION_CHANGE_LEFT_RIGHT:
            return 'left';
        case TILE_TYPES.DIRECTION_CHANGE_UP_RIGHT:
        case TILE_TYPES.DIRECTION_CHANGE_UP_LEFT:
        case TILE_TYPES.DIRECTION_CHANGE_UP_DOWN:
            return 'up';
        default:
            return 'right'; // Default direction if something goes wrong
    }
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
function countTilesUsed() {
    return grid.flat().filter(tile => tile !== TILE_TYPES.EMPTY).length;
}
function pauseSimulation() {
    isPaused = true;
    document.getElementById('pause-btn').textContent = 'Resume';
    const rewindSlider = document.getElementById('rewind-slider');
    rewindSlider.style.display = 'inline-block';
    rewindSlider.disabled = false; // Enable the slider
    rewindSlider.max = gameStates.length - 1;
    rewindSlider.value = currentStep;
    updateResetClearButton(); // Add this line
}

function resumeSimulation() {
    isPaused = false;
    document.getElementById('pause-btn').textContent = 'Pause';
    const rewindSlider = document.getElementById('rewind-slider');
    rewindSlider.style.display = 'none';
    rewindSlider.disabled = true; // Disable the slider
    currentStep = gameStates.length - 1;
    updateResetClearButton(); // Add this line
}

function rewindTo(step) {
    if (isPaused && step >= 0 && step < gameStates.length) {
        currentStep = step;
        const state = gameStates[step];
        grid = JSON.parse(JSON.stringify(state.grid));
        objects = JSON.parse(JSON.stringify(state.objects));
        scores = { ...state.scores };
        waste = { ...state.waste };
        isLocked = state.isLocked;
        lockedDirections = { ...state.lockedDirections };
        
        // Restore direction change tile states
        for (const [key, value] of Object.entries(state.directionChangeTiles)) {
            const [i, j] = key.split(',').map(Number);
            grid[i][j] = value;
        }
        
        renderGrid();
        renderObjects();
        updateScores();
        updateWaste();
    }
}

function setupInventoryControls() {
    renderInventory(); // Initial render
    // Event delegation for dynamically created buttons
    document.getElementById('inventory-grid').addEventListener('mousedown', handleInventoryButtonMouseDown);
    document.addEventListener('mouseup', handleInventoryButtonMouseUp);
    document.addEventListener('mouseleave', handleInventoryButtonMouseUp);
}

function handleInventoryButtonMouseDown(event) {
    if (!isInFreeMode) return;
    
    const button = event.target.closest('.modify-quantity button');
    if (!button) return;
    
    const tileType = parseInt(button.dataset.tileType);
    const amount = button.textContent === '+' ? 1 : -1;
    
    updateInventoryInFreeMode(tileType, amount);
    
    const buttonId = `${tileType}_${amount > 0 ? 'inc' : 'dec'}`;
    
    inventoryIntervals[buttonId] = {
        timeout: setTimeout(() => {
            inventoryIntervals[buttonId].interval = setInterval(() => {
                updateInventoryInFreeMode(tileType, amount);
            }, REPEAT_DELAY);
        }, CLICK_DELAY)
    };

    button.addEventListener('mouseup', () => handleInventoryButtonMouseUp(buttonId));
    button.addEventListener('mouseleave', () => handleInventoryButtonMouseUp(buttonId));

    event.preventDefault(); // Prevent text selection
}
function startInventoryAdjustment(tileType, amount) {
    if (intervalId) clearInterval(intervalId);
    
    intervalId = setInterval(() => {
        updateInventoryInFreeMode(tileType, amount);
    }, REPEAT_DELAY);
}
function handleInventoryButtonMouseUp(buttonId) {
    if (typeof buttonId === 'string') {
        clearButtonInterval(buttonId);
    } else {
        clearAllInventoryIntervals();
    }
}
function clearButtonInterval(buttonId) {
    if (inventoryIntervals[buttonId]) {
        clearTimeout(inventoryIntervals[buttonId].timeout);
        clearInterval(inventoryIntervals[buttonId].interval);
        delete inventoryIntervals[buttonId];
    }
}

function clearAllInventoryIntervals() {
    Object.keys(inventoryIntervals).forEach(clearButtonInterval);
}

function handleInventoryMouseUp(event) {
    clearAllInventoryIntervals();
}

function handleInventoryMouseLeave() {
    clearInventoryInterval();
}

function startSimulation() {
    if (!isSimulating) {
        resetFrames();
        isSimulating = true;
        isCapturingFrames = true;
        objects = [];
        stepCount = 0;
        tilesUsed = countTilesUsed();
        gameStates = [];
        currentStep = 0;
        renderObjects();
        captureFrame();
        
        let lastStepTime = Date.now();
        const maxStepDuration = 5000; // 5 seconds max per step
        
        intervalId = setInterval(() => {
            if (!isPaused) {
                const currentTime = Date.now();
                if (currentTime - lastStepTime > maxStepDuration) {
                    console.error(`Step ${stepCount} took too long, stopping simulation`);
                    stopSimulation();
                    return;
                }
                
                moveObjects();
                stepCount++;
                renderObjects();
                captureFrame();
                saveGameState();
                currentStep++;
                console.log(`Completed step: ${stepCount}`);
                
                lastStepTime = currentTime;
            }
        }, 150);
        
        updateSimulationControls(true);
    }
}
function stopSimulation() {
    console.log('stopSimulation called');
    if (isSimulating) {
        clearInterval(intervalId);
        isSimulating = false;
        isPaused = false;
        console.log('Simulation stopped, isSimulating:', isSimulating, 'isCapturingFrames:', isCapturingFrames);
        
        // Reset game state variables
        objects = [];
        renderObjects();
        waste = { ...initialState.waste };
        scores = { ...initialState.scores };
        isLocked = false;
        lockedDirections = {};
        
        // Reset direction change tiles to their original orientation
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                if (isDirectionChangeTile(grid[i][j]) || (grid[i][j] >= TILE_TYPES.LOCK_RIGHT && grid[i][j] <= TILE_TYPES.LOCK_UP)) {
                    grid[i][j] = originalGrid[i][j];
                }
            }
        }

        // Reset generator counters
        generatorCounters = {};

        // Reset step count and current step
        stepCount = 0;
        currentStep = 0;

        // Clear game states
        gameStates = [];

        // Update the display
        updateWaste();
        updateScores();
        renderScoresWaste();
        renderGrid();
        
        // Update buttons and controls
        updateResetClearButton();
        updateUndoButton();
        updateSimulationControls(false);

        // Reset rewind slider
        const rewindSlider = document.getElementById('rewind-slider');
        if (rewindSlider) {
            rewindSlider.value = 0;
            rewindSlider.max = 0;
            rewindSlider.style.display = 'none';
        }

        // Reset pause button
        const pauseBtn = document.getElementById('pause-btn');
        if (pauseBtn) {
            pauseBtn.textContent = 'Pause';
        }

        // If in free mode, reset additional elements
        if (isInFreeMode) {
            freeModeReset();
        }

        // Hide win/loss screens if they're visible
        hideWinLossScreens();

        console.log("Simulation stopped and game state reset");
    }
}

function resetLockState() {
    isLocked = false;
    lockedDirections = {};
    
    // Reset direction change tiles to their original orientation
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (isDirectionChangeTile(grid[i][j])) {
                grid[i][j] = originalGrid[i][j];
            }
        }
    }
}
function isDirectionChangeTile(tileType) {
    return tileType >= TILE_TYPES.DIRECTION_CHANGE_RIGHT_DOWN && tileType <= TILE_TYPES.DIRECTION_CHANGE_UP_DOWN;
}

let placedPortals = [];
function pushToHistory() {
    if (isDragging) {
        dragChanges.push({
            grid: JSON.parse(JSON.stringify(grid)),
            inventory: { ...inventory },
            scores: { ...scores },
            waste: { ...waste },
            portalPairs: JSON.parse(JSON.stringify(portalPairs)),
            nextPortalNumber: nextPortalNumber
        });
    } else {
        history.push({
            grid: JSON.parse(JSON.stringify(grid)),
            inventory: { ...inventory },
            scores: { ...scores },
            waste: { ...waste },
            portalPairs: JSON.parse(JSON.stringify(portalPairs)),
            nextPortalNumber: nextPortalNumber
        });
        updateUndoButton();
    }
}
let isDragging = false;

function enableDragPlacement() {
    const gridContainer = document.getElementById('grid-container');
    gridContainer.addEventListener('mousedown', startDragging);
    gridContainer.addEventListener('mousemove', dragPlaceTile);
    gridContainer.addEventListener('mouseup', stopDragging);
    gridContainer.addEventListener('mouseleave', stopDragging);
}
let lockedDirections = {};

function startDragging(event) {
    if (isInFreeMode && (selectedTile !== null || isErasing)) {
        isDragging = true;
        dragChanges = [];
        dragPlaceTile(event);
    }
}
function clearGrid() {
    // Clear the grid
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            grid[i][j] = TILE_TYPES.EMPTY;
        }
    }
    
    // Reset scores, waste, and objects
    scores = { crimson: 0, green: 0, blue: 0, yellow: 0, purple: 0, orange: 0, white: 0 };
    waste = { crimson: 0, green: 0, blue: 0, yellow: 0, purple: 0, orange: 0, white: 0 };
    objects = [];
    
    // Clear history and generator counters
    history = [];
    generatorCounters = {};
    
    // Reset portal information
    portalPairs = {};
    nextPortalNumber = 1;
    
    // Update the display
    renderGrid();
    renderInventory();
    renderScoresWaste();
    updateScores();
    updateWaste();
    renderObjects();
    updateUndoButton();
}
let inventoryIntervals = {};

function resetGame() {
    if (isInFreeMode) {
        freeModeReset();
    } else {
        // Existing reset logic for normal mode
        stopSimulation();
        if (initialState) {
            grid = JSON.parse(JSON.stringify(initialState.grid));
            inventory = { ...initialState.inventory };
            scores = { ...initialState.scores };
            waste = { ...initialState.waste };
            goals = { ...initialState.goals };
            wasteLimits = { ...initialState.wasteLimits };
            portalPairs = JSON.parse(JSON.stringify(initialState.portalPairs || {}));
            nextPortalNumber = initialState.nextPortalNumber || 1;
        } else {
            initializeGrid();
        }
        
        history = [];
        generatorCounters = {};
        objects = [];
    }
    
    hideWinLossScreens();
    renderGrid();
    renderInventory();
    renderScoresWaste();
    updateScores();
    updateWaste();
    renderObjects();
    updateUndoButton();
}
// In display.js

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
// Helper function to get the arrow for a given direction
function getDirectionArrow(direction) {
    switch (direction) {
        case 'right': return '→';
        case 'down': return '↓';
        case 'left': return '←';
        case 'up': return '↑';
        default: return '→'; // Default arrow if something goes wrong
    }
}

function updateResetClearButton() {
    const button = document.getElementById('reset-clear-btn');
    if (button) {
        // Remove any existing event listeners
        button.removeEventListener('click', clearGrid);
        button.removeEventListener('click', resetGame);
        button.removeEventListener('click', freeModeReset);

        if (isInFreeMode) {
            button.textContent = 'Clear Grid';
            button.addEventListener('click', clearGrid);
        } else if (isLevelLoaded) {
            button.textContent = 'Reset';
            button.addEventListener('click', resetGame);
        } else {
            button.textContent = 'Reset';
            button.addEventListener('click', freeModeReset);
        }

        // Disable the button when paused or simulating
        button.disabled = isPaused || isSimulating;
    }
}

function dragPlaceTile(event) {
    if (isDragging) {
        const gridContainer = document.getElementById('grid-container');
        const rect = gridContainer.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const col = Math.floor(x / (rect.width / GRID_SIZE));
        const row = Math.floor(y / (rect.height / GRID_SIZE));
        
        if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
            handleTileClick(row, col);
        }
    }
}
function stopDragging() {
    if (isDragging) {
        isDragging = false;
        if (dragChanges.length > 0) {
            history.push(dragChanges[0]); // Only push the first change to represent the entire drag operation
            updateUndoButton();
        }
        dragChanges = [];
    }
}

function resetGame() {
    if (!isInFreeMode) {
        stopSimulation();
        if (initialState) {
            grid = JSON.parse(JSON.stringify(initialState.grid));
            inventory = { ...initialState.inventory };
            scores = { ...initialState.scores };
            waste = { ...initialState.waste };
            goals = { ...initialState.goals };
            wasteLimits = { ...initialState.wasteLimits };
            
            // Reset portal information
            portalPairs = JSON.parse(JSON.stringify(initialState.portalPairs || {}));
            nextPortalNumber = initialState.nextPortalNumber || 1;
        } else {
            // If no initial state, reset to default values
            initializeGrid();
        }
        
        history = [];
        generatorCounters = {};
        objects = [];
        
        // Ensure win and loss screens are hidden
        hideWinLossScreens();

        renderGrid();
        renderInventory();
        renderScoresWaste();
        updateScores();
        updateWaste();
        renderObjects();
        updateUndoButton();
    }
}

function freeModeReset() {
    if (isInFreeMode) {
        stopSimulation();
        objects = [];
        scores = { crimson: 0, green: 0, blue: 0, yellow: 0, purple: 0, orange: 0, white: 0 };
        waste = { crimson: 0, green: 0, blue: 0, yellow: 0, purple: 0, orange: 0, white: 0 };
        
        renderObjects();
        updateScores();
        updateWaste();
        renderScoresWaste();
    } else {
        resetGame();
    }
}

function updateUndoButton() {
    const undoBtn = document.getElementById('undo-btn');
    if (undoBtn) {
        undoBtn.disabled = history.length === 0;
    }
}

function undo() {
    if (history.length > 0) {
        const previousState = history.pop();
        grid = JSON.parse(JSON.stringify(previousState.grid));
        inventory = { ...previousState.inventory };
        scores = { ...previousState.scores };
        waste = { ...previousState.waste };
        portalPairs = JSON.parse(JSON.stringify(previousState.portalPairs));
        nextPortalNumber = previousState.nextPortalNumber;
        renderGrid();
        renderInventory();
        renderScoresWaste();
        updateUndoButton();
    }
}
function updateGoals() {
    const colors = ['crimson', 'green', 'blue', 'yellow', 'purple', 'orange', 'white'];
    colors.forEach(color => {
        const input = document.getElementById(`${color}-goal`);
        if (input) {
            const value = parseInt(input.value);
            goals[color] = isNaN(value) ? 0 : Math.max(0, value);
            input.value = goals[color]; // Update the input to reflect the sanitized value
        }
    });
    renderScoresWaste();
}
function updateWaste() {
    for (const color in waste) {
        const wasteElement = document.getElementById(`${color}-waste`);
        if (wasteElement) {
            wasteElement.textContent = waste[color];
        }
    }
    renderScoresWaste();
}

function updateGoals() {
    const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'white'];
    colors.forEach(color => {
        const input = document.getElementById(`${color}-goal`);
        if (input) {
            goals[color] = parseInt(input.value) || 0;
        }
    });
    renderScoresWaste();
}

function updateWasteLimits() {
    const colors = ['crimson', 'green', 'blue', 'yellow', 'purple', 'orange', 'white'];
    colors.forEach(color => {
        const input = document.getElementById(`${color}-waste-limit`);
        if (input) {
            const value = parseInt(input.value);
            wasteLimits[color] = isNaN(value) ? 0 : Math.max(0, value);
            input.value = wasteLimits[color]; // Update the input to reflect the sanitized value
        }
    });
    renderScoresWaste();
}


function adjustStepCount(steps) {
    return Math.max(steps - 4, 0);  // Ensure we don't return negative values
}
function calculateMeanAndStdDev(arr) {
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const variance = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length;
    const stdDev = Math.sqrt(variance);
    return { mean, stdDev };
}
function getDirectionChangeTileStates() {
    const states = {};
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (isDirectionChangeTile(grid[i][j])) {
                states[`${i},${j}`] = grid[i][j];
            }
        }
    }
    return states;
}


function saveGameState() {
    gameStates.push({
        grid: JSON.parse(JSON.stringify(grid)),
        objects: JSON.parse(JSON.stringify(objects)),
        scores: { ...scores },
        waste: { ...waste },
        directionChangeTiles: getDirectionChangeTileStates(),
        isLocked: isLocked,
        lockedDirections: { ...lockedDirections }
    });
}
function gaussianFunction(x, mean, stdDev) {
    return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * 
           Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
}


// Modify the checkWinCondition function
function checkWinCondition() {
    const allGoalsReached = Object.keys(goals).every(color => scores[color] >= goals[color]);
    if (allGoalsReached) {
        stopSimulation();
        isCapturingFrames = false;
        
        console.log(`Level completed in ${stepCount} steps`); // Debug output
        
        if (!isInFreeMode) {
            const adjustedStepCount = Math.max(stepCount - 4, 0);
            previousSolutions.push({ steps: adjustedStepCount, tiles: tilesUsed });
            localStorage.setItem('previousSolutions', JSON.stringify(previousSolutions));
            console.log('Updated previousSolutions:', previousSolutions); // Debug output
        }
        
        document.getElementById('win-screen').style.display = 'flex';
        document.getElementById('export-gif-btn').style.display = 'inline-block';
        
        displayWinStats(stepCount);
    }
}
function managePortalNumbers() {
    let maxPortalNumber = 0;
    for (let number in portalPairs) {
        if (portalPairs[number].length > 0) {
            maxPortalNumber = Math.max(maxPortalNumber, parseInt(number));
        } else {
            delete portalPairs[number];
        }
    }
    nextPortalNumber = maxPortalNumber + 1;
}

// Modify the displayWinStats function
function displayWinStats(currentStepCount) {
    console.log('Displaying win stats', { currentStepCount, previousSolutions });
    const statsContainer = document.getElementById('win-stats');
    
    if (isInFreeMode) {
        statsContainer.innerHTML = `
            <p>Level completed in Free Mode</p>
            <p>Steps taken: ${currentStepCount}</p>
            <p>Tiles used: ${tilesUsed}</p>
            <p>Stats are not recorded in Free Mode</p>
        `;
    } else {
        const adjustedStepCount = Math.max(currentStepCount - 4, 0);
        const stepsData = previousSolutions.map(s => s.steps);
        const tilesData = previousSolutions.map(s => s.tiles);
        
        console.log('Stats data:', { adjustedStepCount, stepsData, tilesData });

        const stepsStats = calculateMeanAndStdDev(stepsData);
        const tilesStats = calculateMeanAndStdDev(tilesData);
        
        console.log('Calculated stats:', { stepsStats, tilesStats });

        statsContainer.innerHTML = `
            <p>Your performance:</p>
            <p>Steps taken: ${adjustedStepCount} (Average: ${Math.round(stepsStats.mean)}, StdDev: ${Math.round(stepsStats.stdDev)})</p>
            <p>Tiles used: ${tilesUsed} (Average: ${Math.round(tilesStats.mean)}, StdDev: ${Math.round(tilesStats.stdDev)})</p>
        `;
    }
    
    if (!isInFreeMode) {
        renderSolutionsCharts(adjustedStepCount);
    }
}



// Modify the renderSolutionsCharts function
function renderSolutionsCharts(currentAdjustedStepCount) {
    console.log('Rendering solution charts', { currentAdjustedStepCount, previousSolutions });
    const stepsData = previousSolutions.map(s => s.steps);
    const tilesData = previousSolutions.map(s => s.tiles);

    console.log('Chart data:', { stepsData, tilesData });

    if (stepsData.length > 0) {
        createGaussianChart('steps-chart', stepsData, currentAdjustedStepCount, '#880000', 'Steps Distribution');
    } else {
        document.getElementById('steps-chart').innerHTML = '<p>Not enough data for steps distribution</p>';
    }
    
    if (tilesData.length > 0) {
        createGaussianChart('tiles-chart', tilesData, tilesUsed, '#009911', 'Tiles Distribution');
    } else {
        document.getElementById('tiles-chart').innerHTML = '<p>Not enough data for tiles distribution</p>';
    }
}

function handleOverflow(color) {
    if (scores[color] >= goals[color]) {
        waste[color]++;
        updateWaste();
    } else {
        scores[color]++;
        updateScores();
    }
    checkWinCondition();
    checkLossCondition();
}



function checkLossCondition() {
    if (!isSimulating) return false;

    const wasteLimitExceeded = Object.keys(waste).some(color => waste[color] > wasteLimits[color]);
    if (wasteLimitExceeded) {
        stopSimulation();
        document.getElementById('loss-screen').style.display = 'flex';
        setupLossScreenButton();
        return true;
    }
    return false;
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
function populateLevelSelect() {
    const levelSelect = document.getElementById('level-select');
    const levels = ['level1.csv', 'level2.csv', 'level3.csv']; // Add your level filenames here

    levels.forEach(level => {
        const option = document.createElement('option');
        option.value = level;
        option.textContent = level.replace('.csv', '');
        levelSelect.appendChild(option);
    });
}

function loadLevel(levelFileOrSeed) {
    if (levelFileOrSeed.endsWith('.csv')) {
        // Load from file
        fetch(levelFileOrSeed)
            .then(response => response.text())
            .then(csvContent => {
                loadLevelFromCSV(csvContent);
                isInFreeMode = false;
                updateFreeModeUI();
            })
            .catch(error => console.error('Error loading level:', error));
    } else {
        // Treat as a seed
        loadLevelFromSeed(levelFileOrSeed);
    }
}
function loadLevelFromCSV(csvContent) {
    console.log("CSV Content:", csvContent);

    const lines = csvContent.trim().split('\n');
    console.log("Number of lines:", lines.length);

    const GRID_SIZE = 12;
    console.log("Grid size:", GRID_SIZE);

    // Parse grid content
    grid = [];
    for (let i = 0; i < GRID_SIZE; i++) {
        if (i < lines.length) {
            const parsedRow = lines[i].split(',').map(Number);
            grid.push(parsedRow.length === GRID_SIZE ? parsedRow : Array(GRID_SIZE).fill(TILE_TYPES.EMPTY));
        } else {
            grid.push(Array(GRID_SIZE).fill(TILE_TYPES.EMPTY));
        }
    }
    console.log("Parsed grid:", grid);

    originalGrid = JSON.parse(JSON.stringify(grid));

    // Parse inventory content
    inventory = {};
    if (lines.length > GRID_SIZE) {
        lines[GRID_SIZE].split(',').forEach(item => {
            const [key, value] = item.split(':');
            const tileType = parseInt(key);
            const quantity = parseInt(value) || 0;
            inventory[tileType] = quantity;
        });
    }
    console.log("Parsed inventory:", inventory);

    // Parse goals
    goals = { crimson: 0, green: 0, blue: 0, yellow: 0, purple: 0, orange: 0, white: 0 };
    if (lines.length > GRID_SIZE + 1) {
        lines[GRID_SIZE + 1].split(',').forEach(item => {
            const [key, value] = item.split(':');
            goals[key] = parseInt(value) || 0;
        });
    }
    console.log("Parsed goals:", goals);

    // Parse waste limits
    wasteLimits = { crimson: 10, green: 10, blue: 10, yellow: 10, purple: 10, orange: 10, white: 10 };
    if (lines.length > GRID_SIZE + 2) {
        lines[GRID_SIZE + 2].split(',').forEach(item => {
            const [key, value] = item.split(':');
            wasteLimits[key] = parseInt(value) || 10;
        });
    }
    console.log("Parsed waste limits:", wasteLimits);

    // Parse portal pairs
    portalPairs = {};
    let maxPortalNumber = 0;
    if (lines.length > GRID_SIZE + 3 && lines[GRID_SIZE + 3].trim() !== '') {
        lines[GRID_SIZE + 3].split(';').forEach(pair => {
            const [number, coords] = pair.split(':');
            const coordsArray = coords.split(',').map(Number);
            portalPairs[number] = [];
            for (let i = 0; i < coordsArray.length; i += 2) {
                if (!isNaN(coordsArray[i]) && !isNaN(coordsArray[i+1])) {
                    portalPairs[number].push({ row: coordsArray[i], col: coordsArray[i+1] });
                }
            }
            maxPortalNumber = Math.max(maxPortalNumber, parseInt(number));
        });
    }
    nextPortalNumber = maxPortalNumber + 1;
    console.log("Parsed portal pairs:", portalPairs);

    // Reset scores and waste
    scores = { crimson: 0, green: 0, blue: 0, yellow: 0, purple: 0, orange: 0, white: 0 };
    waste = { crimson: 0, green: 0, blue: 0, yellow: 0, purple: 0, orange: 0, white: 0 };

    // Reset objects and history
    objects = [];
    history = [];

    // Deselect any previously selected tile
    selectedTile = null;

    // Initialize inventory
    initializeInventory();
    isLevelLoaded = true;
    isInFreeMode = false;
    // Store the initial state
    initialState = {
        grid: JSON.parse(JSON.stringify(grid)),
        inventory: { ...inventory },
        scores: { ...scores },
        waste: { ...waste },
        goals: { ...goals },
        wasteLimits: { ...wasteLimits },
        portalPairs: JSON.parse(JSON.stringify(portalPairs)),
        nextPortalNumber: nextPortalNumber
    };

    console.log("Initial state:", initialState);
    
    // Update the game state
    renderGrid();
    renderInventory();
    renderScoresWaste();
    updateScores();
    updateWaste();
    renderObjects();
    updateUndoButton();
    updateResetClearButton();
    updateFreeModeUI();

    // Reset simulation state
    isSimulating = false;
    isPaused = false;
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }

    // Hide win/loss screens
    hideWinLossScreens();

    console.log("Level loaded successfully");
}

function initializeInventory() {
    // Ensure all tile types (except EMPTY) are represented in the inventory
    for (const tileType in TILE_TYPES) {
        const tileTypeValue = TILE_TYPES[tileType];
        if (tileTypeValue !== TILE_TYPES.EMPTY && !(tileTypeValue in inventory)) {
            inventory[tileTypeValue] = 0;
        }
    }

    // Add lock tiles to the inventory
 

    // Remove items with zero quantity if not in free mode
    if (!isInFreeMode) {
        for (const tileType in inventory) {
            if (inventory[tileType] === 0) {
                delete inventory[tileType];
            }
        }
    }

    console.log("Initialized inventory:", inventory);
}
