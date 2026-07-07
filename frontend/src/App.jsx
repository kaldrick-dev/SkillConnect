import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import StudentProfile from "./pages/StudentProfile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<StudentProfile />} />
    </Routes>
  );
}

export default App;