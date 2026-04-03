import { useContext } from 'react';
import {
    View, Text, TouchableOpacity, ScrollView,
    SafeAreaView, StyleSheet, StatusBar,
} from 'react-native';
import { PeladaContext } from '../context/PeladaContext';
import { COR, NOMES_TIMES, CORES_TIMES } from '../constants/theme';

export default function DestaquesScreen() {
    const { getArtilheiro, getGarcao, setTela } = useContext(PeladaContext);
    const artilheiros = getArtilheiro();
    const garcoes = getGarcao();
    const semEstatisticas = artilheiros.length === 0 || artilheiros[0]?.gols === 0;

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor="#080e18" />
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerEmoji}>⭐</Text>
                    <Text style={styles.headerTitle}>Destaques</Text>
                    <Text style={styles.headerSub}>Os craques que brilharam hoje</Text>
                </View>

                {/* Estado vazio */}
                {semEstatisticas && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyEmoji}>📋</Text>
                        <Text style={styles.emptyTitle}>Sem estatísticas</Text>
                        <Text style={styles.emptySub}>Nenhum gol ou assistência foi registrado nessa pelada.</Text>
                    </View>
                )}

                {!semEstatisticas && (
                    <>
                        {/* Artilheiro */}
                        <AwardSection
                            icon="⚽"
                            title={artilheiros.length > 1 ? 'Artilheiros' : 'Artilheiro do dia'}
                            color="#f59e0b"
                            bg="#1a1500"
                            players={artilheiros}
                            mainStat={(j) => j.gols}
                            mainLabel="GOLS"
                            subStat={(j) => `${j.assistencias} assistência${j.assistencias !== 1 ? 's' : ''}`}
                        />

                        {/* Garçom */}
                        <AwardSection
                            icon="👟"
                            title={garcoes.length > 1 ? 'Garçons' : 'Garçom do dia'}
                            color={COR.verde}
                            bg="#071410"
                            players={garcoes}
                            mainStat={(j) => j.assistencias}
                            mainLabel="ASSISTS"
                            subStat={(j) => `${j.gols} gol${j.gols !== 1 ? 's' : ''}`}
                        />
                    </>
                )}

                <TouchableOpacity style={styles.btnNext} onPress={() => setTela('ranking')} activeOpacity={0.85}>
                    <Text style={styles.btnNextText}>Ver Ranking  📊</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

function AwardSection({ icon, title, color, bg, players, mainStat, mainLabel, subStat }) {
    const winner = players[0];
    if (!winner) return null;
    const teamCor = CORES_TIMES[winner.time] || color;

    return (
        <View style={[styles.awardCard, { borderColor: color + '60', backgroundColor: bg }]}>
            {/* Badge do título */}
            <View style={[styles.awardBadge, { backgroundColor: color + '20', borderColor: color + '50' }]}>
                <Text style={styles.awardBadgeIcon}>{icon}</Text>
                <Text style={[styles.awardBadgeText, { color }]}>{title.toUpperCase()}</Text>
            </View>

            {/* Hero winner */}
            <View style={styles.heroRow}>
                <View style={[styles.heroAvatar, { backgroundColor: color + '25', borderColor: color + '60', borderWidth: 2 }]}>
                    <Text style={[styles.heroAvatarLetter, { color }]}>{winner.nome.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={styles.heroInfo}>
                    <Text style={styles.heroName}>{winner.nome}</Text>
                    <View style={[styles.heroTeamBadge, { borderColor: teamCor + '80' }]}>
                        <Text style={[styles.heroTeamText, { color: teamCor }]}>{NOMES_TIMES[winner.time]}</Text>
                    </View>
                </View>
                <View style={styles.heroBigStat}>
                    <Text style={[styles.heroBigNum, { color }]}>{mainStat(winner)}</Text>
                    <Text style={[styles.heroBigLabel, { color: color + '99' }]}>{mainLabel}</Text>
                </View>
            </View>

            {/* Sub-info */}
            <Text style={styles.heroSubStat}>{subStat(winner)}</Text>

            {/* Outros empatados */}
            {players.length > 1 && (
                <View style={styles.tiedRow}>
                    <Text style={styles.tiedLabel}>Também em destaque:</Text>
                    {players.slice(1).map((j, i) => (
                        <Text key={i} style={styles.tiedName}>• {j.nome}</Text>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#080e18' },
    scroll: { padding: 20, paddingBottom: 50 },

    header: { alignItems: 'center', paddingTop: 16, paddingBottom: 28 },
    headerEmoji: { fontSize: 48, marginBottom: 10 },
    headerTitle: { fontSize: 30, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
    headerSub: { fontSize: 14, color: '#8899aa', marginTop: 6 },

    awardCard: {
        borderRadius: 20,
        borderWidth: 1.5,
        padding: 20,
        marginBottom: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 8,
    },
    awardBadge: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'center',
        borderRadius: 30,
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 5,
        gap: 6,
        marginBottom: 18,
    },
    awardBadgeIcon: { fontSize: 14 },
    awardBadgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },

    heroRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 10 },
    heroAvatar: {
        width: 56, height: 56, borderRadius: 28,
        alignItems: 'center', justifyContent: 'center',
    },
    heroAvatarLetter: { fontSize: 24, fontWeight: '900' },
    heroInfo: { flex: 1, gap: 6 },
    heroName: { fontSize: 20, fontWeight: '800', color: '#eef' },
    heroTeamBadge: {
        alignSelf: 'flex-start',
        borderWidth: 1, borderRadius: 6,
        paddingHorizontal: 8, paddingVertical: 2,
    },
    heroTeamText: { fontSize: 11, fontWeight: '700' },
    heroBigStat: { alignItems: 'center', minWidth: 60 },
    heroBigNum: { fontSize: 48, fontWeight: '900', lineHeight: 52 },
    heroBigLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginTop: 2 },

    heroSubStat: { fontSize: 13, color: '#8899aa', marginTop: 4, marginBottom: 4 },

    tiedRow: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#1e2a3a',
    },
    tiedLabel: { fontSize: 11, color: '#8899aa', fontWeight: '700', marginBottom: 4 },
    tiedName: { fontSize: 13, color: '#8899aa', marginTop: 2 },

    emptyState: {
        alignItems: 'center',
        backgroundColor: '#111820',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#1e2a3a',
        padding: 32,
        marginBottom: 18,
    },
    emptyEmoji: { fontSize: 48, marginBottom: 14 },
    emptyTitle: { fontSize: 18, fontWeight: '800', color: '#c0d0e0', marginBottom: 8 },
    emptySub: { fontSize: 13, color: '#8899aa', textAlign: 'center', lineHeight: 20 },

    btnNext: {
        backgroundColor: COR.azul,
        borderRadius: 16, paddingVertical: 18,
        alignItems: 'center',
        shadowColor: COR.azul,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
    },
    btnNextText: { color: '#fff', fontSize: 17, fontWeight: '900', letterSpacing: 0.3 },
});
