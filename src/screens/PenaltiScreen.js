import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    View, Text, TouchableOpacity, SafeAreaView,
    StyleSheet, StatusBar, Animated, Modal, ScrollView,
} from 'react-native';
import { PeladaContext } from '../context/PeladaContext';
import { NOMES_TIMES, CORES_TIMES, COR } from '../constants/theme';

export default function PenaltiScreen() {
    const { penaltiTimes, penaltiResultado, setPenaltiResultado, setTela, times } = useContext(PeladaContext);
    const [modalVisible, setModalVisible] = useState(false);
    // gols[idx] = Set de nomes que converteram
    const [gols, setGols] = useState(() => penaltiTimes.map(() => new Set()));
    const [rodada, setRodada] = useState(1);
    const [empateRodada, setEmpateRodada] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(40)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const [resultado, setResultado] = useState(penaltiResultado); // índice do time vencedor

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 60, friction: 8 }),
        ]).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    function toggleGol(timeIdx, nomeJogador) {
        setGols(prev => {
            const next = prev.map(s => new Set(s));
            if (next[timeIdx].has(nomeJogador)) {
                next[timeIdx].delete(nomeJogador);
            } else {
                next[timeIdx].add(nomeJogador);
            }
            return next;
        });
    }

    function confirmarResultado() {
        const contagens = gols.map(s => s.size);
        const maxGols = Math.max(...contagens);
        const vencedores = contagens
            .map((g, i) => ({ g, i }))
            .filter(({ g }) => g === maxGols);

        if (vencedores.length > 1) {
            // Empate → nova rodada
            setEmpateRodada(true);
            return;
        }

        const timeVencedor = penaltiTimes[vencedores[0].i];
        setResultado(timeVencedor);
        setPenaltiResultado(timeVencedor);
        setModalVisible(false);
    }

    function novaRodada() {
        setGols(penaltiTimes.map(() => new Set()));
        setRodada(r => r + 1);
        setEmpateRodada(false);
    }

    const contagens = gols.map(s => s.size);
    const algumGol = gols.some(s => s.size > 0);

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor="#080e18" />

            <Animated.View style={[
                styles.centrado,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}>
                {/* Badge de desempate */}
                <View style={styles.desempateBadge}>
                    <Text style={styles.desempateBadgeText}>DESEMPATE</Text>
                </View>

                <Animated.Text style={[styles.mainEmoji, { transform: [{ scale: pulseAnim }] }]}>
                    🥅
                </Animated.Text>

                <Text style={styles.titulo}>Empate na liderança!</Text>
                <Text style={styles.sub}>
                    {penaltiTimes.map(i => NOMES_TIMES[i]).join(' x ')} estão empatados{'\n'}Vamos para os pênaltis!
                </Text>

                {/* Times que disputam */}
                <View style={styles.teamsRow}>
                    {penaltiTimes.map((ti, idx) => (
                        <React.Fragment key={ti}>
                            {idx > 0 && <Text style={styles.vsText}>×</Text>}
                            <View style={[styles.teamChip, { borderColor: CORES_TIMES[ti] + '60' }]}>
                                <Text style={[styles.teamChipText, { color: CORES_TIMES[ti] }]}>
                                    {NOMES_TIMES[ti]}
                                </Text>
                            </View>
                        </React.Fragment>
                    ))}
                </View>

                {resultado === null || resultado === undefined ? (
                    <TouchableOpacity
                        style={styles.btnPenalti}
                        onPress={() => setModalVisible(true)}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.btnPenaltiText}>⚽  Cobrar Pênaltis</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.resultContainer}>
                        <View style={styles.trofeuCircle}>
                            <Text style={styles.trofeuEmoji}>🏆</Text>
                        </View>
                        <Text style={styles.vencedorLabel}>VENCEDOR NOS PÊNALTIS</Text>
                        <Text style={[styles.vencedorNome, { color: CORES_TIMES[resultado] }]}>
                            {NOMES_TIMES[resultado]}
                        </Text>
                        <TouchableOpacity style={styles.btnPodio} onPress={() => setTela('podio')} activeOpacity={0.85}>
                            <Text style={styles.btnPodioText}>Ver Pódio  🏆</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </Animated.View>

            {/* Modal de cobrança */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalSheet}>

                        {/* Handle */}
                        <View style={styles.modalHandle} />

                        {/* Header modal */}
                        <View style={styles.modalHeader}>
                            <View style={styles.modalTituloRow}>
                                <Text style={styles.modalTitulo}>Cobrança de Pênaltis</Text>
                                {rodada > 1 && (
                                    <View style={styles.rodadaBadge}>
                                        <Text style={styles.rodadaBadgeText}>Rodada {rodada}</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={styles.modalSub}>Toque nos jogadores que converteram</Text>
                        </View>

                        {/* Banner de empate */}
                        {empateRodada && (
                            <View style={styles.empateBanner}>
                                <Text style={styles.empateBannerEmoji}>🤝</Text>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.empateBannerTitulo}>Empate na rodada!</Text>
                                    <Text style={styles.empateBannerSub}>Os times ficaram iguais. Nova rodada?</Text>
                                </View>
                                <TouchableOpacity style={styles.btnNovaRodada} onPress={novaRodada} activeOpacity={0.8}>
                                    <Text style={styles.btnNovaRodadaText}>Nova rodada</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Placar */}
                        <View style={styles.placarRow}>
                            {penaltiTimes.map((ti, idx) => (
                                <React.Fragment key={ti}>
                                    {idx > 0 && (
                                        <Text style={styles.placarSep}>×</Text>
                                    )}
                                    <View style={styles.placarCol}>
                                        <Text style={[styles.placarNome, { color: CORES_TIMES[ti] }]}>
                                            {NOMES_TIMES[ti]}
                                        </Text>
                                        <Text style={[styles.placarGols, { color: CORES_TIMES[ti] }]}>
                                            {contagens[idx]}
                                        </Text>
                                    </View>
                                </React.Fragment>
                            ))}
                        </View>

                        {/* Colunas de jogadores */}
                        <ScrollView
                            style={styles.modalScroll}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.modalScrollContent}
                        >
                            <View style={styles.colunasRow}>
                                {penaltiTimes.map((ti, idx) => {
                                    const jogadoresTi = times[ti] || [];
                                    return (
                                        <View key={ti} style={styles.coluna}>
                                            <View style={[styles.colunaHeader, { borderColor: CORES_TIMES[ti] + '40' }]}>
                                                <Text style={[styles.colunaHeaderText, { color: CORES_TIMES[ti] }]}>
                                                    {NOMES_TIMES[ti]}
                                                </Text>
                                            </View>
                                            {jogadoresTi.map(j => {
                                                const converteu = gols[idx].has(j.nome);
                                                return (
                                                    <TouchableOpacity
                                                        key={j.nome}
                                                        style={[
                                                            styles.jogadorBtn,
                                                            converteu && styles.jogadorBtnGol,
                                                            converteu && { borderColor: CORES_TIMES[ti] + '80' },
                                                        ]}
                                                        onPress={() => toggleGol(idx, j.nome)}
                                                        activeOpacity={0.75}
                                                    >
                                                        <Text style={[
                                                            styles.jogadorNome,
                                                            converteu && styles.jogadorNomeGol,
                                                        ]} numberOfLines={1}>
                                                            {j.nome}
                                                        </Text>
                                                        <Text style={styles.jogadorIcon}>
                                                            {converteu ? '⚽' : '·'}
                                                        </Text>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                    );
                                })}
                            </View>
                        </ScrollView>

                        {/* Botões de ação */}
                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.btnCancelar}
                                onPress={() => setModalVisible(false)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.btnCancelarText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.btnConfirmar, !algumGol && styles.btnConfirmarDisabled]}
                                onPress={confirmarResultado}
                                activeOpacity={0.85}
                                disabled={!algumGol}
                            >
                                <Text style={styles.btnConfirmarText}>
                                    {algumGol ? 'Confirmar Resultado' : 'Marque os gols'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#080e18' },
    centrado: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },

    desempateBadge: {
        backgroundColor: '#2a1010',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 5,
        marginBottom: 28,
        borderWidth: 1,
        borderColor: COR.vermelho + '60',
    },
    desempateBadgeText: {
        fontSize: 11, fontWeight: '800', letterSpacing: 3, color: COR.vermelho,
    },

    mainEmoji: { fontSize: 80, marginBottom: 20 },

    titulo: {
        fontSize: 26, fontWeight: '900', color: '#fff',
        textAlign: 'center', letterSpacing: -0.3, marginBottom: 10,
    },
    sub: {
        fontSize: 15, color: '#8899aa', textAlign: 'center',
        lineHeight: 24, marginBottom: 28,
    },

    teamsRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 36 },
    teamChip: {
        backgroundColor: '#1a2235', borderRadius: 12,
        paddingHorizontal: 20, paddingVertical: 10,
        borderWidth: 1,
    },
    teamChipText: { fontSize: 15, fontWeight: '800' },
    vsText: { fontSize: 20, fontWeight: '900', color: '#8899aa' },

    btnPenalti: {
        backgroundColor: COR.verde, borderRadius: 16,
        paddingVertical: 18, alignItems: 'center', width: '100%',
        shadowColor: COR.verde, shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
    },
    btnPenaltiText: { color: '#fff', fontSize: 17, fontWeight: '900', letterSpacing: 0.3 },

    resultContainer: { alignItems: 'center', width: '100%' },
    trofeuCircle: {
        width: 88, height: 88, borderRadius: 44,
        backgroundColor: '#f5c84215', alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: '#f5c84250', marginBottom: 18,
    },
    trofeuEmoji: { fontSize: 44 },
    vencedorLabel: {
        fontSize: 11, fontWeight: '800', color: '#f5c84280',
        letterSpacing: 2, marginBottom: 10,
    },
    vencedorNome: {
        fontSize: 30, fontWeight: '900',
        textTransform: 'uppercase', letterSpacing: 1.5,
        marginBottom: 32, textAlign: 'center',
    },
    btnPodio: {
        backgroundColor: COR.verde, borderRadius: 16,
        paddingVertical: 18, alignItems: 'center', width: '100%',
        shadowColor: COR.verde, shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
    },
    btnPodioText: { color: '#fff', fontSize: 17, fontWeight: '900', letterSpacing: 0.3 },

    /* ── Modal ── */
    modalOverlay: {
        flex: 1, backgroundColor: '#00000088',
        justifyContent: 'flex-end',
    },
    modalSheet: {
        backgroundColor: '#0c1420',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        paddingBottom: 32, maxHeight: '90%',
        borderTopWidth: 1, borderColor: '#1a2a3a',
    },
    modalHandle: {
        width: 40, height: 4, backgroundColor: '#2a3a4a',
        borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 20,
    },
    modalHeader: { paddingHorizontal: 24, marginBottom: 20 },
    modalTitulo: { fontSize: 20, fontWeight: '900', color: '#fff', marginBottom: 4 },
    modalSub: { fontSize: 13, color: '#5a7a9a' },

    /* Placar */
    placarRow: {
        flexDirection: 'row', justifyContent: 'center',
        alignItems: 'center', gap: 20, marginBottom: 20,
        paddingHorizontal: 24,
    },
    placarCol: { alignItems: 'center' },
    placarNome: { fontSize: 12, fontWeight: '700', marginBottom: 4 },
    placarGols: { fontSize: 44, fontWeight: '900', lineHeight: 48 },
    placarSep: { fontSize: 22, color: '#3a4a5a', fontWeight: '900' },

    /* Colunas */
    modalScroll: { maxHeight: 340 },
    modalScrollContent: { paddingHorizontal: 16 },
    colunasRow: { flexDirection: 'row', gap: 10 },
    coluna: { flex: 1 },
    colunaHeader: {
        borderBottomWidth: 1, paddingBottom: 8, marginBottom: 10, alignItems: 'center',
    },
    colunaHeaderText: { fontSize: 12, fontWeight: '800', letterSpacing: 1 },

    /* Jogador */
    jogadorBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#101c2c', borderRadius: 10, borderWidth: 1,
        borderColor: '#1a2a3a', paddingVertical: 10, paddingHorizontal: 10,
        marginBottom: 6,
    },
    jogadorBtnGol: {
        backgroundColor: '#0a1f0a',
    },
    jogadorNome: {
        fontSize: 13, fontWeight: '600', color: '#7a9ab8', flex: 1,
    },
    jogadorNomeGol: {
        color: '#c8e8b8', fontWeight: '700',
    },
    jogadorIcon: { fontSize: 14, marginLeft: 4 },

    /* Footer */
    modalFooter: {
        flexDirection: 'row', gap: 10,
        paddingHorizontal: 16, paddingTop: 16,
    },
    btnCancelar: {
        flex: 1, backgroundColor: '#141e2e', borderRadius: 14,
        paddingVertical: 16, alignItems: 'center',
        borderWidth: 1, borderColor: '#1a2a3a',
    },
    btnCancelarText: { color: '#5a7a9a', fontSize: 15, fontWeight: '700' },
    btnConfirmar: {
        flex: 2, backgroundColor: COR.verde, borderRadius: 14,
        paddingVertical: 16, alignItems: 'center',
        shadowColor: COR.verde, shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35, shadowRadius: 8, elevation: 6,
    },
    btnConfirmarDisabled: {
        backgroundColor: '#141e2e', shadowOpacity: 0, elevation: 0,
    },
    btnConfirmarText: { color: '#fff', fontSize: 15, fontWeight: '800' },

    /* Rodada badge */
    modalTituloRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
    rodadaBadge: {
        backgroundColor: COR.amarelo + '25', borderRadius: 8,
        paddingHorizontal: 8, paddingVertical: 3,
        borderWidth: 1, borderColor: COR.amarelo + '50',
    },
    rodadaBadgeText: { fontSize: 11, fontWeight: '800', color: COR.amarelo },

    /* Banner empate */
    empateBanner: {
        flexDirection: 'row', alignItems: 'center', gap: 12,
        backgroundColor: '#1a1a0a', borderRadius: 14,
        marginHorizontal: 16, marginBottom: 16,
        padding: 14, borderWidth: 1, borderColor: COR.amarelo + '40',
    },
    empateBannerEmoji: { fontSize: 28 },
    empateBannerTitulo: { fontSize: 13, fontWeight: '800', color: COR.amarelo, marginBottom: 2 },
    empateBannerSub: { fontSize: 12, color: '#7a7a4a' },
    btnNovaRodada: {
        backgroundColor: COR.amarelo, borderRadius: 10,
        paddingHorizontal: 12, paddingVertical: 8,
    },
    btnNovaRodadaText: { fontSize: 12, fontWeight: '800', color: '#000' },
});
