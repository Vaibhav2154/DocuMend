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
import { Navigation } from "@/components/navigation";
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
import dynamic from 'next/dynamic';
import remarkGfm from 'remark-gfm';

// Dynamically import components that might cause SSR issues
const ReactMarkdown = dynamic(() => import('react-markdown'), { 
  ssr: false,
  loading: () => <div className="animate-pulse bg-muted h-20 rounded"></div>
});

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

export default function SummarizerPage() {
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
  const [isMounted, setIsMounted] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";

  useEffect(() => {
    setIsMounted(true);
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
      setExtractedText(data.extracted_text || "");
      setUploadProgress(100);
      setCurrentStep(2);
      
      toast({
        title: "Success",
        description: "Text extracted successfully from PDF",
      });
    } catch (error) {
      console.error('Upload error:', error);
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
      setSummary(data.summary || "");
      setCurrentStep(4);
      
      toast({
        title: "Success",
        description: "Summary generated successfully",
      });
    } catch (error) {
      console.error('Summary error:', error);
      toast({
        title: "Error",
        description: "Failed to generate summary",
        variant: "destructive",
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  // Fix the DOCX download function with better error handling
  const handleDownloadDocx = async () => {
    if (!summary) {
      toast({
        title: "Error",
        description: "No summary to download",
        variant: "destructive",
      });
      return;
    }

    try {
      // Dynamically import marked to avoid SSR issues
      const { marked } = await import('marked');
      
      // Convert markdown to HTML
      const htmlSummary = await marked(summary);
      
      // Create a properly formatted HTML document that can be saved as DOCX
      const htmlContent = `<!DOCTYPE html>
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
  </style>
</head>
<body>
  <div class="metadata">
    <h1>📄 Document Summary</h1>
    <p><strong>Original File:</strong> ${file?.name || 'Unknown'}</p>
    <p><strong>Template Used:</strong> ${templates[selectedTemplate] || 'Unknown'}</p>
    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
  </div>
  <hr>
  <div class="summary-content">
    ${htmlSummary}
  </div>
</body>
</html>`;

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
    } catch (error) {
      console.error('DOCX download error:', error);
      toast({
        title: "Error",
        description: "Failed to download Word document",
        variant: "destructive",
      });
    }
  };

  // Fix the PDF generation function
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
      
      // Convert markdown to plain text for PDF
      let plainTextSummary = summary
        .replace(/#{1,6}\s+/g, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/`(.*?)`/g, '$1')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')
        .replace(/^[-*+]\s+/gm, '• ')
        .replace(/^\d+\.\s+/gm, (match, offset, string) => {
          const lineStart = string.lastIndexOf('\n', offset) + 1;
          const currentLine = string.substring(lineStart, offset);
          const number = match.match(/\d+/)?.[0] || '1';
          return `${number}. `;
        })
        .replace(/\n{3,}/g, '\n\n')
        .trim();
      
      // Add title
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Document Summary', margin, 35);
      
      // Add metadata
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      let yPosition = 60;
      
      const metadata = [
        `Original File: ${file?.name || 'Unknown'}`,
        `Template: ${templates[selectedTemplate] || 'Unknown'}`,
        `Generated: ${new Date().toLocaleString()}`
      ];
      
      metadata.forEach((line, index) => {
        pdf.text(line, margin, yPosition + (index * 8));
      });
      
      yPosition += 40;
      
      // Add summary content
      pdf.setFontSize(11);
      const lines = pdf.splitTextToSize(plainTextSummary, maxWidth);
      lines.forEach((line: string) => {
        if (yPosition > pageHeight - margin - 5) {
          pdf.addPage();
          yPosition = margin + 10;
        }
        pdf.text(line, margin, yPosition);
        yPosition += 6;
      });
      
      pdf.save(`summary-${file?.name?.replace('.pdf', '') || 'document'}.pdf`);
      
      toast({
        title: "Success",
        description: "Summary downloaded as PDF",
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

  // Don't render until mounted to avoid hydration issues
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-background to-muted/20 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <Navigation />

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

          {/* Progress Indicator */}
          <div className="mt-6 max-w-md mx-auto">
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
                <Input
                  id="file"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="file:mr-6 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-b file:from-primary file:to-blue-900 file:text-yellow-100 hover:file:from-primary/90 hover:file:to-blue-600/90 file:transition-all file:duration-200 text-base h-14 border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-all duration-200"
                />
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
