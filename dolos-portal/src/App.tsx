import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home';
import Conversation from "./pages/conversation";
import Layout from "./components/Layout";
import Training from "./pages/training";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/conversation" element={<Conversation />} />
          <Route path="/training" element={<Training />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
