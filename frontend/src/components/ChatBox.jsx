import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');
const API_URL = 'http://localhost:5000/api';

export default function ChatBox({ currentUserId, recipientId, recipientName, token }) {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const room = [currentUserId, recipientId].sort().join('_');

  useEffect(() => {
    socket.emit('join_room', room);

    axios.get(`${API_URL}/messages/${currentUserId}/${recipientId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setMessages(res.data)).catch(err => console.error(err));

    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on('message_deleted', (deletedId) => {
      setMessages((prev) => prev.map(msg => 
        msg._id === deletedId 
          ? { ...msg, message: 'This message was deleted', isAudio: false, isDeleted: true } 
          : msg
      ));
    });

    return () => {
      socket.off('receive_message');
      socket.off('message_deleted');
    };
  }, [currentUserId, recipientId, room, token]);

  const startRecording = async () => {
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result;
          sendAudioMessage(base64Audio);
        };
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      alert('Microphone access denied or unavailable.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const sendAudioMessage = (base64Audio) => {
    const messageData = {
      sender: currentUserId,
      receiver: recipientId,
      message: base64Audio,
      isAudio: true,
      room
    };
    socket.emit('send_message', messageData);
  };

  const sendTextMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const messageData = {
      sender: currentUserId,
      receiver: recipientId,
      message: messageInput,
      isAudio: false,
      room
    };

    socket.emit('send_message', messageData);
    setMessageInput('');
  };

  const deleteMessage = (messageId) => {
    socket.emit('delete_message', { messageId, room });
  };

  return (
    <div className="card mt-3">
      <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
        <span>Chat with {recipientName}</span>
      </div>
      <div className="card-body" style={{ height: '280px', overflowY: 'scroll' }}>
        {messages.map((msg, idx) => (
          <div key={msg._id || idx} className={`mb-2 text-${msg.sender === currentUserId ? 'end' : 'start'}`}>
            <div className="d-inline-block position-relative">
              {msg.isDeleted ? (
                <span className="p-2 rounded bg-secondary text-white fst-italic">
                  {msg.message}
                </span>
              ) : msg.isAudio || (msg.message && msg.message.startsWith('data:audio')) ? (
                <audio controls src={msg.message} style={{ maxWidth: '220px' }} />
              ) : (
                <span className={`p-2 rounded d-inline-block ${msg.sender === currentUserId ? 'bg-primary text-white' : 'bg-light text-dark'}`}>
                  {msg.message}
                </span>
              )}

              {msg.sender === currentUserId && !msg.isDeleted && (
                <button 
                  className="btn btn-sm text-danger border-0 bg-transparent ms-1 p-0" 
                  style={{ fontSize: '12px' }}
                  title="Delete for everyone"
                  onClick={() => deleteMessage(msg._id)}
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="card-footer">
        <form onSubmit={sendTextMessage} className="input-group">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Type a message or record audio..." 
            value={messageInput} 
            onChange={(e) => setMessageInput(e.target.value)} 
          />
          {recording ? (
            <button type="button" className="btn btn-danger" onClick={stopRecording}>
              ⏹ Stop
            </button>
          ) : (
            <button type="button" className="btn btn-secondary" onClick={startRecording}>
              🎤 Record
            </button>
          )}
          <button className="btn btn-success" type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}