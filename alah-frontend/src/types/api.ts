export interface AIModelConfig {
  name: string;
  provider: 'openai' | 'huggingface' | 'anthropic' | 'local';
  modelId: string;
  apiKey?: string;
  endpoint?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AttentionAnalysisRequest {
  text: string;
  modelConfig?: AIModelConfig;
  options?: {
    includeTokenizer?: boolean;
    includeLayers?: number[];
    includeHeads?: number[];
  };
}

export interface AttentionAnalysisResponse {
  tokens: string[];
  attention: number[][][]; // [layer][head][token_i][token_j]
  layers: number;
  heads: number;
  tokenizer_info?: {
    vocab_size: number;
    model_max_length: number;
  };
  processing_time: number;
}

export interface HallucinationDetectionRequest {
  text: string;
  context?: string;
  modelConfig?: AIModelConfig;
  detection_types: ('factual' | 'logical' | 'consistency')[];
}

export interface HallucinationDetectionResponse {
  text: string;
  has_hallucination: boolean;
  confidence: number;
  detected_issues: {
    type: 'factual' | 'logical' | 'consistency';
    severity: 'low' | 'medium' | 'high';
    description: string;
    location: {
      start: number;
      end: number;
    };
    suggestion?: string;
  }[];
  explanation: string;
  processing_time: number;
}

export interface TextGenerationRequest {
  prompt: string;
  modelConfig?: AIModelConfig;
  options?: {
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    stop?: string[];
  };
}

export interface TextGenerationResponse {
  text: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model: string;
  processing_time: number;
}

export interface DecisionPathRequest {
  text: string;
  modelConfig?: AIModelConfig;
  options?: {
    include_embeddings?: boolean;
    include_attention?: boolean;
    max_steps?: number;
  };
}

export interface DecisionStep {
  step_id: number;
  step_type: 'input' | 'embedding' | 'attention' | 'feedforward' | 'output';
  layer: number;
  description: string;
  input_shape: number[];
  output_shape: number[];
  activations?: number[];
  attention_weights?: {
    source: number;
    target: number;
    weight: number;
  }[];
  processing_time: number;
  confidence: number;
}

export interface DecisionPathResponse {
  steps: DecisionStep[];
  total_processing_time: number;
  final_output: string;
  model_info: {
    name: string;
    layers: number;
    heads: number;
    hidden_size: number;
  };
}

export interface APIError {
  code: string;
  message: string;
  details?: any;
}