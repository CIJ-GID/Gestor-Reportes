import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

function GooglePdf() {
  return (
    <div>
      <h1>Google PDF</h1>
      {/* Contenido del componente GooglePdf */}
      
      <div className="absolute bottom-0 left-0 mb-4 ml-4">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="primary">Volver al inicio</Button>
        </Link>
      </div>
    </div>
  );
}

export default GooglePdf;
