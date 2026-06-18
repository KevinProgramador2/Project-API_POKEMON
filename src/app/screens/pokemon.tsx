
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';


type PokemonProps = {
    name: string;
    url: string;
}

export default function Pokemon() {
    const [loading, setLoading] = useState(false);
    const [pokemon, setPokemon] = useState<PokemonProps[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [inputSearch, setInputSearch] = useState("");
    const [listaOriginal, setListaOriginal] = useState<PokemonProps[]>([]);
    const [limit, setLimit] = useState(20);
    const navigation = useNavigation<any>();


    const [fontsLoaded] = useFonts({

        'GoogleSans': require('../../../assets/fonts/GoogleSans-Bold.ttf'),
        'GoogleSans-Bold': require('../../../assets/fonts/GoogleSans-Regular.ttf'),
    });

    const URL = "https://pokeapi.co/api/v2/pokemon/"
    const IMAGE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon"

    async function buscarPokemon(nome: string) {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome.toLowerCase().trim()}`);

            if (!response.ok) {
                throw new Error("Pokémon não encontrado.");
            }
            const data = await response.json()
            const filteredPokemon = [{
                name: data.name,
                url: `https://pokeapi.co/api/v2/pokemon/${data.id}/`
            }];

            setPokemon(filteredPokemon);
        } catch (err) {

            setPokemon([]);
            setError("Nenhum Pokémon encontrado com esse nome.");
        } finally {
            setLoading(false);
        }
    }

    async function listarPokemons() {
        setLoading(true);
        try {
            const response = await fetch(`${URL}?limit=1350&offset=0`);
            const data = await response.json();

            setListaOriginal(data.results);
        } catch (error) {
            console.error("error", error);
        } finally {
            setLoading(false);
        }
    }

    function getPokemonImage(url: string) {
        const pokemonId = url.split('/').filter(Boolean).pop();
        return (`${IMAGE}/${pokemonId}.png`)
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(inputSearch);
        }, 500);

        return () => clearTimeout(timer);
    }, [inputSearch]);

    useEffect(() => {
        if (listaOriginal.length === 0) {
            listarPokemons();
            return;
        }

        if (search.trim() === "") {
            setError(null);
            setPokemon(listaOriginal.slice(0, limit));
        } else {
            const filtrados = listaOriginal.filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase())
            );

            if (filtrados.length === 0) {
                setError("Nenhum Pokémon encontrado com esse nome.");
                setPokemon([]);
            } else {
                setError(null);
                setPokemon(filtrados.slice(0, limit));
            }
        }
    }, [search, listaOriginal, limit]);

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder='Pesquisa'
                placeholderTextColor="green"
                value={inputSearch}
                onChangeText={setInputSearch}
            />
            <Text style={styles.title}>Lista de Pokémons</Text>

            {/* Mensagem de erro caso o Pokémon digitado não exista */}
            {error && <Text style={styles.errorText}>{error}</Text>}

            {loading && <ActivityIndicator size="small" color="#0000ff" style={{ margin: 10 }} />}

            <FlatList
                nestedScrollEnabled
                data={pokemon}
                keyExtractor={(item) => item.name}
                contentContainerStyle={styles.listContent}
                initialNumToRender={15}
                maxToRenderPerBatch={20}
                windowSize={5}
                renderItem={({ item }) => (

                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => {
                            navigation.navigate("PokemonDetails", {
                                pokemonUrl: item.url
                            })
                        }}
                    >
                        <View style={styles.list}>
                            <Text style={styles.nameText}>{item.name}</Text>
                            <Image style={styles.image} source={{ uri: getPokemonImage(item.url) }} />
                        </View>
                    </TouchableOpacity>
                )}

                // O botão de carregar mais só aparece se o usuário NÃO estiver pesquisando nada
                ListFooterComponent={() => (
                    search.trim() === "" && pokemon.length < listaOriginal.length ? (
                        <View style={styles.footerContainer}>
                            <TouchableOpacity
                                style={styles.loadMoreButton}
                                onPress={() => setLimit(prev => prev + 20)}
                            >
                                <Text style={styles.loadMoreText}>Carregar Mais Pokémons</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null
                )}
            />

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#121212",
        paddingHorizontal: 16,
        paddingTop: 50,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 16,
        fontFamily: "GoogleSans-Bold",
        shadowOffset: { width: 0, height: 0.2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    input: {
        fontFamily: 'GoogleSans',
        backgroundColor: "#cdcdcd",
        color: "#FFFFFF",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#333', // Bordinha sutil
        shadowColor: "#000",
        fontSize: 16,
        marginBottom: 40,
        width: '100%',
    },
    card: {
        backgroundColor: '#1e1e1e', // Fundo escuro do card
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#2a2a2a',
    },
    pokemonName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginLeft: 16,
        fontFamily: 'GoogleSans',
    },
    tituloPokemon: {
        fontFamily: 'GoogleSans',
        fontStyle: 'normal',

    },
    image: {
        width: 70,
        height: 70,
        resizeMode: 'contain',
    },
    errorText: {
        color: '#ff6b6b',
        textAlign: 'center',
        marginTop: 20,
    },
    emptyText: {
        textAlign: 'center',
        color: '#888',
        marginTop: 40,
    },
    nameText: {
        textTransform: 'capitalize',
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    list: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    loadMoreButton: {
        backgroundColor: '#333333',
        borderWidth: 1,
        borderColor: '#444',
        width: '100%',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    loadMoreText: {
        color: '#FFF',
        fontWeight: 'bold',
    }, Content: {
        paddingHorizontal: 16,
        paddingBottom: 32,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 32,
    },
    footerContainer: {
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 15,
    },
    infoText: {
        fontSize: 16,
        color: '#AAA',
    },

    /* =========================================
       ESTILO MODAL DARK THEME
       ========================================= */
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        width: '100%',
        height: '80%',
        backgroundColor: '#1e1e1e',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingHorizontal: 20,
        paddingTop: 0,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    modalImage: {
        width: 220,
        height: 220,
        marginTop: -110,
        alignSelf: 'center',
        zIndex: 10,
    },
    modalTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#FFFFFF',
        textTransform: 'capitalize',
        marginTop: 10,
    },
    modalId: {
        fontSize: 20,
        color: '#888',
        fontWeight: 'normal',
    },
    typesContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        marginVertical: 15,
    },
    typeBadge: {
        backgroundColor: '#333',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    typeText: {
        color: '#FFF',
        textTransform: 'capitalize',
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 15,
        color: '#FFFFFF',
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
        marginBottom: 12,
    },
    statLabel: {
        color: '#AAA',
        fontSize: 13,
        width: 80,
        textTransform: 'capitalize',
    },
    statValue: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
        width: 35,
        textAlign: 'right',
        marginRight: 10,
    },
    barBackground: {
        flex: 1,
        height: 6,
        backgroundColor: '#333',
        borderRadius: 5,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: 5,
    },
    closeButton: {
        backgroundColor: 'transparent',
        paddingVertical: 15,
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    closeButtonText: {
        color: '#AAA',
        fontSize: 16,
        fontWeight: 'bold',
    },
});