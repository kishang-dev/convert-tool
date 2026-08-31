import React from "react";
import BatchConverterPage from "@/components/BatchConverterPage";
import { fileAPI } from "@/lib/api";

export default function WordToPdf() {
    return (
        <BatchConverterPage
            toolId="word-to-pdf"
            title="Word to PDF Converter Online Free — Convert DOCX to PDF"
            description="Transform Microsoft Word (.docx, .doc) files into clean, professional PDF documents. Free batch converter with 100% layout and font preservation."
            acceptedFiles=".docx,.doc"
            outputLabel="PDF"
            iconType="pdf"
            keywords={[
                "word to pdf converter",
                "convert docx to pdf free",
                "word doc to pdf online",
                "batch word to pdf",
                "save docx as pdf free",
                "doc to pdf converter"
            ]}
            runConversion={async (fileId) => await fileAPI.wordToPdf(fileId)}
        />
    );
}
