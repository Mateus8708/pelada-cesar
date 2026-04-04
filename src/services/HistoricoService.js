import { doc, getDoc, setDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "./firebaseConfig";

/**
 * Retorna o mês atual no formato YYYY-MM
 */
function getMesAtualStr() {
    const data = new Date();
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    return `${ano}-${mes}`;
}

/**
 * Salva e acumula as estatísticas de uma pelada no mês atual.
 * @param {Array} jogadores - Array de jogadores vindo de PeladaContext (precisa conter gols, assistencias e penaltis)
 */
export async function salvarHistoricoMensal(jogadores) {
    try {
        const mesStr = getMesAtualStr();
        const docRef = doc(db, "historico_mensal", mesStr);

        const docSnap = await getDoc(docRef);
        let dadosAtuais = { totalPeladasNoMes: 0, jogadores: {} };

        if (docSnap.exists()) {
            dadosAtuais = docSnap.data();
        }

        // Incrementa o contador de peladas do mês
        dadosAtuais.totalPeladasNoMes += 1;

        // Itera sobre os jogadores para somar as estatísticas
        jogadores.forEach(j => {
            // Ignora jogadores vazios ou sem nome
            if (!j.nome || j.nome.trim() === '') return;

            const nome = j.nome.trim();

            if (!dadosAtuais.jogadores[nome]) {
                dadosAtuais.jogadores[nome] = { gols: 0, assistencias: 0, penaltis: 0, pontos: 0 };
            }

            dadosAtuais.jogadores[nome].gols += (j.gols || 0);
            dadosAtuais.jogadores[nome].assistencias += (j.assistencias || 0);
            dadosAtuais.jogadores[nome].penaltis += (j.penaltis || 0);
            dadosAtuais.jogadores[nome].pontos += (j.pontos || 0);
        });

        // Salva de volta no Firestore na própria raiz do documento do mês
        await setDoc(docRef, dadosAtuais, { merge: true });

        console.log(`Histórico do mês ${mesStr} atualizado com sucesso!`);
        return true;
    } catch (error) {
        console.error("Erro ao salvar histórico mensal: ", error);
        return false;
    }
}

/**
 * Busca todos os históricos mensais (coleção raiz historico_mensal)
 * e retorna um array formatado pronto para o componente.
 */
export async function getTodosHistoricos() {
    try {
        const hRef = collection(db, "historico_mensal");
        // Não faremos orderBy sofisticado aqui para evitar necessidade de criar index no firebase
        // vamos trazer os docs e ordenar localmente pelo ID.
        const snapshot = await getDocs(hRef);
        const historicos = [];

        snapshot.forEach(doc => {
            historicos.push({ id: doc.id, ...doc.data() });
        });

        // Ordenar do mais recente pro mais antigo (id é YYYY-MM)
        historicos.sort((a, b) => b.id.localeCompare(a.id));
        return historicos;
    } catch (error) {
        console.error("Erro ao buscar históricos: ", error);
        return [];
    }
}
