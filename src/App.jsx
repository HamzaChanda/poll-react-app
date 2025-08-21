import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CreatePoll from './pages/CreatePoll';
import PollPage from './pages/PollPage';
import PollCreated from './pages/PollCreated';
import './App.css';

function App() {
  return (
    <div className="container">
      <header>
        <h1>Quick Poll</h1>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<CreatePoll />} />
          <Route path="/poll/:id" element={<PollPage />} />
          <Route path="/poll/:id/created" element={<PollCreated />} />
        </Routes>
      </main>
      <footer>
        <p>Built with Node.js, React, and Socket.IO</p>
      </footer>
    </div>
  );
}

export default App;