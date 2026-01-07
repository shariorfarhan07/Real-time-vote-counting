const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// WebSocket server
const wss = new WebSocket.Server({ server });

// Voting state - using a simple in-memory store with atomic operations
const votingState = {
  tour: {
    national: 0,
    international: 0
  },
  medical: {
    insurance: 0,
    allowance: 0
  },
  isVotingActive: true
};

// Lock for atomic operations
let operationLock = false;
const operationQueue = [];

// Atomic operation executor
async function executeAtomic(operation) {
  return new Promise((resolve) => {
    operationQueue.push({ operation, resolve });
    processQueue();
  });
}

async function processQueue() {
  if (operationLock || operationQueue.length === 0) {
    return;
  }
  
  operationLock = true;
  const { operation, resolve } = operationQueue.shift();
  
  try {
    const result = await operation();
    resolve(result);
  } catch (error) {
    resolve({ error: error.message });
  } finally {
    operationLock = false;
    processQueue();
  }
}

// Broadcast state to all connected clients
function broadcastState() {
  const message = JSON.stringify({
    type: 'state_update',
    data: votingState
  });
  
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New client connected');
  
  // Send current state to newly connected client
  ws.send(JSON.stringify({
    type: 'state_update',
    data: votingState
  }));
  
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'increment_vote':
          await executeAtomic(() => {
            if (!votingState.isVotingActive) {
              return { error: 'Voting is not active' };
            }
            
            if (data.question === 'tour' && data.option === 'national') {
              votingState.tour.national++;
            } else if (data.question === 'tour' && data.option === 'international') {
              votingState.tour.international++;
            } else if (data.question === 'medical' && data.option === 'insurance') {
              votingState.medical.insurance++;
            } else if (data.question === 'medical' && data.option === 'allowance') {
              votingState.medical.allowance++;
            }
            
            broadcastState();
            return { success: true };
          });
          break;
          
        case 'decrement_vote':
          await executeAtomic(() => {
            if (!votingState.isVotingActive) {
              return { error: 'Voting is not active' };
            }
            
            if (data.question === 'tour' && data.option === 'national' && votingState.tour.national > 0) {
              votingState.tour.national--;
            } else if (data.question === 'tour' && data.option === 'international' && votingState.tour.international > 0) {
              votingState.tour.international--;
            } else if (data.question === 'medical' && data.option === 'insurance' && votingState.medical.insurance > 0) {
              votingState.medical.insurance--;
            } else if (data.question === 'medical' && data.option === 'allowance' && votingState.medical.allowance > 0) {
              votingState.medical.allowance--;
            }
            
            broadcastState();
            return { success: true };
          });
          break;
          
        case 'start_voting':
          await executeAtomic(() => {
            votingState.isVotingActive = true;
            broadcastState();
            return { success: true };
          });
          break;
          
        case 'end_voting':
          await executeAtomic(() => {
            votingState.isVotingActive = false;
            broadcastState();
            return { success: true };
          });
          break;
          
        default:
          ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
      }
    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(JSON.stringify({ type: 'error', message: error.message }));
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// REST API endpoints for initial state (optional, for HTTP polling fallback)
app.get('/api/state', (req, res) => {
  res.json(votingState);
});

const PORT = process.env.PORT || 5556;
const HOST = process.env.HOST || '127.0.0.1';

server.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
  console.log(`WebSocket server ready for connections`);
});

