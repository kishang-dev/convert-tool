import React from "react";
import BatchConverterPage from "@/components/BatchConverterPage";
import { fileAPI } from "@/lib/api";

export default function PdfToWord() {
    return (
        <BatchConverterPage
            toolId="pdf-to-word"
            title="PDF to Word Converter Online Free — Convert PDF to Editable DOCX"
            description="Convert PDF documents into editable Microsoft Word (.docx) files seamlessly. Batch process up to 50 PDFs at once with 100% formatting & font preservation."
            acceptedFiles=".pdf"
            outputLabel="Word Document"
            iconType="word"
            keywords={[
                "pdf to word converter",
                "convert pdf to docx free",
                "pdf to editable word",
                "free online pdf to word",
                "batch pdf to word converter",
                "extract word from pdf"
            ]}
            runConversion={async (fileId) => await fileAPI.convertToWord(fileId)}
        />
    );
}
