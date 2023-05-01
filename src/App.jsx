import { useEffect } from "react";
import { HashRouter, Route, Routes } from 'react-router-dom';
import { useHuddle01 } from '@huddle01/react';

import Navbar from "./components/Navbar";
import VideoStream from "./pages/VideoStream";
import ViewStream from "./pages/ViewStream";
import RecordStream from './pages/RecordStream';

import { HUDDLE01_PROJECTID } from "./keys";

function App() {
  const { initialize } = useHuddle01();

  useEffect(() => {
    // its preferable to use env vars to store projectId
    initialize(HUDDLE01_PROJECTID);
  }, []);

  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route
          path="/stream/:roomId"
          element={
            <ViewStream />} />
         <Route
          path="/record"
          element={
            <RecordStream />} />
        <Route
          path="/"
          element={
            <VideoStream /> } />
      </Routes>
    </HashRouter>
  )
}

export default App;