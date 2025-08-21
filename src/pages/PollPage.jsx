import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import PollResults from '../components/PollResults';
import api from '../api/axios';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

function PollPage() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [voted, setVoted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch initial poll data
       api.get(`/polls/${id}`)
      .then(response => {
        setPoll(response.data);
        if(response.data.userVote) {
          setVoted(true);
          setSelectedOption(response.data.userVote);
        }
      })
      .catch(err => {
        setError('Poll not found or an error occurred.');
        console.error(err);
      })
      .finally(() => setIsLoading(false));

    // Setup WebSocket connection
    const socket = io(SOCKET_URL);
    socket.emit('joinPoll', id);
    socket.on('pollUpdate', (updatedPoll) => {
      setPoll(updatedPoll);
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  const handleVote = async () => {
    if (!selectedOption) {
      setError("Please select an option to vote.");
      return;
    }
    try {
      await api.post(`/polls/${id}/vote`, { optionId: selectedOption });
      setVoted(true);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'You have already voted or an error occurred.');
      setVoted(true); // Assume they have voted if server rejects
    }
  };

  if (isLoading) return <p>Loading poll...</p>;
  if (error && !poll) return <p className="error">{error}</p>;
  if (!poll) return null;

  const isExpired = new Date() > new Date(poll.expiresAt);

  return (
    <div className="card poll-view">
      <h2>{poll.question}</h2>
      {isExpired && <p className="expired-notice">This poll has expired. Here are the final results.</p>}
      
      {(!voted && !isExpired) ? (
        <div className="vote-section">
          {poll.options.map(option => (
            <button
              key={option._id}
              className={`option-btn ${selectedOption === option._id ? 'selected' : ''}`}
              onClick={() => setSelectedOption(option._id)}
            >
              {option.text}
            </button>
          ))}
          <button className="primary-btn" onClick={handleVote} disabled={!selectedOption}>
            Submit Vote
          </button>
          {error && <p className="error">{error}</p>}
        </div>
      ) : (
        <div className="results-section">
          {voted && !isExpired && <p className="voted-notice">Thank you for voting!</p>}
          <PollResults poll={poll} userVote={selectedOption} />
        </div>
      )}

      {poll.insight && <div className="insight-box">💡 {poll.insight}</div>}

    </div>
  );
}

export default PollPage;