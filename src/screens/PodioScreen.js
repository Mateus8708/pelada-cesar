import { useContext, useEffect, useRef } from 'react';
import {
    View, Text, TouchableOpacity, SafeAreaView,
    ScrollView, Animated, StyleSheet, StatusBar,
} from 'react-native';
import { PeladaContext } from '../context/PeladaContext';
import { NOMES_TIMES, COR } from '../constants/theme';

const MEDAL_META = [
    { emoji: '🥇', glow: '#f5c842', bg: '#fdf2df', label: '1º LUGAR' },
    { emoji: '🥈', glow: '#7c8896', bg: '#f1f3f5', label: '2º LUGAR' },
    { emoji: '🥉', glow: '#a35f27', bg: '#fdf0e6', label: '3º LUGAR' },
];

export default function PodioScreen() {
    const { getPodiumOrdem, setTela } = useContext(PeladaContext);
    const ordem = getPodiumOrdem();

    const anims = [
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current,
    ];
    const glowAnim = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        // Cards sobem em sequência
        Animated.stagger(200, anims.map(a =>
            Animated.spring(a, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 })
        )).start();
        // Efeito de pulsação no campeão
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
                Animated.timing(glowAnim, { toValue: 0.4, duration: 1200, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor="#f4f6f9" />
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* Título */}
                <View style={styles.header}>
                    <Text style={styles.headerEmoji}>🏆</Text>
                    <Text style={styles.headerTitle}>Pódio Final</Text>
                    <Text style={styles.headerSub}>Parabéns aos campeões!</Text>
                </View>

                {/* === Card do 1º Lugar (destaque especial) === */}
                {ordem[0] && (() => {
                    const t = ordem[0];
                    return (
                        <Animated.View style={[
                            styles.firstCard,
                            {
                                opacity: anims[0],
                                borderColor: MEDAL_META[0].glow,
                                transform: [{ scale: anims[0].interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }]
                            }
                        ]}>
                            {/* Faixa campeão */}
                            <Animated.View style={[styles.championBanner, { opacity: glowAnim }]}>
                                <Text style={styles.championBannerText}>◆  CAMPEÃO  ◆</Text>
                            </Animated.View>

                            <Text style={styles.firstMedal}>🥇</Text>
                            <Text style={[styles.firstTeamName, { color: MEDAL_META[0].glow }]}>{NOMES_TIMES[t.index]}</Text>

                            {/* Big stat: pontos */}
                            <View style={styles.firstPtsContainer}>
                                <Text style={styles.firstPtsNum}>{t.pontos}</Text>
                                <Text style={styles.firstPtsLabel}>PONTOS</Text>
                            </View>

                            {/* Stats secundários */}
                            <View style={styles.firstStats}>
                                <MiniStat label="V" value={t.vitorias} color="#4ade80" />
                                <MiniStat label="E" value={t.empates} color="#94a3b8" />
                                <MiniStat label="SO" value={t.shootouts || 0} color="#f59e0b" />
                                <MiniStat label="D" value={t.derrotas} color="#f87171" />
                            </View>
                        </Animated.View>
                    );
                })()}

                {/* === 2º e 3º lugar lado a lado === */}
                <View style={styles.bottomRow}>
                    {[1, 2].map(pos => {
                        const t = ordem[pos];
                        if (!t) return null;
                        const meta = MEDAL_META[pos];
                        return (
                            <Animated.View key={pos} style={[
                                styles.smallCard,
                                { borderColor: meta.glow, backgroundColor: meta.bg },
                                {
                                    opacity: anims[pos],
                                    transform: [{ translateY: anims[pos].interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }]
                                }
                            ]}>
                                <Text style={styles.smallMedal}>{meta.emoji}</Text>
                                <Text style={styles.smallPos}>{meta.label}</Text>
                                <Text style={[styles.smallTeam, { color: meta.glow }]}>{NOMES_TIMES[t.index]}</Text>
                                <View style={[styles.smallPtsBadge, { backgroundColor: meta.glow + '20', borderColor: meta.glow }]}>
                                    <Text style={[styles.smallPts, { color: meta.glow }]}>{t.pontos} pts</Text>
                                </View>
                                <View style={styles.smallStats}>
                                    <Text style={styles.smallStatText}>{t.vitorias}V  {t.empates}E  {t.shootouts || 0}SO</Text>
                                </View>
                            </Animated.View>
                        );
                    })}
                </View>

                <TouchableOpacity style={styles.btnNext} onPress={() => setTela('destaques')} activeOpacity={0.85}>
                    <Text style={styles.btnNextText}>Destaques  ⭐</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

function MiniStat({ label, value, color }) {
    return (
        <View style={styles.miniStat}>
            <Text style={[styles.miniStatVal, { color }]}>{value}</Text>
            <Text style={styles.miniStatLabel}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COR.fundo },
    scroll: { padding: 20, paddingBottom: 50 },

    header: { alignItems: 'center', paddingTop: 16, paddingBottom: 28 },
    headerEmoji: { fontSize: 52, marginBottom: 10 },
    headerTitle: { fontSize: 30, fontWeight: '900', color: COR.texto, letterSpacing: -0.5 },
    headerSub: { fontSize: 14, color: COR.textoSecundario, marginTop: 6 },

    /* Campeão */
    firstCard: {
        backgroundColor: COR.amareloClaro,
        borderRadius: 24,
        borderWidth: 2,
        padding: 24,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#f5c842',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 10,
        elevation: 4,
    },
    championBanner: {
        backgroundColor: '#f5c84222',
        borderRadius: 30,
        paddingHorizontal: 18,
        paddingVertical: 5,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#f5c84255',
    },
    championBannerText: {
        color: '#f5c842',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 4,
    },
    firstMedal: { fontSize: 56, marginBottom: 8 },
    firstTeamName: {
        fontSize: 32,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 16,
    },
    firstPtsContainer: { alignItems: 'center', marginBottom: 20 },
    firstPtsNum: { fontSize: 64, fontWeight: '900', color: '#f5c842', lineHeight: 68 },
    firstPtsLabel: { fontSize: 12, fontWeight: '800', color: '#f5c84299', letterSpacing: 3, marginTop: 2 },
    firstStats: { flexDirection: 'row', gap: 10 },
    miniStat: {
        alignItems: 'center',
        backgroundColor: COR.superficie,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: COR.borda,
    },
    miniStatVal: { fontSize: 18, fontWeight: '900' },
    miniStatLabel: { fontSize: 10, fontWeight: '700', color: COR.textoSecundario, marginTop: 2, letterSpacing: 0.5 },

    /* 2º e 3º */
    bottomRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    smallCard: {
        flex: 1,
        borderRadius: 18,
        borderWidth: 1.5,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 3,
    },
    smallMedal: { fontSize: 32, marginBottom: 6 },
    smallPos: { fontSize: 9, fontWeight: '800', color: COR.textoSecundario, letterSpacing: 2, marginBottom: 8 },
    smallTeam: { fontSize: 16, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10, textAlign: 'center' },
    smallPtsBadge: {
        borderRadius: 20, borderWidth: 1,
        paddingHorizontal: 12, paddingVertical: 4, marginBottom: 8,
    },
    smallPts: { fontSize: 14, fontWeight: '800' },
    smallStats: {},
    smallStatText: { fontSize: 11, color: COR.textoSecundario, fontWeight: '600' },

    btnNext: {
        backgroundColor: COR.verde,
        borderRadius: 16, paddingVertical: 18,
        alignItems: 'center',
        shadowColor: COR.verde,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2, shadowRadius: 6, elevation: 4,
    },
    btnNextText: { color: '#fff', fontSize: 17, fontWeight: '900', letterSpacing: 0.3 },
});
