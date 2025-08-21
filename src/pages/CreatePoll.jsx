import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
    setIsLoading(true);

    const filteredOptions = options.filter(opt => opt.trim() !== '');
    if (question.trim().length === 0 || filteredOptions.length < 2) {
      setError('Please provide a question and at least two options.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/polls`, {
        question,
        options: filteredOptions,
      });
      navigate(`/poll/${response.data.pollId}/created`);
    } catch (err) {
      setError('Failed to create poll. Please try again.');
      console.error(err);
    } finally {
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
            />
            {options.length > 2 && (
              <button type="button" className="remove-btn" onClick={() => removeOption(index)}>
                &times;
              </button>
            )}
          </div>
        ))}

        {options.length < 4 && (
          <button type="button" className="secondary-btn" onClick={addOption}>
            Add Option
          </button>
        )}

        {error && <p className="error">{error}</p>}
        
        <button type="submit" className="primary-btn" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Poll'}
        </button>
      </form>
    </div>
  );
}

export default CreatePoll;