import { useContext, useState, useRef } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, Pressable, ScrollView,
    SafeAreaView, StyleSheet, StatusBar, Keyboard, KeyboardAvoidingView, Platform,
} from 'react-native';
import { PeladaContext } from '../context/PeladaContext';
import { COR } from '../constants/theme';

const GRUPOS = [
    { label: 'Grupo A', range: [0, 4] },
    { label: 'Grupo B', range: [5, 9] },
    { label: 'Grupo C', range: [10, 14] },
];

export default function CadastroScreen() {
    const { jogadores, atualizarNome, atualizarNota, formarTimes } = useContext(PeladaContext);
    const [focusedId, setFocusedId] = useState(null);
    // Estado local para os nomes — evita re-render do Context a cada letra digitada
    const [nomes, setNomes] = useState(() => jogadores.map(j => j.nome));
    const nomesRef = useRef(nomes);
    const inputRefs = useRef([]);

    const preenchidos = nomes.filter(n => n.trim().length > 0).length;
    const pct = Math.round((preenchidos / 15) * 100);
    const tudo = preenchidos === 15;

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor="#060c14" />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="always"
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerEmoji}>⚽</Text>
                        <Text style={styles.headerTitle}>Pelada FC</Text>
                        <Text style={styles.headerSub}>Cadastre os 15 jogadores</Text>
                    </View>

                    {/* Progress */}
                    <View style={styles.progressBlock}>
                        <View style={styles.progressRow}>
                            <Text style={styles.progressLabel}>
                                {preenchidos} <Text style={styles.progressLabelDim}>de 15 jogadores</Text>
                            </Text>
                            <Text style={[styles.progressPct, { color: tudo ? COR.verde : COR.azul }]}>
                                {pct}%
                            </Text>
                        </View>
                        <View style={styles.progressBg}>
                            <View style={[styles.progressFill, {
                                width: `${pct}%`,
                                backgroundColor: tudo ? COR.verde : COR.azul,
                            }]} />
                        </View>
                    </View>

                    {/* Grupos de jogadores */}
                    {GRUPOS.map(({ label, range }) => {
                        const [ini, fim] = range;
                        const grupoPreenchidos = nomes.slice(ini, fim + 1).filter(n => n.trim().length > 0).length;

                        return (
                            <View key={label} style={styles.grupo}>
                                <View style={styles.grupoHeader}>
                                    <Text style={styles.grupoLabel}>{label}</Text>
                                    <Text style={styles.grupoCount}>
                                        {grupoPreenchidos}/5
                                    </Text>
                                </View>

                                {jogadores.slice(ini, fim + 1).map((j, gi) => {
                                    const i = ini + gi;
                                    const filled = nomes[i].trim().length > 0;
                                    const focused = focusedId === j.id;
                                    const isLast = i === 14;

                                    return (
                                        <Pressable
                                            key={j.id}
                                            style={[
                                                styles.card,
                                                filled && styles.cardFilled,
                                                focused && styles.cardFocused,
                                            ]}
                                            onPress={() => inputRefs.current[i]?.focus()}
                                        >
                                            {/* Badge número */}
                                            <View style={[
                                                styles.numBadge,
                                                filled && { backgroundColor: COR.azul },
                                                focused && { backgroundColor: COR.azul },
                                            ]}>
                                                <Text style={[styles.numText, (filled || focused) && { color: '#fff' }]}>
                                                    {filled ? '✓' : i + 1}
                                                </Text>
                                            </View>

                                            {/* Input nome — usa estado local para não perder foco */}
                                            <TextInput
                                                ref={el => { inputRefs.current[i] = el; }}
                                                style={styles.input}
                                                placeholder={`Jogador ${i + 1}`}
                                                placeholderTextColor="#2e3f52"
                                                value={nomes[i]}
                                                onChangeText={v => {
                                                    setNomes(prev => {
                                                        const next = [...prev];
                                                        next[i] = v;
                                                        nomesRef.current = next;
                                                        return next;
                                                    });
                                                }}
                                                onFocus={() => setFocusedId(j.id)}
                                                onBlur={() => {
                                                    setFocusedId(null);
                                                    atualizarNome(j.id, nomesRef.current[i]);
                                                }}
                                                returnKeyType={isLast ? 'done' : 'next'}
                                                autoCorrect={false}
                                                autoCapitalize="words"
                                                spellCheck={false}
                                                blurOnSubmit={false}
                                                onSubmitEditing={() => {
                                                    atualizarNome(j.id, nomesRef.current[i]);
                                                    if (!isLast) {
                                                        inputRefs.current[i + 1]?.focus();
                                                    } else {
                                                        Keyboard.dismiss();
                                                    }
                                                }}
                                            />

                                            {/* Estrelas */}
                                            <View style={styles.stars}>
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <TouchableOpacity
                                                        key={star}
                                                        onPress={() => atualizarNota(j.id, star)}
                                                        hitSlop={{ top: 10, bottom: 10, left: 4, right: 4 }}
                                                        activeOpacity={0.7}
                                                    >
                                                        <Text style={[
                                                            styles.star,
                                                            j.nota >= star && styles.starFilled,
                                                        ]}>
                                                            ★
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        );
                    })}

                    {/* Legenda estrelas */}
                    <View style={styles.legenda}>
                        <Text style={styles.legendaText}>★ = fraco &nbsp;&nbsp; ★★★ = médio &nbsp;&nbsp; ★★★★★ = craque</Text>
                    </View>

                    {/* Botão sortear */}
                    <TouchableOpacity
                        style={[styles.btnSortear, !tudo && styles.btnSortearDisabled]}
                        onPress={() => { Keyboard.dismiss(); formarTimes(); }}
                        activeOpacity={0.85}
                        disabled={!tudo}
                    >
                        {tudo ? (
                            <Text style={styles.btnSortearText}>🎲  Sortear Times</Text>
                        ) : (
                            <View style={styles.btnSortearInner}>
                                <Text style={styles.btnSortearTextDisabled}>
                                    Faltam {15 - preenchidos} jogador{15 - preenchidos !== 1 ? 'es' : ''}
                                </Text>
                                <View style={styles.btnProgressBar}>
                                    <View style={[styles.btnProgressFill, { width: `${pct}%` }]} />
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#060c14' },
    scroll: { padding: 20, paddingBottom: 60 },

    /* Header */
    header: { alignItems: 'center', paddingTop: 8, paddingBottom: 28 },
    headerEmoji: { fontSize: 48, marginBottom: 10 },
    headerTitle: { fontSize: 32, fontWeight: '900', color: '#ffffff', letterSpacing: -1 },
    headerSub: { fontSize: 13, color: '#5a7a9a', marginTop: 6, letterSpacing: 0.5 },

    /* Progress */
    progressBlock: { marginBottom: 28 },
    progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 },
    progressLabel: { fontSize: 15, fontWeight: '800', color: '#c8d8e8' },
    progressLabelDim: { fontSize: 13, fontWeight: '500', color: '#4a6a8a' },
    progressPct: { fontSize: 14, fontWeight: '800' },
    progressBg: { height: 6, backgroundColor: '#0e1828', borderRadius: 3 },
    progressFill: { height: 6, borderRadius: 3 },

    /* Grupos */
    grupo: { marginBottom: 20 },
    grupoHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 10, paddingHorizontal: 2,
    },
    grupoLabel: { fontSize: 11, fontWeight: '700', color: '#4a6a8a', letterSpacing: 1.5, textTransform: 'uppercase' },
    grupoCount: { fontSize: 11, fontWeight: '700', color: '#4a6a8a' },

    /* Cards */
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0c1420',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#141e2e',
        paddingVertical: 14,
        paddingHorizontal: 14,
        marginBottom: 7,
        gap: 12,
    },
    cardFocused: {
        borderColor: COR.azul,
        backgroundColor: '#0a1624',
        shadowColor: COR.azul,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
    },
    cardFilled: {
        borderColor: '#182a18',
        backgroundColor: '#0a1410',
    },

    /* Badge número */
    numBadge: {
        width: 32, height: 32, borderRadius: 8,
        backgroundColor: '#141e2e',
        alignItems: 'center', justifyContent: 'center',
    },
    numText: { fontSize: 12, fontWeight: '800', color: '#4a6a8a' },

    /* Input */
    input: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#ddeeff',
        paddingVertical: 0,
        minHeight: 24,
    },

    /* Estrelas */
    stars: { flexDirection: 'row', gap: 4 },
    star: { fontSize: 20, color: '#1a2838' },
    starFilled: { color: COR.amarelo },

    /* Legenda */
    legenda: { alignItems: 'center', marginBottom: 8, marginTop: -8 },
    legendaText: { fontSize: 11, color: '#2e4a6a' },

    /* Botão sortear */
    btnSortear: {
        backgroundColor: COR.verde,
        borderRadius: 16,
        paddingVertical: 19,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: COR.verde,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 14,
        elevation: 8,
    },
    btnSortearDisabled: {
        backgroundColor: '#0e1828',
        shadowOpacity: 0,
        elevation: 0,
    },
    btnSortearInner: { alignItems: 'center', width: '100%', paddingHorizontal: 24, gap: 10 },
    btnSortearText: { color: '#fff', fontSize: 17, fontWeight: '900', letterSpacing: 0.3 },
    btnSortearTextDisabled: { color: '#4a6a8a', fontSize: 15, fontWeight: '700' },
    btnProgressBar: {
        height: 3, width: '100%', backgroundColor: '#1a2a3a', borderRadius: 2,
    },
    btnProgressFill: {
        height: 3, backgroundColor: '#2a4a6a', borderRadius: 2,
    },
});
