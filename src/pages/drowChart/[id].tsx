import React from "react";
import { useRouter } from "next/router";
import { ChartEditor } from "@/components/drowChart/ChartEditor";

export default function DrowChartPage() {
    const router = useRouter();
    const { id } = router.query;

    if (!id || typeof id !== "string") {
        // Return early if loading or invalid id
        return (
            <div className="flex h-screen items-center justify-center bg-[#0B0F1A]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    return <ChartEditor id={id} />;
}
