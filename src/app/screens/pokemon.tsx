import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, Image, Platform, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';

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
    //Esse estado vai capturar cada letra digitada em tempo real:
    const [inputSearch, setInputSearch] = useState("");
    const [limit, setLimit] = useState(20);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPokemon, setSelectedPokemon] = useState<any>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    async function carregarDetalhesPokemon(url: string) {
        setLoadingDetails(true);
        setModalVisible(true); // Abre o modal mostrando um indicador de carregamento
        try {
            const response = await fetch(url);
            const data = await response.json();
            setSelectedPokemon(data); // Guarda todos os dados detalhados (abilities, stats, types, etc)
        } catch (error) {
            console.error("Erro ao buscar detalhes:", error);
        } finally {
            setLoadingDetails(false);
        }
    }

    const URLAbility = "https://pokeapi.co/api/v2/pokemon/ditto"
    const URL = "https://pokeapi.co/api/v2/pokemon/"
    const IMAGE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon"

    // Nova função para buscar apenas UM Pokémon específico pelo nome
    async function buscarPokemon(nome: string) {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome.toLowerCase().trim()}`);

            if (!response.ok) {
                throw new Error("Pokémon não encontrado.");
            }

            const data = await response.json();

            // Formata o resultado para que a FlatList consiga entender.
            const filteredPokemon = [{
                name: data.name,
                url: `https://pokeapi.co/api/v2/pokemon/${data.id}/`
            }];

            setPokemon(filteredPokemon);
        } catch (err) {
            // Se não achar o Pokémon na API, limpa a lista e avisa o usuário
            setPokemon([]);
            setError("Nenhum Pokémon encontrado com esse nome.");
        } finally {
            setLoading(false);
        }
    }

    async function listarPokemons() {
        setLoading(true);
        try {
            if (loading) {
                return <Text>Carregando...</Text>;
            }
            const response = await fetch(`${URL}?limit=${limit}&offset=0`);
            const data = await response.json()
            console.log('teste:', data.results)
            setPokemon(data.results);
        } catch (error) {
            console.error("error", error)
        } finally {
            setTimeout(() => { setLoading(false) }, 2000)
        }
    }

    function getPokemonImage(url: string) {
        const pokemonId = url.split('/').filter(Boolean).pop();
        return (`${IMAGE}/${pokemonId}.png`)
    }

    useEffect(() => {
        // Toda vez que o usuário digitar, começa a contar 500ms
        const timer = setTimeout(() => {
            setSearch(inputSearch); // Só atualiza o 'search' real após a pausa
        }, 500);

        // Se o usuário digitar outra letra antes de dar 500ms, 
        // essa linha limpa o timer anterior e recomeça a contagem:
        return () => clearTimeout(timer);
    }, [inputSearch]);

    // O useEffect agora gerencia os dois cenários baseando-se no que foi digitado
    useEffect(() => {
        // Se a pesquisa estiver vazia, puxa a listagem normal padrão
        if (search.trim() === "") {
            listarPokemons();
        } else {
            // Se tem texto, faz a busca direta na API
            buscarPokemon(search);
        }
    }, [limit, search]); // Executa sempre que o limite OU o texto de busca mudar

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder='Pesquisa'
                value={inputSearch}
                onChangeText={setInputSearch}
            />
            <Text style={styles.title}>Lista de Pokémons</Text>

            {/* MODAL / CARD FLUTUANTE */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>

                        {loadingDetails ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : (
                            selectedPokemon && (
                                <ScrollView showsVerticalScrollIndicator={false}>

                                    <Image
                                        style={styles.modalImage}
                                        source={{ uri: selectedPokemon.sprites.front_default }}
                                    />

                                    {/* Nome */}
                                    <Text style={styles.modalTitle}>{selectedPokemon.id} - {selectedPokemon.name}</Text>

                                    {/* Info Básica */}
                                    <View style={styles.infoRow}>
                                        <Text style={styles.infoText}>Altura: {selectedPokemon.height / 10}m </Text>
                                        <Text style={styles.infoText}>Peso: {selectedPokemon.weight / 10}kg </Text>
                                        <Text style={styles.infoText}>XP base: {selectedPokemon.base_experience}</Text>
                                    </View>

                                    {/* Tipos */}
                                    <Text style={styles.sectionTitle}>Tipos:</Text>
                                    <Text style={styles.infoText}>
                                        {selectedPokemon.types.map((t: any) => t.type.name).join(', ')}
                                    </Text>

                                    {/* Habilidades */}
                                    <Text style={styles.sectionTitle}>Habilidades:</Text>
                                    <Text style={styles.infoText}>
                                        {selectedPokemon.abilities.map((a: any) => a.ability.name).join(', ')}
                                    </Text>
                                </ScrollView>
                            )
                        )}

                        {/* Botão Fechar */}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Mensagem de erro caso o Pokémon digitado não exista */}
            {error && <Text style={styles.errorText}>{error}</Text>}

            {loading && <ActivityIndicator size="small" color="#0000ff" style={{ margin: 10 }} />}

            <FlatList
                nestedScrollEnabled
                data={pokemon}
                keyExtractor={(item) => item.name}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => carregarDetalhesPokemon(item.url)}
                    >
                        <View style={styles.list}>
                            <Text style={styles.nameText}>{item.name}</Text>
                            <Image style={styles.image} source={{ uri: getPokemonImage(item.url) }} />
                        </View>
                    </TouchableOpacity>
                )}

                // O botão de carregar mais só aparece se o usuário NÃO estiver pesquisando nada
                ListFooterComponent={() => (
                    search.trim() === "" ? (
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
        backgroundColor: "#f5f5f5",
        paddingHorizontal: 16,
        paddingTop: 50,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'blue',
        marginBottom: 16,
        fontFamily: "bold",
        shadowOffset: { width: 0, height: 0.2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    input: {
        backgroundColor: "white",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: "12",
        fontSize: 16,
        marginBottom: 40,
        width: '100%',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2, // Sombra para Android
        shadowColor: '#000', // Sombra para iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    pokemonName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#444',
        marginLeft: 16,
    },
    tituloPokemon: {
        textShadowColor: "red",
        fontStyle: 'normal',
    },
    image: {
        width: 70,
        height: 70,
        resizeMode: 'contain',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    emptyText: {
        textAlign: 'center',
        color: '#888',
        marginTop: 40,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        maxHeight: '80%',
    },
    modalImage: {
        width: 150,
        height: 150,
        alignSelf: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
        color: '#333',
        textTransform: 'capitalize'
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 15,
    },
    infoText: {
        fontSize: 16,
        color: '#666',
    },
    nameText: {
        textTransform: 'capitalize'
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
        color: '#444',
    },
    closeButton: {
        backgroundColor: '#FF3B30',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    list: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    loadMoreButton: {
        backgroundColor: '#3B4CCA',
        width: '100%', // Se quiser o botão largo tradicional, ou use paddingHorizontal para ele ficar menor
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        // Uma sombra sutil para dar acabamento
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    loadMoreText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    listContent: {
        // Dá uma folga nas laterais e na base interna para que nada fique espremido
        paddingHorizontal: 16,
        paddingBottom: 32,
    },
    footerContainer: {
        marginTop: 20, // Descolar o botão do último card de Pokémon
        width: '100%',
        alignItems: 'center',
    },
});

