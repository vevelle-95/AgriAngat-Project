import React, { useEffect, useRef, useState, Images } from "react";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Animated,
  Easing,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from "react-native";
import PropTypes from "prop-types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import account from "../assets/images/Section=Account.png";
import home from "../assets/images/Section=Home.png";
import marketplace from "../assets/images/Section=Marketplace.png";
import services from "../assets/images/Section=Services.png";

const renderTabBar = (props) => <AnimatedTabBar {...props} />;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={renderTabBar}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: home,
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: "Marketplace",
          tabBarIcon: marketplace,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: "Services",
          tabBarIcon: services,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: account,
        }}
      />
    </Tabs>
  );
}

function AnimatedTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const [itemLayouts, setItemLayouts] = useState({});
  const translateX = useRef(new Animated.Value(0)).current;
  const activeWidth = useRef(new Animated.Value(64)).current;

  useEffect(() => {
    const layout = itemLayouts[state.index];
    if (!layout) return;
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: layout.x,
        stiffness: 220,
        damping: 22,
        mass: 0.6,
        useNativeDriver: false,
      }),
      Animated.spring(activeWidth, {
        toValue: Math.max(layout.width, 30),
        stiffness: 220,
        damping: 22,
        mass: 0.6,
        useNativeDriver: false,
      }),
    ]).start();
  }, [state.index, itemLayouts, translateX, activeWidth]);

  const onItemLayout = (index, x, width) => {
    setItemLayouts((prev) =>
      prev[index]?.width === width && prev[index]?.x === x
        ? prev
        : { ...prev, [index]: { x, width } }
    );
  };

  const bottomOffset = Math.max(8, (insets?.bottom || 0) + 8);

  return (
    <View style={[stylesBar.wrapper, { bottom: bottomOffset }]}>
      <View style={stylesBar.container}>
        {/* Active pill */}
        {itemLayouts[state.index] && (
          <Animated.View
            style={[
              stylesBar.activePill,
              {
                width: activeWidth,
                transform: [{ translateX }],
              },
            ]}
          />
        )}

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const icon = options.tabBarIcon?.({
            color: focused ? "#fff" : "#ECECEC",
            size: 20,
            focused,
          });
          let label = route.name;
          if (typeof options.tabBarLabel === "string") {
            label = options.tabBarLabel;
          } else if (typeof options.title === "string") {
            label = options.title;
          }

          return (
            <TabItem
              key={route.key}
              index={index}
              label={label}
              focused={focused}
              icon={icon}
              onLayout={onItemLayout}
              onPress={() => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  // Fallback to rAF to avoid rare timing issues
                  requestAnimationFrame(() => navigation.navigate(route.name));
                }
              }}
              onLongPress={() =>
                navigation.emit({ type: "tabLongPress", target: route.key })
              }
            />
          );
        })}
      </View>
    </View>
  );
}

AnimatedTabBar.propTypes = {
  state: PropTypes.shape({
    index: PropTypes.number.isRequired,
    routes: PropTypes.array.isRequired,
  }).isRequired,
  descriptors: PropTypes.object.isRequired,
  navigation: PropTypes.shape({
    emit: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

function TabItem({
  index,
  label,
  focused,
  icon,
  onLayout,
  onPress,
  onLongPress,
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const labelOpacity = useRef(new Animated.Value(focused ? 1 : 0)).current;
  const labelTranslateX = useRef(new Animated.Value(focused ? 0 : 8)).current;
  const iconScale = useRef(new Animated.Value(focused ? 1.1 : 1)).current;
  const iconTranslateY = useRef(new Animated.Value(focused ? -2 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(labelOpacity, {
        toValue: focused ? 1 : 0,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(labelTranslateX, {
        toValue: focused ? 0 : 8,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(iconScale, {
        toValue: focused ? 1.1 : 1,
        stiffness: 240,
        damping: 14,
        mass: 0.5,
        useNativeDriver: true,
      }),
      Animated.spring(iconTranslateY, {
        toValue: focused ? -2 : 0,
        stiffness: 240,
        damping: 14,
        mass: 0.5,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused, labelOpacity, labelTranslateX, iconScale, iconTranslateY]);

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
      accessibilityLabel={label}
      testID={`tab-${label}`}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={() =>
        Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start()
      }
      onPressOut={() =>
        Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()
      }
      onLayout={(e) =>
        onLayout(index, e.nativeEvent.layout.x, e.nativeEvent.layout.width)
      }
      style={[stylesBar.itemTouchable, !focused && { width: 48 }]}
      activeOpacity={0.9}
    >
      <Animated.View style={[stylesBar.itemInner, { transform: [{ scale }] }]}> 
        {focused ? (
          <Animated.View style={[stylesBar.iconWrap, { transform: [{ scale: iconScale }] }]}> 
            {icon}
          </Animated.View>
        ) : (
          <Animated.View style={{ transform: [{ scale: iconScale }, { translateY: iconTranslateY }] }}>
            {icon}
          </Animated.View>
        )}
        <Animated.Text
          style={[
            stylesBar.label,
            { opacity: labelOpacity, transform: [{ translateX: labelTranslateX }] },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {label}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

TabItem.propTypes = {
  index: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  focused: PropTypes.bool.isRequired,
  icon: PropTypes.node,
  onLayout: PropTypes.func.isRequired,
  onPress: PropTypes.func.isRequired,
  onLongPress: PropTypes.func.isRequired,
};

const stylesBar = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 10,
    right: 5,
    bottom: 20,
    marginRight: 50,
    width: "100%",
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#3f3f3f",
    borderRadius: 9999,
    paddingHorizontal: 10,
    height: 64,
    overflow: "hidden",
    marginRight: 28,
    marginTop: 10,
    gap: 2,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    width: "90%",
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  activePill: {
    position: "absolute",
    left: 6,
    top: 6,
    bottom: 6,
    backgroundColor: "#2a2a2a",
    borderRadius: 26,
  },
  itemTouchable: {
    paddingHorizontal: 0,
    minWidth: 58,
    alignItems: "center",
  },
  itemInner: {
    height: 56,
    borderRadius: 26,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
    fontSize: 13,
    flexShrink: 1,
    maxWidth: 140,
  },
});
