import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function CreatePoll() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleQuestionChange = (e) => {
    const value = e.target.value;
    // Quick-create feature
    if (value.includes('?') && value.includes(',')) {
        const parts = value.split('?');
        const q = parts[0] + '?';
        const opts = parts[1].split(',').map(o => o.trim()).filter(Boolean);
        if (opts.length >= 2 && opts.length <= 4) {
            setQuestion(q);
            // Ensure options array has the right length before setting
            const newOptions = [...opts];
            while (newOptions.length < 2) newOptions.push('');
            setOptions(newOptions.slice(0, 4));
            return;
        }
    }
    setQuestion(value);
  };
  
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 4) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const filteredOptions = options.filter(opt => opt.trim() !== '');
    if (question.trim().length === 0 || filteredOptions.length < 2) {
      setError('Please provide a question and at least two options.');
      return;
    }

    // --- KEY CHANGES START HERE ---
    
    // 1. Immediately set loading state to give the user instant feedback
    setIsLoading(true);

    try {
      const response = await api.post(`/polls`, {
        question,
        options: filteredOptions,
      });
      // On success, navigate to the next page
      navigate(`/poll/${response.data.pollId}/created`);
    } catch (err) {
      // On error, show a more helpful message
      setError('Failed to create poll. The server might be waking up. Please try again in a moment.');
      console.error(err);
    } finally {
      // 2. ALWAYS set loading back to false, whether the request succeeded or failed
      setIsLoading(false); 
    }
  };

  return (
    <div className="card">
      <h2>Create a New Poll</h2>
      <p className="subtitle">Enter a question and up to 4 options. Polls expire in 24 hours.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="question">Question (max 120 chars)</label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={handleQuestionChange}
            maxLength="120"
            placeholder="e.g., Best pizza topping? Pepperoni, Mushrooms"
            required
            disabled={isLoading} // Optionally disable inputs while loading
          />
        </div>
        
        {options.map((option, index) => (
          <div className="form-group option-group" key={index}>
            <label htmlFor={`option-${index}`}>Option {index + 1}</label>
            <input
              type="text"
              id={`option-${index}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              required
              disabled={isLoading} // Optionally disable inputs while loading
            />
            {options.length > 2 && (
              <button type="button" className="remove-btn" onClick={() => removeOption(index)} disabled={isLoading}>
                &times;
              </button>
            )}
          </div>
        ))}

        {options.length < 4 && (
          <button type="button" className="secondary-btn" onClick={addOption} disabled={isLoading}>
            Add Option
          </button>
        )}

        {error && <p className="error">{error}</p>}
        
        {/* 3. This button now gives instant feedback */}
        <button type="submit" className="primary-btn" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Poll'}
        </button>
      </form>
    </div>
  );
}

export default CreatePoll;