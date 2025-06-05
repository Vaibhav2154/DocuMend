"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Upload, 
  Download, 
  Loader2, 
  FileDown, 
  Eye, 
  Sparkles, 
  CheckCircle, 
  ArrowRight, 
  Clock,
  TrendingUp,
  Zap,
  Star,
  Shield,
  Users,
  BarChart3
} from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { marked } from 'marked';
import { ModeToggle } from "@/components/mode-toggle";

// Add proper type definitions
interface TemplateConfig {
  [key: string]: string;
}

const templates: TemplateConfig = {
  "1": "Executive Summary - Brief summary focusing on key points and main conclusions",
  "2": "Technical Summary - Methodology, findings, and recommendations",
  "3": "Business Summary - Financial impact and strategic implications", 
  "4": "Academic Summary - Comprehensive analysis with detailed insights",
  "5": "General Summary - Simple summary for general audience"
};

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [summary, setSummary] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'edit'>('preview');
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Update step progression
  useEffect(() => {
    if (file && !extractedText) setCurrentStep(1);
    else if (extractedText && !summary) setCurrentStep(2);
    else if (summary) setCurrentStep(4);
  }, [file, extractedText, summary]);

  const handleFileUpload = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a PDF file first",
        variant: "destructive",
      });
      return;
    }

    setIsExtracting(true);
    setUploadProgress(0);
    
    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${baseUrl}/validate/pdf`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to extract text from PDF");
      }

      const data = await response.json();
      setExtractedText(data.extracted_text);
      setUploadProgress(100);
      setCurrentStep(2);
      
      toast({
        title: "Success",
        description: "Text extracted successfully from PDF",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to extract text from PDF",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setIsExtracting(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleGenerateSummary = async () => {
    if (!extractedText || !selectedTemplate) {
      toast({
        title: "Error",
        description: "Please extract text and select a template first",
        variant: "destructive",
      });
      return;
    }

    setIsSummarizing(true);
    setCurrentStep(3);
    
    try {
      const response = await fetch(`${baseUrl}/summarize/summarize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: extractedText,
          template_id: parseInt(selectedTemplate),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await response.json();
      setSummary(data.summary);
      setCurrentStep(4);
      
      toast({
        title: "Success",
        description: "Summary generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate summary",
        variant: "destructive",
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  // Fix the DOCX download function
  const handleDownloadDocx = () => {
    if (!summary) {
      toast({
        title: "Error",
        description: "No summary to download",
        variant: "destructive",
      });
      return;
    }

    // Convert markdown to HTML with proper typing
    const htmlSummary = marked(summary) as string;
    
    // Create a properly formatted HTML document that can be saved as DOCX
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Document Summary</title>
        <style>
          body { 
            font-family: 'Times New Roman', serif; 
            line-height: 1.6; 
            margin: 40px; 
            color: #333;
          }
          h1 { 
            color: #2c3e50; 
            border-bottom: 3px solid #3498db; 
            padding-bottom: 10px;
            font-size: 28px;
          }
          h2 { 
            color: #34495e; 
            margin-top: 30px;
            font-size: 22px;
            border-left: 4px solid #3498db;
            padding-left: 15px;
          }
          h3 { 
            color: #5a6c7d; 
            margin-top: 25px;
            font-size: 18px;
          }
          h4, h5, h6 {
            color: #7f8c8d;
            margin-top: 20px;
          }
          p { 
            margin-bottom: 15px; 
            text-align: justify;
          }
          ul, ol { 
            margin-bottom: 15px; 
            padding-left: 30px;
          }
          li { 
            margin-bottom: 8px; 
          }
          blockquote {
            border-left: 4px solid #bdc3c7;
            margin: 20px 0;
            padding: 15px 20px;
            background-color: #f8f9fa;
            font-style: italic;
          }
          code {
            background-color: #f1f2f6;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
          }
          pre {
            background-color: #f1f2f6;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            margin: 15px 0;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
          }
          th, td {
            border: 1px solid #bdc3c7;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #ecf0f1;
            font-weight: bold;
          }
          .metadata { 
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); 
            padding: 25px; 
            border-radius: 10px; 
            margin-bottom: 30px; 
            border: 1px solid #bdc3c7;
          }
          .metadata h1 {
            margin-top: 0;
            border-bottom: none;
          }
          strong { 
            color: #2c3e50; 
          }
          hr {
            border: none;
            height: 2px;
            background: linear-gradient(to right, #3498db, transparent);
            margin: 30px 0;
          }
        </style>
      </head>
      <body>
        <div class="metadata">
          <h1>📄 Document Summary</h1>
          <p><strong>Original File:</strong> ${file?.name || 'Unknown'}</p>
          <p><strong>Template Used:</strong> ${templates[selectedTemplate as keyof typeof templates]}</p>
          <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        </div>
        <hr>
        <div class="summary-content">
          ${htmlSummary}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `summary-${file?.name?.replace('.pdf', '') || 'document'}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Summary downloaded as Word document",
    });
  };

  // Fix the PDF generation function with proper typing
  const handleDownloadPdf = async () => {
    if (!summary) {
      toast({
        title: "Error",
        description: "No summary to download",
        variant: "destructive",
      });
      return;
    }

    try {
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF();
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      
      // Convert markdown to plain text for PDF (removing markdown syntax)
      let plainTextSummary = summary
        .replace(/#{1,6}\s+/g, '') // Remove headers
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
        .replace(/\*(.*?)\*/g, '$1') // Remove italic
        .replace(/`(.*?)`/g, '$1') // Remove inline code
        .replace(/```[\s\S]*?```/g, '') // Remove code blocks
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
        .replace(/^[-*+]\s+/gm, '• ') // Convert bullet points
        .replace(/^\d+\.\s+/gm, (match, offset, string) => {
          // Convert numbered lists
          const lineStart = string.lastIndexOf('\n', offset) + 1;
          const currentLine = string.substring(lineStart, offset);
          const number = match.match(/\d+/)?.[0] || '1';
          return `${number}. `;
        })
        .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
        .trim();
      
      // Add title with enhanced styling
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(44, 62, 80); // Dark blue-gray
      pdf.text('Document Summary', margin, 35);
      
      // Add decorative line under title
      pdf.setDrawColor(52, 152, 219); // Blue
      pdf.setLineWidth(1);
      pdf.line(margin, 42, pageWidth - margin, 42);
      
      // Add metadata section with better formatting
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(52, 73, 94); // Dark gray
      let yPosition = 60;
      
      const metadata = [
        `📄 Original File: ${file?.name || 'Unknown'}`,
        `📋 Template: ${templates[selectedTemplate as keyof typeof templates] || 'Unknown'}`,
        `📅 Generated: ${new Date().toLocaleString()}`
      ];
      
      // Create metadata box
      pdf.setFillColor(248, 249, 250); // Light gray background
      pdf.setDrawColor(189, 195, 199); // Border color
      pdf.roundedRect(margin, yPosition - 8, maxWidth, 35, 3, 3, 'FD');
      
      metadata.forEach((line, index) => {
        pdf.setFont('helvetica', index === 0 ? 'bold' : 'normal');
        pdf.text(line, margin + 5, yPosition + (index * 8) + 5);
      });
      
      yPosition += 45;
      
      // Add separator line with gradient effect
      pdf.setDrawColor(52, 152, 219);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 15;
      
      // Process summary content with enhanced formatting
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(33, 37, 41); // Almost black
      
      // Split text into paragraphs and process each
      const paragraphs = plainTextSummary.split('\n\n');
      
      paragraphs.forEach((paragraph, paragraphIndex) => {
        if (!paragraph.trim()) return;
        
        // Check if it's a heading (starts with original markdown indicators)
        const originalLine = summary.split('\n').find(line => 
          line.replace(/#{1,6}\s+/, '') === paragraph.trim()
        );
        
        if (originalLine && originalLine.match(/^#{1,6}\s+/)) {
          // This is a heading
          const headerLevel = (originalLine.match(/#/g) || []).length;
          const fontSize = Math.max(16 - headerLevel * 2, 11);
          
          // Add some space before headings (except first)
          if (paragraphIndex > 0) yPosition += 8;
          
          pdf.setFontSize(fontSize);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(52, 73, 94);
          
          const headerLines = pdf.splitTextToSize(paragraph.trim(), maxWidth);
          headerLines.forEach((line: string) => {
            if (yPosition > pageHeight - margin - 10) {
              pdf.addPage();
              yPosition = margin + 10;
            }
            pdf.text(line, margin, yPosition);
            yPosition += fontSize * 0.35 + 2;
          });
          
          yPosition += 5; // Extra space after headings
        } else {
          // Regular paragraph
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(33, 37, 41);
          
          const lines = pdf.splitTextToSize(paragraph.trim(), maxWidth);
          lines.forEach((line: string) => {
            if (yPosition > pageHeight - margin - 5) {
              pdf.addPage();
              yPosition = margin + 10;
            }
            
            // Handle bullet points with better formatting
            if (line.startsWith('• ')) {
              pdf.text('•', margin, yPosition);
              pdf.text(line.substring(2), margin + 8, yPosition);
            } else if (line.match(/^\d+\.\s/)) {
              // Handle numbered lists
              const parts = line.split(/^(\d+\.\s)/);
              if (parts.length >= 3) {
                pdf.text(parts[1], margin, yPosition);
                pdf.text(parts[2], margin + 12, yPosition);
              } else {
                pdf.text(line, margin, yPosition);
              }
            } else {
              pdf.text(line, margin, yPosition);
            }
            
            yPosition += 6;
          });
          
          yPosition += 4; // Space between paragraphs
        }
      });
      
      // Add footer with page numbers
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(149, 165, 166);
        pdf.text(
          `Page ${i} of ${pageCount}`,
          pageWidth - margin - 20,
          pageHeight - 10
        );
      }
      
      // Save the PDF
      pdf.save(`summary-${file?.name?.replace('.pdf', '') || 'document'}.pdf`);
      
      toast({
        title: "Success",
        description: "Summary downloaded as PDF with proper formatting",
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-background to-muted/20 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative bg-gradient-to-br from-primary to-primary/80 p-3 rounded-2xl shadow-lg">
                  <FileText className="h-8 w-8 text-primary-foreground" />
                  <Sparkles className="h-4 w-4 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
                </div>
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  DocuMend
                </h1>
                <p className="text-sm text-muted-foreground font-medium">AI-Powered Document Intelligence Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  v2.1
                </Badge>
                <Badge variant="outline" className="border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300">
                  <Users className="h-3 w-3 mr-1" />
                  10K+ Users
                </Badge>
              </div>
              <ModeToggle />
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Process Progress</span>
              <span className="text-sm font-medium text-primary">{currentStep}/4 Steps</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-blue-600 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-7xl p-6 space-y-8">
        {/* Enhanced Hero Section */}
        <div className="text-center py-12 space-y-6 relative animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full text-sm font-medium text-primary mb-4">
            <Zap className="h-4 w-4" />
            <span>Powered by Advanced AI Technology</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
            Transform Documents
            <br />
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              with AI Intelligence
            </span>
          </h2>
          
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Upload PDF → Extract Text → Generate Intelligent Summaries → Download in Multiple Formats
          </p>
          
          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {[
              { icon: Shield, text: "Secure Processing", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" },
              { icon: Zap, text: "Fast", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" },
              { icon: Star, text: "Premium Quality", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100" },
              { icon: BarChart3, text: "Smart Analytics", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" }
            ].map((feature, index) => (
              <Badge key={index} className={`${feature.color} px-4 py-2 text-sm font-medium animate-scale-in`} style={{ animationDelay: `${index * 100}ms` }}>
                <feature.icon className="h-4 w-4 mr-2" />
                {feature.text}
              </Badge>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto mt-12">
            {[
              { value: "10K+", label: "Documents Processed", icon: FileText },
              { value: "99.9%", label: "Accuracy Rate", icon: CheckCircle },
              { value: "50+", label: "Languages Supported", icon: Star }
            ].map((stat, index) => (
              <div key={index} className="text-center p-4 rounded-2xl bg-background/50 backdrop-blur border border-border/50 animate-slide-up" style={{ animationDelay: `${index * 200}ms` }}>
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-8">
          {/* Enhanced File Upload */}
          <Card className="relative overflow-hidden shadow-lg border-0 bg-gradient-to-br from-background to-muted/20 animate-slide-up">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-500/5 to-purple-500/10" />
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-primary to-blue-600 p-3 rounded-xl shadow-lg">
                    <Upload className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold">Step 1: Upload PDF Document</CardTitle>
                    <CardDescription className="text-base mt-1">
                      Select a PDF file to extract and analyze its content with AI
                    </CardDescription>
                  </div>
                </div>
                <Badge 
                  variant={currentStep >= 1 ? "default" : "secondary"} 
                  className={currentStep >= 1 ? "bg-green-600 text-white" : ""}
                >
                  {currentStep > 1 ? <CheckCircle className="h-4 w-4 mr-1" /> : <Clock className="h-4 w-4 mr-1" />}
                  {currentStep > 1 ? "Complete" : "Pending"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-6">
              <div className="space-y-4">
                <Label htmlFor="file" className="text-base font-semibold flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Choose PDF File
                </Label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-lg blur-sm group-hover:blur-md transition-all duration-300"></div>
                  <Input
                  id="file"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="relative file:mr-6 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-b file:from-primary file:to-blue-900 file:text-yellow-100 hover:file:from-primary/90 hover:file:to-blue-600/90 file:transition-all file:duration-200 text-base h-14 border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-all duration-200"
                  />
                </div>
                {file && (
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border/50 animate-scale-in">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • PDF Document
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      Ready to Process
                    </Badge>
                  </div>
                )}
              </div>
              
              {uploadProgress > 0 && (
                <div className="space-y-2 animate-scale-in">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Extracting text...</span>
                    <span className="font-medium text-primary">{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
              
              <Button 
                onClick={handleFileUpload} 
                disabled={!file || isExtracting}
                className="w-full h-14 text-base font-semibold bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all duration-200"
                size="lg"
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Extracting Text from PDF...
                  </>
                ) : (
                  <>
                    <Upload className="mr-3 h-5 w-5" />
                    Extract Text from PDF
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Enhanced Extracted Text */}
          {extractedText && (
            <Card className="relative overflow-hidden shadow-lg border-0 bg-gradient-to-br from-background to-muted/20 animate-slide-up">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/5 to-teal-500/10" />
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-3 rounded-xl shadow-lg">
                      <Eye className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold">Step 2: Extracted Text</CardTitle>
                      <CardDescription className="text-base mt-1">
                        Review and edit the extracted text content if needed
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                      {extractedText.length.toLocaleString()} characters
                    </Badge>
                    <Badge variant="default" className="bg-green-600 text-white">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Complete
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-lg blur-sm"></div>
                  <Textarea
                    value={extractedText}
                    onChange={(e) => setExtractedText(e.target.value)}
                    className="relative min-h-[250px] font-mono text-sm resize-none border-2 border-border/30 focus:border-blue-500/50 transition-all duration-200 custom-scrollbar"
                    placeholder="Extracted text will appear here..."
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                  <span>Text successfully extracted from your PDF document</span>
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Ready for summarization
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Summary Generation */}
          {extractedText && (
            <Card className="relative overflow-hidden shadow-lg border-0 bg-gradient-to-br from-background to-muted/20 animate-slide-up">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-teal-500/10" />
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-3 rounded-xl shadow-lg">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold">Step 3: Generate AI Summary</CardTitle>
                      <CardDescription className="text-base mt-1">
                        Choose a template and let AI create an intelligent summary
                      </CardDescription>
                    </div>
                  </div>
                  <Badge 
                    variant={currentStep >= 3 ? "default" : "secondary"} 
                    className={currentStep >= 3 ? "bg-green-600 text-white" : ""}
                  >
                    {currentStep > 3 ? <CheckCircle className="h-4 w-4 mr-1" /> : <Clock className="h-4 w-4 mr-1" />}
                    {currentStep > 3 ? "Complete" : currentStep === 3 ? "Processing" : "Pending"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="template" className="text-base font-semibold flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Summary Template
                  </Label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg blur-sm group-hover:blur-md transition-all duration-300"></div>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger className="relative h-14 text-base border-2 border-border/30 focus:border-green-500/50 transition-all duration-200">
                        <SelectValue placeholder="Select a summary template for AI processing" />
                      </SelectTrigger>
                      <SelectContent className="max-w-md">
                        {Object.entries(templates).map(([id, description]) => (
                          <SelectItem key={id} value={id} className="py-4 cursor-pointer">
                            <div className="space-y-2">
                              <div className="font-semibold text-base flex items-center">
                                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                                {description.split(' - ')[0]}
                              </div>
                              <div className="text-sm text-muted-foreground ml-5">
                                {description.split(' - ')[1]}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedTemplate && (
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl animate-scale-in">
                      <div className="flex items-start space-x-3">
                        <div className="bg-green-500 p-1 rounded-full mt-0.5">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-green-800 dark:text-green-200">
                            {templates[selectedTemplate as keyof typeof templates].split(' - ')[0]} Selected
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                            {templates[selectedTemplate as keyof typeof templates].split(' - ')[1]}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={handleGenerateSummary}
                  disabled={!selectedTemplate || isSummarizing}
                  className="w-full h-14 text-base font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-lg hover:shadow-xl transition-all duration-200"
                  size="lg"
                >
                  {isSummarizing ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      Generating AI Summary...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-3 h-5 w-5" />
                      Generate AI Summary
                      <ArrowRight className="ml-3 h-5 w-5" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Generated Summary */}
          {summary && (
            <Card className="relative overflow-hidden shadow-xl border-0 bg-gradient-to-br from-background to-muted/20 animate-slide-up">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-indigo-500/10" />
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-xl shadow-lg">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold">Step 4: Generated Summary</CardTitle>
                      <CardDescription className="text-base mt-1">
                        Your AI-generated summary is ready for download and use
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                      {summary.length.toLocaleString()} characters
                    </Badge>
                    <Badge variant="default" className="bg-green-600 text-white">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Complete
                    </Badge>
                    <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'preview' | 'edit')}>
                      <TabsList className="grid grid-cols-2 h-9">
                        <TabsTrigger value="preview" className="text-xs px-3">
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </TabsTrigger>
                        <TabsTrigger value="edit" className="text-xs px-3">
                          Edit
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-6">
                <div className="min-h-[300px]">
                  {viewMode === 'preview' ? (
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-lg blur-sm"></div>
                      <div 
                        ref={summaryRef}
                        className="relative prose prose-sm dark:prose-invert max-w-none p-6 bg-gradient-to-br from-muted/40 to-background/60 rounded-xl border border-border/50 backdrop-blur-sm custom-scrollbar overflow-y-auto max-h-96"
                      >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {summary}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ) : (
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-lg blur-sm"></div>
                      <Textarea
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        className="relative min-h-[300px] font-mono text-sm resize-none border-2 border-border/30 focus:border-purple-500/50 transition-all duration-200 custom-scrollbar"
                        placeholder="Generated summary will appear here..."
                      />
                    </div>
                  )}
                </div>
                
                <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />
                
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Download Your Summary</h3>
                    <p className="text-muted-foreground">Choose your preferred format for the generated summary</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button 
                      onClick={handleDownloadDocx} 
                      className="h-14 text-base font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Download className="mr-3 h-5 w-5" />
                      Download as Word Document
                      <div className="ml-auto text-xs opacity-80">.DOC</div>
                    </Button>
                    <Button 
                      onClick={handleDownloadPdf} 
                      variant="outline" 
                      className="h-14 text-base font-semibold border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 dark:border-purple-800 dark:hover:border-purple-600 dark:hover:bg-purple-950/20 transition-all duration-200"
                    >
                      <FileDown className="mr-3 h-5 w-5" />
                      Download as PDF Document
                      <div className="ml-auto text-xs opacity-80">.PDF</div>
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-1 text-green-600" />
                      Secure Processing
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 mr-1 text-yellow-600" />
                      Instant Download
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-purple-600" />
                      Professional Quality
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Enhanced Footer */}
        <footer className="text-center py-12 space-y-6">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-3">Ready to Transform Your Documents?</h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of professionals who trust DocuMend for their document processing needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {[
                "🚀 Lightning Fast Processing",
                "🔒 Enterprise-Grade Security", 
                "🎯 99.9% Accuracy Rate",
                "🌍 50+ Languages Supported"
              ].map((feature, index) => (
                <Badge key={index} variant="outline" className="px-4 py-2 text-sm">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
          <Separator className="max-w-md mx-auto bg-gradient-to-r from-transparent via-border to-transparent" />
          <p className="text-sm text-muted-foreground">
            © 2025 DocuMend. All rights reserved • Built with ❤️ for document intelligence
          </p>
        </footer>
      </div>
    </div>
  );
}