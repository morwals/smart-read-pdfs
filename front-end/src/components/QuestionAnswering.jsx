// src/components/QuestionAnswering.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { askQuestion } from '../services/api';

const QuestionAnswering = ({ documentText }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [questionHistory, setQuestionHistory] = useState([]);

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      return;
    }

    setLoading(true);
    setAnswer(null);
    setError(null);

    try {
      const { answer } = await askQuestion(question, documentText);
      
      const newQuestion = {
        id: Date.now(),
        text: question,
        answer: answer
      };
      
      setQuestionHistory([newQuestion, ...questionHistory]);
      setAnswer(answer);
      setQuestion('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="QA-main-div">
      <h2 className="QA-h1">Ask Questions</h2>
      <form onSubmit={handleQuestionSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about the document..."
            className="QA-input"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="QA-btn"
        >
          {loading ? 'Processing...' : 'Ask'}
        </button>
      </form>

      {error && <p className="QA-error">{error}</p>}

      {answer && (
        <div className="QA-ans-div">
          <h3 className="QA-h3">Answer:</h3>
          <p>{answer}</p>
        </div>
      )}

      {questionHistory.length > 0 && (
        <div className="QH-div">
          <h3 className="QH-h3">Previous Questions</h3>
          <div className="QH-div2">
            {questionHistory.map((item) => (
              <div key={item.id} className="QH-div3">
                <p className="p-text">Q: {item.text}</p>
                <p className="p-ans">A: {item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

QuestionAnswering.propTypes = {
  documentText: PropTypes.string.isRequired
};

export default QuestionAnswering;