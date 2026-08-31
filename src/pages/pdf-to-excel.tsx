import React from "react";
import BatchConverterPage from "@/components/BatchConverterPage";
import { fileAPI } from "@/lib/api";

export default function PdfToExcel() {
    return (
        <BatchConverterPage
            toolId="pdf-to-excel"
            title="PDF to Excel Converter Online Free — Extract Tables to XLSX"
            description="Extract tabular data and spreadsheets from PDF files into editable Microsoft Excel (.xlsx) workbooks instantly. Free batch converter with 100% precision."
            acceptedFiles=".pdf"
            outputLabel="Excel Spreadsheet"
            iconType="excel"
            keywords={[
                "pdf to excel converter",
                "convert pdf to xlsx free",
                "pdf table extractor",
                "pdf to excel online free",
                "extract tables from pdf",
                "batch pdf to excel"
            ]}
            runConversion={async (fileId) => await fileAPI.convertToExcel(fileId)}
        />
    );
}
