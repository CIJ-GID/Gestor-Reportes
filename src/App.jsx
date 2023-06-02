import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import GooglePDF from "./components/google/GooglePDF";
import TwitterTXT from "./components/twitter/TwitterTXT";
import FacebookPDF from "./components/facebook/FacebookPDF";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";

const HomePage = () => {
  return (
    <div className="bg-principal w-screen h-screen flex items-center justify-center">
      <Box
        sx={{
          width: "400px",
          p: 4,
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          textAlign: "center",
          backgroundColor: "white", // Cambia el color de fondo del cuadro aquí
        }}
      >
        <h1 className="text-4xl mb-8">Gestor de reportes</h1>
        <Button
          component={Link}
          to="/googlepdf"
          variant="contained"
          sx={{ mr: 2 }}
        >
          Google
        </Button>
        <Button
          component={Link}
          to="/twittertxt"
          variant="contained"
          sx={{ mr: 2 }}
        >
          Twitter
        </Button>
        <Button
          component={Link}
          to="/facebookpdf"
          variant="contained"
          sx={{ mr: 2 }} // Ajusta el margen inferior del botón de Facebook aquí
        >
          Facebook
        </Button>
      </Box>
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
        <Route path="/facebookpdf" element={<FacebookPDF />} />
      </Routes>
    </Router>
  );
};

export default App;
