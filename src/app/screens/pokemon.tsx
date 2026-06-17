
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, Image } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { withSafeAreaInsets } from 'react-native-safe-area-context';


type PokemonAbilitys = {
    ability: string;
    name: string;
    url: string;
}


type PokemonProps = {
    name: string;
    url: string;
}
export default function Pokemon() {

    const [loading, setLoading] = useState(false);
    const [pokemon, setPokemon] = useState<PokemonProps[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");


    const URLAbility = "https://pokeapi.co/api/v2/pokemon/ditto"
    const URL = "https://pokeapi.co/api/v2/pokemon/"
    const IMAGE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon"

    async function listarPokemons() {
        setLoading(true);
        try {
            if (loading) {
                return <Text>Carregando...</Text>;

            }
            const response = await fetch(URL);
            const data = await response.json()
            console.log('teste:', data.results)
            setPokemon(data.results);
        } catch (error) {
            console.error("error", error)
        } finally {
            setTimeout(() => { setLoading(false) }, 3000)
        }
    }

    function getPokemonImage(url: string) {
        const pokemonId = url.split('/').filter(Boolean).pop();
        // console.log("pokeid", `${IMAGE}/${pokemonId}.png`);
        return (`${IMAGE}/${pokemonId}.png`)
    }
    useEffect(() => {
        listarPokemons();
    }, []);

    const filteredPokemon = pokemon.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );
    return (
        <View style={styles.container}>
            <TextInput style={styles.input} placeholder='Pesquisa' value={search} onChangeText={setSearch}></TextInput>

            <View style={styles.cardImg}>
                <Text style={styles.title}>Lista de pokemons</Text>
            </View>

            <FlatList
                nestedScrollEnabled
                data={filteredPokemon}
                keyExtractor={(item) => item.name} // Adicionado para evitar warnings
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text>{item.name}</Text>
                        <Image style={styles.image} source={{ uri: getPokemonImage(item.url) }} />
                    </View>
                )} // Fecha o renderItem aqui
            /> // Fecha a FlatList aqui corretamente

        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#cdcdcd",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        padding: 10
    },
    title: {
        fontSize: 24
    },
    input: {
        backgroundColor: "white",
        padding: 10,
        margin: 10,

    },
    card: {

    },
    cardImg: {
        backgroundColor: "white"
    },

    image: {
        width: 100,
        height: 100
    }
});