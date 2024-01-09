import { FansText } from "@components/controls/Text";
import tw from "@lib/tailwind";
import React, { FC, useState } from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

interface Props {
	text: string;
}

const BioText: FC<Props> = (props) => {
	const { text } = props;
	const [openShowMore, setOpenShowMore] = useState(false);
	const [height, setHeight] = useState(0);

	const offset = useSharedValue(105);

	const animationStyles = useAnimatedStyle(() => {
		return {
			maxHeight: withTiming(offset.value, {
				duration: 100,
			}),
		};
	});

	const toggleShowMore = (val: boolean) => {
		setOpenShowMore(val);
		offset.value = val ? height : 105;
	};

	return (
		<View>
			<Animated.View style={[{ overflow: "hidden" }, animationStyles]}>
				<View onLayout={(e) => setHeight(e.nativeEvent.layout.height)}>
					<FansText
						fontSize={16}
						lineHeight={21}
						style={tw.style("text-fans-black dark:text-fans-white")}
					>
						{text}
					</FansText>
				</View>
			</Animated.View>
			{height > 105 ? (
				<View style={tw.style("flex-row")}>
					<Button
						labelStyle={tw.style(
							"text-[15px] leading-5 text-fans-purple m-0",
						)}
						style={tw.style("min-w-0 min-h-0")}
						onPress={() => toggleShowMore(!openShowMore)}
					>
						{openShowMore ? "Less info" : "More info"}
					</Button>
				</View>
			) : null}
		</View>
	);
};

export default BioText;
