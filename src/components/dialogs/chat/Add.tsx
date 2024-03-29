import {
	Close1Svg,
	GallerySvg,
	GIFSvg,
	OutlinedDollarSvg,
} from "@assets/svgs/common";
import BottomSheetWrapper from "@components/common/bottomSheetWrapper";
import { FansGap, FansSvg, FansText, FansView } from "@components/controls";
import { IGif } from "@giphy/js-types";
import tw from "@lib/tailwind";
import { Colors } from "@usertypes/enums";
import React, { FC, useState } from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import GifSheet from "./Gif";

interface Props {
	open: boolean;
	onClose: () => void;
	onPressPhoto: () => void;
	onGifSelect: (gif: IGif) => void;
	onTipSelect: () => void;
}

const AddSheet: FC<Props> = (props) => {
	const { open, onClose, onPressPhoto, onGifSelect, onTipSelect } = props;

	const [gifOpen, setGifOpen] = useState(false);

	const onPressGif = () => setGifOpen(true);
	const onGifClose = () => setGifOpen(false);

	return (
		<BottomSheetWrapper open={open} onClose={onClose}>
			<GifSheet
				open={gifOpen}
				onClose={onGifClose}
				onGifSelect={onGifSelect}
			/>
			<FansView
				width={30}
				height={30}
				style={tw.style("mr-[16px]")}
				alignItems="center"
				alignSelf="end"
				backgroundColor={{ color: "black", opacity: 30 }}
				borderRadius="full"
				display={{ xs: "hidden", lg: "flex" }}
				justifyContent="center"
			>
				<FansSvg
					width={11.46}
					height={11.45}
					svg={Close1Svg}
					color1="white"
				/>
			</FansView>
			<FansGap height={{ lg: 13.2 }} />
			<View style={tw.style("flex-row justify-around", "pb-[100px]")}>
				{/*<View style={tw.style("flex-col items-center")}>
				<VideoCallSvg width={36} height={36} />
				<Text style={tw.style("pt-[13px] text-[19px]")}>
					Video Call
				</Text>
</View>*/}
				<TouchableOpacity onPress={onTipSelect}>
					<View style={tw.style("flex gap-[10px] items-center")}>
						<OutlinedDollarSvg size={36} color={Colors.Purple} />
						<FansText fontSize={19}>Send tip</FansText>
					</View>
				</TouchableOpacity>
				<TouchableOpacity onPress={onPressGif}>
					<View style={tw.style("flex gap-[10px] items-center")}>
						<View style={tw.style("p-[2px]")}>
							<GIFSvg size={32} color={Colors.Purple} />
						</View>
						<FansText fontSize={19}>GIF</FansText>
					</View>
				</TouchableOpacity>
				<TouchableOpacity onPress={onPressPhoto}>
					<View style={tw.style("flex gap-[10px] items-center")}>
						<View style={tw.style("p-[2px]")}>
							<GallerySvg size={32} color={Colors.Purple} />
						</View>
						<FansText fontSize={19}>Photo</FansText>
					</View>
				</TouchableOpacity>
			</View>
			{/*
			<View style={tw.style("px-[18px] pb-5")}>
				<View style={tw.style("flex-row justify-around")}>
					<View style={tw.style("flex-col items-center")}>
						<CustomizeVideoSvg width={36} height={36} />
						<Text style={tw.style("pt-[13px] text-[19px]")}>
							Custom video
						</Text>
					</View>
				</View>
			</View>
*/}
		</BottomSheetWrapper>
	);
};

export default AddSheet;
