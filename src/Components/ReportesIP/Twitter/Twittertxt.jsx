import React, { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { CircularProgress } from "@mui/material";

function Twitterpage() {
  const [parsedData, setParsedData] = useState([]);
  const [processing, setProcessing] = useState(false);

  const handleFileUpload = (file) => {
    processReport(file);
  };

  const FileUploader = ({ onFileUpload }) => {
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      onFileUpload(file);
    };

    return (
      <div>
        <input type="file" onChange={handleFileChange} />
      </div>
    );
  };

  const processReport = (file) => {
    const extension = getFileExtension(file.name);

    if (extension === "csv") {
      parseCSV(file);
    } else if (extension === "txt") {
      parseTXT(file);
    } else {
      console.log("Formato de archivo no compatible");
    }
  };

  const parseCSV = (file) => {
    Papa.parse(file, {
      complete: function (results) {
        console.log(results.data);
        const parsedData = extractDataFromCSV(results.data);
        setParsedData(parsedData);
      },
    });
  };

  const parseTXT = async (file) => {
    const reader = new FileReader();
    reader.onload = async function (event) {
      const contents = event.target.result;
      const parsedData = await extractDataFromTXT(contents);
      setParsedData(parsedData);
    };
    reader.readAsText(file);
  };

  const extractDataFromCSV = (data) => {
    return data;
  };

  const extractDataFromTXT = async (contents) => {
    const regex =
      /"accountId"\s*:\s*"([^"]+)"\s*,\s*"createdAt"\s*:\s*"([^"]+)"\s*,\s*"loginIp"\s*:\s*"([^"]+)"\s*}/gs;
    const matches = Array.from(contents.matchAll(regex));
    const parsedData = [];

    for (const match of matches) {
      try {
        const accountId = match[1];
        const createdAt = match[2];
        const loginIp = match[3];

        let org = "";
        try {
          const access_token = "814ee26772f463";
          const response = await axios.get(
            `https://ipinfo.io/${loginIp}/org?token=${access_token}`
          );
          org = response.data;
        } catch (error) {
          console.error("Error al obtener la información de la IP:", error);
        }

        const createdAtUTC = new Date(createdAt);
        const createdAtBuenosAires = new Date(
          createdAtUTC.getTime() - 3 * 60 * 60 * 1000
        );

        parsedData.push({
          accountId,
          createdAt: createdAtUTC.toISOString(),
          "createdAt (Buenos Aires)": createdAtBuenosAires.toISOString(),
          loginIp,
          org,
        });
      } catch (error) {
        console.error("Error al analizar el objeto JSON:", error);
      }
    }

    return parsedData;
  };

  const getFileExtension = (filename) => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  };

  const exportToExcel = () => {
    if (parsedData.length === 0) {
      console.log("No hay datos para exportar.");
      return;
    }

    setProcessing(true);

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(parsedData, {
      header: [
        "accountId",
        "createdAt",
        "createdAt (Buenos Aires)",
        "loginIp",
        "org",
      ],
    });

    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos procesados");

    const excelFile = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelFile], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "datos_procesados.xlsx";
    link.click();

    setProcessing(false);
  };

  return (
    <div className="bg-principal w-screen h-screen flex items-center justify-center">
      <h1
        className="text-4xl mb-8 absolute top-0 transform -translate-x-1/2 left-1/2"
        style={{ color: "white" }}
      >
        Reportes Twitter
      </h1>
      <div className="w-96 h-96 bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl mb-4">Cargar Archivo</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={exportToExcel}
          className="mb-4"
        >
          Exportar a Excel
        </Button>
        {processing && (
          <div className="flex justify-center mt-4">
            <CircularProgress />
          </div>
        )}
        <FileUploader onFileUpload={handleFileUpload} />
      </div>

      <div className="absolute bottom-0 left-0 mb-4 ml-4">
        <Link to="/home" style={{ textDecoration: "none" }}>
          <Button variant="contained" color="primary">
            Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Twitterpage;
