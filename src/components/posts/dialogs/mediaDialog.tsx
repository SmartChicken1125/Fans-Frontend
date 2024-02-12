import { ChevronLeftSvg, ChevronRightSvg, CloseSvg } from "@assets/svgs/common";
import { FypNullableView, FypSvg, FypVideo } from "@components/common/base";
import { FansIconButton, FansView } from "@components/controls";
import { decodeToDataURL } from "@helper/BlurHash";
import { cdnURL } from "@helper/Utils";
import tw from "@lib/tailwind";
import { MediaType, ResizeMode } from "@usertypes/commonEnums";
import { IMedia } from "@usertypes/types";
import React, { FC, useEffect, useState } from "react";
import { Image } from "react-native";
import { Modal, Portal } from "react-native-paper";

interface Props {
	visible: boolean;
	handleClose: () => void;
	selectedId: string;
	data: IMedia[];
}

const MediaDialog: FC<Props> = (props) => {
	console.log("MediaDialog");
	const { visible, handleClose, selectedId, data } = props;
	const [index, setIndex] = useState(0);
	const [imgHeight, setImgHeight] = useState(400);

	const handlePrev = () => {
		setIndex(index - 1);
	};

	const handleNext = () => {
		setIndex(index + 1);
	};

	useEffect(() => {
		const _index = data.findIndex((media) => media.id === selectedId);
		setIndex(_index);
	}, [selectedId]);

	return (
		<Portal>
			<Modal
				visible={visible}
				onDismiss={handleClose}
				contentContainerStyle={[
					tw.style(
						"mx-[18px] w-full mx-auto h-full relative md:w-full md:max-w-[740px] md:mx-auto",
					),
					{
						shadowOpacity: 0,
					},
				]}
			>
				<FansView
					position="relative"
					background="fans-white"
					onLayout={(e) => setImgHeight(e.nativeEvent.layout.width)}
				>
					{data[index]?.type === MediaType.Video ? (
						<>
							{data[index].url ? (
								<FypVideo
									source={{
										uri: cdnURL(data[index].url) ?? "",
									}}
									posterSource={{
										uri: cdnURL(data[index].thumbnail),
									}}
									style={[
										tw.style("w-full bg-fans-grey"),
										{ height: imgHeight },
									]}
									resizeMode={ResizeMode.CONTAIN}
								/>
							) : (
								<Image
									source={{
										uri: decodeToDataURL(
											data[index].blurhash,
										),
									}}
									resizeMode="cover"
									style={[
										tw.style("w-full bg-fans-grey"),
										{ height: imgHeight },
									]}
								/>
							)}
						</>
					) : null}
					{data[index]?.type === MediaType.Image ? (
						<>
							<Image
								source={{
									uri: decodeToDataURL(data[index].blurhash),
								}}
								style={tw.style("w-full", {
									height: imgHeight,
									position: "absolute",
									pointerEvents: "none",
								})}
							/>
							<Image
								source={{
									uri: cdnURL(data[index].url ?? ""),
								}}
								style={tw.style("w-full", {
									height: imgHeight,
									pointerEvents: "none",
								})}
							/>
						</>
					) : null}

					<FypNullableView visible={index > 0}>
						<FansIconButton
							onPress={handlePrev}
							size={30}
							backgroundColor="bg-fans-black/50 dark:bg-fans-white/50"
							style={tw.style("absolute left-4 top-1/2 z-10")}
						>
							<FypSvg
								width={13}
								height={13}
								svg={ChevronLeftSvg}
								color="fans-white"
							/>
						</FansIconButton>
					</FypNullableView>
					<FypNullableView visible={index < data.length - 1}>
						<FansIconButton
							onPress={handleNext}
							size={30}
							backgroundColor="bg-fans-black/50 dark:bg-fans-white/50"
							style={tw.style("absolute right-4 top-1/2 z-10")}
						>
							<FypSvg
								width={13}
								height={13}
								svg={ChevronRightSvg}
								color="fans-white"
							/>
						</FansIconButton>
					</FypNullableView>
				</FansView>
				<FansIconButton
					onPress={handleClose}
					backgroundColor="bg-fans-black/30 dark:bg-fans-white/30"
					size={30}
					style={tw.style("absolute top-5 right-5")}
				>
					<FypSvg
						width={13}
						height={13}
						svg={CloseSvg}
						color="fans-white"
					/>
				</FansIconButton>
			</Modal>
		</Portal>
	);
};

export default MediaDialog;
