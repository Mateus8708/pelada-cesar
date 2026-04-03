import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { PeladaContext } from '../context/PeladaContext';
import { s } from '../styles/globalStyles';
import { COR } from '../constants/theme';

export default function DestaquesScreen() {
    const { getArtilheiro, getGarcao, setTela } = useContext(PeladaContext);
    const artilheiros = getArtilheiro();
    const garcoes = getGarcao();

    return (
        <SafeAreaView style={s.safe}>
            <ScrollView contentContainerStyle={s.scrollContent}>
                <View style={s.header}>
                    <Text style={s.headerEmoji}>⭐</Text>
                    <Text style={s.headerTitulo}>Destaques da Pelada</Text>
                </View>
                <View style={[s.card, { borderLeftColor: COR.amarelo }]}>
                    <Text style={[s.cardTitulo, { color: COR.amarelo }]}>
                        ⚽ {artilheiros.length > 1 ? 'Artilheiros' : 'Artilheiro'}
                    </Text>
                    {artilheiros.map((j, i) => (
                        <Text key={i} style={s.destaqueNome}>
                            {j.nome} — {j.gols} gols | {j.assistencias} assistências
                        </Text>
                    ))}
                </View>
                <View style={[s.card, { borderLeftColor: COR.verde }]}>
                    <Text style={[s.cardTitulo, { color: COR.verde }]}>
                        👟 {garcoes.length > 1 ? 'Garçons' : 'Garçom'}
                    </Text>
                    {garcoes.map((j, i) => (
                        <Text key={i} style={s.destaqueNome}>
                            {j.nome} — {j.assistencias} assistências | {j.gols} gols
                        </Text>
                    ))}
                </View>
                <TouchableOpacity style={s.btnVerde} onPress={() => setTela('ranking')}>
                    <Text style={s.btnVerdeTexto}>Ver Ranking Completo 📊</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
