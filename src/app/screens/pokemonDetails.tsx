import {View, Text, ActivityIndicator, Image, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import {useEffect, useState} from "react";

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
            console.error("Erro ao buscar detalhes:", error);
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

    return (
        <ScrollView
            style={{
                flex: 1,
                backgroundColor: "#1e1e1e",
            }}
            contentContainerStyle={{
                padding: 20,
                paddingBottom: 40,
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
                    color: "#999",
                    marginBottom: 20,
                }}
            >
                #{pokemon.id}
            </Text>

            <Text style={{ color: "#FFF", fontSize: 18 }}>
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
                                    width: `${Math.min(statValue, 255) / 255 * 100}%`,
                                    backgroundColor:
                                        statValue >= 100
                                            ? "#4CAF50"
                                            : statValue >= 60
                                                ? "#FFC107"
                                                : "#F44336",
                                }}
                            />
                        </View>
                    </View>
                );
            })}
        </ScrollView>
    );
}