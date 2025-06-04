import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 px-4 bg-primary/5">
      <div className="container mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Document Workflow?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of companies already using DocuMend to process documents faster, 
            more accurately, and with complete security.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Schedule Demo
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">14-Day Free Trial</h3>
                <p className="text-sm text-muted-foreground">
                  Full access to all features, no credit card required
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Easy Setup</h3>
                <p className="text-sm text-muted-foreground">
                  Get started in minutes with our simple onboarding
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Expert Support</h3>
                <p className="text-sm text-muted-foreground">
                  Dedicated support team to help you succeed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}