import { useLocalSearchParams } from "expo-router"
import React from "react"
import { Image, Text, StyleSheet } from "react-native"
import { PageContainer, PokemonCard, PokemonsFooter } from "../../src/components"
import { useQuery } from "@tanstack/react-query"
import { PokemonService } from "../../src/services"

function getPokemonIdFromUrl(url: string | string[] | undefined): string | undefined {
  console.log("url", url)
  if (typeof url === 'string') {
    const parts = url.split('/');
    return parts[parts.length - 2];
  }
}

export default function PokemonDetails() {
  const params = useLocalSearchParams()

  const pokemonId = getPokemonIdFromUrl(params.url)

  if (!pokemonId) {
    return <PageContainer title="Error"><Text>Error: Invalid URL</Text></PageContainer>
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['pokemonDetails', params.id],
    queryFn: () => PokemonService.getPokemonDetails(pokemonId)
  });

  if (isLoading) {
    return <PageContainer title="Error"><Text>Loading...</Text></PageContainer>;
  }

  if (error) {
    return <PageContainer title="Error"><Text>An error occurred: {error.message}</Text></PageContainer>;
  }

  return (
    <PageContainer title="Pokemon">
      <Image source={{ uri: data.sprites.front_default }} style={styles.image} />
    </PageContainer>
  )
}


const styles = StyleSheet.create({
  contentContainerStyle: {
    padding: 16,
  },
  image: {
    width: 200,
    height: 200,
  }
})
