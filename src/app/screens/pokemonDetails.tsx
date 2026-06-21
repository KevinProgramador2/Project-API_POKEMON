import { View, Text, ActivityIndicator, Image, ScrollView, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";

const typeColors: Record<string, string> = {
    normal: "#A8A77A", fire: "#EE8130", water: "#6390F0", electric: "#F7D02C",
    grass: "#7AC74C", ice: "#96D9D6", fighting: "#C22E28", poison: "#A33EA1",
    ground: "#E2BF65", flying: "#A98FF3", psychic: "#F95587", bug: "#A6B91A",
    rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC", dark: "#705746",
    steel: "#B7B7CE", fairy: "#D685AD",
};

const STAT_LABELS: Record<string, string> = {
    hp: 'HP', attack: 'Ataque', defense: 'Defesa',
    'special-attack': 'Sp.Atk', 'special-defense': 'Sp.Def', speed: 'Speed',
};

const STAT_COLORS = ['#78C850', '#F08030', '#6890F0', '#F8D030', '#98D8D8', '#C03028'];

export default function PokemonDetails() {
    const route = useRoute<any>();
    const [pokemon, setPokemon] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { pokemonUrl } = route.params;

    async function carregarDetalhesPokemon() {
        try {
            const response = await fetch(pokemonUrl);
            const data = await response.json();
            setPokemon(data);
        } catch (error) {
            console.error("Erro ao buscar detalhes: ", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarDetalhesPokemon();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFF" />
            </View>
        );
    }

    const mainType = pokemon?.types?.[0]?.type?.name || "normal";
    const pokemonColor = typeColors[mainType] || "#333";

    return (
        <ScrollView style={styles.container}>
            {/* TOPO COLORIDO (HEADER REAPROVEITADO) */}
            <View style={[styles.header, { backgroundColor: pokemonColor }]}>
                <Image
                    style={styles.pokemonImage}
                    source={{
                        uri: pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default,
                    }}
                />
                <Text style={styles.pokemonTitle}>{pokemon.name}</Text>
                <Text style={styles.pokemonId}>#{pokemon.id.toString().padStart(3, '0')}</Text>
            </View>

            {/* CONTEÚDO DA PÁGINA (BODY REAPROVEITADO) */}
            <View style={styles.body}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoText}>Altura: {pokemon.height}</Text>
                    <Text style={styles.infoText}>Peso: {pokemon.weight}</Text>
                </View>
                <Text style={[styles.infoText, { marginBottom: 12 }]}>
                    Experiência Base: {pokemon.base_experience}
                </Text>

                {/* TIPOS */}
                <Text style={styles.sectionTitle}>Tipos</Text>
                <View style={styles.typesContainer}>
                    {pokemon.types.map((t: any) => (
                        <View key={t.type.name} style={[styles.typeBadge, { backgroundColor: typeColors[t.type.name] || "#333" }]}>
                            <Text style={styles.typeText}>{t.type.name}</Text>
                        </View>
                    ))}
                </View>

                {/* HABILIDADES */}
                <Text style={styles.sectionTitle}>Habilidades</Text>
                {pokemon.abilities.map((a: any) => (
                    <Text key={a.ability.name} style={styles.infoTextDesc}>
                        • {a.ability.name}
                    </Text>
                ))}

                {/* BASE STATS (Mapeamento completo e corrigido) */}
                <Text style={styles.sectionTitle}>Base Stats</Text>
                {pokemon.stats.map((s: any, i: number) => (
                    <View key={s.stat.name} style={styles.statRow}>
                        <Text style={styles.statLabel}>{STAT_LABELS[s.stat.name] ?? s.stat.name}</Text>
                        <View style={styles.statBarBg}>
                            <View style={[styles.statBar, {
                                width: `${Math.min(s.base_stat / 150 * 100, 100)}%` as any,
                                backgroundColor: STAT_COLORS[i % STAT_COLORS.length]
                            }]} />
                        </View>
                        <Text style={styles.statVal}>{s.base_stat}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

// ESTILIZAÇÃO COMPATÍVEL COM O SEU DESIGN ANTIGO DE MODAL
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1e1e1e",
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: "#1e1e1e",
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 40,
        paddingBottom: 24,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    pokemonImage: {
        width: 180,
        height: 180,
        marginBottom: 6,
        resizeMode: 'contain',
    },
    pokemonTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#FFFFFF',
        textTransform: 'capitalize',
        marginTop: 4,
    },
    pokemonId: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: 'normal',
        marginTop: 2,
    },
    body: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },
    infoRow: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 4,
    },
    infoText: {
        fontSize: 16,
        color: '#AAA',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 24,
        marginBottom: 12,
        color: '#FFFFFF',
    },
    typesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginVertical: 4,
    },
    typeBadge: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    typeText: {
        color: '#FFF',
        textTransform: 'capitalize',
        fontWeight: 'bold',
    },
    infoTextDesc: {
        fontSize: 14,
        color: '#AAA',
        textTransform: 'capitalize',
        lineHeight: 22,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    statLabel: {
        color: '#888',
        fontSize: 12,
        width: 55,
        textAlign: 'right',
        marginRight: 8,
    },
    statBarBg: {
        flex: 1,
        height: 8,
        backgroundColor: '#333',
        borderRadius: 4,
        overflow: 'hidden',
    },
    statBar: {
        height: '100%',
        borderRadius: 4,
    },
    statVal: {
        color: '#fff',
        fontSize: 12,
        width: 28,
        textAlign: 'right',
        marginLeft: 6,
    },
});