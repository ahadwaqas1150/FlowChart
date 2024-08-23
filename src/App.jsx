import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FlowChart from './pages/FlowChart';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<FlowChart />} />
      </Routes>
    </Router>
  );
}

export default App;
