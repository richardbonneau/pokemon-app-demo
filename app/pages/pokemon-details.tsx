import { useLocalSearchParams } from "expo-router"
import React from "react"
import { Image, Text, StyleSheet, View, FlatList } from "react-native"
import { ListItemCard, PageContainer } from "../../src/components"
import { useQuery } from "@tanstack/react-query"
import { PokemonService } from "../../src/services"
import { PokemonTypeLabel } from "../../src/components/pokemon-type-label"
import { Move, PokemonType } from "../../src/models"
import { useSafeAreaInsets } from "react-native-safe-area-context"

function getPokemonIdFromUrl(url: string | string[] | undefined): string | undefined {
  console.log("url", url)
  if (typeof url === 'string') {
    const parts = url.split('/');
    return parts[parts.length - 2];
  }
}

export default function PokemonDetails() {
  const params = useLocalSearchParams()
  const insets = useSafeAreaInsets()

  const pokemonId = getPokemonIdFromUrl(params.url)

  if (!pokemonId) {
    return <PageContainer title="Error"><Text>Error: Invalid URL</Text></PageContainer>
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['pokemonDetails', params.id],
    queryFn: () => PokemonService.getPokemonDetails(pokemonId)
  });

  if (isLoading) {
    return <PageContainer title="Loading..."><Text>Loading...</Text></PageContainer>;
  }

  if (error) {
    return <PageContainer title="Error"><Text>An error occurred: {error.message}</Text></PageContainer>;
  }

  return (
    <PageContainer title="Pokemon">
      <Image source={{ uri: data.sprites.front_default }} style={styles.image} />

      <View style={styles.typesContainer}>
        {data.types.map((type: PokemonType, i: number) => (<PokemonTypeLabel type={type.type.name} key={i} />))}
      </View>
      {/* 
      <View style={styles.abilitiesContainer}>
        {data.moves.map((move: Move, i: number) => (<ListItemCard item={move.move} key={i} />))}
      </View> */}

      <FlatList
        data={data?.moves.slice(0, 5).flat()}
        contentContainerStyle={[styles.contentContainerStyle, {
          paddingBottom: insets.bottom
        }]}
        renderItem={
          ({ item, index }) => (
            <ListItemCard item={item.move} isFirst={index === 0} />
          )
        }
      />

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
  },
  typesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  abilitiesContainer: {
    padding: 16,
  }
})
