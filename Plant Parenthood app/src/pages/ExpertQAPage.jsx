import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useUser } from '../context/UserContext';

export default function ExpertQAPage() {
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewQuestionForm, setShowNewQuestionForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    description: '',
    category: 'emergency',
    images: [],
  });

  // Example questions data - in a real app, this would come from a database
  const [questions] = useState([
    {
      id: 1,
      title: "Yellow leaves on my Monstera",
      category: "disease",
      description: "My Monstera's leaves are turning yellow and I don't know why. Help!",
      author: "plantlover123",
      timestamp: "2024-03-20T10:00:00",
      urgency: "high",
      status: "open",
      responses: 2,
    },
    // Add more sample questions here
  ]);

  const categories = [
    { id: 'emergency', label: 'Plant Emergency', color: '#ff4444' },
    { id: 'identification', label: 'Plant Identification', color: '#33b5e5' },
    { id: 'disease', label: 'Disease Diagnosis', color: '#ff8800' },
    { id: 'advice', label: 'Expert Advice', color: '#00C851' },
  ];

  const handleNewQuestion = (e) => {
    e.preventDefault();
    // Here you would typically send the question to your backend
    setShowNewQuestionForm(false);
    setNewQuestion({
      title: '',
      description: '',
      category: 'emergency',
      images: [],
    });
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.description.toLowerCase().includes(searchQuery.toLowerCase());
    return selectedCategory === 'all' ? matchesSearch : (matchesSearch && question.category === selectedCategory);
  });

  return (
    <>
      <NavBar />
      <main className="container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="qa-header" style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: '#205624', marginBottom: '1rem' }}>Expert Q&A</h1>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            Get help from plant experts and the community for your plant-related questions
          </p>
          
          {/* Category Filters */}
          <div className="category-filters" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedCategory('all')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                border: 'none',
                background: selectedCategory === 'all' ? '#205624' : '#e0e0e0',
                color: selectedCategory === 'all' ? 'white' : '#333',
                cursor: 'pointer',
              }}
            >
              All Questions
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  border: 'none',
                  background: selectedCategory === category.id ? category.color : '#e0e0e0',
                  color: selectedCategory === category.id ? 'white' : '#333',
                  cursor: 'pointer',
                }}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Search and Ask Question */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                border: '1px solid #ddd',
                flex: 1,
                minWidth: '200px',
              }}
            />
            <button
              onClick={() => setShowNewQuestionForm(true)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                border: 'none',
                background: '#205624',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              Ask a Question
            </button>
          </div>
        </div>

        {/* New Question Form Modal */}
        {showNewQuestionForm && (
          <div className="modal" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}>
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '8px',
              width: '90%',
              maxWidth: '600px',
            }}>
              <h2 style={{ marginBottom: '1rem' }}>Ask a Question</h2>
              <form onSubmit={handleNewQuestion}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Category</label>
                  <select
                    value={newQuestion.category}
                    onChange={(e) => setNewQuestion({...newQuestion, category: e.target.value})}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.label}</option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Title</label>
                  <input
                    type="text"
                    value={newQuestion.title}
                    onChange={(e) => setNewQuestion({...newQuestion, title: e.target.value})}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    placeholder="What's your question?"
                    required
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                  <textarea
                    value={newQuestion.description}
                    onChange={(e) => setNewQuestion({...newQuestion, description: e.target.value})}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', minHeight: '100px' }}
                    placeholder="Provide more details about your question..."
                    required
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Add Images</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setNewQuestion({...newQuestion, images: Array.from(e.target.files)})}
                    style={{ width: '100%' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowNewQuestionForm(false)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      background: 'white',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
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
                    Submit Question
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className="questions-list">
          {filteredQuestions.map(question => (
            <div
              key={question.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
                background: 'white',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0, color: '#205624' }}>{question.title}</h3>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  background: categories.find(c => c.id === question.category)?.color || '#e0e0e0',
                  color: 'white',
                }}>
                  {categories.find(c => c.id === question.category)?.label}
                </span>
              </div>
              <p style={{ color: '#666', margin: '0.5rem 0' }}>{question.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', color: '#888' }}>
                <span>Posted by {question.author}</span>
                <span>{new Date(question.timestamp).toLocaleDateString()}</span>
                <span>{question.responses} responses</span>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
} 