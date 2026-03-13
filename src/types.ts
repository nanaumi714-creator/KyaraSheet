export type Plan = 'free' | 'creator' | 'creator_pro';

export interface User {
  id: string;
  email: string;
  plan: Plan;
}

export interface FaceAnchor {
  center_x: number;
  center_y: number;
  radius: number;
  is_provisional: boolean;
}

export interface Character {
  id: string;
  name: string;
  base_image_url: string;
  thumbnail_url?: string;
  tags: string[];
  face_anchor: FaceAnchor;
}

export type UseCase = 'tweet' | 'youtube' | 'streaming' | 'icon';
export type Mood = 'waku' | 'cool' | 'emo' | 'cute' | 'gachi';

export interface Template {
  id: string;
  name: string;
  use_case: UseCase;
  mood: Mood;
  size_w: number;
  size_h: number;
  default_config: LayerConfig;
}

export type AssetType = 'background' | 'effect' | 'expression' | 'frame';

export interface Asset {
  id: string;
  type: AssetType;
  category?: string;
  image_url: string;
  thumbnail_url?: string;
  mood_tags: string[];
  is_premium: boolean;
}

export interface LayerConfig {
  background_id: string;
  custom_background_url?: string;
  character: {
    id: string;
    position: { x: number; y: number };
    scale: number;
    expression_id: string | null;
  };
  effects: { asset_id: string; enabled: boolean }[];
  frame_id: string | null;
  text: {
    id: string;
    content: string;
    position: { x: number; y: number };
    fontSize: number;
    fontFamily: string;
    color: string;
  }[];
}

export interface Project {
  id: string;
  title: string;
  character_id: string;
  template_id: string;
  config: LayerConfig;
  updated_at: string;
}
