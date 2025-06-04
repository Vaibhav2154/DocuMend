import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Operations Manager",
    company: "TechFlow Inc.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face",
    initials: "SC",
    content: "DocuMend has revolutionized our document processing workflow. What used to take hours now takes minutes, and the accuracy is incredible.",
    rating: 5
  },
  {
    name: "Michael Rodriguez",
    role: "IT Director",
    company: "Global Logistics",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    initials: "MR",
    content: "The AI validation has eliminated manual errors in our invoice processing. We've seen a 95% reduction in processing time.",
    rating: 5
  },
  {
    name: "Emily Watson",
    role: "CFO",
    company: "FinanceFirst",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    initials: "EW",
    content: "The security features and compliance standards give us complete confidence in handling sensitive financial documents.",
    rating: 5
  },
  {
    name: "David Kim",
    role: "Head of Operations",
    company: "MedCare Solutions",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    initials: "DK",
    content: "Integration with our existing systems was seamless. The API documentation is excellent and support team is responsive.",
    rating: 5
  },
  {
    name: "Lisa Thompson",
    role: "Document Manager",
    company: "LegalAdvantage",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    initials: "LT",
    content: "The multi-format support is outstanding. We can process everything from scanned contracts to digital PDFs effortlessly.",
    rating: 5
  },
  {
    name: "James Park",
    role: "VP of Technology",
    company: "InnovateNow",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    initials: "JP",
    content: "DocuMend's analytics give us insights we never had before. We can optimize our processes and track performance in real-time.",
    rating: 5
  }
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how companies are transforming their document workflows with DocuMend.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </blockquote>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}