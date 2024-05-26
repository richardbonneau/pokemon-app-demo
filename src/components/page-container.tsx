import { useNavigation } from "expo-router"
import React, { FunctionComponent, PropsWithChildren, useRef } from "react"
import { Animated, Pressable, StyleSheet, Text, View, Dimensions, Image } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Colors } from "../utils"
import { HEADER_HEIGHT_COLLAPSED, HEADER_HEIGHT_EXTENDED, SCROLL_INPUT_RANGE } from "../utils/ui-constants"

type Props = {
  title: string
  imageUri?: string,
}

export const PageContainer: FunctionComponent<PropsWithChildren<Props>> =
  ({ children, title, imageUri }) => {
    const insets = useSafeAreaInsets()
    const { goBack } = useNavigation()
    const { width } = Dimensions.get('window');
    const scrollY = useRef(new Animated.Value(0)).current;

    const imageSize = scrollY.interpolate({
      inputRange: SCROLL_INPUT_RANGE,
      outputRange: [200, 32],
      extrapolate: 'clamp'
    });

    const headerHeight = scrollY.interpolate({
      inputRange: SCROLL_INPUT_RANGE,
      outputRange: [HEADER_HEIGHT_EXTENDED, HEADER_HEIGHT_COLLAPSED],
      extrapolate: 'clamp'
    });

    const imagePositionX = scrollY.interpolate({
      inputRange: SCROLL_INPUT_RANGE,
      outputRange: [width / 2 - 100, 30],
      extrapolate: 'clamp'
    });

    const imagePositionY = scrollY.interpolate({
      inputRange: SCROLL_INPUT_RANGE,
      outputRange: [75, 38],
      extrapolate: 'clamp'
    });

    return (
      <>
        <Animated.View style={[styles.header, {

          paddingTop: insets.top,
          height: imageUri ? headerHeight : HEADER_HEIGHT_COLLAPSED
        }]}>
          <Pressable onPress={goBack} style={[styles.button, styles.part]}>
            <Text style={styles.back}>
              ← Back
            </Text>
          </Pressable>
          <Text style={[styles.title, styles.part]} ellipsizeMode='tail' numberOfLines={1}>{title}</Text>
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
        <Animated.ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            {
              useNativeDriver: false
            }
          )}
        >
          <View style={{ height: imageUri ? HEADER_HEIGHT_EXTENDED : HEADER_HEIGHT_COLLAPSED }} />
          {children}
        </Animated.ScrollView>
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
    zIndex: 100,
    width: '100%',
    position: 'absolute'

  },
  headerImage: {
    position: 'absolute',
    resizeMode: 'contain',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  part: {
    flex: 1,
  }
})