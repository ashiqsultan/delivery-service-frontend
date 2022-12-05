import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppBar from './components/AppBar';
import Dashboard from './Pages/Dashboard';
import SignIn from './Pages/Login';
import SignUp from './Pages/Signup';

function App() {
  return (
    <Router>
      <AppBar />
      <Routes>
        <Route path='/' element={<SignIn />} />
        {/* <Route path='/signup' element={<SignUp />} /> */}
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='*' element={<div>404 Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
