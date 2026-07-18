import React from "react";
import BatchConverterPage from "@/components/BatchConverterPage";
import { fileAPI } from "@/lib/api";

export default function PdfToExcel() {
    return (
        <BatchConverterPage
            toolId="pdf-to-excel"
            title="PDF to Excel"
            description="Extract tabular data from PDFs to highly editable spreadsheets. Batch convert multiple files accurately."
            acceptedFiles=".pdf"
            outputLabel="Excel Spreadsheet"
            iconType="excel"
            runConversion={async (fileId) => await fileAPI.convertToExcel(fileId)}
        />
    );
}
