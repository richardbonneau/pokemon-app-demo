import { useNavigation } from "expo-router"
import React, { FunctionComponent, PropsWithChildren, useRef } from "react"
import { Animated, Pressable, StyleSheet, Text, View, Dimensions, Image } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Colors } from "../utils"
import { capitalizeFirstLetter } from "../utils/helpers"

type Props = {
  title: string
  imageUri?: string,
  scrollY?: Animated.Value
}

export const PageContainer: FunctionComponent<PropsWithChildren<Props>> =
  ({ children, title, imageUri, scrollY = new Animated.Value(0) }) => {
    const insets = useSafeAreaInsets()
    const { goBack } = useNavigation()
    const { width, height } = Dimensions.get('window');

    const headerScale = scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [3, 0.3],
      extrapolate: 'clamp'
    });

    const headerHeight = scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [200, 60],
      extrapolate: 'clamp'
    });

    const imageSize = scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [100, 20],
      extrapolate: 'clamp'
    });

    const imagePositionX = scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [width / 2 - 50, 0],
      extrapolate: 'clamp'
    });

    const imagePositionY = scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [width / 2 - 50, 0],
      extrapolate: 'clamp'
    });

    return (
      <>
        <Animated.View style={[styles.header, {
          paddingTop: insets.top,
          height: headerHeight
        }]}>
          <Pressable onPress={goBack} style={[styles.button, styles.part]}>
            <Text style={styles.back}>
              ← Back
            </Text>
          </Pressable>
          <Text style={[styles.title, styles.part]} ellipsizeMode='tail' numberOfLines={1}>{capitalizeFirstLetter(title)}</Text>
          <View style={styles.part} />

          <Animated.Image
            source={{ uri: imageUri }}
            style={[styles.headerImage, {
              width: imageSize,
              height: imageSize,
              right: imagePositionX,
              top: imagePositionY
            }]}
          />
        </Animated.View>
        {children}
      </>
    )
  }

const styles = StyleSheet.create({
  back: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontWeight: 'bold'
  },
  button: {
    paddingVertical: 10
  },
  header: {
    backgroundColor: Colors.WHITE,
    borderBottomWidth: 1,
    borderColor: Colors.GRAY,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    position: 'relative',
  },
  headerImage: {
    position: 'absolute',
    resizeMode: 'contain'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  part: {
    flex: 1,
  }
})