import React, { useEffect, useRef, useState } from "react";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Animated,
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
} from "react-native";
import PropTypes from "prop-types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import account from "../../assets/images/Section=Account.png";
import home from "../../assets/images/Section=Home.png";
import marketplace from "../../assets/images/Section=Marketplace.png";
import services from "../../assets/images/Section=Services.png";

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
          tabBarIcon: ({ color }) => (
            <Image source={home} style={[stylesBar.tabIcon, { tintColor: color }]} />
          ),
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: "Marketplace",
          tabBarIcon: ({ color }) => (
            <Image source={marketplace} style={[stylesBar.tabIcon, { tintColor: color }]} />
          ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: "Services",
          tabBarIcon: ({ color }) => (
            <Image source={services} style={[stylesBar.tabIcon, { tintColor: color }]} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => (
            <Image source={account} style={[stylesBar.tabIcon, { tintColor: color }]} />
          ),
        }}
      />
    </Tabs>
  );
}

function AnimatedTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const [itemLayouts, setItemLayouts] = useState({});
  const translateX = useRef(new Animated.Value(0)).current;
  const activeWidth = useRef(new Animated.Value(80)).current;

  useEffect(() => {
    const layout = itemLayouts[state.index];
    if (!layout) return;
    
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: layout.x,
        stiffness: 200,
        damping: 20,
        mass: 0.8,
        useNativeDriver: false,
      }),
      Animated.spring(activeWidth, {
        toValue: layout.width,
        stiffness: 200,
        damping: 20,
        mass: 0.8,
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

  const bottomOffset = Math.max(5, (insets?.bottom || 0) + 5);

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
  const iconScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(iconScale, {
      toValue: focused ? 1.1 : 1,
      stiffness: 180,
      damping: 15,
      mass: 0.7,
      useNativeDriver: true,
    }).start();
  }, [focused, iconScale]);

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
      style={stylesBar.itemTouchable}
      activeOpacity={0.9}
    >
      <Animated.View style={[stylesBar.itemInner, { transform: [{ scale }] }]}> 
        <Animated.View style={{ transform: [{ scale: iconScale }] }}>
          {icon}
        </Animated.View>
        {focused && (
          <Text style={stylesBar.label} numberOfLines={1} ellipsizeMode="tail">
            {label}
          </Text>
        )}
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
  tabIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  wrapper: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 20,
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2D3748",
    borderRadius: 30,
    paddingHorizontal: 6,
    paddingVertical: 8,
    height: 70,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  activePill: {
    position: "absolute",
    top: 8,
    bottom: 8,
    backgroundColor: "#4A5568",
    borderRadius: 22,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  itemTouchable: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: 4,
    minHeight: 54,
  },
  itemInner: {
    height: 54,
    borderRadius: 22,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    minWidth: 80,
    maxWidth: 120,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
    fontSize: 9,
    flexShrink: 1,
    textAlign: "center",
    lineHeight: 12,
    width: "100%",
  },
});
