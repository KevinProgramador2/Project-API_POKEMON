import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Pokemon from './src/app/screens/pokemon';
import PokemonDetails from "./src/app/screens/pokemonDetails";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const caminho = require('./assets/pokedex.png');
const Stack = createStackNavigator<any>();

export default function App() {
    const caminho = require('./assets/pokedex.png');

    return (
         <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
            <Stack.Navigator
        screenOptions={{
            headerStyle: { backgroundColor: '#ff3333', height: 50 },
            headerBackground: () => (
                <View style={{ flex: 1, backgroundColor: '#CC0000' }} />
            ),
            headerTitle: () => (
                <Image 
                    source={caminho} 
                    style={{ width: 120, height: 35, resizeMode: 'contain' }}
                />
            ),
            headerTintColor: '#FFFFFF',
        }}
    >
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
    </GestureHandlerRootView>
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
