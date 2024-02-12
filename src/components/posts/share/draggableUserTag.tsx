import { CloseSvg } from "@assets/svgs/common";
import { FypText } from "@components/common/base";
import { FansIconButton, FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { IUserTag } from "@usertypes/types";
import React, { FC } from "react";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { Popover } from "react-native-popable";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
} from "react-native-reanimated";

interface Props {
	visible: boolean;
	userTag: IUserTag;
	mediaSize: number[];
	onRemove: () => void;
	onUpdate: (position: number[]) => void;
}

const DraggableUserTag: FC<Props> = (props) => {
	const { visible, userTag, onRemove, mediaSize, onUpdate } = props;
	const position = [
		mediaSize[0] * userTag.pointX,
		mediaSize[1] * userTag.pointY,
	];
	const coordinate = useSharedValue(position);
	const pan = Gesture.Pan()
		.onUpdate((e) => {
			const posX = position[0] + e.translationX;
			const poxY = position[1] + e.translationY;
			if (
				posX < 0 ||
				posX > mediaSize[0] ||
				poxY < 0 ||
				poxY > mediaSize[1]
			) {
				return;
			} else {
				coordinate.value = [
					position[0] + e.translationX,
					position[1] + e.translationY,
				];
			}
		})
		.onEnd(() => {
			onUpdate([
				coordinate.value[0] / mediaSize[0],
				coordinate.value[1] / mediaSize[1],
			]);
		});

	const animatedStyle = useAnimatedStyle(() => ({
		left: coordinate.value[0],
		top: coordinate.value[1],
	}));

	return (
		<GestureDetector gesture={pan}>
			<Animated.View
				style={[
					tw.style("w-[150px] h-10 absolute"),
					{
						transform: [{ translateX: -75 }],
					},
					animatedStyle,
				]}
			>
				<Popover
					visible={visible}
					style={[
						{
							width: 150,
						},
					]}
				>
					<FansView
						flexDirection="row"
						alignItems="center"
						padding={{ l: 4, r: 16 }}
						gap={1}
						position="relative"
					>
						<FypText
							color="white"
							fontSize={17}
							numberOfLines={1}
							lineHeight={22}
							textAlign="center"
							style={tw.style("flex-1")}
						>
							{userTag.user?.username}
						</FypText>

						<FansIconButton
							size={12}
							backgroundColor="bg-transparent"
							style={tw.style("absolute top-[5px] right-1")}
							onPress={onRemove}
						>
							<CloseSvg color="#fff" size={10} />
						</FansIconButton>
					</FansView>
				</Popover>
			</Animated.View>
		</GestureDetector>
	);
};

export default DraggableUserTag;
