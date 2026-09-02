import { useContext } from 'react';
import {
    View, Text, TouchableOpacity, ScrollView,
    SafeAreaView, StyleSheet, StatusBar,
} from 'react-native';
import { PeladaContext } from '../context/PeladaContext';
import { COR, NOMES_TIMES, CORES_TIMES } from '../constants/theme';

const MEDAL = ['🥇', '🥈', '🥉'];

export default function RankingScreen() {
    const { getRankingCompleto, novaPelada } = useContext(PeladaContext);
    const ranking = getRankingCompleto();
    const topGols = ranking.length > 0 ? Math.max(1, ranking[0].gols) : 1;

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor="#f4f6f9" />
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerEmoji}>📊</Text>
                    <Text style={styles.headerTitle}>Ranking Geral</Text>
                    <Text style={styles.headerSub}>Por gols — empate desempata por assistências</Text>
                </View>

                {/* Campeão — card hero destacado */}
                {ranking[0] && (() => {
                    const j = ranking[0];
                    const cor = CORES_TIMES[j.time];
                    return (
                        <View style={[styles.heroCard, { borderColor: COR.amarelo }]}>
                            <View style={styles.heroCrown}>
                                <Text style={styles.heroCrownText}>👑  1º LUGAR</Text>
                                <Text style={styles.heroCrownPts}>{j.gols} gol{j.gols !== 1 ? 's' : ''}</Text>
                            </View>
                            <View style={styles.heroBody}>
                                <View style={[styles.heroAvatar, { backgroundColor: cor + '28', borderColor: cor }]}>
                                    <Text style={[styles.heroAvatarLetter, { color: cor }]}>{j.nome.charAt(0).toUpperCase()}</Text>
                                </View>
                                <View style={styles.heroInfo}>
                                    <Text style={styles.heroName}>{j.nome}</Text>
                                    <View style={[styles.heroTeamBadge, { borderColor: cor }]}>
                                        <Text style={[styles.heroTeam, { color: cor }]}>{NOMES_TIMES[j.time]}</Text>
                                    </View>
                                </View>
                                <View style={styles.heroStats}>
                                    <View style={styles.heroStatChip}>
                                        <Text style={styles.heroStatNum}>{j.gols}</Text>
                                        <Text style={styles.heroStatLbl}>⚽</Text>
                                    </View>
                                    <View style={[styles.heroStatChip, { backgroundColor: COR.verdeClaro }]}>
                                        <Text style={styles.heroStatNum}>{j.assistencias}</Text>
                                        <Text style={styles.heroStatLbl}>👟</Text>
                                    </View>
                                </View>
                            </View>
                            {/* Barra de pontos máxima */}
                            <View style={styles.heroBar}>
                                <View style={[styles.heroBarFill, { width: '100%', backgroundColor: COR.amarelo }]} />
                            </View>
                        </View>
                    );
                })()}

                {/* Demais jogadores */}
                {ranking.slice(1).map((j, i) => {
                    const pos = i + 2; // começa no 2
                    const cor = CORES_TIMES[j.time];
                    const barPct = Math.max(4, (j.gols / topGols) * 100);
                    const isTop3 = pos <= 3;

                    return (
                        <View key={i} style={[styles.row, isTop3 && { borderColor: COR.bordaForte }]}>
                            {/* Posição */}
                            <View style={styles.rowPos}>
                                {pos <= 3
                                    ? <Text style={styles.rowMedal}>{MEDAL[pos - 1]}</Text>
                                    : <Text style={styles.rowPosNum}>{pos}º</Text>
                                }
                            </View>

                            {/* Avatar */}
                            <View style={[styles.rowAvatar, { backgroundColor: cor + '1a' }]}>
                                <Text style={[styles.rowAvatarLetter, { color: cor }]}>{j.nome.charAt(0).toUpperCase()}</Text>
                            </View>

                            {/* Info + barra */}
                            <View style={styles.rowMain}>
                                <View style={styles.rowTopLine}>
                                    <Text style={styles.rowName}>{j.nome}</Text>
                                    <View style={styles.rowStatLine}>
                                        <Text style={[styles.rowStatText, { color: cor, fontWeight: '800' }]}>⚽ {j.gols}</Text>
                                        <Text style={styles.rowStatText}>👟 {j.assistencias}</Text>
                                    </View>
                                </View>
                                <View style={styles.rowBarBg}>
                                    <View style={[styles.rowBarFill, { width: `${barPct}%`, backgroundColor: cor }]} />
                                </View>
                            </View>
                        </View>
                    );
                })}

                <TouchableOpacity style={styles.btnNova} onPress={novaPelada} activeOpacity={0.85}>
                    <Text style={styles.btnNovaText}>🔄  Nova Pelada</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COR.fundo },
    scroll: { padding: 20, paddingBottom: 50 },

    header: { alignItems: 'center', paddingTop: 16, paddingBottom: 24 },
    headerEmoji: { fontSize: 44, marginBottom: 10 },
    headerTitle: { fontSize: 28, fontWeight: '900', color: COR.texto, letterSpacing: -0.5 },
    headerSub: { fontSize: 13, color: COR.textoSecundario, marginTop: 5 },

    /* Hero Card */
    heroCard: {
        backgroundColor: COR.amareloClaro,
        borderRadius: 22,
        borderWidth: 2,
        overflow: 'hidden',
        marginBottom: 16,
        shadowColor: COR.amarelo,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 4,
    },
    heroCrown: {
        backgroundColor: COR.amarelo + '20',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderBottomWidth: 1,
        borderBottomColor: COR.amarelo + '35',
    },
    heroCrownText: { fontSize: 12, fontWeight: '800', color: COR.amarelo, letterSpacing: 2 },
    heroCrownPts: { fontSize: 12, fontWeight: '700', color: COR.amarelo + '99' },
    heroBody: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        gap: 14,
    },
    heroAvatar: {
        width: 54, height: 54, borderRadius: 27,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 2,
    },
    heroAvatarLetter: { fontSize: 22, fontWeight: '900' },
    heroInfo: { flex: 1, gap: 6 },
    heroName: { fontSize: 20, fontWeight: '800', color: COR.texto },
    heroTeamBadge: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
    heroTeam: { fontSize: 11, fontWeight: '700' },
    heroStats: { flexDirection: 'row', gap: 6 },
    heroStatChip: {
        backgroundColor: COR.superficie,
        borderRadius: 10,
        paddingHorizontal: 10, paddingVertical: 6,
        alignItems: 'center', minWidth: 40,
    },
    heroStatNum: { fontSize: 18, fontWeight: '900', color: COR.texto },
    heroStatLbl: { fontSize: 13, marginTop: 1 },
    heroBar: { height: 4, backgroundColor: '#f0ead8', marginHorizontal: 18, marginBottom: 16, borderRadius: 2 },
    heroBarFill: { height: 4, borderRadius: 2 },

    /* Rows */
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COR.superficie,
        borderRadius: 14,
        padding: 12,
        marginBottom: 8,
        gap: 10,
        borderWidth: 1,
        borderColor: COR.borda,
    },
    rowPos: { width: 32, alignItems: 'center' },
    rowMedal: { fontSize: 18 },
    rowPosNum: { fontSize: 13, fontWeight: '800', color: COR.textoSecundario },
    rowAvatar: {
        width: 36, height: 36, borderRadius: 18,
        alignItems: 'center', justifyContent: 'center',
    },
    rowAvatarLetter: { fontSize: 14, fontWeight: '800' },
    rowMain: { flex: 1 },
    rowTopLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    rowName: { fontSize: 14, fontWeight: '700', color: COR.texto },
    rowStatLine: { flexDirection: 'row', gap: 10 },
    rowStatText: { fontSize: 12, fontWeight: '700', color: COR.textoSecundario },
    rowBarBg: { height: 3, backgroundColor: COR.superficieAlt, borderRadius: 2 },
    rowBarFill: { height: 3, borderRadius: 2 },

    btnNova: {
        backgroundColor: COR.verde,
        borderRadius: 16, paddingVertical: 18,
        alignItems: 'center', marginTop: 16,
        shadowColor: COR.verde,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15, shadowRadius: 12, elevation: 3,
    },
    btnNovaText: { color: '#fff', fontSize: 17, fontWeight: '900', letterSpacing: 0.3 },
});
