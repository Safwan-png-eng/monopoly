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

// In-memory game rooms
const rooms = {};

// Helper: create a new game state
function createGameState() {
  return {
    players: [],
    turn: 0,
    board: [], // You can expand this
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
    // TODO: Implement game logic here
    rooms[roomId].log.push({ player: socket.id, action, data });
    io.to(roomId).emit('update', rooms[roomId]);
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