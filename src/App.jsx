import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './component/Home';
import ThirdPage from './component/ThirdPage';
import './App.css'
import AgeVerification from './component/AgeVerification'
import Faq from './component/Faq';
import CookieConsent from './component/CookieConsent.jsx';

function App() {


  return (
    <>
      <Router>
        <CookieConsent />
        <Routes>
          <Route path="/" element={<AgeVerification />} />
          <Route path="/home" element={<Home />} />
          <Route path="/sweepstakes/:id" element={<ThirdPage />} />
          <Route path="/faq" element={<Faq />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
