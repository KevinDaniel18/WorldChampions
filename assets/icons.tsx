import React from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Foundation from "@expo/vector-icons/Foundation";

export type RouteName = "index" | "excercises" | "profile";

export const icons: Record<RouteName, (props: any) => JSX.Element> = {
  index: (props: any) => <Foundation name="home" size={24} {...props} />,
  excercises: (props: any) => (
    <FontAwesome6 name="dumbbell" size={24} {...props} />
  ),
  profile: (props: any) => <FontAwesome name="user" size={24} {...props} />,
};
