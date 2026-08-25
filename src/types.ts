export type VerdictType = 
  | 'manipulated_overlay' 
  | 'authentic_document' 
  | 'suspicious_context' 
  | 'inconclusive';

export interface OverlayBox {
  id: string;
  label: string;
  type: 'overlaid_text' | 'modified_number' | 'fake_stamp' | 'pasted_graphic' | 'inconsistent_font' | 'compression_artifact';
  // Normalized 0 to 100 percentages: [ymin, xmin, ymax, xmax]
  box: [number, number, number, number];
  extractedText?: string;
  originalLikelyText?: string;
  explanation: string;
  confidence: number; // 0 - 100
  severity: 'high' | 'medium' | 'low';
}

export interface GroundingCitation {
  title: string;
  url: string;
}

export interface OriginalSourceMatch {
  found: boolean;
  title?: string;
  sourceUrl?: string;
  publisher?: string;
  publicationDate?: string;
  similarityScore?: number;
  originalContext?: string;
  debunkingSummary?: string;
  originalImageUrl?: string;
  citations?: GroundingCitation[];
}

export interface ForensicsMetrics {
  structuralSimilaritySSIM: number; // 0 - 100
  perceptualHashMatch: number; // 0 - 100
  elaAnomalyScore: number; // 0 - 100 (high means manipulated)
  noiseConsistencyScore: number; // 0 - 100 (low means inconsistent)
  fontCohesionScore: number; // 0 - 100
}

export interface OcrRegionItem {
  text: string;
  isTampered: boolean;
  tamperReason?: string;
  box: [number, number, number, number]; // [ymin, xmin, ymax, xmax] in %
}

export interface ForensicReport {
  id: string;
  fileName: string;
  fileSize: number;
  dimensions: { width: number; height: number };
  analyzedAt: string;
  md5Hash: string;
  sha256Hash: string;
  verdict: VerdictType;
  verdictTitle: string;
  verdictDescription: string;
  confidenceScore: number;
  manipulationTypes: string[];
  detectedOverlays: OverlayBox[];
  originalSource: OriginalSourceMatch;
  metrics: ForensicsMetrics;
  ocrExtracted: OcrRegionItem[];
  metadataFindings: {
    softwareSignatures?: string;
    compressionQualityEstimated?: string;
    colorProfileDiscrepancy?: boolean;
    lightingInconsistency?: string;
    notes?: string[];
  };
  reconstructionDescription?: string;
}
