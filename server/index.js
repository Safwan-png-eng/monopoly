import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { nanoid } from 'nanoid';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});

const PORT = process.env.PORT || 3000;

// Property definitions (for demo, 22 properties)
const properties = [
  { name: 'GO', price: 0, rent: 0 },
  { name: 'Med Ave', price: 60, rent: 2 },
  { name: 'Baltic', price: 60, rent: 4 },
  { name: 'Chance', price: 0, rent: 0 },
  { name: 'Oriental', price: 100, rent: 6 },
  { name: 'Vermont', price: 100, rent: 6 },
  { name: 'Connecticut', price: 120, rent: 8 },
  { name: 'Jail', price: 0, rent: 0 },
  { name: 'St. Charles', price: 140, rent: 10 },
  { name: 'States', price: 140, rent: 10 },
  { name: 'Virginia', price: 160, rent: 12 },
  { name: 'St. James', price: 180, rent: 14 },
  { name: 'Tennessee', price: 180, rent: 14 },
  { name: 'New York', price: 200, rent: 16 },
  { name: 'Free Parking', price: 0, rent: 0 },
  { name: 'Kentucky', price: 220, rent: 18 },
  { name: 'Indiana', price: 220, rent: 18 },
  { name: 'Illinois', price: 240, rent: 20 },
  { name: 'B&O RR', price: 200, rent: 25 },
  { name: 'Go To Jail', price: 0, rent: 0 },
  { name: 'Boardwalk', price: 400, rent: 50 },
  { name: 'Park Place', price: 350, rent: 35 }
];

// In-memory game rooms
const rooms = {};

// Helper: create a new game state
function createGameState() {
  return {
    players: [],
    turn: 0,
    board: properties.map((p, i) => ({ ...p, owner: null, idx: i })),
    log: [],
    started: false
  };
}

io.on('connection', (socket) => {
  // Join a room
  socket.on('joinRoom', ({ roomId, name, avatar }, cb) => {
    if (!rooms[roomId]) {
      rooms[roomId] = createGameState();
    }
    const player = {
      id: socket.id,
      name,
      avatar,
      money: 1500,
      position: 0
    };
    rooms[roomId].players.push(player);
    socket.join(roomId);
    io.to(roomId).emit('update', rooms[roomId]);
    cb && cb({ success: true, playerId: socket.id });
  });

  // Start game
  socket.on('startGame', (roomId) => {
    if (rooms[roomId]) {
      rooms[roomId].started = true;
      io.to(roomId).emit('update', rooms[roomId]);
    }
  });

  // Player action (e.g., roll dice, buy property)
  socket.on('action', ({ roomId, action, data }) => {
    const room = rooms[roomId];
    if (!room) return;
    const currentPlayer = room.players[room.turn];
    if (action === 'rollDice' && currentPlayer.id === socket.id) {
      // Roll dice
      const dice1 = Math.floor(Math.random() * 6) + 1;
      const dice2 = Math.floor(Math.random() * 6) + 1;
      const total = dice1 + dice2;
      // Move player
      currentPlayer.position = (currentPlayer.position + total) % room.board.length;
      room.log.push({ player: currentPlayer.name, action: 'rollDice', dice1, dice2, total });
      // Check property
      const tile = room.board[currentPlayer.position];
      if (tile.price > 0 && !tile.owner && currentPlayer.money >= tile.price) {
        // Can buy property
        room.awaitingBuy = { playerId: currentPlayer.id, propertyIdx: tile.idx };
      } else if (tile.price > 0 && tile.owner && tile.owner !== currentPlayer.id) {
        // Pay rent
        const owner = room.players.find(p => p.id === tile.owner);
        if (owner) {
          currentPlayer.money -= tile.rent;
          owner.money += tile.rent;
          room.log.push({ player: currentPlayer.name, action: 'payRent', to: owner.name, amount: tile.rent });
        }
      }
      // Advance turn only if not awaiting buy
      if (!room.awaitingBuy) {
        room.turn = (room.turn + 1) % room.players.length;
      }
      io.to(roomId).emit('update', room);
    }
    if (action === 'buyProperty' && room.awaitingBuy && room.awaitingBuy.playerId === socket.id) {
      const idx = room.awaitingBuy.propertyIdx;
      const tile = room.board[idx];
      if (tile && !tile.owner && currentPlayer.money >= tile.price) {
        tile.owner = currentPlayer.id;
        currentPlayer.money -= tile.price;
        room.log.push({ player: currentPlayer.name, action: 'buyProperty', property: tile.name, price: tile.price });
      }
      room.awaitingBuy = null;
      room.turn = (room.turn + 1) % room.players.length;
      io.to(roomId).emit('update', room);
    }
  });

  // Leave room/disconnect
  socket.on('disconnecting', () => {
    for (const roomId of socket.rooms) {
      if (rooms[roomId]) {
        rooms[roomId].players = rooms[roomId].players.filter(p => p.id !== socket.id);
        io.to(roomId).emit('update', rooms[roomId]);
      }
    }
  });
});

app.get('/', (req, res) => {
  res.send('Monopoly server is running!');
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 