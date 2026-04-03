import React, { useContext, useEffect, useRef } from 'react';
import {
    View, Text, TouchableOpacity, SafeAreaView,
    StyleSheet, StatusBar, Animated,
} from 'react-native';
import { PeladaContext } from '../context/PeladaContext';
import { NOMES_TIMES, COR } from '../constants/theme';

export default function PenaltiScreen() {
    const { penaltiTimes, penaltiResultado, resolverPenalti, setTela } = useContext(PeladaContext);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(40)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

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

                {/* Emoji principal com animação */}
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
                            <View style={styles.teamChip}>
                                <Text style={styles.teamChipText}>{NOMES_TIMES[ti]}</Text>
                            </View>
                        </React.Fragment>
                    ))}
                </View>

                {penaltiResultado === null ? (
                    <TouchableOpacity style={styles.btnPenalti} onPress={resolverPenalti} activeOpacity={0.85}>
                        <Text style={styles.btnPenaltiText}>⚽  Cobrar Pênaltis</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.resultContainer}>
                        <View style={styles.trofeuCircle}>
                            <Text style={styles.trofeuEmoji}>🏆</Text>
                        </View>
                        <Text style={styles.vencedorLabel}>VENCEDOR NOS PÊNALTIS</Text>
                        <Text style={styles.vencedorNome}>{NOMES_TIMES[penaltiResultado]}</Text>
                        <TouchableOpacity style={styles.btnPodio} onPress={() => setTela('podio')} activeOpacity={0.85}>
                            <Text style={styles.btnPodioText}>Ver Pódio  🏆</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </Animated.View>
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
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 3,
        color: COR.vermelho,
    },

    mainEmoji: { fontSize: 80, marginBottom: 20 },

    titulo: {
        fontSize: 26,
        fontWeight: '900',
        color: '#fff',
        textAlign: 'center',
        letterSpacing: -0.3,
        marginBottom: 10,
    },
    sub: {
        fontSize: 15,
        color: '#8899aa',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 28,
    },

    teamsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 36,
    },
    teamChip: {
        backgroundColor: '#1a2235',
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#2a3448',
    },
    teamChipText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#c0d0e0',
    },
    vsText: {
        fontSize: 20,
        fontWeight: '900',
        color: '#8899aa',
    },

    btnPenalti: {
        backgroundColor: COR.verde,
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        width: '100%',
        shadowColor: COR.verde,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    btnPenaltiText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '900',
        letterSpacing: 0.3,
    },

    resultContainer: { alignItems: 'center', width: '100%' },
    trofeuCircle: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: '#f5c84215',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#f5c84250',
        marginBottom: 18,
    },
    trofeuEmoji: { fontSize: 44 },
    vencedorLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: '#f5c84280',
        letterSpacing: 2,
        marginBottom: 10,
    },
    vencedorNome: {
        fontSize: 30,
        fontWeight: '900',
        color: '#f5c842',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 32,
        textAlign: 'center',
    },
    btnPodio: {
        backgroundColor: COR.verde,
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        width: '100%',
        shadowColor: COR.verde,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    btnPodioText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '900',
        letterSpacing: 0.3,
    },
});
