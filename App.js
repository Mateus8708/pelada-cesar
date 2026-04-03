import { useContext } from 'react';
import { PeladaProvider, PeladaContext } from './src/context/PeladaContext';
import CadastroScreen from './src/screens/CadastroScreen';
import SorteioScreen from './src/screens/SorteioScreen';
import PeladaScreen from './src/screens/PeladaScreen';
import PenaltiScreen from './src/screens/PenaltiScreen';
import PodioScreen from './src/screens/PodioScreen';
import DestaquesScreen from './src/screens/DestaquesScreen';
import RankingScreen from './src/screens/RankingScreen';

function MainRouter() {
  const { tela } = useContext(PeladaContext);

  if (tela === 'cadastro') return <CadastroScreen />;
  if (tela === 'sorteio') return <SorteioScreen />;
  if (tela === 'pelada') return <PeladaScreen />;
  if (tela === 'penalti') return <PenaltiScreen />;
  if (tela === 'podio') return <PodioScreen />;
  if (tela === 'destaques') return <DestaquesScreen />;
  if (tela === 'ranking') return <RankingScreen />;

  return null;
}

export default function App() {
  return (
    <PeladaProvider>
      <MainRouter />
    </PeladaProvider>
  );
}