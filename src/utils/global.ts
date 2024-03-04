import { Platform } from "react-native";

// DO NOT USE THIS
// THIS IS NOT REACTING PROPERLY TO WINDOW RESIZE
// USE tw.prefixMatch("lg") INSTEAD
// export const isDesktop =
// 	Platform.OS === "web" && deviceType === DeviceType.DESKTOP;

// export const isMobile =
// 	Platform.OS === "web" && deviceType === DeviceType.PHONE;

export const isWeb = Platform.OS === "web";
