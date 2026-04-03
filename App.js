import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';

const LARGURA = Dimensions.get('window').width;

const COR = {
  verde: '#1a7a3c',
  verdeClaro: '#e8f5ee',
  branco: '#ffffff',
  cinzaClaro: '#f4f4f4',
  cinza: '#e0e0e0',
  cinzaTexto: '#888',
  preto: '#111',
  textoSecundario: '#555',
  amarelo: '#f5a623',
  vermelho: '#e03131',
  vermelhoClaro: '#ffeaea',
  azul: '#1971c2',
  azulClaro: '#e7f0fb',
  laranja: '#e67e22',
  laranjaClaro: '#fef3e2',
};

const NOMES_TIMES = ['Time 1', 'Time 2', 'Time 3'];
const CORES_TIMES = [COR.verde, COR.azul, COR.vermelho];

function sortearTimes(jogadores) {
  const ordenados = [...jogadores].sort((a, b) => b.nota - a.nota);
  const times = [[], [], []];
  const ordem = [0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2];
  ordenados.forEach((j, i) => {
    const t = ordem[i];
    times[t].push({ ...j, time: t, gols: 0, assistencias: 0 });
  });
  return times;
}

function calcularPontos(vitorias, empates) {
  return vitorias * 3 + empates * 1;
}

export default function App() {
  const [tela, setTela] = useState('cadastro');
  const [jogadores, setJogadores] = useState(
    Array.from({ length: 15 }, (_, i) => ({ nome: '', nota: 0, id: i }))
  );
  const [times, setTimes] = useState([[], [], []]);
  const [placar, setPlacar] = useState([
    { vitorias: 0, empates: 0, derrotas: 0 },
    { vitorias: 0, empates: 0, derrotas: 0 },
    { vitorias: 0, empates: 0, derrotas: 0 },
  ]);
  const [jogadoresAtivos, setJogadoresAtivos] = useState([]);
  const [penaltiTimes, setPenaltiTimes] = useState([]);
  const [penaltiResultado, setPenaltiResultado] = useState(null);
  const [jogadorSelecionado, setJogadorSelecionado] = useState(null);

  const animPodio = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  function atualizarNome(id, nome) {
    setJogadores(prev => prev.map(j => j.id === id ? { ...j, nome } : j));
  }

  function atualizarNota(id, nota) {
    setJogadores(prev => prev.map(j => j.id === id ? { ...j, nota } : j));
  }

  function formarTimes() {
    const validos = jogadores.filter(j => j.nome.trim().length > 0);
    if (validos.length < 15) {
      Alert.alert('Atenção', 'Preencha os 15 jogadores antes de sortear.');
      return;
    }
    setTimes(sortearTimes(validos));
    setTela('sorteio');
  }

  function irParaPelada() {
    setJogadoresAtivos(times.flat());
    setTela('pelada');
  }

  function trocarJogadores(jogadorA, jogadorB) {
    setTimes(prev => {
      const novo = prev.map(t => [...t]);
      const tA = jogadorA.time;
      const tB = jogadorB.time;
      const iA = novo[tA].findIndex(j => j.nome === jogadorA.nome);
      const iB = novo[tB].findIndex(j => j.nome === jogadorB.nome);
      const tempA = { ...novo[tA][iA], time: tB };
      const tempB = { ...novo[tB][iB], time: tA };
      novo[tA][iA] = tempB;
      novo[tB][iB] = tempA;
      return novo;
    });
    setJogadorSelecionado(null);
  }

  function selecionarJogador(jogador) {
    if (!jogadorSelecionado) {
      setJogadorSelecionado(jogador);
      return;
    }
    if (jogadorSelecionado.nome === jogador.nome) {
      setJogadorSelecionado(null);
      return;
    }
    if (jogadorSelecionado.time === jogador.time) {
      Alert.alert('Atenção', 'Selecione um jogador de outro time para trocar.');
      setJogadorSelecionado(null);
      return;
    }
    Alert.alert(
      'Confirmar troca',
      `Trocar ${jogadorSelecionado.nome} (${NOMES_TIMES[jogadorSelecionado.time]}) com ${jogador.nome} (${NOMES_TIMES[jogador.time]})?`,
      [
        { text: 'Cancelar', onPress: () => setJogadorSelecionado(null) },
        { text: 'Trocar', onPress: () => trocarJogadores(jogadorSelecionado, jogador) },
      ]
    );
  }

  function adicionarGol(nomeJogador) {
    setJogadoresAtivos(prev =>
      prev.map(j => j.nome === nomeJogador ? { ...j, gols: j.gols + 1 } : j)
    );
  }

  function removerGol(nomeJogador) {
    setJogadoresAtivos(prev =>
      prev.map(j => j.nome === nomeJogador && j.gols > 0 ? { ...j, gols: j.gols - 1 } : j)
    );
  }

  function adicionarAssistencia(nomeJogador) {
    setJogadoresAtivos(prev =>
      prev.map(j => j.nome === nomeJogador ? { ...j, assistencias: j.assistencias + 1 } : j)
    );
  }

  function removerAssistencia(nomeJogador) {
    setJogadoresAtivos(prev =>
      prev.map(j => j.nome === nomeJogador && j.assistencias > 0 ? { ...j, assistencias: j.assistencias - 1 } : j)
    );
  }

  function adicionarVitoria(ti) {
    setPlacar(prev => prev.map((p, i) => i === ti ? { ...p, vitorias: p.vitorias + 1 } : p));
  }

  function removerVitoria(ti) {
    setPlacar(prev => prev.map((p, i) => i === ti && p.vitorias > 0 ? { ...p, vitorias: p.vitorias - 1 } : p));
  }

  function adicionarEmpate(ti) {
    setPlacar(prev => prev.map((p, i) => i === ti ? { ...p, empates: p.empates + 1 } : p));
  }

  function removerEmpate(ti) {
    setPlacar(prev => prev.map((p, i) => i === ti && p.empates > 0 ? { ...p, empates: p.empates - 1 } : p));
  }

  function encerrarPelada() {
    Alert.alert(
      '📯 Encerrar pelada?',
      'Deseja realmente encerrar a pelada?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Encerrar',
          onPress: () => {
            const pontos = placar.map((p, i) => ({
              index: i,
              pontos: calcularPontos(p.vitorias, p.empates),
            }));
            const maxPts = Math.max(...pontos.map(p => p.pontos));
            const lideres = pontos.filter(p => p.pontos === maxPts);
            if (lideres.length > 1) {
              setPenaltiTimes(lideres.map(l => l.index));
              setPenaltiResultado(null);
              setTela('penalti');
            } else {
              animarPodio();
              setTela('podio');
            }
          },
        },
      ]
    );
  }

  function animarPodio() {
    animPodio.forEach(a => a.setValue(0));
    Animated.stagger(250, animPodio.map(a =>
      Animated.spring(a, { toValue: 1, useNativeDriver: true, tension: 60, friction: 7 })
    )).start();
  }

  function resolverPenalti() {
    const vencedor = penaltiTimes[Math.floor(Math.random() * penaltiTimes.length)];
    setPenaltiResultado(vencedor);
  }

  function getPodiumOrdem() {
    const pontos = placar.map((p, i) => ({
      index: i,
      pontos: calcularPontos(p.vitorias, p.empates),
      vitorias: p.vitorias,
      empates: p.empates,
      derrotas: p.derrotas,
    }));
    if (penaltiResultado !== null) {
      return [...pontos].sort((a, b) => {
        if (a.index === penaltiResultado) return -1;
        if (b.index === penaltiResultado) return 1;
        return b.pontos - a.pontos;
      });
    }
    return [...pontos].sort((a, b) => b.pontos - a.pontos);
  }

  function getArtilheiro() {
    const sorted = [...jogadoresAtivos].sort((a, b) =>
      b.gols !== a.gols ? b.gols - a.gols : b.assistencias - a.assistencias
    );
    const top = sorted[0];
    return sorted.filter(j => j.gols === top.gols && j.assistencias === top.assistencias);
  }

  function getGarcao() {
    const sorted = [...jogadoresAtivos].sort((a, b) =>
      b.assistencias !== a.assistencias ? b.assistencias - a.assistencias : b.gols - a.gols
    );
    const top = sorted[0];
    return sorted.filter(j => j.assistencias === top.assistencias && j.gols === top.gols);
  }

  function getRankingCompleto() {
    return [...jogadoresAtivos].sort((a, b) => {
      const ptA = a.gols * 2 + a.assistencias;
      const ptB = b.gols * 2 + b.assistencias;
      if (ptB !== ptA) return ptB - ptA;
      if (b.gols !== a.gols) return b.gols - a.gols;
      return b.assistencias - a.assistencias;
    });
  }

  function novaPelada() {
    setJogadores(Array.from({ length: 15 }, (_, i) => ({ nome: '', nota: 0, id: i })));
    setTimes([[], [], []]);
    setPlacar([
      { vitorias: 0, empates: 0, derrotas: 0 },
      { vitorias: 0, empates: 0, derrotas: 0 },
      { vitorias: 0, empates: 0, derrotas: 0 },
    ]);
    setJogadoresAtivos([]);
    setPenaltiResultado(null);
    setJogadorSelecionado(null);
    setTela('cadastro');
  }

  if (tela === 'cadastro') {
    return (
      <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.scrollContent}>
          <View style={s.header}>
            <Text style={s.headerEmoji}>⚽</Text>
            <Text style={s.headerTitulo}>Pelada FC</Text>
            <Text style={s.headerSub}>Cadastre os 15 jogadores</Text>
          </View>
          {jogadores.map((j, i) => (
            <View key={j.id} style={s.jogadorRow}>
              <Text style={s.jogadorNum}>{i + 1}</Text>
              <TextInput
                style={s.inputNome}
                placeholder={`Jogador ${i + 1}`}
                placeholderTextColor={COR.cinzaTexto}
                value={j.nome}
                onChangeText={v => atualizarNome(j.id, v)}
              />
              <View style={s.estrelasRow}>
                {[1, 2, 3, 4, 5].map(star => (
                  <TouchableOpacity key={star} onPress={() => atualizarNota(j.id, star)}>
                    <Text style={[s.estrela, j.nota >= star && s.estrelaMarcada]}>★</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
          <TouchableOpacity style={s.btnVerde} onPress={formarTimes}>
            <Text style={s.btnVerdeTexto}>Formar Times 🎲</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (tela === 'sorteio') {
    const todosTimes = times.flat();
    return (
      <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.scrollContent}>
          <View style={s.header}>
            <Text style={s.headerEmoji}>🎲</Text>
            <Text style={s.headerTitulo}>Times Sorteados</Text>
            {jogadorSelecionado && (
              <View style={s.bannerSelecao}>
                <Text style={s.bannerSelecaoTexto}>
                  Selecionado: {jogadorSelecionado.nome} ({NOMES_TIMES[jogadorSelecionado.time]})
                </Text>
                <Text style={s.bannerSelecaoSub}>Toque em outro jogador para trocar</Text>
              </View>
            )}
          </View>
          {times.map((time, ti) => (
            <View key={ti} style={[s.card, { borderLeftColor: CORES_TIMES[ti] }]}>
              <Text style={[s.cardTitulo, { color: CORES_TIMES[ti] }]}>{NOMES_TIMES[ti]}</Text>
              <Text style={s.cardNota}>
                Força: {time.reduce((acc, j) => acc + j.nota, 0).toFixed(1)} ⭐
              </Text>
              {time.map((j, ji) => {
                const selecionado = jogadorSelecionado?.nome === j.nome;
                const outroBloqueado = jogadorSelecionado && jogadorSelecionado.time === j.time && !selecionado;
                return (
                  <TouchableOpacity
                    key={ji}
                    style={[
                      s.jogadorCardRow,
                      selecionado && { backgroundColor: COR.amarelo + '33' },
                      outroBloqueado && { opacity: 0.4 },
                    ]}
                    onPress={() => selecionarJogador(j)}
                  >
                    <Text style={s.jogadorCardNome}>{j.nome}</Text>
                    <Text style={s.jogadorCardNota}>{'★'.repeat(j.nota)}</Text>
                    {selecionado && <Text style={s.tagSelecionado}>selecionado</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
          <TouchableOpacity style={s.btnCinza} onPress={() => { setJogadorSelecionado(null); setTela('cadastro'); }}>
            <Text style={s.btnCinzaTexto}>← Voltar ao Cadastro</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.btnVerde} onPress={irParaPelada}>
            <Text style={s.btnVerdeTexto}>Ir para Pelada ▶</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (tela === 'pelada') {
    return (
      <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.scrollContent}>
          <View style={s.header}>
            <Text style={s.headerEmoji}>🏟️</Text>
            <Text style={s.headerTitulo}>Pelada em Andamento</Text>
          </View>
          {times.map((time, ti) => {
            const p = placar[ti];
            const pts = calcularPontos(p.vitorias, p.empates);
            return (
              <View key={ti} style={[s.card, { borderLeftColor: CORES_TIMES[ti] }]}>
                <View style={s.timeCabecalho}>
                  <Text style={[s.cardTitulo, { color: CORES_TIMES[ti] }]}>{NOMES_TIMES[ti]}</Text>
                  <Text style={s.timePlacar}>{pts}Pts</Text>
                </View>

                <View style={s.placarRow}>
                  <View style={s.placarItem}>
                    <Text style={s.placarLabel}>V</Text>
                    <Text style={s.placarValor}>{p.vitorias}</Text>
                    <View style={s.placarBotoes}>
                      <TouchableOpacity style={s.btnContador} onPress={() => adicionarVitoria(ti)}>
                        <Text style={s.btnContadorTexto}>+</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[s.btnContador, s.btnContadorMenos]} onPress={() => removerVitoria(ti)}>
                        <Text style={[s.btnContadorTexto, { color: COR.vermelho }]}>−</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={s.placarDivisor} />
                  <View style={s.placarItem}>
                    <Text style={s.placarLabel}>E</Text>
                    <Text style={s.placarValor}>{p.empates}</Text>
                    <View style={s.placarBotoes}>
                      <TouchableOpacity style={s.btnContador} onPress={() => adicionarEmpate(ti)}>
                        <Text style={s.btnContadorTexto}>+</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[s.btnContador, s.btnContadorMenos]} onPress={() => removerEmpate(ti)}>
                        <Text style={[s.btnContadorTexto, { color: COR.vermelho }]}>−</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={s.separador} />

                {jogadoresAtivos.filter(j => j.time === ti).map((j, ji) => (
                  <View key={ji} style={s.jogadorPeladaRow}>
                    <Text style={s.jogadorPeladaNome}>{j.nome}</Text>
                    <View style={s.jogadorContadores}>
                      <View style={s.contadorGrupo}>
                        <Text style={s.contadorEmoji}>⚽</Text>
                        <Text style={s.contadorValor}>{j.gols}</Text>
                        <TouchableOpacity style={s.btnMini} onPress={() => adicionarGol(j.nome)}>
                          <Text style={s.btnMiniTexto}>+</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[s.btnMini, s.btnMiniMenos]} onPress={() => removerGol(j.nome)}>
                          <Text style={[s.btnMiniTexto, { color: COR.vermelho }]}>−</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={s.contadorGrupo}>
                        <Text style={s.contadorEmoji}>👟</Text>
                        <Text style={s.contadorValor}>{j.assistencias}</Text>
                        <TouchableOpacity style={[s.btnMini, s.btnMiniVerde]} onPress={() => adicionarAssistencia(j.nome)}>
                          <Text style={[s.btnMiniTexto, { color: COR.verde }]}>+</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[s.btnMini, s.btnMiniMenos]} onPress={() => removerAssistencia(j.nome)}>
                          <Text style={[s.btnMiniTexto, { color: COR.vermelho }]}>−</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            );
          })}
          <TouchableOpacity style={[s.btnVerde, { backgroundColor: COR.vermelho }]} onPress={encerrarPelada}>
            <Text style={s.btnVerdeTexto}>📯 Encerrar Pelada</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (tela === 'penalti') {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.centrado}>
          <Text style={{ fontSize: 72, marginBottom: 16 }}>🥅</Text>
          <Text style={s.penaltiTitulo}>Empate na liderança!</Text>
          <Text style={s.penaltiSub}>
            {penaltiTimes.map(i => NOMES_TIMES[i]).join(' x ')} estão empatados.{'\n'}Vamos para os pênaltis!
          </Text>
          {penaltiResultado === null ? (
            <TouchableOpacity style={s.btnVerde} onPress={resolverPenalti}>
              <Text style={s.btnVerdeTexto}>⚽ Cobrar Pênaltis</Text>
            </TouchableOpacity>
          ) : (
            <>
              <Text style={s.penaltiVencedor}>
                🏆 {NOMES_TIMES[penaltiResultado]} venceu nos pênaltis!
              </Text>
              <TouchableOpacity style={s.btnVerde} onPress={() => { animarPodio(); setTela('podio'); }}>
                <Text style={s.btnVerdeTexto}>Ver Pódio 🏆</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </SafeAreaView>
    );
  }

  if (tela === 'podio') {
    const ordem = getPodiumOrdem();
    const medalhas = ['🥇', '🥈', '🥉'];
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.centrado}>
          <Text style={s.podioTitulo}>🏆 Pódio Final</Text>
          {ordem.map((t, pos) => (
            <Animated.View
              key={t.index}
              style={[
                s.podioCard,
                { borderColor: CORES_TIMES[t.index] },
                {
                  opacity: animPodio[pos],
                  transform: [{
                    scale: animPodio[pos].interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }),
                  }],
                },
              ]}
            >
              <Text style={{ fontSize: 40 }}>{medalhas[pos]}</Text>
              <Text style={[s.podioNome, { color: CORES_TIMES[t.index] }]}>{NOMES_TIMES[t.index]}</Text>
              <Text style={s.podioInfo}>{t.vitorias}V | {t.empates}E | {t.derrotas}D | {t.pontos}Pts</Text>
            </Animated.View>
          ))}
          <TouchableOpacity style={s.btnVerde} onPress={() => setTela('destaques')}>
            <Text style={s.btnVerdeTexto}>Próximo ▶</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (tela === 'destaques') {
    const artilheiros = getArtilheiro();
    const garcoes = getGarcao();
    return (
      <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.scrollContent}>
          <View style={s.header}>
            <Text style={s.headerEmoji}>⭐</Text>
            <Text style={s.headerTitulo}>Destaques da Pelada</Text>
          </View>
          <View style={[s.card, { borderLeftColor: COR.amarelo }]}>
            <Text style={[s.cardTitulo, { color: COR.amarelo }]}>
              ⚽ {artilheiros.length > 1 ? 'Artilheiros' : 'Artilheiro'}
            </Text>
            {artilheiros.map((j, i) => (
              <Text key={i} style={s.destaqueNome}>
                {j.nome} — {j.gols} gols | {j.assistencias} assistências
              </Text>
            ))}
          </View>
          <View style={[s.card, { borderLeftColor: COR.verde }]}>
            <Text style={[s.cardTitulo, { color: COR.verde }]}>
              👟 {garcoes.length > 1 ? 'Garçons' : 'Garçom'}
            </Text>
            {garcoes.map((j, i) => (
              <Text key={i} style={s.destaqueNome}>
                {j.nome} — {j.assistencias} assistências | {j.gols} gols
              </Text>
            ))}
          </View>
          <TouchableOpacity style={s.btnVerde} onPress={() => setTela('ranking')}>
            <Text style={s.btnVerdeTexto}>Ver Ranking Completo 📊</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (tela === 'ranking') {
    const ranking = getRankingCompleto();
    return (
      <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.scrollContent}>
          <View style={s.header}>
            <Text style={s.headerEmoji}>📊</Text>
            <Text style={s.headerTitulo}>Ranking Geral</Text>
          </View>
          {ranking.map((j, i) => (
            <View key={i} style={[s.rankRow, i === 0 && s.rankRowTop]}>
              <Text style={s.rankPos}>{i + 1}º</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.rankNome}>{j.nome}</Text>
                <Text style={s.rankTime}>{NOMES_TIMES[j.time]}</Text>
              </View>
              <Text style={s.rankStats}>⚽ {j.gols}  👟 {j.assistencias}</Text>
            </View>
          ))}
          <TouchableOpacity style={[s.btnVerde, { backgroundColor: COR.cinzaTexto, marginTop: 16 }]} onPress={novaPelada}>
            <Text style={s.btnVerdeTexto}>🔄 Nova Pelada</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COR.branco },
  scrollContent: { padding: 16, paddingBottom: 40 },
  centrado: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },

  header: { alignItems: 'center', marginBottom: 20 },
  headerEmoji: { fontSize: 40 },
  headerTitulo: { fontSize: 22, fontWeight: '700', color: COR.preto, marginTop: 6 },
  headerSub: { fontSize: 13, color: COR.cinzaTexto, marginTop: 2 },

  bannerSelecao: {
    marginTop: 12, backgroundColor: COR.amarelo + '22',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: COR.amarelo, alignItems: 'center',
  },
  bannerSelecaoTexto: { fontSize: 13, fontWeight: '700', color: COR.preto },
  bannerSelecaoSub: { fontSize: 11, color: COR.textoSecundario, marginTop: 2 },
  tagSelecionado: {
    fontSize: 10, fontWeight: '700', color: COR.amarelo,
    backgroundColor: COR.amarelo + '22', borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 2, marginLeft: 6,
  },

  jogadorRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COR.cinzaClaro, borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 8, marginBottom: 8,
  },
  jogadorNum: { width: 24, fontSize: 13, color: COR.cinzaTexto, fontWeight: '600' },
  inputNome: { flex: 1, fontSize: 14, color: COR.preto, paddingVertical: 4 },
  estrelasRow: { flexDirection: 'row', gap: 2 },
  estrela: { fontSize: 18, color: COR.cinza },
  estrelaMarcada: { color: COR.amarelo },

  card: {
    backgroundColor: COR.branco, borderRadius: 12,
    borderWidth: 1, borderColor: COR.cinza,
    borderLeftWidth: 4, padding: 14, marginBottom: 14,
  },
  cardTitulo: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  cardNota: { fontSize: 12, color: COR.cinzaTexto, marginBottom: 8 },

  jogadorCardRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 8, borderTopWidth: 0.5, borderTopColor: COR.cinza,
    borderRadius: 6, paddingHorizontal: 4,
  },
  jogadorCardNome: { flex: 1, fontSize: 14, color: COR.preto },
  jogadorCardNota: { fontSize: 12, color: COR.amarelo },

  timeCabecalho: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
  },
  timePlacar: { fontSize: 15, fontWeight: '700', color: COR.preto },

  placarRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COR.cinzaClaro, borderRadius: 10,
    padding: 10, marginBottom: 10,
  },
  placarItem: { flex: 1, alignItems: 'center', gap: 4 },
  placarLabel: { fontSize: 11, fontWeight: '700', color: COR.cinzaTexto, letterSpacing: 1 },
  placarValor: { fontSize: 26, fontWeight: '800', color: COR.preto },
  placarBotoes: { flexDirection: 'row', gap: 6 },
  placarDivisor: { width: 1, height: 50, backgroundColor: COR.cinza },

  btnContador: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: COR.verdeClaro, borderWidth: 1, borderColor: COR.verde,
    alignItems: 'center', justifyContent: 'center',
  },
  btnContadorMenos: { backgroundColor: COR.vermelhoClaro, borderColor: COR.vermelho },
  btnContadorTexto: { fontSize: 18, fontWeight: '700', color: COR.verde },

  separador: { height: 0.5, backgroundColor: COR.cinza, marginVertical: 8 },

  jogadorPeladaRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 7, borderTopWidth: 0.5, borderTopColor: COR.cinza,
  },
  jogadorPeladaNome: { flex: 1, fontSize: 13, color: COR.preto },
  jogadorContadores: { flexDirection: 'row', gap: 10 },
  contadorGrupo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  contadorEmoji: { fontSize: 14 },
  contadorValor: { fontSize: 14, fontWeight: '700', color: COR.preto, minWidth: 16, textAlign: 'center' },

  btnMini: {
    width: 26, height: 26, borderRadius: 6,
    backgroundColor: '#fff3cd', borderWidth: 1, borderColor: COR.amarelo,
    alignItems: 'center', justifyContent: 'center',
  },
  btnMiniVerde: { backgroundColor: COR.verdeClaro, borderColor: COR.verde },
  btnMiniMenos: { backgroundColor: COR.vermelhoClaro, borderColor: COR.vermelho },
  btnMiniTexto: { fontSize: 14, fontWeight: '700', color: '#856404' },

  btnVerde: {
    backgroundColor: COR.verde, borderRadius: 14,
    paddingVertical: 14, alignItems: 'center', marginTop: 10,
  },
  btnVerdeTexto: { color: COR.branco, fontSize: 16, fontWeight: '700' },
  btnCinza: {
    backgroundColor: COR.cinzaClaro, borderRadius: 14,
    paddingVertical: 14, alignItems: 'center', marginTop: 10,
    borderWidth: 1, borderColor: COR.cinza,
  },
  btnCinzaTexto: { color: COR.textoSecundario, fontSize: 15, fontWeight: '600' },

  penaltiTitulo: { fontSize: 24, fontWeight: '700', color: COR.preto, textAlign: 'center' },
  penaltiSub: { fontSize: 15, color: COR.textoSecundario, textAlign: 'center', marginVertical: 16, lineHeight: 24 },
  penaltiVencedor: { fontSize: 20, fontWeight: '700', color: COR.verde, textAlign: 'center', marginVertical: 20 },

  podioTitulo: { fontSize: 26, fontWeight: '800', color: COR.preto, marginBottom: 24 },
  podioCard: {
    width: '100%', backgroundColor: COR.branco,
    borderRadius: 14, borderWidth: 2,
    padding: 16, marginBottom: 12, alignItems: 'center',
  },
  podioNome: { fontSize: 20, fontWeight: '700', marginTop: 6 },
  podioInfo: { fontSize: 13, color: COR.cinzaTexto, marginTop: 4 },

  destaqueNome: { fontSize: 15, color: COR.preto, paddingVertical: 5 },

  rankRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COR.cinzaClaro, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, marginBottom: 8,
  },
  rankRowTop: { backgroundColor: '#fffbea', borderWidth: 1, borderColor: COR.amarelo },
  rankPos: { fontSize: 16, fontWeight: '700', color: COR.cinzaTexto, width: 32 },
  rankNome: { fontSize: 14, fontWeight: '600', color: COR.preto },
  rankTime: { fontSize: 11, color: COR.cinzaTexto },
  rankStats: { fontSize: 13, color: COR.textoSecundario },
});