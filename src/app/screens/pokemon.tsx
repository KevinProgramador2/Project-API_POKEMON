
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, Pressable, Modal } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { ScrollView } from 'react-native';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';


type PokemonProps = {
    name: string;
    url: string;
}
type PokemonDetail = {
    height: number;
    weight: number;
    base_experience: number;
    types: { type: { name: string } }[];
    abilities: { ability: { name: string } }[];
    stats: { base_stat: number; stat: { name: string } }[];
}

const TYPE_COLORS: Record<string, string> = {
    fire: '#F08030', water: '#6890F0', grass: '#78C850', electric: '#F8D030',
    ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0', ground: '#E0C068',
    flying: '#A890F0', psychic: '#F85888', bug: '#A8B820', rock: '#B8A038',
    ghost: '#705898', dragon: '#7038F8', dark: '#705848', steel: '#B8B8D0',
    fairy: '#EE99AC', normal: '#A8A878',
};

const TYPE_LABELS: Record<string, string> = {
    fire: 'Fogo', water: 'Água', grass: 'Grama', electric: 'Elétrico',
    ice: 'Gelo', fighting: 'Lutador', poison: 'Veneno', ground: 'Terra',
    flying: 'Voador', psychic: 'Psíquico', bug: 'Inseto', rock: 'Pedra',
    ghost: 'Fantasma', dragon: 'Dragão', dark: 'Sombrio', steel: 'Aço',
    fairy: 'Fada', normal: 'Normal',
};

const STAT_LABELS: Record<string, string> = {
    hp: 'HP', attack: 'Ataque', defense: 'Defesa',
    'special-attack': 'Sp.Atk', 'special-defense': 'Sp.Def', speed: 'Speed',
};

const STAT_COLORS = ['#78C850', '#F08030', '#6890F0', '#F8D030', '#98D8D8', '#C03028'];
    
function PokemonCard({ item, expandido, onToggle }: { item: PokemonProps; expandido: boolean; onToggle: () => void; }) {
    const [detalhe, setDetalhe] = useState<PokemonDetail | null>(null);
    const [loadingDetalhe, setLoadingDetalhe] = useState(false);

    const IMAGE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
    const pokemonId = item.url.split('/').filter(Boolean).pop();
    const imageUri = `${IMAGE}/${pokemonId}.png`;
    const mainColor = detalhe ? TYPE_COLORS[detalhe.types[0]?.type.name] ?? '#888' : '#888';

    async function abrirModal() {
        if (!detalhe) {
            setLoadingDetalhe(true);
            try {
                const res = await fetch(item.url);
                const data = await res.json();
                setDetalhe(data);
            } catch { }
            finally { setLoadingDetalhe(false); }
        }
        onToggle();
    }

    return (
        <>
            <View style={styles.cardWrap}>
                <Pressable style={styles.card} onPress={abrirModal}>
                    <View style={[styles.colorBar, { backgroundColor: mainColor }]} />
                    <View style={styles.cardFront}>
                        <Text style={styles.pokemonNum}>#{pokemonId?.padStart(3, '0')}</Text>
                        <Image style={styles.image} source={{ uri: imageUri }} />
                        <Text style={styles.nameText}>{item.name}</Text>
                    </View>
                </Pressable>
            </View>

            <Modal
                visible={expandido}
                transparent
                animationType="fade"
                onRequestClose={onToggle}
            >
                <View style={styles.modalOverlay}>
                    <Pressable style={StyleSheet.absoluteFill} onPress={onToggle} />
                    <View style={[styles.modalCard, { borderColor: mainColor }]}>
                        <View style={[styles.modalHeader, { backgroundColor: mainColor }]}>
                            <Image style={styles.modalImage} source={{ uri: imageUri }} />
                            <Text style={styles.modalTitle}>{item.name}</Text>
                            <Text style={styles.modalId}>#{pokemonId?.padStart(3, '0')}</Text>
                        </View>

                        {loadingDetalhe ? (
                            <ActivityIndicator size="large" color="#fff" style={{ margin: 30 }} />
                        ) : detalhe ? (
                            <ScrollView style={styles.modalBody}>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoText}>Altura: {detalhe.height}</Text>
                                <Text style={styles.infoText}>Peso: {detalhe.weight}</Text>
                            </View>
                            <Text style={[styles.infoText, { marginBottom: 12 }]}>
                                Experiência Base: {detalhe.base_experience}
                            </Text>

                            <Text style={styles.sectionTitle}>Tipos</Text>
                            <View style={styles.typesContainer}>
                                {detalhe.types.map(t => (
                                    <View key={t.type.name} style={[styles.typeBadge, { backgroundColor: TYPE_COLORS[t.type.name] }]}>
                                        <Text style={styles.typeText}>{TYPE_LABELS[t.type.name] ?? t.type.name}</Text>
                                    </View>
                                ))}
                            </View>

                            <Text style={styles.sectionTitle}>Habilidades</Text>
                            {detalhe.abilities.map(a => (
                                <Text key={a.ability.name} style={styles.infoTextDesc}>
                                    • {a.ability.name}
                                </Text>
                            ))}

                            <Text style={styles.sectionTitle}>Base Stats</Text>
                            {detalhe.stats.map((s, i) => (
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
                        </ScrollView>
                        ) : null}

                        <TouchableOpacity style={styles.closeButton} onPress={onToggle}>
                            <Text style={styles.closeButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
}
export default function Pokemon() {
    const [loading, setLoading] = useState(false);
    const [pokemon, setPokemon] = useState<PokemonProps[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [inputSearch, setInputSearch] = useState("");
    const [listaOriginal, setListaOriginal] = useState<PokemonProps[]>([]);
    const [limit, setLimit] = useState(21);
    const navigation = useNavigation<any>();
    const [tipoSelecionado, setTipoSelecionado] = useState<string | null>(null);
    const [loadingTipo, setLoadingTipo] = useState(false);
    const [filtroAberto, setFiltroAberto] = useState(false);
    const [pokemonAberto, setPokemonAberto] = useState<string | null>(null);

    const tiposDisponiveis = [
    { label: 'Fogo',     value: 'fire',     cor: 'rgba(240, 128, 48, 0.85)' },
    { label: 'Água',     value: 'water',    cor: 'rgba(104, 144, 240, 0.85)' },
    { label: 'Grama',    value: 'grass',    cor: 'rgba(120, 200, 80, 0.85)' },
    { label: 'Elétrico', value: 'electric', cor: 'rgba(248, 208, 48, 0.85)' },
    { label: 'Gelo',     value: 'ice',      cor: 'rgba(152, 216, 216, 0.85)' },
    { label: 'Lutador',  value: 'fighting', cor: 'rgba(192, 48, 40, 0.85)' },
    { label: 'Veneno',   value: 'poison',   cor: 'rgba(160, 64, 160, 0.85)' },
    { label: 'Terra',    value: 'ground',   cor: 'rgba(224, 192, 104, 0.85)' },
    { label: 'Voador',   value: 'flying',   cor: 'rgba(168, 144, 240, 0.85)' },
    { label: 'Psíquico', value: 'psychic',  cor: 'rgba(248, 88, 136, 0.85)' },
    { label: 'Inseto',   value: 'bug',      cor: 'rgba(168, 184, 32, 0.85)' },
    { label: 'Pedra',    value: 'rock',     cor: 'rgba(184, 160, 56, 0.85)' },
    { label: 'Fantasma', value: 'ghost',    cor: 'rgba(112, 88, 152, 0.85)' },
    { label: 'Dragão',   value: 'dragon',   cor: 'rgba(112, 56, 248, 0.85)' },
    { label: 'Sombrio',  value: 'dark',     cor: 'rgba(112, 88, 72, 0.85)' },
    { label: 'Aço',      value: 'steel',    cor: 'rgba(184, 184, 208, 0.85)' },
    { label: 'Fada',     value: 'fairy',    cor: 'rgba(238, 153, 172, 0.85)' },
    { label: 'Normal',   value: 'normal',   cor: 'rgba(168, 168, 120, 0.85)' },
];


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

        async function buscarPokemonsPorTipo(tipo: string) {
        setLoadingTipo(true);
        setError(null);
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/type/${tipo}`);

            if (!response.ok) {
                throw new Error("Tipo não encontrado.");
            }
            const data = await response.json();

            const listaDoTipo: PokemonProps[] = data.pokemon.map((p: any) => ({
                name: p.pokemon.name,
                url: p.pokemon.url,
            }));

            setPokemon(listaDoTipo);
        } catch (err) {
            setPokemon([]);
            setError("Erro ao buscar Pokémons desse tipo.");
        } finally {
            setLoadingTipo(false);
        }
    }

    function selecionarTipo(tipo: string) {
        if (tipoSelecionado === tipo) {
            setTipoSelecionado(null);
        } else {
            setTipoSelecionado(tipo);
        }
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

        useEffect(() => {
    if (tipoSelecionado) {
        buscarPokemonsPorTipo(tipoSelecionado);
    } else if (listaOriginal.length > 0 && search.trim() === "") {
        setError(null);
        setPokemon(listaOriginal.slice(0, limit));
        }
    }, [tipoSelecionado]);

    return (
  <ScrollView
    style={styles.container}
    contentContainerStyle={styles.scrollContent}
    keyboardShouldPersistTaps="handled"
  >
    <TextInput
      style={styles.input}
      placeholder="Pesquisa"
      placeholderTextColor="#ffffff"
      value={inputSearch}
      onChangeText={setInputSearch}
    />
            <Text style={styles.title}>Lista de Pokémons</Text>
    <View style={styles.filtroWrapper}>
    <TouchableOpacity
        style={styles.filtroToggle}
        onPress={() => setFiltroAberto(!filtroAberto)}
    >
        <Text style={styles.filtroToggleIcone}>☰</Text>
    </TouchableOpacity>
        {filtroAberto && (
    <ScrollView style={styles.filtroLista} nestedScrollEnabled>
        {tipoSelecionado && (
            <TouchableOpacity
                style={styles.filtroLimparBotao}
                onPress={() => {
                    setTipoSelecionado(null);
                    setFiltroAberto(false);
                }}
            >
                <Text style={styles.filtroLimparTexto}>✕ Limpar Filtro</Text>
            </TouchableOpacity>
        )}
        {tiposDisponiveis.map((tipo) => (
            <TouchableOpacity
                key={tipo.value}
                style={[
                    styles.filtroItem,
                    { backgroundColor: tipo.cor },
                    tipoSelecionado === tipo.value && styles.filtroItemAtivo,
                ]}
                onPress={() => {
                    selecionarTipo(tipo.value);
                    setFiltroAberto(false);
                }}
            >
                <Text
                    style={[
                        styles.filtroItemTexto,
                        tipoSelecionado === tipo.value && styles.filtroItemTextoAtivo,
                    ]}
                >
                    {tipo.label}
                </Text>
            </TouchableOpacity>
        ))}
    </ScrollView>
)}
</View>             
{loadingTipo && <ActivityIndicator size="small" color="#0000ff" style={{ margin: 10 }} />}

            {/* Mensagem de erro caso o Pokémon digitado não exista */}
            {error && <Text style={styles.errorText}>{error}</Text>}

            {loading && <ActivityIndicator size="small" color="#0000ff" style={{ margin: 10 }} />}

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
    {pokemon.map(item => (
        <View key={item.name} style={{ width: '32%', marginBottom: 8 }}>
            <PokemonCard
                item={item}
                expandido={pokemonAberto === item.name}
                onToggle={() => setPokemonAberto(pokemonAberto === item.name ? null : item.name)}
            />
        </View>
    ))}
</View>

{search.trim() === "" && pokemon.length < listaOriginal.length && (
    <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.loadMoreButton} onPress={() => setLimit(prev => prev + 21)}>
            <Text style={styles.loadMoreText}>Carregar Mais Pokémons</Text>
        </TouchableOpacity>
    </View>
)}

            </ScrollView>
);
}

const styles = StyleSheet.create({
screen: {
    flex: 1,
    backgroundColor: "#121212",
},

scroll: {
    flex: 1,
},
scrollContent: {
  paddingBottom: 32,
},
  container: {
  backgroundColor: "#121212",
  paddingHorizontal: 16,
  paddingTop: 50,
  height: '100vh' as any,
},
   title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: "GoogleSans-Bold",
    letterSpacing: 1.5,
    textAlign: 'center',
},
    input: {
    fontFamily: 'GoogleSans',
    backgroundColor: "#1e1e1e",
    color: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: "#000",
    fontSize: 16,
    marginBottom: 40,
    width: '100%',
},
    columnWrapper: { flex: 1, justifyContent: 'space-between', marginBottom: 8 },
   cardWrap: { 
    flex: 1, 
    margin: 2, 
    zIndex: 1,
    position: 'relative',
},
card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    overflow: 'visible',
},
   
    colorBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
    cardFront: { alignItems: 'center', paddingVertical: 10, paddingHorizontal: 4 },
    cardExtra: { paddingHorizontal: 8, paddingBottom: 10 },
    divider: { height: 1, backgroundColor: '#2a2a2a', marginBottom: 6 },
    badgesRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 },
    badge: { paddingVertical: 2, paddingHorizontal: 6, borderRadius: 20, marginRight: 4, marginBottom: 4 },
    badgeText: { fontSize: 12, fontWeight: '600' },
    statRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
    statLabel: { color: '#888', fontSize: 11, width: 44, textAlign: 'right', marginRight: 4 },
    statBarBg: { flex: 1, height: 6, backgroundColor: '#333', borderRadius: 4, overflow: 'hidden' },
    statBar: { height: '100%', borderRadius: 4 },
    statVal: { color: '#fff', fontSize: 11, width: 24, textAlign: 'right', marginLeft: 2 },
    pokemonNum: { color: '#555', fontSize: 10 },


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
        width: 65,
        height: 65,
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
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 2,
    },

    loadMoreButton: {
    backgroundColor: '#333333',
    borderWidth: 1,
    borderColor: '#444',
    width: '100%',
    minHeight: 56,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
},
   
loadMoreText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    }, 
    
    Content: {
        paddingHorizontal: 16,
        paddingBottom: 32,

    },

    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 32,
    },

    footerContainer: {
    marginTop: 20,
    marginBottom: 40,
    width: '100%',
    alignItems: 'center',
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

    /* =========================================
       ESTILO MODAL DARK THEME
       ========================================= */
   modalImage: {
    width: 160,
    height: 160,
    marginBottom: 6,
},
modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
},
modalCard: {
    width: '92%',
    maxWidth: 520,
    maxHeight: '90%',
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    borderWidth: 2,
    overflow: 'hidden',
},
modalHeader: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
    paddingBottom: 16,
},
modalBody: {
    paddingHorizontal: 20,
    paddingTop: 16,
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
  modalTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    textTransform: 'capitalize',
    marginTop: 0,
},
    modalId: {
    fontSize: 18,
    color: '#888',
    fontWeight: 'normal',
    marginTop: 2,
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
        filtroScroll: {
        marginBottom: 16,
        flexGrow: 0,
    },
    filtroContainer: {
        gap: 8,
        paddingRight: 16,
    },
    filtroBotao: {
        backgroundColor: '#1e1e1e',
        borderWidth: 1,
        borderColor: '#333',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    filtroBotaoAtivo: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    filtroBotaoTexto: {
        color: '#AAA',
        fontSize: 14,
        fontWeight: '600',
    },
    filtroBotaoTextoAtivo: {
        color: '#FFFFFF',
    },
filtroToggle: {
    alignSelf: 'flex-start',
    width: 44,
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 16,
},
filtroToggleIcone: {
    color: '#FFFFFF',
    fontSize: 18,
},
filtroLista: {
    position: 'absolute',
    top: 60,
    left: 0,
    zIndex: 999,
    width: 190,
    backgroundColor: 'rgba(30, 30, 30, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    maxHeight: 260,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    padding: 6,
},
filtroItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
},
filtroItemAtivo: {
    backgroundColor: '#4CAF50',
},
filtroItemTexto: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '600',
},
filtroItemTextoAtivo: {
    color: '#000000',
    fontWeight: 'bold',
},
filtroWrapper: {
    position: 'relative',
    zIndex: 10,
},
filtroLimparBotao: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 6,
    backgroundColor: 'rgba(255, 80, 80, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
},
filtroLimparTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
},
});