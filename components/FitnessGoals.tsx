import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import Animated, { LinearTransition, FadeOut } from "react-native-reanimated";

const INITIAL_LIST = [
  { id: 1, meta: "Ganar músculo", color: "#b58df1" },
  { id: 2, meta: "Perder peso", color: "#ffe780" },
  { id: 3, meta: "Aumentar resistencia", color: "#fa7f7c" },
  { id: 4, meta: "Correr 5 km", color: "#82cab2" },
  { id: 5, meta: "Mejorar flexibilidad", color: "#fa7f7c" },
  { id: 6, meta: "Mantener el equilibrio", color: "#b58df1" },
  { id: 7, meta: "Hacer 20 dominadas", color: "#ffe780" },
  { id: 8, meta: "Reducir grasa corporal", color: "#b58df1" },
  { id: 9, meta: "otra meta", color: "#82cab2" },
  { id: 10, meta: "otra meta", color: "#82cab2" },
  { id: 11, meta: "otra meta", color: "#82cab2" },
  { id: 12, meta: "otra meta", color: "#82cab2" },
  { id: 13, meta: "otra meta", color: "#82cab2" },
  { id: 14, meta: "otra meta", color: "#82cab2" },
  { id: 15, meta: "otra meta", color: "#82cab2" },
  { id: 16, meta: "otra meta", color: "#82cab2" },
];

export default function FitnessGoals({ onSelectedGoals }: any) {
  const [items, setItems] = useState(INITIAL_LIST);
  const [selectedGoals, setSelectedGoals] = useState<{ meta: string }[]>([]);
  const [scrollY, setScrollY] = useState(0);

  const removeItem = (idToRemove: number) => {
    const itemToRemove = items.find((item) => item.id === idToRemove);
    if (itemToRemove) {
      setSelectedGoals((prevGoals) => [
        ...prevGoals,
        { meta: itemToRemove.meta },
      ]);
    }
    const updatedItems = items.filter((item) => item.id !== idToRemove);
    setItems(updatedItems);
  };

  const getOpacity = (index: number) => {
    const itemPosition = index * 10;
    const distanceFromBottom = Math.abs(scrollY - 9 - itemPosition);
    const opacity =
      distanceFromBottom < 100
        ? 1
        : Math.max(0.5, 1 - (distanceFromBottom - 100) / 100);
    return opacity;
  };

  useEffect(() => {
    if (onSelectedGoals) {
      onSelectedGoals(selectedGoals);
    }
  }, [selectedGoals]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
          setScrollY(event.nativeEvent.contentOffset.y);
        }}
        scrollEventThrottle={16}
      >
        <Items items={items} onRemove={removeItem} getOpacity={getOpacity} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Items({ items, onRemove, getOpacity }: any) {
  return (
    <View style={styles.gridContainer}>
      {items.map(
        (
          item: { id: React.Key | null | undefined; color: any; meta: any },
          index: number
        ) => (
          <Animated.View
            key={item.id}
            layout={LinearTransition}
            exiting={FadeOut}
            style={[styles.tileContainer, { backgroundColor: item.color }]}
          >
            <Animated.View style={{ opacity: getOpacity(index) }}>
              <Tile meta={item.meta} onRemove={() => onRemove(item.id)} />
            </Animated.View>
          </Animated.View>
        )
      )}
    </View>
  );
}

function Tile({ meta, onRemove }: any) {
  return (
    <TouchableOpacity onPress={onRemove} style={styles.tile}>
      <Animated.Text style={styles.tileLabel}>{meta}</Animated.Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  tileContainer: {
    width: "40%",
    margin: "1%",
    borderRadius: 16,
    minHeight: 80,
    justifyContent: "center",
  },
  tile: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  tileLabel: {
    color: "black",
    fontSize: 15,
    fontWeight: "bold",
  },
});
