import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { Document, pdfjs } from "react-pdf";
import { saveAs } from "file-saver";
import { utils, write } from "xlsx";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import moment from "moment";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function facebookPage() {
  const [pdfFile, setPdfFile] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setPdfFile(file);
  };

  const extractDataFromPage = async (pageText) => {
    const lines = [];
    let timestamp = "";
    let ipAddress = "";
    let org = "";

    for (let i = 0; i < pageText.length; i++) {
      const item = pageText[i];

      if (item.includes("UTC")) {
        timestamp = item;
      } else if (
        item.match(
          /^((\d{1,3}\.){3}\d{1,3})|(([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4})$/
        )
      ) {
        ipAddress = item;
        org = await getOrgFromIP(ipAddress);
      }

      if (timestamp && ipAddress) {
        lines.push([timestamp, ipAddress, org]);
        timestamp = "";
        ipAddress = "";
        org = "";
      }
    }

    return lines;
  };

  const getOrgFromIP = async (ipAddress) => {
    try {
      const access_token = "814ee26772f463";
      const url = `https://ipinfo.io/${ipAddress}/org?token=${access_token}`;

      const response = await axios.get(url);
      return response.data || "";
    } catch (error) {
      console.log("Error al obtener la información de organización:", error);
      return "";
    }
  };

  const convertToBuenosAiresTime = (timestamp) => {
    const utcDateTime = moment.utc(timestamp, "YYYY-MM-DD HH:mm:ss");
    const buenosAiresDateTime = utcDateTime
      .utcOffset(-180) // UTC-3:00 (Buenos Aires)
      .format("YYYY-MM-DD HH:mm:ss");

    return buenosAiresDateTime;
  };

  const exportToExcel = async () => {
    if (!pdfFile) {
      console.log("No hay archivo PDF cargado.");
      return;
    }

    setProcessing(true);

    const fileReader = new FileReader();
    fileReader.onload = async function () {
      const typedArray = new Uint8Array(this.result);
      const pdf = await pdfjs.getDocument(typedArray).promise;
      const numPages = pdf.numPages;

      let data = [["Time(UTC)", "Time (Buenos Aires)", "IP Address", "org"]];

      for (let currentPage = 1; currentPage <= numPages; currentPage++) {
        const page = await pdf.getPage(currentPage);
        const content = await page.getTextContent();
        const pageText = content.items.map((item) => item.str.trim());

        const lines = await extractDataFromPage(pageText);

        if (lines.length > 0) {
          lines.forEach((line) => {
            const [timestamp, ipAddress, org] = line;
            const buenosAiresTime = convertToBuenosAiresTime(timestamp);
            data.push([timestamp, buenosAiresTime, ipAddress, org]);
          });
        }
      }

      const worksheet = utils.aoa_to_sheet(data);
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, "datos_procesados");
      const excelBuffer = write(workbook, { type: "array", bookType: "xlsx" });
      saveAs(
        new Blob([excelBuffer], { type: "application/octet-stream" }),
        "datos_procesados.xlsx"
      );

      setProcessing(false);
    };

    fileReader.readAsArrayBuffer(pdfFile);
  };

  return (
    <div className="bg-principal w-screen h-screen flex items-center justify-center">
      <h1
        className="text-4xl mb-8 absolute top-0 transform -translate-x-1/2 left-1/2"
        style={{ color: "white" }}
      >
        Reportes Facebook
      </h1>
      <div className="w-96 h-96 bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl mb-4">Cargar Archivo</h1>
        <input type="file" onChange={handleFileUpload} />
        <Button variant="contained" onClick={exportToExcel}>
          Exportar a Excel
        </Button>
        {processing && (
          <div className="flex justify-center mt-16">
            <CircularProgress />
          </div>
        )}
        <div className="absolute bottom-0 left-0 mb-4 ml-4">
          <Link to="/home" style={{ textDecoration: "none" }}>
            <Button variant="contained" color="primary">
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default facebookPage;
