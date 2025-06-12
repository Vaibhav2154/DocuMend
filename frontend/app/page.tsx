"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/navigation";
import { 
  FileText, 
  Upload, 
  Download, 
  Loader2, 
  ImageIcon,
  FileDown, 
  Sparkles, 
  CheckCircle, 
  Wand2,
  Copy,
  ScanText,
  Zap,
  Star,
  Shield,
  Users,
  BarChart3,
  TrendingUp,
  Languages,
  Brain,
  Eye
} from "lucide-react";

interface LLMAnalysis {
  document_classification: string;
  structured_data: any;
}

interface OCRResult {
  raw_text: string;
  processed_text: string;
  text_length: number;
  processing_timestamp: string;
  llm_analysis?: LLMAnalysis;
}

interface OCRResponse {
  filename: string;
  file_type: string;
  processing_options: {
    language: string;
    text_cleaning: boolean;
    ai_analysis: boolean;
  };
  extracted_data: OCRResult;
  status: string;
}

const supportedLanguages = {
  "eng": "English",
  "fra": "French", 
  "deu": "German",
  "spa": "Spanish",
  "ita": "Italian",
  "por": "Portuguese",
  "rus": "Russian",
  "chi_sim": "Chinese (Simplified)",
  "chi_tra": "Chinese (Traditional)",
  "jpn": "Japanese",
  "kor": "Korean",
  "ara": "Arabic",
  "hin": "Hindi"
};

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [ocrResult, setOcrResult] = useState<OCRResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cleanText, setCleanText] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("eng");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("upload");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a JPG, PNG, or PDF file",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      setOcrResult(null);
      setActiveTab("upload");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(droppedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a JPG, PNG, or PDF file",
          variant: "destructive",
        });
        return;
      }
      setFile(droppedFile);
      setOcrResult(null);
      setActiveTab("upload");
    }
  };

  const processFile = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("clean_text", cleanText.toString());
      formData.append("language", selectedLanguage);

      const response = await fetch(`${baseUrl}/ocr/extract`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "OCR processing failed");
      }

      const result: OCRResponse = await response.json();
      setOcrResult(result);
      setUploadProgress(100);
      setActiveTab("results");

      toast({
        title: "Success!",
        description: "Text extracted and analyzed with AI successfully",
      });

    } catch (error) {
      console.error("OCR processing error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process file",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      clearInterval(progressInterval);
    }
  };

  const downloadJSON = () => {
    if (!ocrResult) return;
    
    const dataStr = JSON.stringify(ocrResult, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${ocrResult.filename}_ocr_analysis.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "JSON file saved successfully",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const getFileIcon = () => {
    if (!file) return <FileText className="h-8 w-8" />;
    
    if (file.type === 'application/pdf') {
      return <FileText className="h-8 w-8 text-red-500" />;
    } else {
      return <ImageIcon className="h-8 w-8 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Navigation />
      
      {/* Enhanced Hero Section */}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="text-center py-12 space-y-6 relative">
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full text-sm font-medium text-primary mb-4">
            <Zap className="h-4 w-4" />
            <span>Advanced OCR-to-JSON Parser</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
            Extract Text from Images
            <br />
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Get Structured JSON
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Upload Images or PDFs → Extract Text with OCR → Get Clean JSON Output with AI Analysis
          </p>
          
          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {[
              { icon: ScanText, text: "Advanced OCR", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" },
              { icon: Languages, text: "13+ Languages", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" },
              { icon: Brain, text: "AI-Enhanced", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100" },
              { icon: FileDown, text: "JSON Export", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100" }
            ].map((feature, index) => (
              <Badge key={index} className={`${feature.color} px-4 py-2 text-sm font-medium`}>
                <feature.icon className="h-4 w-4 mr-2" />
                {feature.text}
              </Badge>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
            {[
              { value: "JPG, PNG", label: "Image Formats", icon: ImageIcon },
              { value: "PDF", label: "Scanned Documents", icon: FileText },
              { value: "13+", label: "Languages", icon: Languages },
              { value: "JSON", label: "Structured Output", icon: FileDown }
            ].map((stat, index) => (
              <div key={index} className="text-center p-4 rounded-2xl bg-background/50 backdrop-blur border border-border/50">
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload & Extract
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              JSON Results
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-8">
            {/* File Upload Card */}
            <Card className="relative overflow-hidden shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-blue-500/5 to-purple-500/5" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="bg-gradient-to-br from-primary to-blue-600 p-3 rounded-xl shadow-lg">
                    <Upload className="h-6 w-6 text-primary-foreground" />
                  </div>
                  Upload Your Document
                </CardTitle>
                <CardDescription className="text-base">
                  Supports JPG, PNG images and PDF documents for OCR processing
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div 
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer bg-gradient-to-br from-muted/20 to-background/50"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {file ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-center">
                        {getFileIcon()}
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{file.name}</p>
                        <p className="text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type.includes('pdf') ? 'PDF Document' : 'Image File'}
                        </p>
                      </div>
                      <Button variant="outline" size="lg" className="mt-4">
                        <Upload className="h-4 w-4 mr-2" />
                        Change File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <Upload className="h-16 w-16 mx-auto text-muted-foreground" />
                      <div>
                        <p className="text-xl font-semibold mb-2">Drop files here or click to upload</p>
                        <p className="text-muted-foreground">
                          Supports <strong>JPG, PNG</strong> images and <strong>PDF</strong> documents
                        </p>
                      </div>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            {/* OCR Settings Card */}
            <Card className="relative overflow-hidden shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-teal-500/5" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-3 rounded-xl shadow-lg">
                    <ScanText className="h-6 w-6 text-white" />
                  </div>
                  OCR Configuration
                </CardTitle>
                <CardDescription className="text-base">
                  Configure language detection and text processing settings
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="language" className="text-base font-semibold flex items-center gap-2">
                      <Languages className="h-4 w-4" />
                      OCR Language
                    </Label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(supportedLanguages).map(([code, name]) => (
                          <SelectItem key={code} value={code} className="py-3">
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-3 pt-8">
                    <Switch
                      id="clean-text"
                      checked={cleanText}
                      onCheckedChange={setCleanText}
                      className="scale-125"
                    />
                    <Label htmlFor="clean-text" className="flex items-center gap-2 text-base font-semibold">
                      <Wand2 className="h-4 w-4" />
                      Smart Text Cleaning
                    </Label>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <Brain className="h-6 w-6 text-blue-600 mt-1 shrink-0" />
                    <div>
                      <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2 text-lg">
                        🚀 AI-Enhanced Processing
                      </p>
                      <p className="text-blue-700 dark:text-blue-300">
                        Every document is automatically analyzed with advanced AI to intelligently extract and structure data. 
                        The system automatically detects document types and extracts key-value pairs like dates, amounts, names, and more.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                          Document Classification
                        </Badge>
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                          Key-Value Extraction
                        </Badge>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                          Entity Recognition
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Process Button */}
            {file && (
              <Card className="relative overflow-hidden shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
                <CardContent className="p-8">
                  <div className="text-center space-y-6">
                    <div className="bg-muted/50 rounded-xl p-6">
                      <div className="flex items-center justify-center gap-4 mb-4">
                        {getFileIcon()}
                        <div className="text-left">
                          <p className="font-semibold text-lg">{file.name}</p>
                          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mt-1">
                            <Badge variant="outline">
                              {supportedLanguages[selectedLanguage as keyof typeof supportedLanguages]}
                            </Badge>
                            {cleanText && <Badge variant="outline">Smart Cleaning</Badge>}
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                              AI Enhanced
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {isProcessing && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center gap-3">
                          <Sparkles className="h-5 w-5 animate-pulse text-blue-600" />
                          <span className="text-lg font-medium">Processing with AI-powered OCR...</span>
                        </div>
                        <Progress value={uploadProgress} className="w-full h-3" />
                      </div>
                    )}

                    <Button 
                      onClick={processFile} 
                      disabled={!file || isProcessing}
                      size="lg"
                      className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-200"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                          Extracting Text with OCR...
                        </>
                      ) : (
                        <>
                          <ScanText className="mr-3 h-6 w-6" />
                          Extract Text & Generate JSON
                          <Sparkles className="ml-3 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-8">
            {ocrResult ? (
              <>
                {/* Summary Card */}
                <Card className="relative overflow-hidden shadow-xl border-0 bg-gradient-to-br from-background to-muted/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-teal-500/5" />
                  <CardHeader className="relative">
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-3 text-2xl">
                        <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-3 rounded-xl shadow-lg">
                          <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                        OCR Processing Complete
                      </span>
                      <Button onClick={downloadJSON} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <Download className="h-5 w-5 mr-2" />
                        Download JSON
                      </Button>
                    </CardTitle>
                    <CardDescription className="text-base">
                      Successfully processed <strong>{ocrResult.filename}</strong> with AI-powered OCR
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center p-4 bg-white/50 dark:bg-black/20 rounded-xl border border-border/50">
                        <p className="text-2xl font-bold text-primary">{ocrResult.file_type.toUpperCase()}</p>
                        <p className="text-sm text-muted-foreground">File Type</p>
                      </div>
                      <div className="text-center p-4 bg-white/50 dark:bg-black/20 rounded-xl border border-border/50">
                        <p className="text-2xl font-bold text-primary">{ocrResult.extracted_data.text_length.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Characters</p>
                      </div>
                      <div className="text-center p-4 bg-white/50 dark:bg-black/20 rounded-xl border border-border/50">
                        <p className="text-2xl font-bold text-primary">
                          {supportedLanguages[ocrResult.processing_options.language as keyof typeof supportedLanguages]}
                        </p>
                        <p className="text-sm text-muted-foreground">Language</p>
                      </div>
                      <div className="text-center p-4 bg-white/50 dark:bg-black/20 rounded-xl border border-border/50">
                        <p className="text-2xl font-bold text-blue-600">
                          {ocrResult.extracted_data.llm_analysis?.document_classification || "General"}
                        </p>
                        <p className="text-sm text-muted-foreground">Document Type</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Analysis Results */}
                {ocrResult.extracted_data.llm_analysis && (
                  <Card className="relative overflow-hidden shadow-xl border-0 bg-gradient-to-br from-background to-muted/20">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-indigo-500/5" />
                    <CardHeader className="relative">
                      <CardTitle className="flex items-center gap-3 text-2xl">
                        <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-xl shadow-lg">
                          <Brain className="h-6 w-6 text-white" />
                        </div>
                        AI-Extracted Structured Data
                      </CardTitle>
                      <CardDescription className="text-base">
                        Intelligently structured information extracted by AI with key-value pair detection
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="space-y-4">
                        {ocrResult.extracted_data.llm_analysis.structured_data.error ? (
                          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                            <p className="text-red-800 dark:text-red-200 font-semibold text-lg">Analysis Error</p>
                            <p className="text-red-600 dark:text-red-400 mt-2">
                              {ocrResult.extracted_data.llm_analysis.structured_data.error}
                            </p>
                          </div>
                        ) : (
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-lg font-semibold flex items-center gap-2">
                                <Star className="h-5 w-5 text-yellow-500" />
                                Structured JSON Data
                              </h4>
                              <Button 
                                onClick={() => copyToClipboard(JSON.stringify(ocrResult.extracted_data.llm_analysis.structured_data, null, 2))}
                                variant="outline" 
                                size="sm"
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                              </Button>
                            </div>
                            <pre className="text-sm overflow-auto whitespace-pre-wrap bg-white/70 dark:bg-black/30 p-4 rounded-lg border max-h-96">
                              {JSON.stringify(ocrResult.extracted_data.llm_analysis.structured_data, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Extracted Text */}
                <Card className="relative overflow-hidden shadow-xl border-0 bg-gradient-to-br from-background to-muted/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-teal-500/5" />
                  <CardHeader className="relative">
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-3 text-2xl">
                        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-3 rounded-xl shadow-lg">
                          <Eye className="h-6 w-6 text-white" />
                        </div>
                        Extracted Text Content
                      </span>
                      <Button 
                        onClick={() => copyToClipboard(ocrResult.extracted_data.processed_text)}
                        variant="outline" 
                        size="lg"
                      >
                        <Copy className="h-5 w-5 mr-2" />
                        Copy Text
                      </Button>
                    </CardTitle>
                    <CardDescription className="text-base">
                      Clean, processed text extracted from your document
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <Textarea 
                      value={ocrResult.extracted_data.processed_text}
                      readOnly
                      className="min-h-[300px] font-mono text-sm resize-none border-2 focus:border-blue-500/50 bg-white/70 dark:bg-black/30"
                    />
                  </CardContent>
                </Card>

                {/* Complete JSON Output */}
                <Card className="relative overflow-hidden shadow-xl border-0 bg-gradient-to-br from-background to-muted/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-red-500/5 to-pink-500/5" />
                  <CardHeader className="relative">
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-3 text-2xl">
                        <div className="bg-gradient-to-br from-orange-600 to-red-600 p-3 rounded-xl shadow-lg">
                          <FileDown className="h-6 w-6 text-white" />
                        </div>
                        Complete JSON Output
                      </span>
                      <div className="flex gap-3">
                        <Button 
                          onClick={() => copyToClipboard(JSON.stringify(ocrResult, null, 2))}
                          variant="outline" 
                          size="lg"
                        >
                          <Copy className="h-5 w-5 mr-2" />
                          Copy JSON
                        </Button>
                        <Button onClick={downloadJSON} size="lg" className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                          <Download className="h-5 w-5 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardTitle>
                    <CardDescription className="text-base">
                      Full structured JSON response with metadata and analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <pre className="bg-white/70 dark:bg-black/30 p-6 rounded-xl overflow-auto text-sm border max-h-96">
                      {JSON.stringify(ocrResult, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="relative overflow-hidden shadow-xl border-0 bg-gradient-to-br from-background to-muted/20">
                <CardContent className="text-center py-16">
                  <ScanText className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
                  <p className="text-2xl font-semibold mb-3">No OCR Results Yet</p>
                  <p className="text-muted-foreground mb-6 text-lg">
                    Upload and process a document to see AI-powered OCR results and structured JSON output
                  </p>
                  <Button onClick={() => setActiveTab("upload")} size="lg" className="bg-gradient-to-r from-primary to-blue-600">
                    <Upload className="h-5 w-5 mr-2" />
                    Start OCR Processing
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Enhanced Footer */}
        <footer className="text-center py-16 space-y-8 mt-16">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">Ready to Extract Text from Your Documents?</h3>
            <p className="text-muted-foreground mb-8 text-lg">
              Join thousands of professionals who trust our AI-powered OCR technology for accurate text extraction and intelligent document analysis.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {[
                "🔍 Advanced OCR Technology",
                "🤖 AI-Powered Analysis", 
                "📄 Multiple File Formats",
                "🌍 13+ Language Support",
                "⚡ Lightning Fast Processing",
                "📊 Structured JSON Output"
              ].map((feature, index) => (
                <Badge key={index} variant="outline" className="px-4 py-2 text-sm">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
          <div className="border-t border-border/50 pt-8">
            <p className="text-sm text-muted-foreground">
              © 2025 DocuMend OCR Parser. Built with ❤️ for intelligent document processing
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}