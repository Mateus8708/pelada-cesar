import { useContext, useEffect, useRef, useState } from 'react';
import {
    View, Text, TouchableOpacity, ScrollView,
    SafeAreaView, StyleSheet, StatusBar, Animated, Vibration,
} from 'react-native';
import { PeladaContext } from '../context/PeladaContext';
import { COR, NOMES_TIMES, CORES_TIMES } from '../constants/theme';
import { calcularPontos } from '../utils/helpers';

const STAT_ICONS = { vitorias: '🏆', empates: '🤝', penaltis: '🎯' };

function StatBox({ label, icon, value, onAdd, onRemove, accentColor }) {
    return (
        <View style={[styles.statBox, { borderTopColor: accentColor }]}>
            <Text style={styles.statBoxIcon}>{icon}</Text>
            <Text style={styles.statBoxLabel}>{label}</Text>
            <Text style={[styles.statBoxValue, { color: accentColor }]}>{value}</Text>
            <View style={styles.statBoxBtns}>
                <TouchableOpacity style={styles.statBtnMinus} onPress={onRemove} activeOpacity={0.7}>
                    <Text style={styles.statBtnMinusText}>−</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.statBtnPlus, { backgroundColor: accentColor }]} onPress={onAdd} activeOpacity={0.7}>
                    <Text style={styles.statBtnPlusText}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function PlayerRow({ jogador, onAddGol, onRemoveGol, onAddAssist, onRemoveAssist, accentColor }) {
    return (
        <View style={styles.playerRow}>
            <View style={styles.playerTopRow}>
                <View style={[styles.playerAvatar, { backgroundColor: accentColor + '25' }]}>
                    <Text style={[styles.playerAvatarText, { color: accentColor }]}>
                        {jogador.nome.charAt(0).toUpperCase()}
                    </Text>
                </View>
                <Text style={styles.playerName}>{jogador.nome}</Text>
            </View>
            <View style={styles.playerBottomRow}>
                {/* Gols */}
                <View style={styles.playerStatPill}>
                    <Text style={styles.playerStatEmoji}>⚽</Text>
                    <Text style={styles.playerStatVal}>{jogador.gols}</Text>
                    <TouchableOpacity style={styles.miniBtnMinus} onPress={onRemoveGol} activeOpacity={0.7}>
                        <Text style={styles.miniBtnMinusText}>−</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.miniBtnPlus, { backgroundColor: accentColor }]} onPress={onAddGol} activeOpacity={0.7}>
                        <Text style={styles.miniBtnPlusText}>+</Text>
                    </TouchableOpacity>
                </View>
                {/* Assistências */}
                <View style={styles.playerStatPill}>
                    <Text style={styles.playerStatEmoji}>👟</Text>
                    <Text style={styles.playerStatVal}>{jogador.assistencias}</Text>
                    <TouchableOpacity style={styles.miniBtnMinus} onPress={onRemoveAssist} activeOpacity={0.7}>
                        <Text style={styles.miniBtnMinusText}>−</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.miniBtnPlus, { backgroundColor: accentColor }]} onPress={onAddAssist} activeOpacity={0.7}>
                        <Text style={styles.miniBtnPlusText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default function PeladaScreen() {
    const {
        times, placar, jogadoresAtivos,
        adicionarVitoria, removerVitoria,
        adicionarEmpate, removerEmpate,
        adicionarShootout, removerShootout,
        adicionarGol, removerGol,
        adicionarAssistencia, removerAssistencia,
        encerrarPelada,
    } = useContext(PeladaContext);

    const livePulse = useRef(new Animated.Value(0.5)).current;

    // ── Cronômetro ──
    const DURACAO = 8 * 60; // 8 minutos em segundos
    const [segundos, setSegundos] = useState(DURACAO);
    const [rodando, setRodando] = useState(false);
    const intervalRef = useRef(null);
    const timerFlash = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (rodando) {
            intervalRef.current = setInterval(() => {
                setSegundos(prev => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current);
                        setRodando(false);
                        Vibration.vibrate([0, 500, 200, 500, 200, 500]);
                        Animated.loop(
                            Animated.sequence([
                                Animated.timing(timerFlash, { toValue: 0.2, duration: 400, useNativeDriver: true }),
                                Animated.timing(timerFlash, { toValue: 1, duration: 400, useNativeDriver: true }),
                            ]),
                            { iterations: 6 }
                        ).start();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [rodando]);

    function resetarTimer() {
        clearInterval(intervalRef.current);
        setRodando(false);
        setSegundos(DURACAO);
    }

    const minutos = Math.floor(segundos / 60);
    const secs = segundos % 60;
    const display = `${String(minutos).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    const pctRestante = segundos / DURACAO;
    const timerCor = pctRestante > 0.5 ? COR.verde : pctRestante > 0.25 ? COR.amarelo : COR.vermelho;
    const acabou = segundos === 0;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(livePulse, { toValue: 1, duration: 700, useNativeDriver: true }),
                Animated.timing(livePulse, { toValue: 0.5, duration: 700, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor="#111820" />
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* ─── Cabeçalho ─── */}
                <View style={styles.header}>
                    <Animated.View style={[styles.liveBadgeWrap, { opacity: livePulse }]}>
                        <Text style={styles.headerBadge}>⬤  AO VIVO</Text>
                    </Animated.View>
                    <Text style={styles.headerTitle}>🏟  Pelada em Andamento</Text>
                    <Text style={styles.headerSub}>Toque nos botões para registrar os eventos</Text>
                </View>

                {/* ─── Cronômetro ─── */}
                <Animated.View style={[styles.timerCard, { opacity: timerFlash, borderColor: timerCor + '50' }]}>
                    {/* Barra de progresso */}
                    <View style={styles.timerProgressBg}>
                        <View style={[styles.timerProgressFill, {
                            width: `${pctRestante * 100}%`,
                            backgroundColor: timerCor,
                        }]} />
                    </View>

                    <View style={styles.timerBody}>
                        {/* Display */}
                        <View style={styles.timerDisplayArea}>
                            {acabou
                                ? <Text style={[styles.timerAcabou]}>TEMPO!</Text>
                                : <Text style={[styles.timerDisplay, { color: timerCor }]}>{display}</Text>
                            }
                            <Text style={styles.timerLabel}>
                                {acabou ? 'A partida encerrou' : rodando ? 'em andamento' : segundos === DURACAO ? '8 min por partida' : 'pausado'}
                            </Text>
                        </View>

                        {/* Botões */}
                        <View style={styles.timerBtns}>
                            <TouchableOpacity
                                style={[styles.timerBtnPlay, {
                                    backgroundColor: acabou ? '#1a2235' : timerCor,
                                    shadowColor: timerCor,
                                }]}
                                onPress={() => { if (!acabou) setRodando(r => !r); }}
                                activeOpacity={0.8}
                                disabled={acabou}
                            >
                                <Text style={styles.timerBtnPlayText}>
                                    {rodando ? '⏸' : '▶'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.timerBtnReset} onPress={resetarTimer} activeOpacity={0.8}>
                                <Text style={styles.timerBtnResetText}>↺</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>

                {/* ─── Mini Scoreboard ─── */}
                <View style={styles.scoreStrip}>
                    {times.map((_, ti) => {
                        const p = placar[ti];
                        const pts = calcularPontos(p.vitorias, p.empates, p.shootouts);
                        const cor = CORES_TIMES[ti];
                        return (
                            <View key={ti} style={[styles.scoreChip, { borderColor: cor + '50' }]}>
                                <View style={[styles.scoreChipDot, { backgroundColor: cor }]} />
                                <Text style={[styles.scoreChipName, { color: cor }]}>
                                    {NOMES_TIMES[ti].replace('Time ', 'T')}
                                </Text>
                                <Text style={[styles.scoreChipPts, { color: cor }]}>{pts}</Text>
                                <Text style={styles.scoreChipPtsLabel}>pts</Text>
                            </View>
                        );
                    })}
                </View>

                {/* ─── Cards de Time ─── */}
                {times.map((_, ti) => {
                    const p = placar[ti];
                    const pts = calcularPontos(p.vitorias, p.empates, p.shootouts);
                    const cor = CORES_TIMES[ti];
                    const jogadores = jogadoresAtivos.filter(j => j.time === ti);

                    return (
                        <View key={ti} style={styles.card}>
                            {/* Topo colorido */}
                            <View style={[styles.cardTop, { backgroundColor: cor }]}>
                                <View>
                                    <Text style={styles.cardTeamName}>{NOMES_TIMES[ti]}</Text>
                                    <Text style={styles.cardTopSub}>{jogadores.length} jogadores</Text>
                                </View>
                                <View style={styles.cardPtsBadge}>
                                    <Text style={styles.cardPtsNum}>{pts}</Text>
                                    <Text style={styles.cardPtsLabel}>pts</Text>
                                </View>
                            </View>

                            {/* Grid de Stats */}
                            <View style={styles.statsGrid}>
                                <StatBox
                                    label="Vitórias" icon={STAT_ICONS.vitorias}
                                    value={p.vitorias} accentColor={cor}
                                    onAdd={() => adicionarVitoria(ti)}
                                    onRemove={() => removerVitoria(ti)}
                                />
                                <View style={styles.statsGridDivider} />
                                <StatBox
                                    label="Empates" icon={STAT_ICONS.empates}
                                    value={p.empates} accentColor={cor}
                                    onAdd={() => adicionarEmpate(ti)}
                                    onRemove={() => removerEmpate(ti)}
                                />
                                <View style={styles.statsGridDivider} />
                                <StatBox
                                    label="Pênalti" icon={STAT_ICONS.penaltis}
                                    value={p.penaltis || 0} accentColor={cor}
                                    onAdd={() => adicionarPenalti(ti)}
                                    onRemove={() => removerPenalti(ti)}
                                />
                            </View>

                            {/* Jogadores */}
                            <View style={styles.playersSection}>
                                <Text style={styles.playersSectionTitle}>Jogadores</Text>
                                {jogadores.map((j, ji) => (
                                    <PlayerRow
                                        key={ji}
                                        jogador={j}
                                        accentColor={cor}
                                        onAddGol={() => adicionarGol(j.nome)}
                                        onRemoveGol={() => removerGol(j.nome)}
                                        onAddAssist={() => adicionarAssistencia(j.nome)}
                                        onRemoveAssist={() => removerAssistencia(j.nome)}
                                    />
                                ))}
                            </View>
                        </View>
                    );
                })}

                {/* ─── Botão Encerrar ─── */}
                <TouchableOpacity style={styles.btnEncerrar} onPress={encerrarPelada} activeOpacity={0.85}>
                    <Text style={styles.btnEncerrarText}>📯  Encerrar Pelada</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

/* ─────────────── STYLES ─────────────── */
const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#111820' },
    scroll: { padding: 16, paddingBottom: 48 },

    /* Header */
    header: { alignItems: 'center', paddingVertical: 20 },
    liveBadgeWrap: { marginBottom: 10 },
    headerBadge: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 3,
        color: COR.vermelho,
        backgroundColor: '#2a1010',
        paddingHorizontal: 14,
        paddingVertical: 5,
        borderRadius: 20,
        overflow: 'hidden',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: -0.5,
        textAlign: 'center',
    },
    headerSub: {
        fontSize: 13,
        color: '#8899aa',
        marginTop: 6,
        textAlign: 'center',
    },

    /* Cronômetro */
    timerCard: {
        backgroundColor: '#141c28',
        borderRadius: 18, borderWidth: 1,
        marginBottom: 16, overflow: 'hidden',
    },
    timerProgressBg: { height: 4, backgroundColor: '#1a2235', width: '100%' },
    timerProgressFill: { height: 4, borderRadius: 0 },
    timerBody: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20, paddingVertical: 14,
    },
    timerDisplayArea: { gap: 2 },
    timerDisplay: { fontSize: 40, fontWeight: '900', letterSpacing: 2, lineHeight: 44 },
    timerAcabou: { fontSize: 34, fontWeight: '900', color: COR.vermelho, letterSpacing: 3 },
    timerLabel: { fontSize: 11, color: '#4a6a8a', fontWeight: '600', letterSpacing: 0.5 },
    timerBtns: { flexDirection: 'row', gap: 10, alignItems: 'center' },
    timerBtnPlay: {
        width: 52, height: 52, borderRadius: 26,
        alignItems: 'center', justifyContent: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4, shadowRadius: 8, elevation: 5,
    },
    timerBtnPlayText: { fontSize: 20 },
    timerBtnReset: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: '#1a2235', alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: '#2a3448',
    },
    timerBtnResetText: { fontSize: 20, color: '#5a7a9a', fontWeight: '700' },

    /* Mini Scoreboard */
    scoreStrip: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    scoreChip: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1c2230',
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 8,
        gap: 5,
    },
    scoreChipDot: { width: 7, height: 7, borderRadius: 4 },
    scoreChipName: { flex: 1, fontSize: 11, fontWeight: '800' },
    scoreChipPts: { fontSize: 18, fontWeight: '900' },
    scoreChipPtsLabel: { fontSize: 9, fontWeight: '700', color: '#8899aa', marginBottom: -2 },

    /* Card */
    card: {
        backgroundColor: '#1c2230',
        borderRadius: 20,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    cardTeamName: {
        fontSize: 20,
        fontWeight: '900',
        color: '#fff',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    cardTopSub: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
    cardPtsBadge: {
        backgroundColor: 'rgba(0,0,0,0.25)',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 8,
        alignItems: 'center',
    },
    cardPtsNum: { fontSize: 28, fontWeight: '900', color: '#fff', lineHeight: 30 },
    cardPtsLabel: {
        fontSize: 11, fontWeight: '700',
        color: 'rgba(255,255,255,0.6)',
        letterSpacing: 1, textTransform: 'uppercase',
    },

    /* Stats Grid */
    statsGrid: {
        flexDirection: 'row',
        backgroundColor: '#141a24',
        paddingVertical: 16,
        paddingHorizontal: 8,
    },
    statsGridDivider: { width: 1, backgroundColor: '#2a3040', marginVertical: 4 },
    statBox: {
        flex: 1, alignItems: 'center',
        borderTopWidth: 2, marginHorizontal: 6,
        paddingTop: 10, borderRadius: 2,
    },
    statBoxIcon: { fontSize: 18, marginBottom: 4 },
    statBoxLabel: {
        fontSize: 9, fontWeight: '700', color: '#8899aa',
        textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6,
    },
    statBoxValue: { fontSize: 28, fontWeight: '900', marginBottom: 10 },
    statBoxBtns: { flexDirection: 'row', gap: 6 },
    statBtnMinus: {
        width: 34, height: 34, borderRadius: 8,
        backgroundColor: '#222a38', alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: '#333d50',
    },
    statBtnMinusText: { fontSize: 22, fontWeight: '700', color: COR.vermelho },
    statBtnPlus: { width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    statBtnPlusText: { fontSize: 22, fontWeight: '700', color: '#fff' },

    /* Players */
    playersSection: { padding: 16 },
    playersSectionTitle: {
        fontSize: 11, fontWeight: '800', color: '#8899aa',
        textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12,
    },
    playerRow: {
        backgroundColor: '#1a2235',
        borderRadius: 12, padding: 12, marginBottom: 8,
    },
    playerTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    playerBottomRow: { flexDirection: 'row', gap: 10 },
    playerStatPill: {
        flex: 1, flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#111820', borderRadius: 8,
        paddingHorizontal: 8, paddingVertical: 6, gap: 6,
    },
    playerAvatar: {
        width: 36, height: 36, borderRadius: 18,
        alignItems: 'center', justifyContent: 'center', marginRight: 10,
    },
    playerAvatarText: { fontSize: 16, fontWeight: '800' },
    playerName: { flex: 1, fontSize: 16, fontWeight: '700', color: '#eef' },
    playerStatEmoji: { fontSize: 14 },
    playerStatVal: { fontSize: 15, fontWeight: '800', color: '#fff', minWidth: 20, textAlign: 'center' },
    miniBtnMinus: {
        width: 26, height: 26, borderRadius: 6,
        backgroundColor: '#2a1818', alignItems: 'center', justifyContent: 'center',
    },
    miniBtnMinusText: { fontSize: 16, fontWeight: '700', color: COR.vermelho },
    miniBtnPlus: { width: 26, height: 26, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
    miniBtnPlusText: { fontSize: 16, fontWeight: '700', color: '#fff' },

    /* Encerrar */
    btnEncerrar: {
        backgroundColor: COR.vermelho,
        borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginTop: 8,
        shadowColor: COR.vermelho,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.45, shadowRadius: 12, elevation: 8,
    },
    btnEncerrarText: { color: '#fff', fontSize: 17, fontWeight: '900', letterSpacing: 0.5 },
});
