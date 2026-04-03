import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { PeladaContext } from '../context/PeladaContext';
import { s } from '../styles/globalStyles';
import { COR, NOMES_TIMES, CORES_TIMES } from '../constants/theme';

export default function SorteioScreen() {
    const {
        times,
        jogadorSelecionado,
        selecionarJogador,
        setJogadorSelecionado,
        setTela,
        irParaPelada
    } = useContext(PeladaContext);

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
