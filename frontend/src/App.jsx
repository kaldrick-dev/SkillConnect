import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import StudentProfile from "./pages/StudentProfile";
import Login from "./pages/Login";
import CreateInternship from "./pages/CreateInternship";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<StudentProfile />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/create-internship" element={<CreateInternship />} />
    </Routes>
  );
}

export default App;