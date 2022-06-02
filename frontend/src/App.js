import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Home from './components/Home';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />}/>
          <Route path="/signup" element={<Signup />}/>
          <Route path="/" element={<Home />}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
