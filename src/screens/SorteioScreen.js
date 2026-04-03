import { useContext } from 'react';
import {
    View, Text, TouchableOpacity, ScrollView,
    SafeAreaView, StyleSheet, StatusBar,
} from 'react-native';
import { PeladaContext } from '../context/PeladaContext';
import { COR, NOMES_TIMES, CORES_TIMES } from '../constants/theme';

export default function SorteioScreen() {
    const {
        times, jogadorSelecionado,
        selecionarJogador, setJogadorSelecionado,
        setTela, irParaPelada, rebalancearTimes,
    } = useContext(PeladaContext);

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor="#080e18" />
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerEmoji}>🎲</Text>
                    <Text style={styles.headerTitle}>Escalação</Text>
                    <Text style={styles.headerSub}>Times sorteados com base nas notas</Text>
                </View>

                {/* Banner de seleção ativa */}
                {jogadorSelecionado ? (
                    <View style={styles.selBanner}>
                        <View style={styles.selBannerLeft}>
                            <Text style={styles.selBannerIcon}>🔄</Text>
                            <View>
                                <Text style={styles.selBannerName}>{jogadorSelecionado.nome}</Text>
                                <Text style={styles.selBannerHint}>Toque em outro jogador para trocar</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => setJogadorSelecionado(null)} style={styles.selBannerBtn}>
                            <Text style={styles.selBannerBtnText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.hintBanner}>
                        <Text style={styles.hintBannerText}>💡  Toque em dois jogadores para trocá-los de time</Text>
                    </View>
                )}

                {/* Cards de time */}
                {times.map((time, ti) => {
                    const cor = CORES_TIMES[ti];
                    const forca = time.reduce((acc, j) => acc + j.nota, 0);
                    const avg = time.length > 0 ? (forca / time.length).toFixed(1) : '0.0';
                    return (
                        <View key={ti} style={[styles.teamCard, { borderColor: cor + '80' }]}>
                            {/* Header do time */}
                            <View style={[styles.teamHeader, { backgroundColor: cor + '18' }]}>
                                <View style={[styles.teamColorDot, { backgroundColor: cor }]} />
                                <Text style={[styles.teamName, { color: cor }]}>{NOMES_TIMES[ti]}</Text>
                                <View style={styles.teamHeaderRight}>
                                    <View style={styles.forcaBadge}>
                                        <Text style={[styles.forcaNum, { color: cor }]}>{forca.toFixed(1)}</Text>
                                        <Text style={styles.forcaLbl}>força</Text>
                                    </View>
                                    <View style={styles.forcaBadge}>
                                        <Text style={[styles.forcaNum, { color: cor }]}>{avg}</Text>
                                        <Text style={styles.forcaLbl}>média</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Jogadores */}
                            <View style={styles.teamBody}>
                                {time.map((j, ji) => {
                                    const selecionado = jogadorSelecionado?.nome === j.nome;
                                    const bloqueado = jogadorSelecionado && jogadorSelecionado.time === j.time && !selecionado;

                                    return (
                                        <TouchableOpacity
                                            key={ji}
                                            style={[
                                                styles.playerRow,
                                                selecionado && { backgroundColor: COR.amarelo + '1a', borderColor: COR.amarelo },
                                                bloqueado && { opacity: 0.35 },
                                            ]}
                                            onPress={() => selecionarJogador(j)}
                                            activeOpacity={0.7}
                                        >
                                            {/* Avatar */}
                                            <View style={[styles.avatar, { backgroundColor: cor + '20', borderColor: selecionado ? COR.amarelo : cor + '40', borderWidth: 1.5 }]}>
                                                <Text style={[styles.avatarLetter, { color: selecionado ? COR.amarelo : cor }]}>
                                                    {j.nome.charAt(0).toUpperCase()}
                                                </Text>
                                            </View>

                                            {/* Nome */}
                                            <Text style={[styles.playerName, selecionado && { color: COR.amarelo }]}>{j.nome}</Text>

                                            {/* Estrelas de nota */}
                                            <View style={styles.stars}>
                                                {Array.from({ length: 5 }).map((_, si) => (
                                                    <Text key={si} style={[styles.star, si < j.nota && { color: COR.amarelo, opacity: 1 }]}>★</Text>
                                                ))}
                                            </View>

                                            {selecionado && (
                                                <View style={styles.checkBadge}>
                                                    <Text style={styles.checkText}>✓</Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    );
                })}

                {/* Ações */}
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.btnBack}
                        onPress={() => { setJogadorSelecionado(null); setTela('cadastro'); }}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.btnBackText}>← Voltar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.btnRebalancear}
                        onPress={rebalancearTimes}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.btnRebalancearText}>🔀</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnStart} onPress={irParaPelada} activeOpacity={0.85}>
                        <Text style={styles.btnStartText}>⚽  Iniciar Pelada</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#080e18' },
    scroll: { padding: 16, paddingBottom: 50 },

    header: { alignItems: 'center', paddingTop: 16, paddingBottom: 22 },
    headerEmoji: { fontSize: 46, marginBottom: 10 },
    headerTitle: { fontSize: 28, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
    headerSub: { fontSize: 13, color: '#8899aa', marginTop: 5 },

    selBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1a1800',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: COR.amarelo + '60',
        padding: 14,
        marginBottom: 14,
    },
    selBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
    selBannerIcon: { fontSize: 22 },
    selBannerName: { fontSize: 15, fontWeight: '700', color: COR.amarelo },
    selBannerHint: { fontSize: 11, color: '#667', marginTop: 2 },
    selBannerBtn: {
        backgroundColor: '#2a2200',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: COR.amarelo + '40',
    },
    selBannerBtnText: { fontSize: 12, fontWeight: '700', color: COR.amarelo },

    hintBanner: {
        backgroundColor: '#111820',
        borderRadius: 12,
        padding: 12,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#1e2a3a',
    },
    hintBannerText: { fontSize: 12, color: '#8899aa', fontWeight: '600', textAlign: 'center' },

    teamCard: {
        backgroundColor: '#111820',
        borderRadius: 20,
        borderWidth: 1.5,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 6,
    },
    teamHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#1a2235',
    },
    teamColorDot: { width: 10, height: 10, borderRadius: 5 },
    teamName: { fontSize: 18, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1, flex: 1 },
    teamHeaderRight: { flexDirection: 'row', gap: 10 },
    forcaBadge: { alignItems: 'center', backgroundColor: '#080e18', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
    forcaNum: { fontSize: 14, fontWeight: '900' },
    forcaLbl: { fontSize: 9, color: '#8899aa', fontWeight: '700', letterSpacing: 0.5 },

    teamBody: { padding: 12, gap: 8 },
    playerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0e1420',
        borderRadius: 12,
        padding: 10,
        gap: 10,
        borderWidth: 1,
        borderColor: '#1a2438',
    },
    avatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    avatarLetter: { fontSize: 15, fontWeight: '800' },
    playerName: { flex: 1, fontSize: 14, fontWeight: '700', color: '#bcc' },
    stars: { flexDirection: 'row' },
    star: { fontSize: 13, color: '#1e2a3a', opacity: 0.5 },
    checkBadge: {
        width: 22, height: 22, borderRadius: 11,
        backgroundColor: COR.amarelo,
        alignItems: 'center', justifyContent: 'center',
    },
    checkText: { fontSize: 12, fontWeight: '900', color: '#000' },

    actions: { flexDirection: 'row', gap: 10, marginTop: 4 },
    btnBack: {
        paddingVertical: 16, paddingHorizontal: 16, borderRadius: 14,
        alignItems: 'center', backgroundColor: '#111820',
        borderWidth: 1, borderColor: '#1e2a3a',
    },
    btnBackText: { color: '#8899aa', fontSize: 14, fontWeight: '700' },
    btnRebalancear: {
        paddingVertical: 16, paddingHorizontal: 16, borderRadius: 14,
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#1a1800',
        borderWidth: 1, borderColor: COR.amarelo + '50',
    },
    btnRebalancearText: { fontSize: 18 },
    btnStart: {
        flex: 1, paddingVertical: 16, borderRadius: 14,
        alignItems: 'center', backgroundColor: COR.verde,
        shadowColor: COR.verde,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4, shadowRadius: 10, elevation: 6,
    },
    btnStartText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 0.3 },
});
