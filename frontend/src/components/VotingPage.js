import React from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import VotingChart from './VotingChart';
import './VotingPage.css';

function VotingPage() {
  const { state, isConnected } = useWebSocket();

  if (!state) {
    return (
      <div className="voting-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Connecting to server...</p>
        </div>
      </div>
    );
  }

  const getWinner = (question) => {
    if (question === 'tour') {
      if (state.tour.national > state.tour.international) {
        return 'National';
      } else if (state.tour.international > state.tour.national) {
        return 'International';
      }
      return null;
    } else if (question === 'medical') {
      if (state.medical.insurance > state.medical.allowance) {
        return 'Medical Insurance';
      } else if (state.medical.allowance > state.medical.insurance) {
        return 'Medical Allowance';
      }
      return null;
    }
    return null;
  };

  return (
    <div className="voting-page">
      {!state.isVotingActive && (
        <div className="fireworks-container">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="firework" style={{
              '--x': `${Math.random() * 100}%`,
              '--y': `${Math.random() * 100}%`,
              '--delay': `${Math.random() * 2}s`,
              '--duration': `${1.5 + Math.random()}s`
            }}></div>
          ))}
        </div>
      )}
      
      <div className="company-header">
        <img src="/exabyting_logo.jpeg" alt="Exabyting Logo" className="company-logo" />
        <h1 className="company-name">Exabyting</h1>
      </div>
      
      <div className="connection-status">
        <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></span>
        <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
      </div>

      <div className="voting-container">
        <h1 className="page-title">✨ vote counting! ✨</h1>
        
        {!state.isVotingActive && (
          <>
            <div className="voting-ended-banner">
              <h2>🎉 Voting has ended! 🎉</h2>
            </div>
            
            <div className="winners-section">
              <div className="winners-title">🏆 WINNERS 🏆</div>
              <div className="winners-grid">
                <div className="winner-card">
                  <div className="winner-label">🌍 Tour</div>
                  <div className="winner-name">{getWinner('tour') || 'Tie'}</div>
                  <div className="winner-votes">
                    {state.tour.national > state.tour.international 
                      ? `${state.tour.national} votes`
                      : state.tour.international > state.tour.national
                      ? `${state.tour.international} votes`
                      : 'Tie'}
                  </div>
                </div>
                <div className="winner-card">
                  <div className="winner-label">🏥 Medical Benefit</div>
                  <div className="winner-name">{getWinner('medical') || 'Tie'}</div>
                  <div className="winner-votes">
                    {state.medical.insurance > state.medical.allowance 
                      ? `${state.medical.insurance} votes`
                      : state.medical.allowance > state.medical.insurance
                      ? `${state.medical.allowance} votes`
                      : 'Tie'}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="questions-grid">
          <div className="question-section">
            <h2 className="question-title">🌍 Tour: National vs International</h2>
            <VotingChart
              question="tour"
              labels={['National', 'International']}
              data={[state.tour.national, state.tour.international]}
              colors={['#5BA3F5', '#357ABD']}
            />
          </div>

          <div className="question-section">
            <h2 className="question-title">🏥 Medical Benefit: Insurance vs Allowance</h2>
            <VotingChart
              question="medical"
              labels={['Medical Insurance', 'Medical Allowance']}
              data={[state.medical.insurance, state.medical.allowance]}
              colors={['#6BC5E8', '#4A90E2']}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default VotingPage;

