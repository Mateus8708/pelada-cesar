import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { PeladaContext } from '../context/PeladaContext';
import { s } from '../styles/globalStyles';
import { COR, NOMES_TIMES } from '../constants/theme';

export default function RankingScreen() {
    const { getRankingCompleto, novaPelada } = useContext(PeladaContext);
    const ranking = getRankingCompleto();

    return (
        <SafeAreaView style={s.safe}>
            <ScrollView contentContainerStyle={s.scrollContent}>
                <View style={s.header}>
                    <Text style={s.headerEmoji}>📊</Text>
                    <Text style={s.headerTitulo}>Ranking Geral</Text>
                </View>
                {ranking.map((j, i) => (
                    <View key={i} style={[s.rankRow, i === 0 && s.rankRowTop]}>
                        <Text style={s.rankPos}>{i + 1}º</Text>
                        <View style={{ flex: 1 }}>
                            <Text style={s.rankNome}>{j.nome}</Text>
                            <Text style={s.rankTime}>{NOMES_TIMES[j.time]}</Text>
                        </View>
                        <Text style={s.rankStats}>⚽ {j.gols}  👟 {j.assistencias}</Text>
                    </View>
                ))}
                <TouchableOpacity style={[s.btnVerde, { backgroundColor: COR.cinzaTexto, marginTop: 16 }]} onPress={novaPelada}>
                    <Text style={s.btnVerdeTexto}>🔄 Nova Pelada</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
