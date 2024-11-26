import { Layer } from './types';

export const LAYERS: Layer[] = [
  {
    id: 1,
    name: 'Background',
    traits: [
      { id: 101, name: 'Byzantium Purple', image: '/assets/layers/Background/Byzantium_Purple.png' },
      { id: 102, name: 'Cream', image: '/assets/layers/Background/Cream.png' },
      { id: 103, name: 'Ruddy Blue', image: '/assets/layers/Background/Ruddy_Blue.png' }
    ]
  },
  {
    id: 2,
    name: 'Skin',
    traits: [
      { id: 201, name: 'Tree', image: '/assets/layers/Skin/Tree.png' },
      { id: 202, name: 'Cybersuit', image: '/assets/layers/Skin/Cybersuit.png' },
      { id: 203, name: 'Dreamland', image: '/assets/layers/Skin/Dreamland.png' }
    ]
  },
  {
    id: 3,
    name: 'Eyes',
    traits: [
      { id: 301, name: 'Gaze', image: '/assets/layers/Eyes/Gaze.png' },
      { id: 302, name: 'Nano', image: '/assets/layers/Eyes/Nano.png' },
      { id: 303, name: 'Bloodshot', image: '/assets/layers/Eyes/Bloodshot.png' }
    ]
  },
  {
    id: 4,
    name: 'Mouth',
    traits: [
      { id: 401, name: 'Red', image: '/assets/layers/Mouth/Red.png' },
      { id: 402, name: 'Bone', image: '/assets/layers/Mouth/Bone.png' },
      { id: 403, name: 'Gold Cheese', image: '/assets/layers/Mouth/Gold_Cheese.png' }
    ]
  },
  {
    id: 5,
    name: 'Outfit',
    traits: [
      { id: 501, name: 'Birfday', image: '/assets/layers/Outfit/Birfday.png' },
      { id: 502, name: 'Colonial', image: '/assets/layers/Outfit/Colonial.png' },
      { id: 503, name: 'Bear Suit', image: '/assets/layers/Outfit/Bear_Suit.png' },
    ]
  },
  {
    id: 6,
    name: 'Hat',
    traits: [
      { id: 601, name: 'Crown', image: '/assets/layers/Hat/Crown.png' },
      { id: 602, name: 'Troll', image: '/assets/layers/Hat/Troll.png' },
      { id: 603, name: 'Forest Ancients', image: '/assets/layers/Hat/Forest_Ancients.png' }
    ]
  }
];