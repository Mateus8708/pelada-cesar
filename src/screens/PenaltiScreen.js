import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { PeladaContext } from '../context/PeladaContext';
import { s } from '../styles/globalStyles';
import { NOMES_TIMES } from '../constants/theme';

export default function PenaltiScreen() {
    const { penaltiTimes, penaltiResultado, resolverPenalti, setTela } = useContext(PeladaContext);

    return (
        <SafeAreaView style={s.safe}>
            <View style={s.centrado}>
                <Text style={{ fontSize: 72, marginBottom: 16 }}>🥅</Text>
                <Text style={s.penaltiTitulo}>Empate na liderança!</Text>
                <Text style={s.penaltiSub}>
                    {penaltiTimes.map(i => NOMES_TIMES[i]).join(' x ')} estão empatados.{'\n'}Vamos para os pênaltis!
                </Text>
                {penaltiResultado === null ? (
                    <TouchableOpacity style={s.btnVerde} onPress={resolverPenalti}>
                        <Text style={s.btnVerdeTexto}>⚽ Cobrar Pênaltis</Text>
                    </TouchableOpacity>
                ) : (
                    <>
                        <Text style={s.penaltiVencedor}>
                            🏆 {NOMES_TIMES[penaltiResultado]} venceu nos pênaltis!
                        </Text>
                        <TouchableOpacity style={s.btnVerde} onPress={() => setTela('podio')}>
                            <Text style={s.btnVerdeTexto}>Ver Pódio 🏆</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </SafeAreaView>
    );
}
