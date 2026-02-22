
import { Scene } from './types';

const PANORAMA_1 = 'https://res.cloudinary.com/df0t4iky4/image/upload/v1768998146/Aerea1_fspi8a.jpg';
const PANORAMA_2 = 'https://res.cloudinary.com/df0t4iky4/image/upload/v1768998955/Aerea2_drnpox.jpg';
const PANORAMA_3 = 'https://res.cloudinary.com/df0t4iky4/image/upload/v1769001121/Aerea3_ds7d5c.jpg';

export const INITIAL_SCENES: Scene[] = [
  {
    id: 'aerial-view',
    name: 'Parauapebas',
    panoramaUrl: PANORAMA_1,
    hotspots: [
      {
        id: 'h-to-complex',
        position: [-50, -30, 150],
        title: 'COMPLEXO TURÍSTICO',
        description: 'Clique para voar até o complexo turístico central.',
        targetSceneId: 'tourist-complex'
      }
    ]
  },
  {
    id: 'tourist-complex',
    name: 'Complexo Turístico',
    panoramaUrl: PANORAMA_2,
    hotspots: [
      {
        id: 'h-back-home',
        position: [0, -20, 200],
        title: 'VOLTAR',
        description: 'Retornar ao ponto de observação inicial.',
        targetSceneId: 'aerial-view'
      },
      {
        id: 'h-entrar-from-complex',
        position: [-160, 15, -80],
        title: 'ENTRAR',
        description: 'Acessar a experiência imersiva no coração da vila.',
        targetSceneId: 'village-inner'
      }
    ]
  },
  {
    id: 'village-inner',
    name: 'Interior',
    panoramaUrl: PANORAMA_3,
    hotspots: [
      {
        id: 'h-exit',
        position: [0, -10, 200],
        title: 'SAIR',
        description: 'Retornar para a vista aérea.',
        targetSceneId: 'aerial-view'
      }
    ]
  }
];
