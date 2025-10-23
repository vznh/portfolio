export interface MediaItem {
  src: string;
  duration?: number;
  kind?: 'image' | 'gif';
}

export interface SubstackItem {
  title: string;
  subtitle: string | null | undefined;
  posted: string | null | undefined;
  content: string | null | undefined; // html
}
