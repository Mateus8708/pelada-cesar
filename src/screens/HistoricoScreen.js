import { useContext, useEffect, useState } from 'react';
import {
    View, Text, TouchableOpacity, ScrollView,
    SafeAreaView, StyleSheet, StatusBar, ActivityIndicator
} from 'react-native';
import { PeladaContext } from '../context/PeladaContext';
import { COR } from '../constants/theme';
import { getTodosHistoricos } from '../services/HistoricoService';

export default function HistoricoScreen() {
    const { setTela } = useContext(PeladaContext);
    const [historicos, setHistoricos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [mesExpandido, setMesExpandido] = useState(null);

    useEffect(() => {
        carregarDados();
    }, []);

    async function carregarDados() {
        setCarregando(true);
        const res = await getTodosHistoricos();
        setHistoricos(res);
        if (res.length > 0) {
            setMesExpandido(res[0].id); // Expande o mês mais recente por padrão
        }
        setCarregando(false);
    }

    // Ordena os jogadores de um mês para o ranking da UI
    function rankingMensal(jogadoresMes) {
        if (!jogadoresMes) return [];
        return Object.keys(jogadoresMes)
            .map(nome => ({ nome, ...jogadoresMes[nome] }))
            .sort((a, b) => {
                const ptA = a.pontos || 0;
                const ptB = b.pontos || 0;
                if (ptB !== ptA) return ptB - ptA;
                return (b.gols || 0) - (a.gols || 0); // Desempate por gols
            });
    }

    function formatarMes(stringId) {
        // Ex: "2026-04" -> "Abril 2026"
        if (!stringId) return '';
        const [ano, mes] = stringId.split('-');
        const mesesNomes = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        return `${mesesNomes[parseInt(mes)]} ${ano}`;
    }

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor="#080e18" />
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* Header Navbar */}
                <View style={styles.navBar}>
                    <TouchableOpacity onPress={() => setTela('cadastro')} style={styles.btnVoltar} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                        <Text style={styles.btnVoltarText}>← VOLTAR</Text>
                    </TouchableOpacity>
                </View>

                {/* Header Title */}
                <View style={styles.header}>
                    <Text style={styles.headerEmoji}>📚</Text>
                    <Text style={styles.headerTitle}>Histórico Mensal</Text>
                    <Text style={styles.headerSub}>Todos os seus dados salvos</Text>
                </View>

                {carregando ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COR.verde} />
                        <Text style={styles.loadingText}>Buscando registros...</Text>
                    </View>
                ) : historicos.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyEmoji}>🕸️</Text>
                        <Text style={styles.emptyText}>Que poeira...</Text>
                        <Text style={styles.emptySub}>Nenhum histórico foi salvo ainda. Só é salvo quando uma pelada é oficialmente encerrada!</Text>
                    </View>
                ) : (
                    historicos.map((h) => {
                        const isExpandido = mesExpandido === h.id;
                        const rank = rankingMensal(h.jogadores);

                        return (
                            <View key={h.id} style={styles.monthCard}>
                                {/* Cabeçalho do Cartão (Clica p/ expandir) */}
                                <TouchableOpacity
                                    style={[styles.monthHeader, isExpandido && styles.monthHeaderExpanded]}
                                    onPress={() => setMesExpandido(isExpandido ? null : h.id)}
                                    activeOpacity={0.8}
                                >
                                    <View>
                                        <Text style={styles.monthTitle}>{formatarMes(h.id)}</Text>
                                        <Text style={styles.monthPeladasTotais}>{h.totalPeladasNoMes} pelada{h.totalPeladasNoMes !== 1 ? 's' : ''} no mês</Text>
                                    </View>
                                    <Text style={styles.expandIcon}>{isExpandido ? "▲" : "▼"}</Text>
                                </TouchableOpacity>

                                {/* Lista de Histórico (Só mostra se expandido aberto) */}
                                {isExpandido && (
                                    <View style={styles.monthBody}>
                                        {rank.length === 0 ? (
                                            <Text style={styles.monthSemStats}>Nenhum gol registrado.</Text>
                                        ) : (
                                            rank.map((jog, idx) => (
                                                <View key={jog.nome} style={styles.playerRow}>
                                                    <View style={styles.posBadge}>
                                                        <Text style={styles.posText}>{idx + 1}º</Text>
                                                    </View>

                                                    <Text style={styles.playerName}>{jog.nome}</Text>

                                                    <View style={styles.playerStats}>
                                                        {jog.pontos > 0 && <Text style={[styles.statValue, { color: COR.verde }]}>{jog.pontos}p</Text>}
                                                        <Text style={styles.statValue}>⚽ {jog.gols || 0}</Text>
                                                        <Text style={styles.statValue}>👟 {jog.assistencias || 0}</Text>
                                                    </View>
                                                </View>
                                            ))
                                        )}
                                    </View>
                                )}
                            </View>
                        );
                    })
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#060c14' },
    scroll: { padding: 20, paddingBottom: 60 },

    navBar: { marginBottom: 10 },
    btnVoltar: { paddingVertical: 8, alignSelf: 'flex-start' },
    btnVoltarText: { color: '#5a7a9a', fontSize: 12, fontWeight: '800', letterSpacing: 2 },

    header: { alignItems: 'center', paddingTop: 4, paddingBottom: 32 },
    headerEmoji: { fontSize: 44, marginBottom: 10 },
    headerTitle: { fontSize: 28, fontWeight: '900', color: '#ffffff', letterSpacing: -1 },
    headerSub: { fontSize: 13, color: '#5a7a9a', marginTop: 6 },

    loadingContainer: { alignItems: 'center', marginTop: 60, gap: 16 },
    loadingText: { color: '#4a6a8a', fontSize: 13, fontWeight: '600' },

    emptyContainer: { alignItems: 'center', marginTop: 60 },
    emptyEmoji: { fontSize: 48, marginBottom: 16 },
    emptyText: { color: '#ffffff', fontSize: 18, fontWeight: '800', marginBottom: 6 },
    emptySub: { color: '#5a7a9a', fontSize: 13, textAlign: 'center', lineHeight: 20, paddingHorizontal: 20 },

    monthCard: {
        backgroundColor: '#0a121c',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#142032',
        marginBottom: 16,
        overflow: 'hidden',
    },
    monthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#0c1622',
    },
    monthHeaderExpanded: {
        borderBottomWidth: 1,
        borderBottomColor: '#142032',
    },
    monthTitle: { color: '#ffffff', fontSize: 18, fontWeight: '800', marginBottom: 2 },
    monthPeladasTotais: { color: '#5a7a9a', fontSize: 12, fontWeight: '600' },
    expandIcon: { color: '#4a6a8a', fontSize: 14, fontWeight: '900' },

    monthBody: {
        padding: 16,
        gap: 12,
    },
    monthSemStats: { color: '#4a6a8a', fontSize: 13, textAlign: 'center', padding: 20 },

    playerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111b28',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: '#182436',
    },
    posBadge: {
        width: 32, height: 32, borderRadius: 16,
        backgroundColor: '#1a2838',
        alignItems: 'center', justifyContent: 'center',
        marginRight: 12
    },
    posText: { color: '#88aacc', fontSize: 12, fontWeight: '800' },
    playerName: { color: '#ddeeff', fontSize: 14, fontWeight: '700', flex: 1 },
    playerStats: { flexDirection: 'row', gap: 10 },
    statValue: { color: '#88aacc', fontSize: 13, fontWeight: '700' },
});
