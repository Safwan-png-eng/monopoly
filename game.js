let selectedAvatar = null;
let socket = null;
let roomId = null;
let playerName = null;
let playerId = null;
let isHost = false;
let gameStarted = false;

window.addEventListener('DOMContentLoaded', () => {
    // Room modal logic
    const roomModal = document.getElementById('room-modal');
    const avatars = document.querySelectorAll('.avatar');
    const joinBtn = document.getElementById('join-room-btn');
    const roomCodeInput = document.getElementById('room-code');
    const playerNameInput = document.getElementById('player-name');
    const gameContainer = document.querySelector('.game-container');
    const lobbyContainer = document.querySelector('.lobby-container');
    const lobbyRoomId = document.getElementById('lobby-room-id');
    const lobbyPlayers = document.getElementById('lobby-players');
    const startGameBtn = document.getElementById('start-game-btn');
    const lobbyWaiting = document.getElementById('lobby-waiting');

    avatars.forEach(avatar => {
        avatar.addEventListener('click', () => {
            avatars.forEach(a => a.classList.remove('selected'));
            avatar.classList.add('selected');
            selectedAvatar = avatar.innerHTML;
        });
    });

    joinBtn.addEventListener('click', () => {
        playerName = playerNameInput.value.trim() || 'Player';
        roomId = roomCodeInput.value.trim().toUpperCase() || Math.random().toString(36).substr(2, 6).toUpperCase();
        if (!selectedAvatar) {
            alert('Please select an avatar!');
            return;
        }
        roomModal.style.display = 'none';
        lobbyContainer.style.display = '';
        connectToServer();
    });

    startGameBtn.addEventListener('click', () => {
        if (socket && roomId) {
            socket.emit('startGame', roomId);
        }
    });

    // Roll dice button logic
    const rollBtn = document.getElementById('roll-dice');
    if (rollBtn) {
        rollBtn.addEventListener('click', () => {
            if (socket && roomId) {
                socket.emit('action', { roomId, action: 'rollDice' });
            }
        });
    }
});

function connectToServer() {
    socket = io('https://monopoly-yiw3.onrender.com');
    socket.emit('joinRoom', {
        roomId,
        name: playerName,
        avatar: selectedAvatar
    }, (res) => {
        if (res && res.success) {
            playerId = res.playerId;
            addLogEntry(`Joined room ${roomId} as ${playerName}`);
        }
    });
    socket.on('update', (gameState) => {
        updateLobby(gameState);
        if (gameState.started && !gameStarted) {
            startGameUI(gameState);
        }
    });
}

function updateLobby(gameState) {
    const lobbyContainer = document.querySelector('.lobby-container');
    const lobbyRoomId = document.getElementById('lobby-room-id');
    const lobbyPlayers = document.getElementById('lobby-players');
    const startGameBtn = document.getElementById('start-game-btn');
    const lobbyWaiting = document.getElementById('lobby-waiting');
    if (!lobbyContainer) return;
    lobbyRoomId.textContent = roomId;
    lobbyPlayers.innerHTML = '';
    gameState.players.forEach((p, idx) => {
        const div = document.createElement('div');
        div.className = 'lobby-player';
        div.innerHTML = `<span class="lobby-player-avatar">${p.avatar || ''}</span> <span>${p.name}</span>${idx === 0 ? ' <span style="color:#FFD166;">(Host)</span>' : ''}`;
        lobbyPlayers.appendChild(div);
    });
    isHost = (gameState.players[0] && gameState.players[0].id === playerId);
    startGameBtn.style.display = isHost && !gameState.started ? '' : 'none';
    lobbyWaiting.style.display = !isHost && !gameState.started ? '' : 'none';
    if (gameState.started) {
        renderBoard(gameState);
        renderPlayerPanel(gameState);
        updateCurrentPlayerInfo(gameState);
        // Show last dice roll in log and on dice
        const lastRoll = (gameState.log || []).slice().reverse().find(e => e.action === 'rollDice');
        if (lastRoll) {
            document.getElementById('dice1').textContent = lastRoll.dice1;
            document.getElementById('dice2').textContent = lastRoll.dice2;
            addLogEntry(`${lastRoll.player} rolled ${lastRoll.dice1} and ${lastRoll.dice2} (${lastRoll.total})`);
        }
        // Show buy/rent actions in log
        const lastBuy = (gameState.log || []).slice().reverse().find(e => e.action === 'buyProperty');
        if (lastBuy) {
            addLogEntry(`${lastBuy.player} bought ${lastBuy.property} for $${lastBuy.price}`);
        }
        const lastRent = (gameState.log || []).slice().reverse().find(e => e.action === 'payRent');
        if (lastRent) {
            addLogEntry(`${lastRent.player} paid $${lastRent.amount} rent to ${lastRent.to}`);
        }
    }
}

function startGameUI(gameState) {
    gameStarted = true;
    document.querySelector('.lobby-container').style.display = 'none';
    document.querySelector('.game-container').style.display = '';
    addLogEntry('Game started!');
    renderBoard(gameState);
    renderPlayerPanel(gameState);
    updateCurrentPlayerInfo(gameState);
}

function renderBoard(gameState) {
    const boardGrid = document.getElementById('board-grid');
    if (!boardGrid) return;
    const board = gameState.board || [];
    boardGrid.innerHTML = '';
    for (let i = 0; i < 8 * 8; i++) {
        let prop = null;
        if (i < board.length) prop = board[i];
        const tile = document.createElement('div');
        tile.className = 'board-tile';
        if (prop) {
            tile.innerHTML = `<div>${prop.name}</div>`;
            if (prop.owner) {
                const owner = gameState.players.find(p => p.id === prop.owner);
                tile.innerHTML += `<div style='font-size:0.8em;color:#FFD166;'>🏠 ${owner ? owner.name : 'Player'}</div>`;
            }
        }
        // Show player tokens on this tile
        const playersHere = gameState.players.filter(p => p.position === i);
        if (playersHere.length > 0) {
            const playerDiv = document.createElement('div');
            playerDiv.className = 'tile-players';
            playersHere.forEach(p => {
                const av = document.createElement('span');
                av.className = 'tile-player-avatar';
                av.textContent = p.avatar || '';
                playerDiv.appendChild(av);
            });
            tile.appendChild(playerDiv);
        }
        boardGrid.appendChild(tile);
    }
    // Show Buy Property button if needed
    showBuyPropertyButton(gameState);
}

function showBuyPropertyButton(gameState) {
    let buyBtn = document.getElementById('buy-property-btn');
    if (!buyBtn) {
        buyBtn = document.createElement('button');
        buyBtn.id = 'buy-property-btn';
        buyBtn.style.margin = '1rem 0';
        buyBtn.style.display = 'none';
        buyBtn.textContent = 'Buy Property';
        document.querySelector('.game-controls').insertBefore(buyBtn, document.querySelector('.game-log'));
    }
    buyBtn.style.display = 'none';
    if (gameState.awaitingBuy && playerId && gameState.awaitingBuy.playerId === playerId) {
        const prop = gameState.board[gameState.awaitingBuy.propertyIdx];
        buyBtn.textContent = `Buy ${prop.name} for $${prop.price}`;
        buyBtn.style.display = '';
        buyBtn.disabled = false;
        buyBtn.onclick = () => {
            if (socket && roomId) {
                socket.emit('action', { roomId, action: 'buyProperty' });
            }
        };
    }
}

function renderPlayerPanel(gameState) {
    const playerList = document.getElementById('player-list');
    if (!playerList) return;
    playerList.innerHTML = '';
    gameState.players.forEach((p, idx) => {
        const div = document.createElement('div');
        div.className = 'player-list-item';
        if (gameState.turn === idx) div.style.background = '#FFD16644';
        div.innerHTML = `<span class="player-list-avatar">${p.avatar || ''}</span> <span>${p.name}</span> <span style="margin-left:auto;">$${p.money}</span>`;
        playerList.appendChild(div);
    });
}

function updateCurrentPlayerInfo(gameState) {
    const current = gameState.players[gameState.turn];
    document.getElementById('current-player').textContent = `${current.avatar || ''} ${current.name}`;
    document.getElementById('player-money').textContent = current.money;
    // Enable roll dice only for current player
    const rollBtn = document.getElementById('roll-dice');
    if (playerId && current.id === playerId) {
        rollBtn.disabled = false;
        rollBtn.textContent = 'Roll Dice';
    } else {
        rollBtn.disabled = true;
        rollBtn.textContent = 'Waiting...';
    }
}

function addLogEntry(message) {
    const logEntries = document.getElementById('log-entries');
    if (!logEntries) return;
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = message;
    logEntries.insertBefore(entry, logEntries.firstChild);
}

class MonopolyGame {
    constructor() {
        this.players = [
            { id: 1, name: 'Player 1', money: 1500, position: 0, avatar: selectedAvatar },
            { id: 2, name: 'Player 2', money: 1500, position: 0, avatar: '🟢' }
        ];
        this.currentPlayerIndex = 0;
        this.properties = this.initializeProperties();
        this.setupEventListeners();
    }

    initializeProperties() {
        // Basic property setup - can be expanded
        return [
            { id: 0, name: 'GO', price: 0, rent: 0 },
            { id: 1, name: 'Mediterranean Avenue', price: 60, rent: 2, color: 'brown' },
            { id: 2, name: 'Baltic Avenue', price: 60, rent: 4, color: 'brown' },
            // Add more properties as needed
        ];
    }

    setupEventListeners() {
        const rollButton = document.getElementById('roll-dice');
        rollButton.addEventListener('click', () => this.rollDice());
    }

    rollDice() {
        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        
        document.getElementById('dice1').textContent = dice1;
        document.getElementById('dice2').textContent = dice2;

        const total = dice1 + dice2;
        this.movePlayer(total);
        
        this.addLogEntry(`${this.getCurrentPlayer().name} rolled ${dice1} and ${dice2} (${total})`);
        
        if (dice1 === dice2) {
            this.addLogEntry('Doubles! Roll again!');
        } else {
            this.nextPlayer();
        }
    }

    movePlayer(spaces) {
        const player = this.getCurrentPlayer();
        player.position = (player.position + spaces) % this.properties.length;
        this.addLogEntry(`${player.name} moved to ${this.properties[player.position].name}`);
        
        // Handle property landing logic
        this.handlePropertyLanding(player);
    }

    handlePropertyLanding(player) {
        const property = this.properties[player.position];
        if (property.price > 0) {
            // Add property purchase logic here
            this.addLogEntry(`${property.name} is available for $${property.price}`);
        }
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    nextPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        const player = this.getCurrentPlayer();
        document.getElementById('current-player').textContent = `${player.avatar || ''} ${player.name}`;
        document.getElementById('player-money').textContent = player.money;
    }

    addLogEntry(message) {
        const logEntries = document.getElementById('log-entries');
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = message;
        logEntries.insertBefore(entry, logEntries.firstChild);
    }
}

// Initialize the game when the page loads (after avatar selection)
window.addEventListener('load', () => {
    // Wait for avatar selection before starting the game
    document.getElementById('join-game-btn').addEventListener('click', () => {
        setTimeout(() => {
            window.monopolyGame = new MonopolyGame();
        }, 100);
    });
}); 