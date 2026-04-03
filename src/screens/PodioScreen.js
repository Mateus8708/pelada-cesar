import React, { useContext, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { PeladaContext } from '../context/PeladaContext';
import { s } from '../styles/globalStyles';
import { NOMES_TIMES, CORES_TIMES } from '../constants/theme';

export default function PodioScreen() {
    const { getPodiumOrdem, setTela } = useContext(PeladaContext);
    const ordem = getPodiumOrdem();
    const medalhas = ['🥇', '🥈', '🥉'];

    const animPodio = [
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current,
    ];

    useEffect(() => {
        Animated.stagger(250, animPodio.map(a =>
            Animated.spring(a, { toValue: 1, useNativeDriver: true, tension: 60, friction: 7 })
        )).start();
    }, []);

    return (
        <SafeAreaView style={s.safe}>
            <View style={s.centrado}>
                <Text style={s.podioTitulo}>🏆 Pódio Final</Text>
                {ordem.map((t, pos) => (
                    <Animated.View
                        key={t.index}
                        style={[
                            s.podioCard,
                            { borderColor: CORES_TIMES[t.index] },
                            {
                                opacity: animPodio[pos],
                                transform: [{
                                    scale: animPodio[pos].interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }),
                                }],
                            },
                        ]}
                    >
                        <Text style={{ fontSize: 40 }}>{medalhas[pos]}</Text>
                        <Text style={[s.podioNome, { color: CORES_TIMES[t.index] }]}>{NOMES_TIMES[t.index]}</Text>
                        <Text style={s.podioInfo}>{t.vitorias}V | {t.empates}E | {t.shootouts || 0}SO | {t.derrotas}D | {t.pontos}Pts</Text>
                    </Animated.View>
                ))}
                <TouchableOpacity style={s.btnVerde} onPress={() => setTela('destaques')}>
                    <Text style={s.btnVerdeTexto}>Próximo ▶</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
