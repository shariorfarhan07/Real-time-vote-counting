import React from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import './AdminPage.css';

function AdminPage() {
  const { state, isConnected, sendMessage } = useWebSocket();

  const handleIncrement = (question, option) => {
    sendMessage({
      type: 'increment_vote',
      question,
      option
    });
  };

  const handleDecrement = (question, option) => {
    sendMessage({
      type: 'decrement_vote',
      question,
      option
    });
  };

  const handleStartVoting = () => {
    sendMessage({ type: 'start_voting' });
  };

  const handleEndVoting = () => {
    sendMessage({ type: 'end_voting' });
  };

  if (!state) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Connecting to server...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="connection-status">
        <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></span>
        <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
      </div>

      <div className="admin-container">
        <h1 className="page-title">Admin Control Panel</h1>

        <div className="voting-control-section">
          <h2>Voting Control</h2>
          <div className="control-buttons">
            <button
              onClick={handleStartVoting}
              disabled={state.isVotingActive || !isConnected}
              className="control-btn start-btn"
            >
              Start Voting
            </button>
            <button
              onClick={handleEndVoting}
              disabled={!state.isVotingActive || !isConnected}
              className="control-btn end-btn"
            >
              End Voting
            </button>
          </div>
          <div className="voting-status">
            Status: <span className={state.isVotingActive ? 'active' : 'inactive'}>
              {state.isVotingActive ? 'Active' : 'Ended'}
            </span>
          </div>
        </div>

        <div className="question-control-section">
          <h2>Tour: National vs International</h2>
          <div className="vote-controls">
            <div className="option-control">
              <h3>National</h3>
              <div className="vote-buttons">
                <button
                  onClick={() => handleDecrement('tour', 'national')}
                  disabled={!state.isVotingActive || !isConnected || state.tour.national === 0}
                  className="vote-btn decrement-btn"
                >
                  −
                </button>
                <span className="vote-count">{state.tour.national}</span>
                <button
                  onClick={() => handleIncrement('tour', 'national')}
                  disabled={!state.isVotingActive || !isConnected}
                  className="vote-btn increment-btn"
                >
                  +
                </button>
              </div>
            </div>
            <div className="option-control">
              <h3>International</h3>
              <div className="vote-buttons">
                <button
                  onClick={() => handleDecrement('tour', 'international')}
                  disabled={!state.isVotingActive || !isConnected || state.tour.international === 0}
                  className="vote-btn decrement-btn"
                >
                  −
                </button>
                <span className="vote-count">{state.tour.international}</span>
                <button
                  onClick={() => handleIncrement('tour', 'international')}
                  disabled={!state.isVotingActive || !isConnected}
                  className="vote-btn increment-btn"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="question-control-section">
          <h2>Medical Benefit: Medical Insurance vs Medical Allowance</h2>
          <div className="vote-controls">
            <div className="option-control">
              <h3>Medical Insurance</h3>
              <div className="vote-buttons">
                <button
                  onClick={() => handleDecrement('medical', 'insurance')}
                  disabled={!state.isVotingActive || !isConnected || state.medical.insurance === 0}
                  className="vote-btn decrement-btn"
                >
                  −
                </button>
                <span className="vote-count">{state.medical.insurance}</span>
                <button
                  onClick={() => handleIncrement('medical', 'insurance')}
                  disabled={!state.isVotingActive || !isConnected}
                  className="vote-btn increment-btn"
                >
                  +
                </button>
              </div>
            </div>
            <div className="option-control">
              <h3>Medical Allowance</h3>
              <div className="vote-buttons">
                <button
                  onClick={() => handleDecrement('medical', 'allowance')}
                  disabled={!state.isVotingActive || !isConnected || state.medical.allowance === 0}
                  className="vote-btn decrement-btn"
                >
                  −
                </button>
                <span className="vote-count">{state.medical.allowance}</span>
                <button
                  onClick={() => handleIncrement('medical', 'allowance')}
                  disabled={!state.isVotingActive || !isConnected}
                  className="vote-btn increment-btn"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;

