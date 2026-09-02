import { Alert, Platform } from 'react-native';

export function avisar(titulo, mensagem) {
    if (Platform.OS === 'web') {
        window.alert(mensagem ? `${titulo}\n\n${mensagem}` : titulo);
        return;
    }
    Alert.alert(titulo, mensagem);
}

export function confirmar(titulo, mensagem, onConfirmar, onCancelar, opts = {}) {
    const { textoConfirmar = 'Confirmar', textoCancelar = 'Cancelar', destrutivo = false } = opts;

    if (Platform.OS === 'web') {
        const ok = window.confirm(mensagem ? `${titulo}\n\n${mensagem}` : titulo);
        if (ok) onConfirmar?.();
        else onCancelar?.();
        return;
    }

    Alert.alert(titulo, mensagem, [
        { text: textoCancelar, style: 'cancel', onPress: onCancelar },
        { text: textoConfirmar, onPress: onConfirmar, style: destrutivo ? 'destructive' : 'default' },
    ]);
}

export function perguntarNovaPelada(onNovaTurma, onMesmosJogadores) {
    const titulo = '🔄 Nova Pelada';
    const mensagem = 'Deseja manter os mesmos jogadores?';

    if (Platform.OS === 'web') {
        const manter = window.confirm(
            `${titulo}\n\n${mensagem}\n\nOK = Mesmos jogadores\nCancelar = Nova turma`
        );
        if (manter) onMesmosJogadores?.();
        else onNovaTurma?.();
        return;
    }

    Alert.alert(titulo, mensagem, [
        { text: 'Nova turma', style: 'destructive', onPress: onNovaTurma },
        { text: 'Mesmos jogadores', onPress: onMesmosJogadores },
    ]);
}
