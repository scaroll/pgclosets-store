export interface RoomBackground {
  id: string;
  name: string;
  image: string;
  preview: string;
  category: 'living-room' | 'bedroom' | 'office' | 'kitchen' | 'bathroom' | 'hallway';
}

export interface DoorStyle {
  id: string;
  name: string;
  slug: string;
  image: string;
  category: string;
  price: number;
  features: string[];
  finishes: DoorFinish[];
  sizes: DoorSize[];
}

export interface DoorFinish {
  id: string;
  name: string;
  color: string;
  hex: string;
  texture: string;
  priceModifier: number;
  popular?: boolean;
}

export interface DoorSize {
  id: string;
  width: number;
  height: number;
  displayName: string;
  priceModifier: number;
  popular?: boolean;
}

export interface VisualizerConfig {
  roomBackground: RoomBackground;
  doorStyle: DoorStyle;
  doorFinish: DoorFinish;
  doorSize: DoorSize;
  showBefore: boolean;
  doorPosition: {
    x: number;
    y: number;
    scale: number;
    rotation: number;
  };
}

export interface SavedDesign {
  id: string;
  name: string;
  config: VisualizerConfig;
  thumbnail: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  tags: string[];
}

export interface VisualizerShare {
  platform: 'email' | 'facebook' | 'twitter' | 'pinterest' | 'whatsapp' | 'link';
  url: string;
  title: string;
  description: string;
  image: string;
}

export interface PopularCombination {
  id: string;
  name: string;
  description: string;
  config: VisualizerConfig;
  thumbnail: string;
  popularity: number;
  category: string;
}