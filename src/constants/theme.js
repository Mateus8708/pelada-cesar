import { Dimensions } from 'react-native';

export const LARGURA = Dimensions.get('window').width;

export const COR = {
  // Fundo e superfícies (tema claro)
  fundo: '#f4f6f9',
  superficie: '#ffffff',
  superficieAlt: '#f0f3f7',
  borda: '#e2e7ee',
  bordaForte: '#d3dbe4',

  // Texto
  texto: '#13212f',
  textoSecundario: '#5b6b7d',
  textoTerciario: '#93a2b3',

  // Marca / times / status
  verde: '#15803d',
  verdeClaro: '#e6f6ec',
  branco: '#ffffff',
  cinzaClaro: '#f4f4f4',
  cinza: '#e0e0e0',
  cinzaTexto: '#7a8a9a',
  preto: '#13212f',
  amarelo: '#c8850c',
  amareloClaro: '#fdf2df',
  vermelho: '#dc2626',
  vermelhoClaro: '#fdecec',
  azul: '#1971c2',
  azulClaro: '#e7f0fb',
  laranja: '#e2670e',
  laranjaClaro: '#fef3e2',
};

export const NOMES_TIMES = ['Time 1', 'Time 2', 'Time 3'];
export const CORES_TIMES = [COR.verde, COR.azul, COR.vermelho];
