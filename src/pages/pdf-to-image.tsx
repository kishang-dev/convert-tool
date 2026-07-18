import React from "react";
import BatchConverterPage from "@/components/BatchConverterPage";
import { fileAPI } from "@/lib/api";

export default function PdfToImage() {
    return (
        <BatchConverterPage
            toolId="pdf-to-image"
            title="PDF to Image"
            description="Extract all pages from your PDF as high-resolution images. Batch process up to 50 PDFs instantly."
            acceptedFiles=".pdf"
            outputLabel="Image"
            iconType="image"
            runConversion={async (fileId) => await fileAPI.convertToImage(fileId)}
        />
    );
}
