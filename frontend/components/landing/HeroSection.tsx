import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Zap, Shield } from "lucide-react";

export function HeroSection() {
  return (
    <section className="py-20 md:py-32 px-4">
      <div className="container mx-auto text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Intelligent Document 
            <span className="text-primary"> Processing</span> Made Simple
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Transform your document workflows with AI-powered validation, extraction, 
            and management. Process documents 10x faster with 99.9% accuracy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Watch Demo
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">Process thousands of documents in minutes</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">99.9% Accurate</h3>
              <p className="text-sm text-muted-foreground">AI-powered validation ensures precision</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Any Document</h3>
              <p className="text-sm text-muted-foreground">Support for PDFs, images, and more</p>
            </div>
          </div>
        </div>

        <div className="mt-16 relative">
          <div className="relative mx-auto max-w-5xl">
            <div className="rounded-xl border bg-card shadow-2xl overflow-hidden">
              <div className="bg-muted/30 px-6 py-4 border-b">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-20 bg-muted rounded"></div>
                    <div className="h-4 bg-primary/20 rounded w-2/3"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-8 bg-primary/10 rounded"></div>
                    <div className="h-6 bg-muted rounded w-4/5"></div>
                    <div className="h-6 bg-muted rounded w-3/5"></div>
                    <div className="h-12 bg-green-100 rounded flex items-center justify-center">
                      <span className="text-green-600 font-medium">✓ Validated</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}