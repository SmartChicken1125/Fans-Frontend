import { CloseSvg } from "@assets/svgs/common";
import { FansText } from "@components/controls";
import { Ionicons } from "@expo/vector-icons"; // or any other icon library you're using
import tw from "@lib/tailwind";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import React from "react";
import { View, TouchableOpacity, Image, Text } from "react-native";
import { IconButton } from "react-native-paper";
interface User {
	avatar: string;
	name: string;
	checked: boolean;
}

export const ChatRoomHeader: React.FC<NativeStackHeaderProps> = ({
	navigation,
	route,
}) => {
	// Hardcoded mock user for testing purposes
	const mockUser: User = {
		avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Bella",
		name: "John Lennon",
		checked: true,
	};

	const user = mockUser;

	return (
		<View
			style={{
				flexDirection: "row",
				justifyContent: "space-between",
				alignItems: "center",
				backgroundColor: "black",
				paddingVertical: 10,
				paddingHorizontal: 15,
			}}
		>
			<View style={{ flexDirection: "row", alignItems: "center" }}>
				<Image
					source={{ uri: user.avatar }}
					style={{ width: 30, height: 30, borderRadius: 15 }}
				/>

				<FansText
					textAlign="center"
					fontFamily="inter-semibold"
					fontSize={16}
					color={"white"}
				>
					{user.name}
				</FansText>

				{user.checked ? (
					<Ionicons
						name="checkmark-done"
						size={20}
						color="white"
						style={{ marginLeft: 5 }}
					/>
				) : (
					<Ionicons
						name="checkmark-done-outline"
						size={20}
						color="white"
						style={{ marginLeft: 5 }}
					/>
				)}
			</View>

			<View style={{ flexDirection: "row", alignItems: "center" }}>
				<TouchableOpacity onPress={() => console.log("hey")}>
					<Ionicons
						name="ellipsis-vertical"
						size={24}
						color="white"
						style={{ marginRight: 15 }}
					/>
				</TouchableOpacity>

				<IconButton
					icon={() => (
						<CloseSvg
							style={tw.style(
								"w-3 h-3 lg:w-[14.45px] lg:h-[14.45px]",
							)}
							color="#fff"
						/>
					)}
					containerColor="rgba(255, 255, 255, 0.3);"
					style={tw.style(
						"w-6 h-6 lg:w-7.5 lg:h-7.5 ml-auto my-0 mr-0",
					)}
					onPress={() => {
						navigation.navigate("Home");
					}}
				/>
			</View>
		</View>
	);
};
