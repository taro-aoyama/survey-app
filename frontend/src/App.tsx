import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SurveyForm from './components/SurveyForm';
import SurveyResults from './components/SurveyResults';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="container">
          <Routes>
            <Route path="/" element={<SurveyForm />} />
            <Route path="/admin/results" element={<SurveyResults />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
