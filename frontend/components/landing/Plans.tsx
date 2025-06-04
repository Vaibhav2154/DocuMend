import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Perfect for small teams getting started",
    features: [
      "1,000 documents/month",
      "Basic AI validation",
      "Standard support",
      "API access",
      "5 team members",
      "Basic analytics"
    ],
    buttonText: "Start Free Trial",
    popular: false
  },
  {
    name: "Professional",
    price: "$99",
    period: "/month",
    description: "Ideal for growing businesses",
    features: [
      "10,000 documents/month",
      "Advanced AI validation",
      "Priority support",
      "Full API access",
      "25 team members",
      "Advanced analytics",
      "Custom workflows",
      "Integrations"
    ],
    buttonText: "Start Free Trial",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations with custom needs",
    features: [
      "Unlimited documents",
      "Enterprise AI features",
      "24/7 dedicated support",
      "Custom integrations",
      "Unlimited team members",
      "Advanced security",
      "SLA guarantee",
      "On-premise deployment"
    ],
    buttonText: "Contact Sales",
    popular: false
  }
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your team. Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''} hover:shadow-lg transition-all duration-300`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <div className="mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href="/signup" className="block">
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-primary' : ''}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            All plans include 14-day free trial • No credit card required
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <span>✓ 99.9% Uptime SLA</span>
            <span>✓ Enterprise Security</span>
            <span>✓ 24/7 Support</span>
            <span>✓ Cancel Anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}