import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import GooglePDF from "./components/google/GooglePDF";
import TwitterTXT from "./components/twitter/TwitterTXT";
import Button from "@mui/material/Button";

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to the Homepage!</h1>
      <Button component={Link} to="/googlepdf" variant="contained">
        Go to Google
      </Button>
      <Button component={Link} to="/twittertxt" variant="contained">
        Go to Twitter
      </Button>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/googlepdf" element={<GooglePDF />} />
        <Route path="/twittertxt" element={<TwitterTXT />} />
      </Routes>
    </Router>
  );
};

export default App;
