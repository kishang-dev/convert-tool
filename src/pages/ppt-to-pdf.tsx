import React from "react";
import BatchConverterPage from "@/components/BatchConverterPage";
import { fileAPI } from "@/lib/api";

export default function PptToPdf() {
    return (
        <BatchConverterPage
            toolId="ppt-to-pdf"
            title="PowerPoint to PDF"
            description="Convert presentation slides (.pptx) into standard PDF pages quickly and accurately in bulk."
            acceptedFiles=".pptx,.ppt"
            outputLabel="PDF"
            iconType="pdf"
            runConversion={async (fileId) => await fileAPI.pptToPdf(fileId)}
        />
    );
}
