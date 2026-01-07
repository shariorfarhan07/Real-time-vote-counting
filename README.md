# Real-Time Voting Application

A one-time-use real-time voting web application with WebSocket support for instant vote updates across all connected clients.

## Features

- **Two Voting Questions:**
  - Tour: National vs International
  - Medical Benefit: Medical Insurance vs Medical Allowance

- **Public Voting View (Index Page):**
  - Real-time vote count updates without page refresh
  - Interactive bar charts that update instantly
  - Automatic winner display when voting ends
  - Connection status indicator

- **Admin Control Page:**
  - Increment/decrement votes for each option
  - Start/end voting functionality
  - All changes reflect immediately on the voting page
  - Real-time synchronization across all clients

- **Technical Features:**
  - WebSocket-based real-time communication
  - Atomic vote operations to prevent race conditions
  - Concurrent update handling
  - Responsive design
  - Auto-reconnection on connection loss

## Project Structure

```
.
├── backend/
│   ├── server.js          # Express server with WebSocket support
│   └── package.json        # Backend dependencies
├── frontend/
│   ├── public/
│   │   └── index.html     # HTML template
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── App.js         # Main app component with routing
│   │   └── index.js       # React entry point
│   └── package.json       # Frontend dependencies
└── README.md              # This file
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation & Setup

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## Running the Application

### Step 1: Start the Backend Server

Open a terminal and run:

```bash
cd backend
npm start
```

The backend server will start on `http://localhost:3001`

### Step 2: Start the Frontend Application

Open a new terminal and run:

```bash
cd frontend
npm start
```

The frontend application will start on `http://localhost:3000` and automatically open in your browser.

## Usage

### Public Voting View

1. Navigate to `http://localhost:3000` (or the index page)
2. View real-time vote counts and bar charts for both questions
3. Charts update automatically as votes change
4. When voting ends, winners are displayed automatically

### Admin Control Page

1. Navigate to `http://localhost:3000/admin` (or click "Admin Control" in the navigation)
2. Use the control buttons to:
   - **Start Voting**: Enable voting (allows vote increments/decrements)
   - **End Voting**: Disable voting and display winners
3. Use the +/- buttons to increment or decrement votes for each option
4. All changes are reflected immediately on the voting page

## Technical Details

### Backend Architecture

- **Express.js** server for HTTP endpoints
- **WebSocket (ws)** for real-time bidirectional communication
- **Atomic Operations**: Queue-based lock system ensures thread-safe vote updates
- **State Management**: In-memory state with broadcast to all connected clients

### Frontend Architecture

- **React** for UI components
- **React Router** for navigation
- **Chart.js** with **react-chartjs-2** for real-time bar charts
- **Custom WebSocket Hook**: Manages connection, reconnection, and state updates

### Concurrency Handling

- All vote operations are queued and executed atomically
- Prevents race conditions when multiple clients update votes simultaneously
- State changes are broadcast to all connected clients immediately

### Real-Time Updates

- WebSocket connections maintain persistent connections
- Automatic reconnection on connection loss
- State synchronization on initial connection
- Instant updates across all open browser tabs/windows

## Development

### Backend Development

For development with auto-reload:

```bash
cd backend
npm run dev
```

(Requires `nodemon` to be installed globally or as a dev dependency)

### Frontend Development

The React app runs in development mode with hot-reload by default:

```bash
cd frontend
npm start
```

## Production Build

### Build Frontend

```bash
cd frontend
npm run build
```

This creates an optimized production build in the `frontend/build` directory.

### Environment Variables

You can customize the WebSocket URL by creating a `.env` file in the frontend directory:

```
REACT_APP_WS_URL=ws://your-server-url:3001
```

## Notes

- This is a one-time-use application with no authentication
- State is stored in memory and will reset when the server restarts
- For production use, consider adding persistent storage (database)
- The application handles concurrent updates safely using atomic operations

## Troubleshooting

### Connection Issues

- Ensure the backend server is running before starting the frontend
- Check that port 3001 is not in use by another application
- Verify firewall settings allow WebSocket connections

### Vote Updates Not Appearing

- Check the connection status indicator (green = connected, red = disconnected)
- Refresh the page if the connection is lost
- Ensure the backend server is running and accessible

## License

ISC

