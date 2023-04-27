import { HashRouter, Route, Routes } from 'react-router-dom';

import VideoStream from "./pages/VideoStream";
import ViewStream from "./pages/ViewStream";
import RecordStream from './pages/RecordStream';

function App() {
  return (
    <HashRouter>
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