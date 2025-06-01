import Home from "@/pages/Home/Home";
import Upload from "@/pages/Upload/Upload";
import ErrorPage from "@pages/404";
import { Route, Routes } from "react-router"; 

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App;
