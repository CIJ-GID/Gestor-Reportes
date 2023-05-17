import React, { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";

function App() {
  const [parsedData, setParsedData] = useState([]);

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
        // Aquí puedes realizar la lógica para extraer la información y almacenarla en algún lugar
        const parsedData = extractDataFromCSV(results.data);
        setParsedData(parsedData);
      },
    });
  };

  const parseTXT = (file) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const contents = event.target.result;
      const parsedData = extractDataFromTXT(contents);
      setParsedData(parsedData);
    };
    reader.readAsText(file);
  };

  const extractDataFromCSV = (data) => {
    // Aquí puedes implementar la lógica para extraer los datos del archivo CSV
    return data;
  };

  const extractDataFromTXT = (contents) => {
    const regex = /"ipAudit"\s*:\s*{\s*"accountId"\s*:\s*"([^"]+)"\s*,\s*"createdAt"\s*:\s*"([^"]+)"\s*,\s*"loginIp"\s*:\s*"([^"]+)"\s*}/gs;
    const matches = contents.match(regex);
    const parsedData = [];
  
    if (matches) {
      for (const match of matches) {
        try {
          const matchObj = JSON.parse(`{${match}}`);
          const accountId = matchObj.ipAudit.accountId;
          const createdAt = matchObj.ipAudit.createdAt;
          const loginIp = matchObj.ipAudit.loginIp;
          parsedData.push({ accountId, createdAt, loginIp });
        } catch (error) {
          console.error("Error al analizar el objeto JSON:", error);
        }
      }
    }
  
    return parsedData;
  };
  

  const getFileExtension = (filename) => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  };

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(parsedData);

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
  };

  return (
    <div className="bg-principal w-screen h-screen flex items-center justify-center">
      <div className="w-96 h-96 bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl mb-4">Cargar Archivo</h1>
        <button
          onClick={exportToExcel}
          className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded mt-4"
        >
          Exportar a Excel
        </button>
        <FileUploader onFileUpload={handleFileUpload} />
        <div className="mt-4">
          <h2 className="text-xl mb-2">Datos procesados:</h2>
          {parsedData.length > 0 ? (
            <ul>
              {parsedData.map((data, index) => (
                <li key={index}>
                  <p>
                    Account ID: {data.accountId}, Created At: {data.createdAt},{" "}
                    Login IP: {data.loginIp}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay datos procesados</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
