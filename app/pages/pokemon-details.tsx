import { useLocalSearchParams  } from "expo-router"
import React from "react"
import { ActivityIndicator, Text, StyleSheet } from "react-native"
import { PageContainer, PokemonCard, PokemonsFooter } from "../../src/components"
import { useQuery } from "@tanstack/react-query"
import { PokemonService } from "../../src/services"


export default function PokemonDetails() {
  const params = useLocalSearchParams()

  const url = params.url as string
  const pokemonId = url.substring(url.lastIndexOf('/') + 1)
  const { data, isLoading, error } = useQuery({
    queryKey:['pokemonDetails', params.id],
    queryFn: () => PokemonService.getPokemonDetails(pokemonId)
  });


  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>An error occurred: {error.message}</Text>;
  }
  console.log("details data",{url,pokemonId,data})
  return (
    <PageContainer title="Pokemon">
      <Text>{params.id}</Text>
      <Text>{params.url}</Text>
    </PageContainer>
  )
}


const styles = StyleSheet.create({
  contentContainerStyle: {
    padding: 16,
  }
})
