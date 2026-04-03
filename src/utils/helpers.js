export function sortearTimes(jogadores) {
    const ordenados = [...jogadores].sort((a, b) => b.nota - a.nota);
    const times = [[], [], []];
    const ordem = [0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2];
    ordenados.forEach((j, i) => {
        const t = ordem[i];
        times[t].push({ ...j, time: t, gols: 0, assistencias: 0 });
    });
    return times;
}

export function calcularPontos(vitorias, empates, shootouts = 0) {
    return (vitorias * 3) + (empates * 1) + (shootouts * 1);
}
