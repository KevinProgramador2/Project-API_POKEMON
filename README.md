# 📱 Pokédex Mobile - React Native & Expo

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
</p>

---

## 📄 Sobre o Projeto

Este é um aplicativo mobile desenvolvido como **Trabalho Prático** com o objetivo de consumir a [PokeAPI](https://pokeapi.co/) para listar e exibir detalhes dos Pokémon. O projeto foi construído utilizando **React Native** com o ecossistema **Expo**, aplicando conceitos práticos de navegação, hooks de estado e renderização eficiente de listas.

### 🚀 Funcionalidades Implementadas
* **Consumo de API Externa:** Integração assíncrona com os endpoints da PokeAPI.
* **Listagem Eficiente:** Renderização dos Pokémon através do componente `FlatList` com indicadores visuais de clique.
* **Navegação Dinâmica:** Transição fluida entre a tela principal e a tela de detalhes de cada Pokémon selecionado.
* **Tela de Detalhes:** Exibição detalhada de informações do Pokémon, incluindo:
  * Nome e Identificador (ID)
  * Imagem oficial
  * Tipo(s) e Habilidades
  * Altura, Peso e Experiência Base
* **🔍 Desafio Extra (Filtro de Busca):** Barra de pesquisa com `TextInput` e `useState` para filtrar Pokémon em tempo real por nome diretamente na `FlatList`.

---

## 🛠️ Tecnologias e Dependências

Para rodar este projeto localmente, você precisará ter o **Node.js** instalado. Abaixo estão listadas as principais ferramentas e pacotes necessários:

### Tecnologias
* **React Native** (Estrutura do App)
* **Expo SDK 54** (Ambiente de desenvolvimento e Build)
* **JavaScript** (Lógica do app)

### Dependências Base e Instalação
Navegue até a pasta raiz do projeto através do terminal e instale as dependências executando:

```bash
npm install
npx expo start 
```

1. Instalar a CLI do EAS globalmente:
   ```npm install -g eas-cli ```
   2. Inicializar e configurar o EAS no projeto:
  ```eas build:configure```
   3. Configurar o arquivo eas.json   Abra o arquivo eas.json gerado na raiz e certifique-se de adicionar a propriedade "buildType": "apk". Ele deve ficar estruturado dessa forma:
   
  ```
{
"cli": {
    "version": ">= 14.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  }
} ```
