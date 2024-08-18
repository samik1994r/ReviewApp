import React, { useState } from 'react';

const TodoNotes = ({ notes, onUpdateNotes }) => {
  const [newNote, setNewNote] = useState('');

  const handleAddNote = () => {
    if (newNote.trim()) {
      onUpdateNotes([...notes, { id: Date.now(), text: newNote.trim(), completed: false }]);
      setNewNote('');
    }
  };

  const handleToggleNote = (id) => {
    const updatedNotes = notes.map(note =>
      note.id === id ? { ...note, completed: !note.completed } : note
    );
    onUpdateNotes(updatedNotes);
  };

  const handleRemoveNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    onUpdateNotes(updatedNotes);
  };

  return (
    <div className="mt-4">
      <h3 className="font-bold text-lg mb-2">To-Do Notes</h3>
      <div className="flex mb-2">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="flex-grow border rounded-l px-2 py-1"
          placeholder="Add a new note..."
        />
        <button
          onClick={handleAddNote}
          className="bg-blue-500 text-white px-4 py-1 rounded-r"
        >
          Add
        </button>
      </div>
      <ul>
        {notes.map(note => (
          <li key={note.id} className="flex items-center mb-1">
            <input
              type="checkbox"
              checked={note.completed}
              onChange={() => handleToggleNote(note.id)}
              className="mr-2"
            />
            <span className={note.completed ? 'line-through' : ''}>{note.text}</span>
            <button
              onClick={() => handleRemoveNote(note.id)}
              className="ml-auto text-red-500"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoNotes;