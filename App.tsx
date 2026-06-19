import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Pokemon from './src/app/screens/pokemon';
import PokemonDetails from "./src/app/screens/pokemonDetails";

const Stack = createStackNavigator<any>();

export default function App() {
    const caminho = require('./assets/pokedex.png');

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="PokéDex"
                    component={Pokemon}
                    options={{
                        // Transforma o título do cabeçalho em uma imagem
                        headerTitle: () => (
                            <Image source={caminho} style={{ width: 100, height: 40, resizeMode: 'contain' }} />
                        ),
                        headerTitleAlign: 'center'
                    }}
                />
                <Stack.Screen
                    name="PokemonDetails"
                    component={PokemonDetails}
                    options={{
                        title: 'Detalhes'
                    }}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
