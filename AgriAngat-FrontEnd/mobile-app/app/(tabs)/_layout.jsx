import React, { useEffect, useRef, useState } from "react";
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

const renderTabBar = (props) => <AnimatedTabBar {...props} />;

const homeTabIcon = ({ color }) => (
  <Ionicons name="home" size={20} color={color} />
);

const marketplaceTabIcon = ({ color }) => (
  <Ionicons name="cart" size={20} color={color} />
);

const servicesTabIcon = ({ color }) => (
  <Ionicons name="construct" size={20} color={color} />
);

const accountTabIcon = ({ color }) => (
  <Ionicons name="person" size={20} color={color} />
);

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
          tabBarIcon: homeTabIcon,
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: "Marketplace",
          tabBarIcon: marketplaceTabIcon,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: "Services",
          tabBarIcon: servicesTabIcon,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: accountTabIcon,
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
      Animated.timing(translateX, {
        toValue: layout.x,
        duration: 260,
        easing: Easing.out(Easing.circle),
        useNativeDriver: false,
      }),
      Animated.timing(activeWidth, {
        toValue: Math.max(layout.width, 92),
        duration: 260,
        easing: Easing.out(Easing.circle),
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

  const bottomOffset = Math.max(16, (insets?.bottom || 0) + 12);

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
            color: focused ? "#fff" : "#D9D9D9",
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
                  navigation.navigate(route.name);
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

  useEffect(() => {
    Animated.timing(labelOpacity, {
      toValue: focused ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [focused, labelOpacity]);

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
        {icon}
        <Animated.Text
          style={[stylesBar.label, { opacity: labelOpacity }]}
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
    left: 16,
    right: 16,
    bottom: 16,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#3f3f3f",
    borderRadius: 28,
    paddingHorizontal: 12,
    height: 64,
    overflow: "hidden",
  },
  activePill: {
    position: "absolute",
    left: 6,
    top: 6,
    bottom: 6,
    backgroundColor: "#2f2f2f",
    borderRadius: 22,
  },
  itemTouchable: {
    flex: 1,
  },
  itemInner: {
    height: 52,
    borderRadius: 22,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  label: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    flexShrink: 1,
    maxWidth: 120,
  },
});
