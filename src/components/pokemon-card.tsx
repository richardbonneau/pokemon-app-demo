import React from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"

import { Pokemon } from "../models"
import { Colors } from "../utils"
import { Link } from "expo-router"


// Changed prop name to `pokemon` because it's more intuitive and readable than `item`
interface IProps {
  pokemon: Pokemon
  isFirst?: boolean
}

export const PokemonCard: React.FunctionComponent<IProps> =
  ({ pokemon, isFirst = false }) => {

    return (
      <View style={[styles.card, isFirst && styles.first]}>
        {/* 
          Using a different Router Library here I would have used `/pages/pokemon/:id` instead because it follows RESTful routing conventions. 
          However, I find PokemonDetails to be a better component name than Pokemon because the later is too similar to the other page name at a glance.
        */}
        <Link href={
          {
            pathname: "/pages/pokemon-details",
            params: {url: pokemon.url, name:pokemon.name}
          }
        } asChild>
        <Pressable>
          <Text style={styles.name}>{pokemon.name}</Text>
          <Text style={styles.url}>{pokemon.url}</Text>
        </Pressable>
      
      </Link>

      </View>
    )
  }

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginTop: 8,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    padding: 8
  },
  first: {
    marginTop: 0
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "capitalize"
  },
  url: {
    fontSize: 12,
    color: Colors.GRAY,
    marginTop: 4
  }
})
