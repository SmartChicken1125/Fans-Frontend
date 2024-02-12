import { Close3Svg } from "@assets/svgs/common";
import UserAvatar from "@components/avatar/UserAvatar";
import { FypVideo } from "@components/common/base";
import {
	FansGap,
	FansImage,
	FansSvg,
	FansText,
	FansView,
} from "@components/controls";
import { cdnURL } from "@helper/Utils";
import tw from "@lib/tailwind";
import { MediaType } from "@usertypes/commonEnums";
import { FansModalProps } from "@usertypes/components";
import { IMessage } from "@usertypes/types";
import { ResizeMode } from "expo-av";
import { BlurView } from "expo-blur";
import React, { FC } from "react";
import { Modal, TouchableOpacity } from "react-native";

interface IMediaTimestampModalProps extends FansModalProps {
	data?: IMessage;
	selectedImageIndex: number;
}

const MediaTimestampModal: FC<IMediaTimestampModalProps> = (props) => {
	const { visible, onClose, data, selectedImageIndex } = props;

	const media = data?.media?.[selectedImageIndex];

	return (
		<Modal visible={visible} transparent>
			<BlurView style={tw.style("w-screen h-screen")}>
				<FansView style={tw.style("mx-[17px] my-[20px]")} grow>
					{/* <FansGap height={10.5} /> */}
					<FansView style={tw.style("flex-row items-center")}>
						<UserAvatar
							image={data?.user.avatar ?? undefined}
							size="34px"
						/>
						<FansGap width={13} />
						<FansView style={tw.style("grow")}>
							<FansText fontFamily="inter-semibold" fontSize={16}>
								{data?.user.displayName ?? data?.user.username}
							</FansText>
							{/* <FansText color="grey-70" fontSize={16}>
								2 days ago from camera roll
							</FansText> */}
						</FansView>
						{/* <FansView
							width={34}
							height={34}
							alignItems="center"
							backgroundColor="grey-f0"
							borderRadius="full"
							justifyContent="center"
						>
							<FansView width={15.43} height={15.43}>
								<OutlinedPinSvg />
							</FansView>
						</FansView> */}
						<TouchableOpacity onPress={onClose}>
							<FansView
								width={34}
								height={34}
								alignItems="center"
								alignSelf="end"
								backgroundColor={{
									color: "black",
									opacity: 30,
								}}
								borderRadius="full"
								justifyContent="center"
							>
								<FansSvg
									width={12.69}
									height={12.69}
									svg={Close3Svg}
									color1="white"
								/>
							</FansView>
						</TouchableOpacity>
					</FansView>
					<FansGap height={18.3} />
					<FansView style={tw.style("grow")}>
						{media?.type === MediaType.Image && (
							<FansImage
								source={{
									uri: cdnURL(media.url),
								}}
								resizeMode={ResizeMode.CONTAIN}
							/>
						)}
						{media?.type === MediaType.Video && (
							<FypVideo
								style={tw.style("w-full h-full")}
								source={{
									uri: cdnURL(media.url ?? ""),
								}}
								posterSource={{
									uri: cdnURL(media.thumbnail),
								}}
								resizeMode={ResizeMode.CONTAIN}
							/>
						)}
					</FansView>
				</FansView>
			</BlurView>
		</Modal>
	);
};

export default MediaTimestampModal;
