import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import Home from './Components/ReportesIP/home';
import GooglePage from './Components/ReportesIP/Google/Googlepdf';
import TwitterPage from './Components/ReportesIP/Twitter/Rwittertxt';
import FacebookPage from './Components/ReportesIP/Facebook/Facebookpdf';

const HomePage = () => {
  return (
    <div className="bg-principal w-screen h-screen flex items-center justify-center">
      <Box
        sx={{
          width: '400px',
          p: 4,
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          textAlign: 'center',
          backgroundColor: 'white', // Cambia el color de fondo del cuadro aquí
        }}
      >
        <h1 className="text-4xl mb-8">Gestor de IP's</h1>
        <Button
          component={Link}
          to="/reportes-ip"
          variant="contained"
          sx={{ mr: 2 }}
        >
          Reportes-IP
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
        <Route path="/reportes-ip" element={<Home />} />
        <Route path="/reportes-ip/google" element={<GooglePage />} />
        <Route path="/reportes-ip/facebook" element={<FacebookPage />} />
        <Route path="/reportes-ip/twitter" element={<TwitterPage />} />
      </Routes>
    </Router>
  );
};

export default App;
