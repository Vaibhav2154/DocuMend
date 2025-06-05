export interface FileUploadResponse {
  extracted_text: string;
  message?: string;
}

export interface SummaryResponse {
  summary: string;
  message?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
}

export interface UploadProgress {
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
}