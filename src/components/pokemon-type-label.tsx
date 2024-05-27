import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { TypeColors } from "../utils"

interface IProps {
    type: string
}

export const PokemonTypeLabel: React.FunctionComponent<IProps> =
    ({ type }) => {
        return (
            <View style={[styles.container, {
                backgroundColor: TypeColors[type as keyof typeof TypeColors]
            }]}>
                <Text style={styles.labelText}>{type}</Text>
            </View>
        )
    }

const styles = StyleSheet.create({
    container: {
        padding: 2,
        marginLeft: 6,
        marginBottom: 6,
    },
    labelText: {
        color: 'white',
        textTransform: 'capitalize',
    }
})
