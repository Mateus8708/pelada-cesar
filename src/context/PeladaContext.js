import { createContext, useEffect, useRef, useState } from 'react';
import { sortearTimes, calcularPontos } from '../utils/helpers';
import { NOMES_TIMES } from '../constants/theme';
import { avisar, confirmar, perguntarNovaPelada } from '../utils/dialogo';
import { carregarEstado, salvarEstado } from '../utils/storage';

export const PeladaContext = createContext({});

const PLACAR_INICIAL = [
    { vitorias: 0, empates: 0, derrotas: 0, shootouts: 0 },
    { vitorias: 0, empates: 0, derrotas: 0, shootouts: 0 },
    { vitorias: 0, empates: 0, derrotas: 0, shootouts: 0 },
];

export function PeladaProvider({ children }) {
    // Lê o estado salvo uma única vez, na primeira renderização
    const salvoRef = useRef();
    if (salvoRef.current === undefined) {
        salvoRef.current = carregarEstado() ?? {};
    }
    const salvo = salvoRef.current;

    const [tela, setTela] = useState(salvo.tela ?? 'cadastro');
    const [jogadores, setJogadores] = useState(
        Array.from({ length: 15 }, (_, i) => ({ nome: '', nota: 0, id: i }))
    );
    const [times, setTimes] = useState(salvo.times ?? [[], [], []]);
    const [placar, setPlacar] = useState(salvo.placar ?? PLACAR_INICIAL);
    const [jogadoresAtivos, setJogadoresAtivos] = useState(salvo.jogadoresAtivos ?? []);
    const [penaltiTimes, setPenaltiTimes] = useState(salvo.penaltiTimes ?? []);
    const [penaltiResultado, setPenaltiResultado] = useState(salvo.penaltiResultado ?? null);
    const [jogadorSelecionado, setJogadorSelecionado] = useState(null);

    useEffect(() => {
        salvarEstado({ tela, times, placar, jogadoresAtivos, penaltiTimes, penaltiResultado });
    }, [tela, times, placar, jogadoresAtivos, penaltiTimes, penaltiResultado]);

    function atualizarNome(id, nome) {
        setJogadores(prev => prev.map(j => j.id === id ? { ...j, nome } : j));
    }

    function atualizarNota(id, nota) {
        setJogadores(prev => prev.map(j => j.id === id ? { ...j, nota } : j));
    }

    function formarTimes() {
        const validos = jogadores.filter(j => j.nome.trim().length > 0);
        if (validos.length < 15) {
            avisar('Atenção', 'Preencha os 15 jogadores antes de sortear.');
            return;
        }
        setTimes(sortearTimes(validos));
        setTela('sorteio');
    }

    function adicionarJogador(timeIndex, nome) {
        const nomeLimpo = nome.trim();
        if (!nomeLimpo) return false;

        const jaExiste = times.some(time =>
            time.some(j => j.nome.toLowerCase() === nomeLimpo.toLowerCase())
        );
        if (jaExiste) {
            avisar('Nome repetido', `"${nomeLimpo}" já está cadastrado em outro time.`);
            return false;
        }

        setTimes(prev => {
            const novo = prev.map(t => [...t]);
            novo[timeIndex] = [...novo[timeIndex], { nome: nomeLimpo, time: timeIndex, gols: 0, assistencias: 0 }];
            return novo;
        });
        return true;
    }

    function removerJogador(timeIndex, nome) {
        setTimes(prev => {
            const novo = prev.map(t => [...t]);
            novo[timeIndex] = novo[timeIndex].filter(j => j.nome !== nome);
            return novo;
        });
    }

    function iniciarPelada() {
        setJogadoresAtivos(times.flat());
        setTela('pelada');
    }

    function irParaPelada() {
        setJogadoresAtivos(times.flat());
        setTela('pelada');
    }

    function trocarJogadores(jogadorA, jogadorB) {
        setTimes(prev => {
            const novo = prev.map(t => [...t]);
            const tA = jogadorA.time;
            const tB = jogadorB.time;
            const iA = novo[tA].findIndex(j => j.nome === jogadorA.nome);
            const iB = novo[tB].findIndex(j => j.nome === jogadorB.nome);
            const tempA = { ...novo[tA][iA], time: tB };
            const tempB = { ...novo[tB][iB], time: tA };
            novo[tA][iA] = tempB;
            novo[tB][iB] = tempA;
            return novo;
        });
        setJogadorSelecionado(null);
    }

    function selecionarJogador(jogador) {
        if (!jogadorSelecionado) {
            setJogadorSelecionado(jogador);
            return;
        }
        if (jogadorSelecionado.nome === jogador.nome) {
            setJogadorSelecionado(null);
            return;
        }
        if (jogadorSelecionado.time === jogador.time) {
            avisar('Atenção', 'Selecione um jogador de outro time para trocar.');
            setJogadorSelecionado(null);
            return;
        }
        confirmar(
            'Confirmar troca',
            `Trocar ${jogadorSelecionado.nome} (${NOMES_TIMES[jogadorSelecionado.time]}) com ${jogador.nome} (${NOMES_TIMES[jogador.time]})?`,
            () => trocarJogadores(jogadorSelecionado, jogador),
            () => setJogadorSelecionado(null),
            { textoConfirmar: 'Trocar' }
        );
    }

    function adicionarGol(nomeJogador) {
        setJogadoresAtivos(prev =>
            prev.map(j => j.nome === nomeJogador ? { ...j, gols: j.gols + 1 } : j)
        );
    }

    function removerGol(nomeJogador) {
        setJogadoresAtivos(prev =>
            prev.map(j => j.nome === nomeJogador && j.gols > 0 ? { ...j, gols: j.gols - 1 } : j)
        );
    }

    function adicionarAssistencia(nomeJogador) {
        setJogadoresAtivos(prev =>
            prev.map(j => j.nome === nomeJogador ? { ...j, assistencias: j.assistencias + 1 } : j)
        );
    }

    function removerAssistencia(nomeJogador) {
        setJogadoresAtivos(prev =>
            prev.map(j => j.nome === nomeJogador && j.assistencias > 0 ? { ...j, assistencias: j.assistencias - 1 } : j)
        );
    }

    function adicionarVitoria(ti) {
        setPlacar(prev => prev.map((p, i) => i === ti ? { ...p, vitorias: p.vitorias + 1 } : p));
    }

    function removerVitoria(ti) {
        setPlacar(prev => prev.map((p, i) => i === ti && p.vitorias > 0 ? { ...p, vitorias: p.vitorias - 1 } : p));
    }

    function adicionarEmpate(ti) {
        setPlacar(prev => prev.map((p, i) => i === ti ? { ...p, empates: p.empates + 1 } : p));
    }

    function removerEmpate(ti) {
        setPlacar(prev => prev.map((p, i) => i === ti && p.empates > 0 ? { ...p, empates: p.empates - 1 } : p));
    }

    function adicionarShootout(ti) {
        setPlacar(prev => prev.map((p, i) => i === ti ? { ...p, shootouts: (p.shootouts || 0) + 1 } : p));
    }

    function removerShootout(ti) {
        setPlacar(prev => prev.map((p, i) => i === ti && (p.shootouts || 0) > 0 ? { ...p, shootouts: p.shootouts - 1 } : p));
    }

    function encerrarPelada() {
        confirmar(
            '📯 Encerrar pelada?',
            'Deseja realmente encerrar a pelada?',
            () => {
                const pontos = placar.map((p, i) => ({
                    index: i,
                    pontos: calcularPontos(p.vitorias, p.empates, p.shootouts),
                }));
                const maxPts = Math.max(...pontos.map(p => p.pontos));
                const lideres = pontos.filter(p => p.pontos === maxPts);
                if (lideres.length > 1) {
                    setPenaltiTimes(lideres.map(l => l.index));
                    setPenaltiResultado(null);
                    setTela('penalti');
                } else {
                    setTela('podio');
                }
            },
            undefined,
            { textoConfirmar: 'Encerrar', destrutivo: true }
        );
    }

    function resolverPenalti() {
        const vencedor = penaltiTimes[Math.floor(Math.random() * penaltiTimes.length)];
        setPenaltiResultado(vencedor);
    }

    function getPodiumOrdem() {
        const pontos = placar.map((p, i) => ({
            index: i,
            pontos: calcularPontos(p.vitorias, p.empates, p.shootouts),
            vitorias: p.vitorias,
            empates: p.empates,
            derrotas: p.derrotas,
            shootouts: p.shootouts,
        }));
        if (penaltiResultado !== null) {
            return [...pontos].sort((a, b) => {
                if (a.index === penaltiResultado) return -1;
                if (b.index === penaltiResultado) return 1;
                return b.pontos - a.pontos;
            });
        }
        return [...pontos].sort((a, b) => b.pontos - a.pontos);
    }

    function getArtilheiro() {
        const sorted = [...jogadoresAtivos].sort((a, b) =>
            b.gols !== a.gols ? b.gols - a.gols : b.assistencias - a.assistencias
        );
        const top = sorted[0];
        if (!top) return [];
        return sorted.filter(j => j.gols === top.gols && j.assistencias === top.assistencias);
    }

    function getGarcao() {
        const sorted = [...jogadoresAtivos].sort((a, b) =>
            b.assistencias !== a.assistencias ? b.assistencias - a.assistencias : b.gols - a.gols
        );
        const top = sorted[0];
        if (!top) return [];
        return sorted.filter(j => j.assistencias === top.assistencias && j.gols === top.gols);
    }

    function getTopArtilheiros(n = 3) {
        return [...jogadoresAtivos]
            .filter(j => j.gols > 0)
            .sort((a, b) => b.gols !== a.gols ? b.gols - a.gols : b.assistencias - a.assistencias)
            .slice(0, n);
    }

    function getTopGarcons(n = 3) {
        return [...jogadoresAtivos]
            .filter(j => j.assistencias > 0)
            .sort((a, b) => b.assistencias !== a.assistencias ? b.assistencias - a.assistencias : b.gols - a.gols)
            .slice(0, n);
    }

    function getRankingCompleto() {
        return [...jogadoresAtivos].sort((a, b) =>
            b.gols !== a.gols ? b.gols - a.gols : b.assistencias - a.assistencias
        );
    }

    function rebalancearTimes() {
        const validos = jogadores.filter(j => j.nome.trim().length > 0);
        if (validos.length < 15) return;

        const grupos = {};
        validos.forEach(j => {
            if (!grupos[j.nota]) grupos[j.nota] = [];
            grupos[j.nota].push(j);
        });
        Object.values(grupos).forEach(grupo => {
            for (let i = grupo.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [grupo[i], grupo[j]] = [grupo[j], grupo[i]];
            }
        });
        const embaralhados = Object.keys(grupos)
            .sort((a, b) => Number(b) - Number(a))
            .flatMap(nota => grupos[nota]);

        const novosTimesArr = [[], [], []];
        const ordem = [0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2];
        embaralhados.forEach((j, i) => {
            const t = ordem[i];
            novosTimesArr[t].push({ ...j, time: t, gols: 0, assistencias: 0 });
        });
        setTimes(novosTimesArr);
        setJogadorSelecionado(null);
    }

    function resetarJogo(manterJogadores = false) {
        if (!manterJogadores) {
            setJogadores(Array.from({ length: 15 }, (_, i) => ({ nome: '', nota: 0, id: i })));
            setTimes([[], [], []]);
        }
        setPlacar(PLACAR_INICIAL);
        setJogadoresAtivos([]);
        setPenaltiTimes([]);
        setPenaltiResultado(null);
        setJogadorSelecionado(null);
        setTela('cadastro');
    }

    function novaPelada() {
        perguntarNovaPelada(
            () => resetarJogo(false),
            () => resetarJogo(true),
        );
    }

    return (
        <PeladaContext.Provider
            value={{
                tela, setTela,
                jogadores, setJogadores,
                times, setTimes,
                placar, setPlacar,
                jogadoresAtivos, setJogadoresAtivos,
                penaltiTimes, setPenaltiTimes,
                penaltiResultado, setPenaltiResultado,
                jogadorSelecionado, setJogadorSelecionado,

                atualizarNome,
                atualizarNota,
                formarTimes,
                adicionarJogador,
                removerJogador,
                iniciarPelada,
                irParaPelada,
                trocarJogadores,
                selecionarJogador,
                adicionarGol, removerGol,
                adicionarAssistencia, removerAssistencia,
                adicionarVitoria, removerVitoria,
                adicionarEmpate, removerEmpate,
                adicionarShootout, removerShootout,
                encerrarPelada,
                resolverPenalti,
                getPodiumOrdem,
                getArtilheiro,
                getGarcao,
                getTopArtilheiros,
                getTopGarcons,
                getRankingCompleto,
                rebalancearTimes,
                novaPelada,
            }}
        >
            {children}
        </PeladaContext.Provider>
    );
}
