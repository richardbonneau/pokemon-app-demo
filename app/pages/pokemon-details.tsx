import { useLocalSearchParams } from "expo-router"
import React, { useMemo, useRef } from "react"
import { Text, StyleSheet, View, Animated } from "react-native"
import { ListItemCard, PageContainer } from "../../src/components"
import { PokemonTypeLabel } from "../../src/components/pokemon-type-label"
import { EvolutionChain, Move, PokemonType, URLItem } from "../../src/models"
import { getPokemonIdFromUrl, getSingleParam } from "../../src/utils/helpers"
import { EXTRA_PADDING_BELOW_CONTENT, HEADER_HEIGHT_EXTENDED, SCROLL_INPUT_RANGE } from "../../src/utils/ui-constants"
import { usePokemonData } from "../../src/hooks/usePokemonData"

export default function PokemonDetails() {
  const params = useLocalSearchParams()
  const pokemonId = useMemo(() => getPokemonIdFromUrl(params.url), [params.url])
  const pokemonName = useMemo(() => getSingleParam(params.name) || "Pokemon", [params.name])

  if (!pokemonId) {
    return <PageContainer title="Error">
      <Text>Error: Invalid URL</Text></PageContainer>
  }

  const { pokemonDetailsData, evolutionChainData, isLoading, errors } = usePokemonData(pokemonId);

  if (isLoading) {
    return <PageContainer title="Loading..."><Text>Loading...</Text></PageContainer>;
  }

  if (errors.pokemonDetailsError || errors.evolutionChainError) {
    return (
      <PageContainer title="Error">
        {errors.pokemonDetailsError && <Text>{errors.pokemonDetailsError.message}</Text>}
        {errors.evolutionChainError && <Text>{errors.evolutionChainError.message}</Text>}
      </PageContainer >
    );
  }

  const getEvolutionNames = (chain: EvolutionChain) => {
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

  return (
    <PageContainer
      title={pokemonName}
      imageUri={pokemonDetailsData.sprites.front_default}
    >

      <View style={[styles.typesContainer]}>
        {pokemonDetailsData.types.map((type: PokemonType, i: number) => (<PokemonTypeLabel type={type.type.name} key={i} />))}
      </View>

      {pokemonDetailsData?.moves.slice(0, 5).map((item: any, index: any) => (
        <ListItemCard item={item.move} isFirst={index === 0} key={index} />
      ))}

      {getEvolutionNames(evolutionChainData?.chain).map((item, index) => (
        <ListItemCard item={item} pathname={"/pages/pokemon-details"} isFirst={index === 0} key={index} />
      ))}

      <View style={styles.extraPadding} />

    </PageContainer>
  )
}


const styles = StyleSheet.create({
  typesContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  extraPadding: {
    height: EXTRA_PADDING_BELOW_CONTENT
  },
})