import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { IFypModal } from "@usertypes/components";
import React from "react";
import { Modal, ScrollView } from "react-native";

export const FypModal: IFypModal = (props) => {
	const { visible, children, onDismiss, width, maxWidth } = props;

	return (
		<Modal transparent visible={visible}>
			<FansView
				width="screen"
				height="screen"
				touchableOpacityProps={{ activeOpacity: 1, onPress: onDismiss }}
				alignItems="center"
				backgroundColor={{ color: "black", opacity: 31 }}
				justifyContent="center"
				padding={{
					x: width !== "screen" ? 18 : 0,
					y: width !== "screen" ? 30 : 0,
				}}
			>
				<FansView
					width={width}
					touchableOpacityProps={{ activeOpacity: 1 }}
					borderRadius={15}
					style={tw.style(
						"max-h-full",
						"bg-fans-white dark:bg-fans-black-1d",
						maxWidth ? `max-w-[${maxWidth}px]` : "",
					)}
				>
					<ScrollView>{children}</ScrollView>
				</FansView>
			</FansView>
		</Modal>
	);
};
