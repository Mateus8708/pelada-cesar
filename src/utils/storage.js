import { Platform } from 'react-native';

const CHAVE = '@pelada-cesar/estado';

export function carregarEstado() {
    if (Platform.OS !== 'web') return null;
    try {
        const raw = window.localStorage.getItem(CHAVE);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function salvarEstado(estado) {
    if (Platform.OS !== 'web') return;
    try {
        window.localStorage.setItem(CHAVE, JSON.stringify(estado));
    } catch {
        // localStorage indisponível (modo privado, quota cheia etc.) — ignora
    }
}

export function limparEstado() {
    if (Platform.OS !== 'web') return;
    try {
        window.localStorage.removeItem(CHAVE);
    } catch {
        // ignora
    }
}
