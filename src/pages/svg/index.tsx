import SEO from "@/components/SEO";
import { LuSparkles as Sparkles, LuZap as Zap, LuShield as Shield, LuMousePointer2 as MousePointer2 } from "react-icons/lu";
import { useSvgStore } from "@/store/useSvgStore";
import { FileUpload } from "@/components/FileUpload";
import { SvgPreview } from "@/components/SvgPreview";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Card from "@/components/Card";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function Home() {
  const { svgUrl, uploading, error } = useSvgStore();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <SEO
        title="Image to SVG Converter"
        description="Convert your PNG, JPG and WEBP images to high-quality SVG vectors instantly with AI-powered technology."
        canonical="/svg"
        keywords="image to SVG, SVG converter, PNG to SVG, JPG to SVG, vectorize image, ToolBasketAI"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Image to SVG Converter',
          url: 'https://toolbasketai.com/svg',
          applicationCategory: 'DesignApplication',
          operatingSystem: 'All',
          offers: { '@type': 'Offer', price: '0.00', priceCurrency: 'USD' },
        }}
      />

      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <Breadcrumbs
          items={[
            { label: 'Image to SVG Converter', href: '/svg' }
          ]}
        />

        <div className="mb-8 animate-fadeIn">
          <h1 className="text-3xl font-bold text-[var(--text)] mb-2">Image to SVG Converter</h1>
          <p className="text-[var(--text-muted)] text-sm max-w-2xl">
            Transform your raster images into clean, scalable SVG vectors instantly. Perfect for designers and developers.
          </p>
        </div>

        {/* Content Section */}
        <div className="relative z-10 transition-all duration-500">
          {!svgUrl ? (
            <div className="space-y-12">
              <FileUpload />

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-gray-800">
                <Card
                  variant="elevated"
                  className="p-6 text-center animate-fadeIn"
                  style={{ animationDelay: '0.1s' }}
                >
                  <div className="w-14 h-14 rounded bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-4">
                    <Zap className="text-[var(--text)] dark:text-[var(--text)]" size={28} />
                  </div>
                  <h3 className="font-bold text-lg text-[var(--text)] dark:text-[var(--text)] mb-2">Lightning Fast</h3>
                  <p className="text-[var(--text-muted)] dark:text-[var(--text-muted)] text-sm">
                    Convert complex images to SVGs in under 2 seconds with our
                    optimized engine.
                  </p>
                </Card>

                <Card
                  variant="elevated"
                  className="p-6 text-center animate-fadeIn"
                  style={{ animationDelay: '0.2s' }}
                >
                  <div className="w-14 h-14 rounded bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mx-auto mb-4">
                    <Shield className="text-[var(--text)] dark:text-[var(--text)]" size={28} />
                  </div>
                  <h3 className="font-bold text-lg text-[var(--text)] dark:text-[var(--text)] mb-2">Privacy First</h3>
                  <p className="text-[var(--text-muted)] dark:text-[var(--text-muted)] text-sm">
                    Images are processed securely and deleted immediately after
                    conversion.
                  </p>
                </Card>

                <Card
                  variant="elevated"
                  className="p-6 text-center animate-fadeIn"
                  style={{ animationDelay: '0.3s' }}
                >
                  <div className="w-14 h-14 rounded bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                    <MousePointer2 className="text-[var(--text)] dark:text-[var(--text)]" size={28} />
                  </div>
                  <h3 className="font-bold text-lg text-[var(--text)] dark:text-[var(--text)] mb-2">Layer Support</h3>
                  <p className="text-[var(--text-muted)] dark:text-[var(--text-muted)] text-sm">
                    Automatically detects shapes and creates clean, editable SVG
                    layers.
                  </p>
                </Card>
              </div>
            </div>
          ) : (
            <SvgPreview />
          )}
        </div>

        {/* Error Notification */}
        {error && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 glass-strong border-l-4 border-red-500 px-6 py-4 rounded shadow-xl flex items-center gap-3 animate-slideInRight z-50">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="font-medium text-red-400">{error}</span>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
