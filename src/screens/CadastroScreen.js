import { useContext, useRef, useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, ScrollView,
    SafeAreaView, StyleSheet, StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import { PeladaContext } from '../context/PeladaContext';
import { COR, NOMES_TIMES, CORES_TIMES } from '../constants/theme';

export default function CadastroScreen() {
    const { times, adicionarJogador, removerJogador, iniciarPelada } = useContext(PeladaContext);
    const [nomes, setNomes] = useState(['', '', '']);
    const inputRefs = useRef([]);

    const podeComecar = times.every(time => time.length > 0);

    function handleAdd(ti) {
        const sucesso = adicionarJogador(ti, nomes[ti]);
        if (sucesso) {
            setNomes(prev => {
                const next = [...prev];
                next[ti] = '';
                return next;
            });
        }
        inputRefs.current[ti]?.focus();
    }

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={COR.fundo} />
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
                        <Text style={styles.headerSub}>Monte a escalação de cada time</Text>
                    </View>

                    {/* Times */}
                    {times.map((time, ti) => {
                        const cor = CORES_TIMES[ti];
                        return (
                            <View key={ti} style={[styles.teamCard, { borderColor: cor + '80' }]}>
                                <View style={[styles.teamHeader, { backgroundColor: cor + '18' }]}>
                                    <View style={[styles.teamColorDot, { backgroundColor: cor }]} />
                                    <Text style={[styles.teamName, { color: cor }]}>{NOMES_TIMES[ti]}</Text>
                                    <View style={styles.teamCountBadge}>
                                        <Text style={[styles.teamCountText, { color: cor }]}>{time.length}</Text>
                                    </View>
                                </View>

                                <View style={styles.teamBody}>
                                    {/* Input de nome */}
                                    <View style={styles.inputRow}>
                                        <TextInput
                                            ref={el => { inputRefs.current[ti] = el; }}
                                            style={styles.input}
                                            placeholder="Nome do jogador"
                                            placeholderTextColor={COR.textoTerciario}
                                            value={nomes[ti]}
                                            onChangeText={v => {
                                                setNomes(prev => {
                                                    const next = [...prev];
                                                    next[ti] = v;
                                                    return next;
                                                });
                                            }}
                                            returnKeyType="done"
                                            autoCorrect={false}
                                            autoCapitalize="words"
                                            spellCheck={false}
                                            blurOnSubmit={false}
                                            onSubmitEditing={() => handleAdd(ti)}
                                        />
                                        <TouchableOpacity
                                            style={[styles.btnAdd, { backgroundColor: cor }]}
                                            onPress={() => handleAdd(ti)}
                                            activeOpacity={0.8}
                                        >
                                            <Text style={styles.btnAddText}>+</Text>
                                        </TouchableOpacity>
                                    </View>

                                    {/* Lista de jogadores */}
                                    {time.length === 0 ? (
                                        <Text style={styles.emptyText}>Nenhum jogador ainda</Text>
                                    ) : (
                                        time.map(j => (
                                            <View key={j.nome} style={styles.playerRow}>
                                                <View style={[styles.avatar, { backgroundColor: cor + '20' }]}>
                                                    <Text style={[styles.avatarLetter, { color: cor }]}>
                                                        {j.nome.charAt(0).toUpperCase()}
                                                    </Text>
                                                </View>
                                                <Text style={styles.playerName}>{j.nome}</Text>
                                                <TouchableOpacity
                                                    style={styles.btnRemove}
                                                    onPress={() => removerJogador(ti, j.nome)}
                                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                                    activeOpacity={0.7}
                                                >
                                                    <Text style={styles.btnRemoveText}>×</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ))
                                    )}
                                </View>
                            </View>
                        );
                    })}

                    {/* Botão começar */}
                    <TouchableOpacity
                        style={[styles.btnComecar, !podeComecar && styles.btnComecarDisabled]}
                        onPress={iniciarPelada}
                        activeOpacity={0.85}
                        disabled={!podeComecar}
                    >
                        <Text style={[styles.btnComecarText, !podeComecar && styles.btnComecarTextDisabled]}>
                            {podeComecar ? '⚽  Começar Pelada' : 'Adicione ao menos 1 jogador em cada time'}
                        </Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COR.fundo },
    scroll: { padding: 20, paddingBottom: 60 },

    /* Header */
    header: { alignItems: 'center', paddingTop: 8, paddingBottom: 28 },
    headerEmoji: { fontSize: 48, marginBottom: 10 },
    headerTitle: { fontSize: 32, fontWeight: '900', color: COR.texto, letterSpacing: -1 },
    headerSub: { fontSize: 13, color: COR.textoSecundario, marginTop: 6, letterSpacing: 0.5 },

    /* Card de time */
    teamCard: {
        backgroundColor: COR.superficie,
        borderRadius: 20,
        borderWidth: 1.5,
        marginBottom: 16,
        overflow: 'hidden',
    },
    teamHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        gap: 10,
    },
    teamColorDot: { width: 10, height: 10, borderRadius: 5 },
    teamName: { fontSize: 16, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1, flex: 1 },
    teamCountBadge: {
        backgroundColor: COR.superficieAlt,
        borderRadius: 10,
        minWidth: 28,
        paddingHorizontal: 8,
        paddingVertical: 3,
        alignItems: 'center',
    },
    teamCountText: { fontSize: 13, fontWeight: '800' },

    teamBody: { padding: 14, paddingTop: 4 },

    /* Input */
    inputRow: { flexDirection: 'row', gap: 8, marginBottom: 12, marginTop: 8 },
    input: {
        flex: 1,
        backgroundColor: COR.superficieAlt,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COR.borda,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        fontWeight: '600',
        color: COR.texto,
    },
    btnAdd: {
        width: 46,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnAddText: { fontSize: 22, fontWeight: '900', color: '#fff', lineHeight: 24 },

    /* Lista de jogadores */
    emptyText: {
        fontSize: 12,
        color: COR.textoTerciario,
        textAlign: 'center',
        paddingVertical: 10,
    },
    playerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COR.superficieAlt,
        borderRadius: 12,
        padding: 10,
        marginBottom: 7,
        gap: 10,
        borderWidth: 1,
        borderColor: COR.borda,
    },
    avatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    avatarLetter: { fontSize: 13, fontWeight: '800' },
    playerName: { flex: 1, fontSize: 14, fontWeight: '700', color: COR.texto },
    btnRemove: {
        width: 26, height: 26, borderRadius: 13,
        backgroundColor: COR.vermelhoClaro,
        alignItems: 'center', justifyContent: 'center',
    },
    btnRemoveText: { fontSize: 16, fontWeight: '900', color: COR.vermelho, lineHeight: 18 },

    /* Botão começar */
    btnComecar: {
        backgroundColor: COR.verde,
        borderRadius: 16,
        paddingVertical: 19,
        paddingHorizontal: 16,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: COR.verde,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 14,
        elevation: 4,
    },
    btnComecarDisabled: {
        backgroundColor: COR.superficieAlt,
        borderWidth: 1,
        borderColor: COR.borda,
        shadowOpacity: 0,
        elevation: 0,
    },
    btnComecarText: { color: '#fff', fontSize: 17, fontWeight: '900', letterSpacing: 0.3, textAlign: 'center' },
    btnComecarTextDisabled: { color: COR.textoTerciario, fontSize: 14, fontWeight: '700' },
});
