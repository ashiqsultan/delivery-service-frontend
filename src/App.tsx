import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import io from 'socket.io-client';

import { API_URL } from './constants';
import AppBar from './components/AppBar';
import Dashboard from './Pages/Dashboard';
import SignIn from './Pages/Login';
import SignUp from './Pages/Signup';

const socket = io(API_URL);

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, []);

  return (
    <Router>
      <AppBar />
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='*' element={<div>404 Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
