import {
  DefaultError,
  InfiniteData,
  useInfiniteQuery
} from "@tanstack/react-query"
import React from "react"
import { ActivityIndicator, FlatList, StyleSheet } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { PokemonService } from "../../src/services"
import { PageContainer, ListItemCard, PokemonsFooter } from "../../src/components"
import { URLItem } from "../../src/models"

const PAGE_SIZE = 20

export default function Pokemons() {
  const insets = useSafeAreaInsets()

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery<
      URLItem,
      DefaultError,
      InfiniteData<URLItem, number>,
      string[],
      number
    >({
      queryKey: ['pokemons'],
      queryFn: ({ pageParam }) => PokemonService.getPokemons({
        limit: PAGE_SIZE,
        offset: pageParam
      }),
      initialPageParam: 0,
      getNextPageParam: (_, allPages) => allPages.length * PAGE_SIZE
    })

  return (
    <PageContainer title="Pokemons">
      {isLoading && <ActivityIndicator />}
      {!isLoading && (
        <FlatList
          data={data?.pages.flat()}
          contentContainerStyle={[styles.contentContainerStyle, {
            paddingBottom: insets.bottom
          }]}
          renderItem={
            ({ item, index }) => (
              <ListItemCard item={item} pathname={"/pages/pokemon-details"} isFirst={index === 0} />
            )
          }
          ListFooterComponent={
            <PokemonsFooter
              isHidden={!hasNextPage}
              onPress={fetchNextPage}
              isLoading={isFetchingNextPage}
            />
          }
        />
      )}
    </PageContainer>
  )
}


const styles = StyleSheet.create({
  contentContainerStyle: {
    padding: 16,
  }
})
