import React, { useState } from 'react';
import { useUser } from '../context/UserContext';

export default function QuestionDetail({ question, onClose }) {
  const { user } = useUser();
  const [newResponse, setNewResponse] = useState('');
  const [responses] = useState([
    {
      id: 1,
      author: "plantexpert",
      content: "Based on your description, this could be due to overwatering. Monstera plants prefer their soil to dry out slightly between waterings. Check if the soil is staying too wet and ensure good drainage.",
      timestamp: "2024-03-20T11:00:00",
      isExpert: true,
      votes: 5,
    },
    {
      id: 2,
      author: "greenthumb",
      content: "I had the same issue. Also check the light conditions - if it's getting too much direct sunlight, the leaves can yellow.",
      timestamp: "2024-03-20T12:30:00",
      isExpert: false,
      votes: 2,
    },
  ]);

  const handleSubmitResponse = (e) => {
    e.preventDefault();
    // Here you would typically send the response to your backend
    console.log('New response:', newResponse);
    setNewResponse('');
  };

  return (
    <div className="question-detail" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'white',
      zIndex: 1000,
      overflow: 'auto',
      padding: '2rem',
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            position: 'absolute',
            top: '1rem',
            right: '1rem',
          }}
        >
          ×
        </button>

        {/* Question Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#205624', marginBottom: '1rem' }}>{question.title}</h2>
          <div style={{ display: 'flex', gap: '1rem', color: '#666', fontSize: '0.9rem' }}>
            <span>Posted by {question.author}</span>
            <span>•</span>
            <span>{new Date(question.timestamp).toLocaleDateString()}</span>
          </div>
          <p style={{ marginTop: '1rem' }}>{question.description}</p>
          {question.images?.length > 0 && (
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              {question.images.map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt={`Question image ${index + 1}`}
                  style={{ maxWidth: '200px', borderRadius: '4px' }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Responses */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#205624', marginBottom: '1rem' }}>Responses ({responses.length})</h3>
          {responses.map(response => (
            <div
              key={response.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
                background: response.isExpert ? '#f8fff8' : 'white',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold' }}>{response.author}</span>
                  {response.isExpert && (
                    <span style={{
                      background: '#205624',
                      color: 'white',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                    }}>
                      Expert
                    </span>
                  )}
                </div>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>
                  {new Date(response.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p style={{ margin: '0.5rem 0' }}>{response.content}</p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#666',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  ▲ {response.votes}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Response Form */}
        {user && (
          <form onSubmit={handleSubmitResponse}>
            <h3 style={{ color: '#205624', marginBottom: '1rem' }}>Add Your Response</h3>
            <textarea
              value={newResponse}
              onChange={(e) => setNewResponse(e.target.value)}
              placeholder="Share your knowledge or experience..."
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ddd',
                marginBottom: '1rem',
              }}
              required
            />
            <button
              type="submit"
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                border: 'none',
                background: '#205624',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              Submit Response
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 