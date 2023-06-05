import React from "react";
import {  Link } from "react-router-dom";
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
          to="/reportes-ip/google"
          variant="contained"
          sx={{ mr: 2 }}
        >
          Google
        </Button>
        <Button
          component={Link}
          to="/reportes-ip/twitter"
          variant="contained"
          sx={{ mr: 2 }}
        >
          Twitter
        </Button>
        <Button
          component={Link}
          to="/reportes-ip/facebook"
          variant="contained"
          sx={{ mr: 2 }} // Ajusta el margen inferior del botón de Facebook aquí
        >
          Facebook
        </Button>
        <div className="absolute bottom-0 left-0 mb-4 ml-4">
        <Link to="/" style={{ textDecoration: "none" }}>
          <Button variant="contained" color="primary">
            Volver al inicio
          </Button>
        </Link>
      </div>
      </Box>
    </div>
  );
};

export default HomePage;
