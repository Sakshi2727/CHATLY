
// import { Button } from "@chakra-ui/button"
import './App.css';
import { Routes, Route } from 'react-router-dom';  // Import Routes and Route from react-router-dom
import Homepage from './pages/Homepage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />} />  {/* Use element instead of component */}
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;

