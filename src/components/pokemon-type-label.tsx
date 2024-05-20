import React from "react"
import { StyleSheet, Text, View } from "react-native"

interface IProps {
    type: string
}

export const PokemonTypeLabel: React.FunctionComponent<IProps> =
    ({ type }) => {
        return (
            <View style={styles.container}>
                <Text>{type}</Text>
            </View>
        )
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})
