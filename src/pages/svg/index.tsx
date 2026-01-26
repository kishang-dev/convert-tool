import Head from "next/head";

import { Sparkles, Zap, Shield, MousePointer2 } from "lucide-react";
import { useSvgStore } from "@/store/useSvgStore";
import { FileUpload } from "@/components/FileUpload";
import { SvgPreview } from "@/components/SvgPreview";

export default function Home() {
  const { svgUrl, uploading, error } = useSvgStore();

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Head>
        <title>Vectorize | Instant Image to SVG Converter</title>
        <meta
          name="description"
          content="Convert your PNG, JPG and WEBP images to high-quality SVG vectors instantly."
        />
      </Head>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-16 animate-in fade-in slide-in-from-top-10 duration-1000">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Vectorization</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900">
            Vectorize <span className="text-blue-600">Instantly.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
            The simplest way to transform your raster images into clean,
            scalable SVG vectors. Perfect for designers, developers, and
            creators.
          </p>
        </div>

        {/* Content Section */}
        <div className="relative z-10 transition-all duration-500">
          {!svgUrl ? (
            <div className="space-y-12">
              <FileUpload />

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-slate-100">
                <div className="flex flex-col items-center text-center p-6 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg">Lightning Fast</h3>
                  <p className="text-slate-500 text-sm">
                    Convert complex images to SVGs in under 2 seconds with our
                    optimized engine.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-6 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg">Privacy First</h3>
                  <p className="text-slate-500 text-sm">
                    Images are processed securely and deleted immediately after
                    conversion.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-6 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <MousePointer2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg">Layer Support</h3>
                  <p className="text-slate-500 text-sm">
                    Automatically detects shapes and creates clean, editable SVG
                    layers.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <SvgPreview />
          )}
        </div>

        {/* Error Notification */}
        {error && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-50 border border-red-100 px-6 py-4 rounded-2xl shadow-xl flex items-center space-x-3 text-red-700 animate-in slide-in-from-bottom-4">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="font-medium">{error}</span>
          </div>
        )}
      </main>

      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-100/20 blur-[120px] rounded-full" />
      </div>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-sm font-medium">
          &copy; {new Date().getFullYear()} Vectorize App. Built with Next.js
          and Lucid Icons.
        </p>
      </footer>
    </div>
  );
}
