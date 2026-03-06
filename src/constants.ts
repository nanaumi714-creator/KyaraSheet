import { Template, Asset, UseCase, Mood } from './types';

export const USE_CASES: { id: UseCase; label: string }[] = [
  { id: 'tweet', label: 'ツイート告知 (1:1)' },
  { id: 'youtube', label: 'YouTubeサムネ (16:9)' },
  { id: 'streaming', label: '配信告知 (16:9)' },
  { id: 'icon', label: 'SNSアイコン (1:1)' },
];

export const MOODS: { id: Mood; label: string; color: string }[] = [
  { id: 'waku', label: 'ワクワク', color: 'bg-orange-500' },
  { id: 'cool', label: 'クール', color: 'bg-blue-600' },
  { id: 'emo', label: 'エモ', color: 'bg-purple-500' },
  { id: 'cute', label: 'かわいい', color: 'bg-pink-400' },
  { id: 'gachi', label: 'ガチ勢', color: 'bg-red-600' },
];

export const TEMPLATES: Template[] = [
  {
    id: 'tweet_waku_01',
    name: 'ワクワク告知',
    use_case: 'tweet',
    mood: 'waku',
    size_w: 1080,
    size_h: 1080,
    default_config: {
      background_id: 'bg_01',
      character: {
        id: '',
        position: { x: 540, y: 600 },
        scale: 1,
        expression_id: null,
      },
      effects: [{ asset_id: 'eff_01', enabled: true }],
      frame_id: 'frame_01',
      text: [
        {
          id: 'headline',
          content: '今夜22時〜配信！',
          position: { x: 540, y: 150 },
          fontSize: 80,
          fontFamily: 'sans-serif',
          color: '#ffffff',
        },
      ],
    },
  },
  {
    id: 'youtube_cool_01',
    name: 'クールサムネイル',
    use_case: 'youtube',
    mood: 'cool',
    size_w: 1280,
    size_h: 720,
    default_config: {
      background_id: 'bg_02',
      character: {
        id: '',
        position: { x: 900, y: 400 },
        scale: 1.2,
        expression_id: null,
      },
      effects: [],
      frame_id: null,
      text: [
        {
          id: 'headline',
          content: 'NEW VIDEO',
          position: { x: 300, y: 360 },
          fontSize: 120,
          fontFamily: 'sans-serif',
          color: '#ffffff',
        },
      ],
    },
  },
];

export const ASSETS: Asset[] = [
  // Backgrounds
  { id: 'bg_01', type: 'background', image_url: 'https://picsum.photos/seed/bg1/1080/1080', mood_tags: ['waku'], is_premium: false },
  { id: 'bg_02', type: 'background', image_url: 'https://picsum.photos/seed/bg2/1280/720', mood_tags: ['cool'], is_premium: false },
  { id: 'bg_03', type: 'background', image_url: 'https://picsum.photos/seed/bg3/1080/1080', mood_tags: ['emo'], is_premium: true },
  
  // Effects
  { id: 'eff_01', type: 'effect', image_url: 'https://picsum.photos/seed/eff1/500/500', mood_tags: ['waku'], is_premium: false },
  
  // Expressions (Mocked with simple shapes or icons for now, in real app these would be transparent PNGs)
  { id: 'exp_smile', type: 'expression', image_url: 'https://cdn-icons-png.flaticon.com/512/166/166527.png', mood_tags: ['waku'], is_premium: false },
  { id: 'exp_surprised', type: 'expression', image_url: 'https://cdn-icons-png.flaticon.com/512/166/166538.png', mood_tags: ['waku'], is_premium: false },
  { id: 'exp_cool', type: 'expression', image_url: 'https://cdn-icons-png.flaticon.com/512/166/166547.png', mood_tags: ['cool'], is_premium: false },
  
  // Frames
  { id: 'frame_01', type: 'frame', image_url: 'https://picsum.photos/seed/frame1/1080/1080', mood_tags: ['waku'], is_premium: false },
];

export const EXPRESSIONS = [
  { id: 'smile', label: '笑顔', asset_id: 'exp_smile' },
  { id: 'surprised', label: '驚き', asset_id: 'exp_surprised' },
  { id: 'cool', label: 'クール', asset_id: 'exp_cool' },
  { id: 'angry', label: '怒り', asset_id: null },
  { id: 'sad', label: '悲しみ', asset_id: null },
];
