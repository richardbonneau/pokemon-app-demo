import React from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"

import { URLItem } from "../models"
import { Colors } from "../utils"
import { Link } from "expo-router"

interface IProps {
  item: URLItem
  pathname?: string
  isFirst?: boolean
}

export const ListItemCard: React.FunctionComponent<IProps> =
  ({ item, pathname, isFirst = false }) => {
    console.log("item ", item.name)
    return (
      <View style={[styles.card, isFirst && styles.first]}>
        <Link href={
          {
            pathname,
            params: { url: item.url, name: item.name }
          }
        } asChild>
          <Pressable>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.url}>{item.url}</Text>
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
