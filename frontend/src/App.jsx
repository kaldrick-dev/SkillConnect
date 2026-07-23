import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import StudentProfile from "./pages/StudentProfile";
import Login from "./pages/Login";
import CreateInternship from "./pages/CreateInternship";
<<<<<<< Updated upstream
=======
import Messages from "./pages/Messages";
import Progress from "./pages/Progress";
import AdminDashboard from "./pages/AdminDashboard";

>>>>>>> Stashed changes

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<StudentProfile />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/create-internship" element={<CreateInternship />} />
<<<<<<< Updated upstream
=======
      <Route path="/messages" element={<Messages />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/admin" element={<AdminDashboard />} />

>>>>>>> Stashed changes
    </Routes>
  );
}

export default App;