import React from 'react';
import api from "../api/axios";
function PollResults({ poll, userVote }) {
  const totalVotes = poll.totalVotes || poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div className="results-wrapper">
      {poll.options.map(option => {
        const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
        const isUserChoice = option._id === userVote;

        return (
          <div key={option._id} className={`result-bar-item ${isUserChoice ? 'user-choice' : ''}`}>
            <div className="result-bar-info">
              <span className="option-text">{option.text} {isUserChoice && ' (Your Vote)'}</span>
              <span className="option-percent">{percentage.toFixed(0)}%</span>
            </div>
            <div className="result-bar-bg">
              <div
                className="result-bar-fg"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <div className="vote-count">{option.votes} vote(s)</div>
          </div>
        );
      })}
      <p className="total-votes">Total Votes: {totalVotes}</p>
    </div>
  );
}
const fetchPolls = async () => {
  try {
    const res = await api.get("/polls");
    console.log(res.data);
  } catch (err) {
    console.error(err);
  }
};
export default PollResults;