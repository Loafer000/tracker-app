'use client'

import { useState, useEffect } from 'react'

const PEOPLE = ['Arpan', 'Jamai', 'Sidd']

export default function Home() {
  const [ideas, setIdeas] = useState([])
  const [formData, setFormData] = useState({ person: '', title: '', description: '' })
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({ title: '', description: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchIdeas()
    const interval = setInterval(fetchIdeas, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchIdeas = async () => {
    try {
      const res = await fetch('/api/ideas')
      const data = await res.json()
      if (Array.isArray(data)) {
        setIdeas(data)
      } else {
        setIdeas([])
      }
      setLoading(false)
    } catch (e) {
      console.error(e)
      setIdeas([])
      setLoading(false)
    }
  }

  const getTodayString = () => new Date().toISOString().split('T')[0]

  const hasSubmittedToday = (person) => {
    const today = getTodayString()
    return ideas.some(idea => idea.person === person && idea.date === today)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.person || !formData.title || !formData.description) return

    if (hasSubmittedToday(formData.person)) {
      alert(`${formData.person} has already submitted an idea today!`)
      return
    }

    const newIdea = {
      _id: Date.now().toString(),
      ...formData,
      date: getTodayString(),
      comments: []
    }

    try {
      await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIdea)
      })
      setFormData({ person: '', title: '', description: '' })
      await fetchIdeas()
    } catch (e) {
      console.error(e)
      alert('Failed to submit idea')
    }
  }

  const handleEdit = (id) => {
    const idea = ideas.find(i => i._id === id)
    setEditingId(id)
    setEditData({ title: idea.title, description: idea.description })
  }

  const saveEdit = async (id) => {
    const idea = ideas.find(i => i._id === id)
    const updatedIdea = { ...idea, ...editData }
    try {
      await fetch('/api/ideas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedIdea)
      })
      setEditingId(null)
      await fetchIdeas()
    } catch (e) {
      console.error(e)
      alert('Failed to save')
    }
  }

  const addComment = async (ideaId, person, text) => {
    if (!text.trim() || !person) return
    const idea = ideas.find(i => i._id === ideaId)
    const updatedIdea = {
      ...idea,
      comments: [...(idea.comments || []), { person, text, timestamp: Date.now() }]
    }
    try {
      await fetch('/api/ideas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedIdea)
      })
      await fetchIdeas()
    } catch (e) {
      console.error(e)
    }
  }

  const editComment = async (ideaId, commentIndex, newText) => {
    const idea = ideas.find(i => i._id === ideaId)
    const updatedIdea = {
      ...idea,
      comments: idea.comments.map((c, i) => i === commentIndex ? { ...c, text: newText } : c)
    }
    try {
      await fetch('/api/ideas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedIdea)
      })
      await fetchIdeas()
    } catch (e) {
      console.error(e)
    }
  }

  const deleteComment = async (ideaId, commentIndex) => {
    if (confirm('Delete this comment?')) {
      const idea = ideas.find(i => i._id === ideaId)
      const updatedIdea = {
        ...idea,
        comments: idea.comments.filter((_, i) => i !== commentIndex)
      }
      try {
        await fetch('/api/ideas', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedIdea)
        })
        await fetchIdeas()
      } catch (e) {
        console.error(e)
      }
    }
  }

  const deleteIdea = async (id) => {
    if (confirm('Delete this idea?')) {
      try {
        await fetch(`/api/ideas?id=${id}`, { method: 'DELETE' })
        await fetchIdeas()
      } catch (e) {
        console.error(e)
        alert('Failed to delete')
      }
    }
  }

  const todaySubmissions = PEOPLE.filter(hasSubmittedToday)

  if (loading) {
    return (
      <div className="container">
        <div className="header">
          <h1>💡 Startup Idea Tracker</h1>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <h1> Startup Idea Tracker</h1>
        <p>One idea per person, every day. Let's build something amazing!</p>
      </div>

      <div className="submit-section">
        <h2 style={{ marginBottom: '20px' }}>Submit Today's Idea</h2>
        
        {todaySubmissions.length > 0 && (
          <div className="alert alert-info">
            ✅ Submitted today: {todaySubmissions.join(', ')}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Who are you?</label>
            <select 
              value={formData.person} 
              onChange={(e) => setFormData({...formData, person: e.target.value})}
              required
            >
              <option value="">Select your name</option>
              {PEOPLE.map(person => (
                <option key={person} value={person} disabled={hasSubmittedToday(person)}>
                  {person} {hasSubmittedToday(person) ? '(Already submitted today)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Idea Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter a catchy title..."
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe your idea in detail..."
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">Submit Idea</button>
        </form>
      </div>

      <div>
        {ideas.length === 0 ? (
          <div className="empty-state">
            <h2>No ideas yet!</h2>
            <p>Be the first to submit an idea above 🚀</p>
          </div>
        ) : (
          <div className="ideas-grid">
            {ideas.map(idea => (
              <IdeaCard
                key={idea._id}
                idea={idea}
                isEditing={editingId === idea._id}
                editData={editData}
                setEditData={setEditData}
                onEdit={handleEdit}
                onSave={saveEdit}
                onCancel={() => setEditingId(null)}
                onDelete={deleteIdea}
                onAddComment={addComment}
                onEditComment={editComment}
                onDeleteComment={deleteComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function IdeaCard({ idea, isEditing, editData, setEditData, onEdit, onSave, onCancel, onDelete, onAddComment, onEditComment, onDeleteComment }) {
  const [commentPerson, setCommentPerson] = useState('')
  const [commentText, setCommentText] = useState('')
  const [editingCommentIdx, setEditingCommentIdx] = useState(null)
  const [editCommentText, setEditCommentText] = useState('')

  const handleAddComment = (e) => {
    e?.preventDefault()
    if (commentPerson && commentText.trim()) {
      onAddComment(idea._id, commentPerson, commentText)
      setCommentText('')
      setCommentPerson('')
    }
  }

  const personClass = idea.person === 'Arpan' ? 'person-badge person-1' : 
                      idea.person === 'Jamai' ? 'person-badge person-2' : 
                      'person-badge person-3'

  return (
    <div className="idea-card">
      <div className="idea-header">
        <div className="idea-meta">
          <span className={personClass}>{idea.person}</span>
          <span className="date-badge">📅 {idea.date}</span>
        </div>
      </div>

      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({...editData, title: e.target.value})}
          />
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({...editData, description: e.target.value})}
          />
          <div className="action-buttons">
            <button onClick={() => onSave(idea._id)} className="btn btn-primary btn-small">Save</button>
            <button onClick={onCancel} className="btn btn-secondary btn-small">Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="idea-title">{idea.title}</h3>
          <p className="idea-description">{idea.description}</p>
          <div className="action-buttons">
            <button onClick={() => onEdit(idea._id)} className="btn btn-primary btn-small">Edit</button>
            <button onClick={() => onDelete(idea._id)} className="btn btn-secondary btn-small">Delete</button>
          </div>
        </>
      )}

      <div className="comments-section">
        <div className="comments-title">💬 Discussion ({(idea.comments || []).length})</div>
        
        {(idea.comments || []).map((comment, idx) => (
          <div key={idx} className="comment">
            {editingCommentIdx === idx ? (
              <div>
                <input
                  type="text"
                  value={editCommentText}
                  onChange={(e) => setEditCommentText(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '2px solid #e0e0e0', marginBottom: '8px' }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => { onEditComment(idea._id, idx, editCommentText); setEditingCommentIdx(null); }} className="btn btn-primary btn-small">Save</button>
                  <button onClick={() => setEditingCommentIdx(null)} className="btn btn-secondary btn-small">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <div className="comment-author">{comment.person}</div>
                  <div className="comment-actions">
                    <button onClick={() => { setEditingCommentIdx(idx); setEditCommentText(comment.text); }} className="comment-btn" title="Edit">Edit</button>
                    <button onClick={() => onDeleteComment(idea._id, idx)} className="comment-btn comment-btn-delete" title="Delete">Delete</button>
                  </div>
                </div>
                <div className="comment-text">{comment.text}</div>
              </>
            )}
          </div>
        ))}

        <div className="comment-form">
          <select 
            value={commentPerson} 
            onChange={(e) => setCommentPerson(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '2px solid #e0e0e0' }}
          >
            <option value="">Who?</option>
            {PEOPLE.map(person => (
              <option key={person} value={person}>{person}</option>
            ))}
          </select>
          <input
            type="text"
            className="comment-input"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
          />
          <button onClick={handleAddComment} className="btn btn-primary btn-small">Add</button>
        </div>
      </div>
    </div>
  )
}
