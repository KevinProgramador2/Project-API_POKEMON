import {View, Text, ActivityIndicator, Image, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import {useEffect, useState} from "react";

const typeColors: Record<string, string> = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
};

export default function PokemonDetails() {

    const route = useRoute<any>();
    const [pokemon, setPokemon] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { pokemonUrl } = route.params;
    const mainType =
        pokemon?.types?.[0]?.type?.name || "normal";

    const pokemonColor =
        typeColors[mainType] || "#333";

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
            <View>
                <ActivityIndicator size="large"/>
            </View>
        )
    }

    {`const mainType = pokemon.types[0].type.name; const pokemonColor = typeColors[mainType] || "#333";`}

    return (
        <ScrollView
            style={{
                flex: 1,
                backgroundColor: "#1e1e1e",
            }}
        >
            {/* TOPO COLORIDO */}
            <View
                style={{
                    backgroundColor: pokemonColor,
                    paddingTop: 20,
                    paddingBottom: 30,
                    borderBottomLeftRadius: 30,
                    borderBottomRightRadius: 30,
                }}
            >
                <Image
                    style={{
                        width: 250,
                        height: 250,
                        alignSelf: "center",
                    }}
                    source={{
                        uri:
                            pokemon.sprites.other["official-artwork"]
                                .front_default ||
                            pokemon.sprites.front_default,
                    }}
                />

                <Text
                    style={{
                        fontSize: 32,
                        fontWeight: "bold",
                        color: "#FFF",
                        textAlign: "center",
                        textTransform: "capitalize",
                    }}
                >
                    {pokemon.name}
                </Text>

                <Text
                    style={{
                        textAlign: "center",
                        color: "#FFF",
                        fontSize: 18,
                    }}
                >
                    #{pokemon.id}
                </Text>
            </View>

            {/* CONTEÚDO */}
            <View
                style={{
                    padding: 20,
                }}
            >
                <Text
                    style={{
                        color: "#FFF",
                        fontSize: 18,
                    }}
                >
                    Altura: {pokemon.height}
                </Text>

                <Text
                    style={{
                        color: "#FFF",
                        fontSize: 18,
                        marginTop: 10,
                    }}
                >
                    Peso: {pokemon.weight}
                </Text>

                <Text
                    style={{
                        color: "#FFF",
                        fontSize: 18,
                        marginTop: 10,
                    }}
                >
                    Experiência Base: {pokemon.base_experience}
                </Text>

                {/* TIPOS */}
                <Text
                    style={{
                        color: "#FFF",
                        fontSize: 22,
                        fontWeight: "bold",
                        marginTop: 25,
                    }}
                >
                    Tipos
                </Text>

                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        marginTop: 10,
                        gap: 10,
                    }}
                >
                    {pokemon.types.map((t: any) => (
                        <View
                            key={t.type.name}
                            style={{
                                backgroundColor:
                                    typeColors[t.type.name] || "#333",
                                paddingVertical: 6,
                                paddingHorizontal: 14,
                                borderRadius: 20,
                            }}
                        >
                            <Text
                                style={{
                                    color: "#FFF",
                                    textTransform: "capitalize",
                                    fontWeight: "bold",
                                }}
                            >
                                {t.type.name}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* HABILIDADES */}
                <Text
                    style={{
                        color: "#FFF",
                        fontSize: 22,
                        fontWeight: "bold",
                        marginTop: 25,
                    }}
                >
                    Habilidades
                </Text>

                {pokemon.abilities.map((a: any) => (
                    <Text
                        key={a.ability.name}
                        style={{
                            color: "#AAA",
                            marginTop: 5,
                            textTransform: "capitalize",
                        }}
                    >
                        • {a.ability.name}
                    </Text>
                ))}

                {/* BASE STATS */}
                <Text
                    style={{
                        color: "#FFF",
                        fontSize: 22,
                        fontWeight: "bold",
                        marginTop: 25,
                        marginBottom: 15,
                    }}
                >
                    Base Stats
                </Text>

                {pokemon.stats.map((s: any) => {
                    const statValue = s.base_stat;

                    return (
                        <View
                            key={s.stat.name}
                            style={{
                                marginBottom: 15,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    marginBottom: 5,
                                }}
                            >
                                <Text
                                    style={{
                                        color: "#FFF",
                                        textTransform: "capitalize",
                                    }}
                                >
                                    {s.stat.name.replace("-", " ")}
                                </Text>

                                <Text
                                    style={{
                                        color: "#FFF",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {statValue}
                                </Text>
                            </View>

                            <View
                                style={{
                                    width: "100%",
                                    height: 10,
                                    backgroundColor: "#333",
                                    borderRadius: 5,
                                    overflow: "hidden",
                                }}
                            >
                                <View
                                    style={{
                                        height: "100%",
                                        width: `${(Math.min(statValue, 255) / 255) * 100}%`,
                                        backgroundColor: pokemonColor,
                                    }}
                                />
                            </View>
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
}