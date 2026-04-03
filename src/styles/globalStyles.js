import { StyleSheet } from 'react-native';
import { COR } from '../constants/theme';

export const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COR.branco },
    scrollContent: { padding: 16, paddingBottom: 40 },
    centrado: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },

    header: { alignItems: 'center', marginBottom: 20 },
    headerEmoji: { fontSize: 40 },
    headerTitulo: { fontSize: 22, fontWeight: '700', color: COR.preto, marginTop: 6 },
    headerSub: { fontSize: 13, color: COR.cinzaTexto, marginTop: 2 },

    bannerSelecao: {
        marginTop: 12, backgroundColor: COR.amarelo + '22',
        borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8,
        borderWidth: 1, borderColor: COR.amarelo, alignItems: 'center',
    },
    bannerSelecaoTexto: { fontSize: 13, fontWeight: '700', color: COR.preto },
    bannerSelecaoSub: { fontSize: 11, color: COR.textoSecundario, marginTop: 2 },
    tagSelecionado: {
        fontSize: 10, fontWeight: '700', color: COR.amarelo,
        backgroundColor: COR.amarelo + '22', borderRadius: 6,
        paddingHorizontal: 6, paddingVertical: 2, marginLeft: 6,
    },

    jogadorRow: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: COR.cinzaClaro, borderRadius: 10,
        paddingHorizontal: 10, paddingVertical: 8, marginBottom: 8,
    },
    jogadorNum: { width: 24, fontSize: 13, color: COR.cinzaTexto, fontWeight: '600' },
    inputNome: { flex: 1, fontSize: 14, color: COR.preto, paddingVertical: 4 },
    estrelasRow: { flexDirection: 'row', gap: 2 },
    estrela: { fontSize: 18, color: COR.cinza },
    estrelaMarcada: { color: COR.amarelo },

    card: {
        backgroundColor: COR.branco, borderRadius: 12,
        borderWidth: 1, borderColor: COR.cinza,
        borderLeftWidth: 4, padding: 14, marginBottom: 14,
    },
    cardTitulo: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
    cardNota: { fontSize: 12, color: COR.cinzaTexto, marginBottom: 8 },

    jogadorCardRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 8, borderTopWidth: 0.5, borderTopColor: COR.cinza,
        borderRadius: 6, paddingHorizontal: 4,
    },
    jogadorCardNome: { flex: 1, fontSize: 14, color: COR.preto },
    jogadorCardNota: { fontSize: 12, color: COR.amarelo },

    timeCabecalho: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 10,
    },
    timePlacar: { fontSize: 15, fontWeight: '700', color: COR.preto },

    placarRow: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: COR.cinzaClaro, borderRadius: 10,
        padding: 10, marginBottom: 10,
    },
    placarItem: { flex: 1, alignItems: 'center', gap: 4 },
    placarLabel: { fontSize: 11, fontWeight: '700', color: COR.cinzaTexto, letterSpacing: 1 },
    placarValor: { fontSize: 26, fontWeight: '800', color: COR.preto },
    placarBotoes: { flexDirection: 'row', gap: 6 },
    placarDivisor: { width: 1, height: 50, backgroundColor: COR.cinza },

    btnContador: {
        width: 32, height: 32, borderRadius: 8,
        backgroundColor: COR.verdeClaro, borderWidth: 1, borderColor: COR.verde,
        alignItems: 'center', justifyContent: 'center',
    },
    btnContadorMenos: { backgroundColor: COR.vermelhoClaro, borderColor: COR.vermelho },
    btnContadorTexto: { fontSize: 18, fontWeight: '700', color: COR.verde },

    separador: { height: 0.5, backgroundColor: COR.cinza, marginVertical: 8 },

    jogadorPeladaRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 7, borderTopWidth: 0.5, borderTopColor: COR.cinza,
    },
    jogadorPeladaNome: { flex: 1, fontSize: 13, color: COR.preto },
    jogadorContadores: { flexDirection: 'row', gap: 10 },
    contadorGrupo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    contadorEmoji: { fontSize: 14 },
    contadorValor: { fontSize: 14, fontWeight: '700', color: COR.preto, minWidth: 16, textAlign: 'center' },

    btnMini: {
        width: 26, height: 26, borderRadius: 6,
        backgroundColor: '#fff3cd', borderWidth: 1, borderColor: COR.amarelo,
        alignItems: 'center', justifyContent: 'center',
    },
    btnMiniVerde: { backgroundColor: COR.verdeClaro, borderColor: COR.verde },
    btnMiniMenos: { backgroundColor: COR.vermelhoClaro, borderColor: COR.vermelho },
    btnMiniTexto: { fontSize: 14, fontWeight: '700', color: '#856404' },

    btnVerde: {
        backgroundColor: COR.verde, borderRadius: 14,
        paddingVertical: 14, alignItems: 'center', marginTop: 10,
    },
    btnVerdeTexto: { color: COR.branco, fontSize: 16, fontWeight: '700' },
    btnCinza: {
        backgroundColor: COR.cinzaClaro, borderRadius: 14,
        paddingVertical: 14, alignItems: 'center', marginTop: 10,
        borderWidth: 1, borderColor: COR.cinza,
    },
    btnCinzaTexto: { color: COR.textoSecundario, fontSize: 15, fontWeight: '600' },

    penaltiTitulo: { fontSize: 24, fontWeight: '700', color: COR.preto, textAlign: 'center' },
    penaltiSub: { fontSize: 15, color: COR.textoSecundario, textAlign: 'center', marginVertical: 16, lineHeight: 24 },
    penaltiVencedor: { fontSize: 20, fontWeight: '700', color: COR.verde, textAlign: 'center', marginVertical: 20 },

    podioTitulo: { fontSize: 26, fontWeight: '800', color: COR.preto, marginBottom: 24 },
    podioCard: {
        width: '100%', backgroundColor: COR.branco,
        borderRadius: 14, borderWidth: 2,
        padding: 16, marginBottom: 12, alignItems: 'center',
    },
    podioNome: { fontSize: 20, fontWeight: '700', marginTop: 6 },
    podioInfo: { fontSize: 13, color: COR.cinzaTexto, marginTop: 4 },

    destaqueNome: { fontSize: 15, color: COR.preto, paddingVertical: 5 },

    rankRow: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: COR.cinzaClaro, borderRadius: 10,
        paddingHorizontal: 12, paddingVertical: 10, marginBottom: 8,
    },
    rankRowTop: { backgroundColor: '#fffbea', borderWidth: 1, borderColor: COR.amarelo },
    rankPos: { fontSize: 16, fontWeight: '700', color: COR.cinzaTexto, width: 32 },
    rankNome: { fontSize: 14, fontWeight: '600', color: COR.preto },
    rankTime: { fontSize: 11, color: COR.cinzaTexto },
    rankStats: { fontSize: 13, color: COR.textoSecundario },
});
