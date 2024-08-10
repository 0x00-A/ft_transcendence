import { BrowserRouter, Link, Route, Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";

import { LoadingBarProvider } from "./hooks/LoadingBarContext";
import PreLoader from "./components/PreLoader/PreLoader";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  return (
    <>
      {/* <PreLoader /> */}
      <div>
        <LoadingBarProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              {/* <Route path="/" element={<Home />} /> */}
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </BrowserRouter>
        </LoadingBarProvider>
      </div>
    </>
  );
}

export default App;
