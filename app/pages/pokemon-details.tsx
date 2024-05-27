import { useLocalSearchParams } from "expo-router"
import React, { useMemo } from "react"
import { Text, StyleSheet, View } from "react-native"
import { ListItemCard, PageContainer } from "../../src/components"
import { PokemonTypeLabel } from "../../src/components/pokemon-type-label"
import { EvolutionChain, PokemonType, URLItem } from "../../src/models"
import { getPokemonIdFromUrl, getSingleParam, urlReplacePokemonSpeciesWithPokemon } from "../../src/utils/helpers"
import { EXTRA_PADDING_BELOW_CONTENT } from "../../src/utils/ui-constants"
import { usePokemonData } from "../../src/hooks/usePokemonData"

const isSpeciesInUrlItems = (urlItems: URLItem[], speciesName: string) => {
  return urlItems.some(item => item.name === speciesName)
}

const getEvolutionNames = (chain: EvolutionChain, currentPokemonName: string) => {
  const urlItems: URLItem[] = [];
  let currentChain = chain;

  while (currentChain) {
    if (currentChain.evolves_to.length > 1) {
      currentChain.evolves_to.forEach((evolution) => {
        const species = evolution.species;
        species.url = urlReplacePokemonSpeciesWithPokemon(species.url);
        if (species.name !== currentPokemonName && !isSpeciesInUrlItems(urlItems, species.name)) urlItems.push(species);
      });
    }

    const currentSpecies = currentChain.species;
    currentSpecies.url = urlReplacePokemonSpeciesWithPokemon(currentSpecies.url);
    if (currentSpecies.name !== currentPokemonName && !isSpeciesInUrlItems(urlItems, currentSpecies.name)) urlItems.push(currentChain.species);
    currentChain = currentChain.evolves_to[0];
  }
  return urlItems;
}

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

  return (
    <PageContainer
      title={pokemonName}
      imageUri={pokemonDetailsData.sprites.front_default}
    >
      <View style={styles.contentContainer}>
        <View style={[styles.typesContainer]}>
          {pokemonDetailsData.types.map((type: PokemonType, i: number) => (<PokemonTypeLabel type={type.type.name} key={i} />))}
        </View>

        <Text style={styles.h2}>First 5 moves</Text>

        {pokemonDetailsData?.moves.slice(0, 5).map((item: any, index: any) => (
          <ListItemCard item={item.move} isFirst={index === 0} key={index} />
        ))}

        <Text style={styles.h2}>Evolutions</Text>

        {getEvolutionNames(evolutionChainData?.chain, pokemonName).map((item, index) => (
          <ListItemCard item={item} pathname={"/pages/pokemon-details"} isFirst={index === 0} key={index} />
        ))}

        <View style={styles.extraPadding} />
      </View>
    </PageContainer>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16
  },
  typesContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  extraPadding: {
    height: EXTRA_PADDING_BELOW_CONTENT
  },
  h2: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16
  },
})