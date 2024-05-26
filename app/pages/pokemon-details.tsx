import { useLocalSearchParams } from "expo-router"
import React, { useCallback, useEffect, useMemo, useRef } from "react"
import { Image, Text, StyleSheet, View, FlatList, Animated } from "react-native"
import { ListItemCard, PageContainer } from "../../src/components"
import { useQuery } from "@tanstack/react-query"
import { PokemonService } from "../../src/services"
import { PokemonTypeLabel } from "../../src/components/pokemon-type-label"
import { Move, PokemonType, URLItem } from "../../src/models"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { getPokemonIdFromUrl, getSingleParam } from "../../src/utils/helpers"
import { EXTRA_PADDING_BELOW_CONTENT, HEADER_HEIGHT_EXTENDED } from "../../src/utils/ui-constants"

export default function PokemonDetails() {
  const params = useLocalSearchParams()
  const insets = useSafeAreaInsets()

  const scrollY = useRef(new Animated.Value(0)).current;

  const pokemonId = useMemo(() => getPokemonIdFromUrl(params.url), [params.url])
  const pokemonName = useMemo(() => getSingleParam(params.name) || "Pokemon", [params.name])

  if (!pokemonId) {
    return <PageContainer title="Error"><Text>Error: Invalid URL</Text></PageContainer>
  }

  const { data: pokemonDetailsData, isLoading: pokemonDetailsIsLoading, error: pokemonDetailsError } = useQuery({
    queryKey: ['pokemonDetails', pokemonId],
    queryFn: () => PokemonService.getPokemonDetails(pokemonId)
  });

  const { data: evolutionChainData, isLoading: evolutionChainIsLoading, error: evolutionChainError } = useQuery({
    queryKey: ['evolutionChain', pokemonId],
    queryFn: () => PokemonService.getPokemonSpecies(pokemonId).then((species) => {
      const evolutionChainId = getPokemonIdFromUrl(species.evolution_chain.url);

      if (!evolutionChainId) {
        throw new Error('Invalid evolution chain URL');
      }

      return PokemonService.getPokemonEvolutionChain(evolutionChainId);
    })
  });

  if (pokemonDetailsIsLoading) {
    return <PageContainer title="Loading..."><Text>Loading...</Text></PageContainer>;
  }

  if (pokemonDetailsError) {
    return <PageContainer title="Error"><Text>An error occurred: {pokemonDetailsError.message}</Text></PageContainer>;
  }
  console.log("evolutionChainData", evolutionChainData)

  const getEvolutionNames = (chain: any) => {
    const urlItems: URLItem[] = [];
    let currentChain = chain;
    while (currentChain) {
      const currentSpecies = currentChain.species;
      currentSpecies.url = currentSpecies.url.replace('pokemon-species', 'pokemon');
      if (currentSpecies.name !== pokemonName) urlItems.push(currentChain.species);
      currentChain = currentChain.evolves_to[0];
    }
    return urlItems;
  };

  const imageSize = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [200, 32],
    extrapolate: 'clamp'
  });



  return (
    <PageContainer
      title={pokemonName}
      imageUri={pokemonDetailsData.sprites.front_default}
      scrollY={scrollY}
      imageSize={imageSize}
    >
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: false
          }
        )}
      >
        <View style={{ height: HEADER_HEIGHT_EXTENDED + 10 }} />
        <View style={[styles.typesContainer]}>
          {pokemonDetailsData.types.map((type: PokemonType, i: number) => (<PokemonTypeLabel type={type.type.name} key={i} />))}
        </View>

        {pokemonDetailsData?.moves.slice(0, 10).map((item: any, index: any) => (
          <ListItemCard item={item.move} isFirst={index === 0} key={index} />
        ))}

        {getEvolutionNames(evolutionChainData?.chain).map((item, index) => (
          <ListItemCard item={item} pathname={"/pages/pokemon-details"} isFirst={index === 0} key={index} />
        ))}

        <View style={styles.extraPadding} />
      </Animated.ScrollView>
    </PageContainer>
  )
}


const styles = StyleSheet.create({
  contentContainerStyle: {
    padding: 16,
  },
  typesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  abilitiesContainer: {
    padding: 16,
  },
  extraPadding: {
    height: EXTRA_PADDING_BELOW_CONTENT
  }
})