import { VideoCameraSvg } from "@assets/svgs/common";
import RoundButton from "@components/common/RoundButton";
import { FypText } from "@components/common/base";
import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { PostsNavigationStacks } from "@usertypes/navigations";
import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import the icon library

interface BookVideoCallProps {
	username: string;
	onClick: () => void;
}
interface SpacerProps {
	size: number;
}

const Spacer: React.FC<SpacerProps> = ({ size }) => (
	<View style={[{ width: size }]} />
);

const BookVideoCall: React.FC<BookVideoCallProps> = ({ username, onClick }) => {
	const handleBookVideoCall = () => {
		onClick();
	};

	return (
		<FansView
			borderRadius={34}
			margin={{ b: 30, t: 12 }}
			flexDirection="row"
			style={tw.style("border border-fans-purple")}
		>
			<View style={styles.leftSection}>
				<Image
					source={require("@assets/images/call-to-action-video.png")}
					style={styles.image}
					resizeMode="cover"
				/>
			</View>
			<View style={styles.rightSection}>
				<FypText fontSize={24} fontWeight={700} margin={{ b: 10 }}>
					Just for you
				</FypText>
				<FypText fontSize={16} margin={{ b: 20 }}>
					Have an exclusive 1:1 video call with {username}!
				</FypText>
				<RoundButton onPress={handleBookVideoCall}>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							margin: 10,
						}}
					>
						<VideoCameraSvg
							width={14.6}
							height={13.6}
							color={"white"}
						/>
						<Spacer size={10} />
						<View>Book Video call</View>
					</View>
				</RoundButton>
			</View>
		</FansView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "row",
	},
	leftSection: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	rightSection: {
		flex: 2,
		padding: 20,
	},
	image: {
		width: "75%",
		height: "75%",
	},
	button: {
		backgroundColor: "#f57c00",
		padding: 10,
		borderRadius: 5,
		alignItems: "center",
	},
	buttonText: {
		fontSize: 18,
		color: "#fff",
	},
});

export default BookVideoCall;
