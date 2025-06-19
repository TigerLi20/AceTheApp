import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import USAMap from './components/USAMap';
import TopCollegesButton from './components/TopCollegesButton';
import FloatingNavButtons from "./components/FloatingNavButtons";
import ComingSoon from "./components/ComingSoon";
import RevolvingQuotes from "./components/RevolvingQuotes";
import backgroundGif from "./assets/background.gif";
import SurveyPage from "./components/SurveyPage";
import HomeScreenButton from "./components/HomeScreenButton";
import LandingPage from "./components/LandingPage";
import CreateAccount from "./components/CreateAccount";
import LoginPage from "./components/LoginPage";
import './App.css';
import VideoPage from "./components/VideoPage";
import AssignmentsPage from "./components/AssignmentsPage";
import TopColleges from "./components/TopColleges";
import CollegeList from "./components/CollegeList";
import { CollegeProvider } from "./components/CollegeProvider";




function App() {
  // Track registration status
  const [registered, setRegistered] = useState(localStorage.getItem("registered") === "1");

  useEffect(() => {
    // Listen for changes to registration status (multi-tab support)
    const onStorage = () => setRegistered(localStorage.getItem("registered") === "1");
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <CollegeProvider>
    <>
      <HomeScreenButton />
      <div className="background-gif">
        <img src={backgroundGif} alt="background" />
      </div>
      <Routes>
        <Route path="/" element={
          registered ? (
            <div className="app">
              <RevolvingQuotes />
              <USAMap />
              <TopCollegesButton />
              <FloatingNavButtons />
            </div>
          ) : (
            <LandingPage />
          )
        } />
        <Route path="/home" element={
          <div className="app">
            <RevolvingQuotes />
            <USAMap />
            <FloatingNavButtons />
            <TopCollegesButton />
          </div>
        } />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/affinity-calc" element={<ComingSoon emoji="🧮" />} />
        <Route path="/settings" element={<ComingSoon emoji="⚙️" />} />
        <Route path="/survey" element={<SurveyPage />} />
        <Route path="/video" element={<VideoPage />} />
        <Route path="/assignments" element={<AssignmentsPage />} />
        <Route path="/top-colleges" element={<TopColleges />} />
        <Route path="/colleges-list" element={<CollegeList />} />
      </Routes>
    </>
    </CollegeProvider>
  );
}

export default App;