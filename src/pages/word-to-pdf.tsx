import React from "react";
import BatchConverterPage from "@/components/BatchConverterPage";
import { fileAPI } from "@/lib/api";

export default function WordToPdf() {
    return (
        <BatchConverterPage
            toolId="word-to-pdf"
            title="Word to PDF"
            description="Transform .docx files into standard PDF format with perfect layout preservation. Supports bulk conversion."
            acceptedFiles=".docx,.doc"
            outputLabel="PDF"
            iconType="pdf"
            runConversion={async (fileId) => await fileAPI.wordToPdf(fileId)}
        />
    );
}
