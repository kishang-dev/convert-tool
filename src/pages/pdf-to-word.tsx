import React from "react";
import BatchConverterPage from "@/components/BatchConverterPage";
import { fileAPI } from "@/lib/api";

export default function PdfToWord() {
    return (
        <BatchConverterPage
            toolId="pdf-to-word"
            title="PDF to Word"
            description="Convert PDF documents to editable Microsoft Word files seamlessly. Batch process up to 50 PDFs at once."
            acceptedFiles=".pdf"
            outputLabel="Word Document"
            iconType="word"
            runConversion={async (fileId) => await fileAPI.convertToWord(fileId)}
        />
    );
}
