import { useContext } from 'react';
import {
    View, Text, TouchableOpacity, ScrollView,
    SafeAreaView, StyleSheet, StatusBar,
} from 'react-native';
import { PeladaContext } from '../context/PeladaContext';
import { COR, NOMES_TIMES, CORES_TIMES } from '../constants/theme';

const MEDALHAS = ['🥇', '🥈', '🥉'];

export default function DestaquesScreen() {
    const { getTopArtilheiros, getTopGarcons, setTela } = useContext(PeladaContext);
    const artilheiros = getTopArtilheiros(3);
    const garcoes = getTopGarcons(3);
    const semEstatisticas = artilheiros.length === 0 && garcoes.length === 0;

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor="#f4f6f9" />
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
                        {/* Top 3 Artilheiros */}
                        <Top3Section
                            icon="⚽"
                            title="Top 3 Artilheiros"
                            color="#f59e0b"
                            bg={COR.amareloClaro}
                            players={artilheiros}
                            mainStat={(j) => j.gols}
                            mainLabel="gols"
                            subStat={(j) => `${j.assistencias} assist.`}
                        />

                        {/* Top 3 Assistências */}
                        <Top3Section
                            icon="👟"
                            title="Top 3 Assistências"
                            color={COR.verde}
                            bg={COR.verdeClaro}
                            players={garcoes}
                            mainStat={(j) => j.assistencias}
                            mainLabel="assist."
                            subStat={(j) => `${j.gols} gols`}
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

function Top3Section({ icon, title, color, bg, players, mainStat, mainLabel, subStat }) {
    if (players.length === 0) return null;

    return (
        <View style={[styles.awardCard, { borderColor: color + '60', backgroundColor: bg }]}>
            {/* Badge do título */}
            <View style={[styles.awardBadge, { backgroundColor: color + '20', borderColor: color + '50' }]}>
                <Text style={styles.awardBadgeIcon}>{icon}</Text>
                <Text style={[styles.awardBadgeText, { color }]}>{title.toUpperCase()}</Text>
            </View>

            {players.map((j, i) => {
                const teamCor = CORES_TIMES[j.time] || color;
                return (
                    <View key={j.nome} style={[styles.rankRow, i < players.length - 1 && styles.rankRowBorder]}>
                        <Text style={styles.rankMedal}>{MEDALHAS[i]}</Text>

                        <View style={[styles.rankAvatar, { backgroundColor: color + '25', borderColor: color + '60' }]}>
                            <Text style={[styles.rankAvatarLetter, { color }]}>{j.nome.charAt(0).toUpperCase()}</Text>
                        </View>

                        <View style={styles.rankInfo}>
                            <Text style={styles.rankName}>{j.nome}</Text>
                            <View style={[styles.rankTeamBadge, { borderColor: teamCor + '80' }]}>
                                <Text style={[styles.rankTeamText, { color: teamCor }]}>{NOMES_TIMES[j.time]}</Text>
                            </View>
                        </View>

                        <View style={styles.rankStat}>
                            <Text style={[styles.rankStatNum, { color }]}>{mainStat(j)}</Text>
                            <Text style={styles.rankStatSub}>{subStat(j)}</Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COR.fundo },
    scroll: { padding: 20, paddingBottom: 50 },

    header: { alignItems: 'center', paddingTop: 16, paddingBottom: 28 },
    headerEmoji: { fontSize: 48, marginBottom: 10 },
    headerTitle: { fontSize: 30, fontWeight: '900', color: COR.texto, letterSpacing: -0.5 },
    headerSub: { fontSize: 14, color: COR.textoSecundario, marginTop: 6 },

    awardCard: {
        borderRadius: 20,
        borderWidth: 1.5,
        padding: 18,
        marginBottom: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 4,
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
        marginBottom: 14,
    },
    awardBadgeIcon: { fontSize: 14 },
    awardBadgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },

    rankRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
    },
    rankRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: COR.borda,
    },
    rankMedal: { fontSize: 22, width: 28, textAlign: 'center' },
    rankAvatar: {
        width: 40, height: 40, borderRadius: 20,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1.5,
    },
    rankAvatarLetter: { fontSize: 16, fontWeight: '900' },
    rankInfo: { flex: 1, gap: 6 },
    rankName: { fontSize: 15, fontWeight: '800', color: COR.texto },
    rankTeamBadge: {
        alignSelf: 'flex-start',
        borderWidth: 1, borderRadius: 6,
        paddingHorizontal: 8, paddingVertical: 2,
    },
    rankTeamText: { fontSize: 10, fontWeight: '700' },
    rankStat: { alignItems: 'flex-end', minWidth: 56 },
    rankStatNum: { fontSize: 24, fontWeight: '900', lineHeight: 26 },
    rankStatSub: { fontSize: 11, color: COR.textoSecundario, marginTop: 2 },

    emptyState: {
        alignItems: 'center',
        backgroundColor: COR.superficie,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COR.borda,
        padding: 32,
        marginBottom: 18,
    },
    emptyEmoji: { fontSize: 48, marginBottom: 14 },
    emptyTitle: { fontSize: 18, fontWeight: '800', color: COR.texto, marginBottom: 8 },
    emptySub: { fontSize: 13, color: COR.textoSecundario, textAlign: 'center', lineHeight: 20 },

    btnNext: {
        backgroundColor: COR.azul,
        borderRadius: 16, paddingVertical: 18,
        alignItems: 'center',
        shadowColor: COR.azul,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16, shadowRadius: 12, elevation: 4,
    },
    btnNextText: { color: '#fff', fontSize: 17, fontWeight: '900', letterSpacing: 0.3 },
});
