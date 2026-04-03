import React, { useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { PeladaContext } from '../context/PeladaContext';
import { s } from '../styles/globalStyles';
import { COR } from '../constants/theme';

export default function CadastroScreen() {
    const { jogadores, atualizarNome, atualizarNota, formarTimes } = useContext(PeladaContext);

    return (
        <SafeAreaView style={s.safe}>
            <ScrollView contentContainerStyle={s.scrollContent}>
                <View style={s.header}>
                    <Text style={s.headerEmoji}>⚽</Text>
                    <Text style={s.headerTitulo}>Pelada FC</Text>
                    <Text style={s.headerSub}>Cadastre os 15 jogadores</Text>
                </View>
                {jogadores.map((j, i) => (
                    <View key={j.id} style={s.jogadorRow}>
                        <Text style={s.jogadorNum}>{i + 1}</Text>
                        <TextInput
                            style={s.inputNome}
                            placeholder={`Jogador ${i + 1}`}
                            placeholderTextColor={COR.cinzaTexto}
                            value={j.nome}
                            onChangeText={v => atualizarNome(j.id, v)}
                        />
                        <View style={s.estrelasRow}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <TouchableOpacity key={star} onPress={() => atualizarNota(j.id, star)}>
                                    <Text style={[s.estrela, j.nota >= star && s.estrelaMarcada]}>★</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}
                <TouchableOpacity style={s.btnVerde} onPress={formarTimes}>
                    <Text style={s.btnVerdeTexto}>Formar Times 🎲</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
