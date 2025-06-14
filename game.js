let selectedAvatar = null;

window.addEventListener('DOMContentLoaded', () => {
    // Avatar modal logic
    const modal = document.getElementById('avatar-modal');
    const avatars = document.querySelectorAll('.avatar');
    const joinBtn = document.getElementById('join-game-btn');

    avatars.forEach(avatar => {
        avatar.addEventListener('click', () => {
            avatars.forEach(a => a.classList.remove('selected'));
            avatar.classList.add('selected');
            selectedAvatar = avatar.innerHTML;
        });
    });

    joinBtn.addEventListener('click', () => {
        if (!selectedAvatar) {
            alert('Please select an avatar!');
            return;
        }
        modal.style.display = 'none';
        // Optionally, show avatar in player info
        document.getElementById('current-player').textContent = `${selectedAvatar} Player 1`;
    });
});

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