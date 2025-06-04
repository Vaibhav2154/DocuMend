import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileCheck, 
  Zap, 
  Shield, 
  Bot, 
  BarChart3, 
  Globe,
  Users,
  Clock,
  Database
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI-Powered Validation",
    description: "Advanced machine learning algorithms automatically validate document authenticity and extract key information with unprecedented accuracy.",
    badge: "Core Feature"
  },
  {
    icon: Zap,
    title: "Real-time Processing",
    description: "Process documents instantly with our lightning-fast processing engine. Get results in seconds, not hours.",
    badge: "Performance"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade encryption and compliance with GDPR, HIPAA, and SOC 2 standards ensure your documents are always protected.",
    badge: "Security"
  },
  {
    icon: FileCheck,
    title: "Multi-format Support",
    description: "Handle PDFs, images, scanned documents, and more. Our system adapts to any document format you throw at it.",
    badge: "Compatibility"
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Gain insights with comprehensive reporting and analytics. Track processing metrics and optimize your workflows.",
    badge: "Insights"
  },
  {
    icon: Globe,
    title: "API Integration",
    description: "Seamlessly integrate with your existing systems using our robust REST API and webhooks.",
    badge: "Integration"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Enable your team to work together with role-based access controls and collaborative workflows.",
    badge: "Collaboration"
  },
  {
    icon: Clock,
    title: "Automated Workflows",
    description: "Set up automated processing pipelines that handle documents from upload to final validation without manual intervention.",
    badge: "Automation"
  },
  {
    icon: Database,
    title: "Smart Storage",
    description: "Intelligent document organization with tagging, search, and retrieval capabilities powered by AI.",
    badge: "Organization"
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for Modern Teams
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to transform your document processing workflows and boost productivity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}