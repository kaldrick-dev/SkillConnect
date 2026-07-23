import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import StudentProfile from "./pages/StudentProfile";
import Login from "./pages/Login";
import CreateInternship from "./pages/CreateInternship";
import Messages from "./pages/Messages";
import Progress from "./pages/Progress";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<StudentProfile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/create-internship" element={<CreateInternship />} />
      <Route path="/messages" element={<Messages />} />
        <Route path="/progress" element={<Progress />} />

    </Routes>
  );
}

export default App;