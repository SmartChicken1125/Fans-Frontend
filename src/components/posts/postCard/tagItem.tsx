import { FypText } from "@components/common/base";
import { FansView } from "@components/controls";
import { IPostMediaTag } from "@usertypes/types";
import { useRouter } from "expo-router";
import React, { FC } from "react";
import { Popover } from "react-native-popable";

interface Props {
	visible: boolean;
	tag: IPostMediaTag;
	mediaSize: number;
}

const TagItem: FC<Props> = (props) => {
	const { visible, tag, mediaSize } = props;

	const router = useRouter();

	const handlePress = () => {
		router.push(`/${tag.user.username}`);
	};

	return (
		<Popover
			visible={visible}
			style={[
				{
					position: "absolute",
					top: tag.pointY * mediaSize,
					left: tag.pointX * mediaSize,
					transform: [{ translateX: -75 }],
					width: 150,
				},
			]}
		>
			<FansView>
				<FansView
					pressableProps={{
						onPress: handlePress,
					}}
				>
					<FypText color="white" textAlign="center" fontSize={17}>
						{tag.user.displayName}
					</FypText>
				</FansView>
			</FansView>
		</Popover>
	);
};

export default TagItem;
