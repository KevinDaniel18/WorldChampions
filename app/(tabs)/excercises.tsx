import { View, Text } from "react-native";
import React, { useCallback, useState } from "react";
import Animated, {SlideInRight } from "react-native-reanimated";
import { useFocusEffect } from "expo-router";
const Excercises = () => {
  const [key, setKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setKey((prevKey) => prevKey + 1);
    }, [])
  );

  return (
    <View style={{flex: 1, backgroundColor: "black"}}>
      <Animated.View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
        key={key}
        entering={SlideInRight}
      >
        <Text style={{ color: "white" }}>Las rutinas y planes</Text>
      </Animated.View>
    </View>
  );
};

export default Excercises;
