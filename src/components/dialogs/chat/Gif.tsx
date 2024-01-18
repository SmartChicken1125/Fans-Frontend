import { ChevronLeftSvg, GIFSvg, SearchSvg } from "@assets/svgs/common";
import BottomSheetWrapper from "@components/common/bottomSheetWrapper";
import {
	FansButton3,
	FansGap,
	FansText,
	FansTextInput,
	FansView,
} from "@components/controls";
import { GIPHY_API_KEY } from "@env";
import { GiphyFetch } from "@giphy/js-fetch-api";
import type { IGif } from "@giphy/js-types";
import { Gif, Grid } from "@giphy/react-components";
import tw from "@lib/tailwind";
import { Colors } from "@usertypes/enums";
import React, { FC, useState } from "react";
import { ScrollView, View } from "react-native";

interface Props {
	open: boolean;
	onClose: () => void;
	onGifSelect: (gif: IGif) => void;
}

const GifSheet: FC<Props> = (props) => {
	const { open, onClose, onGifSelect } = props;

	const [width, setWidth] = useState(300);
	const [searchTerm, setSearchTerm] = useState("");
	const [gif, setGif] = useState<IGif>();

	const gf = new GiphyFetch(GIPHY_API_KEY);

	const fetchGifs = async (offset = 0) => {
		if (searchTerm) {
			return await gf.search(searchTerm, { offset, limit: 10 });
		} else {
			return await gf.trending({ offset, limit: 10 });
		}
	};

	const onSearch = (value: string) => {
		setSearchTerm(value);
		setGif(undefined);
	};

	return (
		<BottomSheetWrapper open={open} onClose={onClose}>
			<View
				style={tw.style("h-[600px]", "flex gap-[10px]")}
				onLayout={(event) => {
					const { width } = event.nativeEvent.layout;
					setWidth(width);
				}}
			>
				<View style={tw.style("flex-row items-center")}>
					<View style={tw.style("grow", "pl-[20px]")}>
						<ChevronLeftSvg
							size={13}
							color={Colors.Grey}
							onPress={onClose}
						/>
					</View>
					<View style={tw.style("flex items-center", "grow")}>
						<View
							style={tw.style("flex-row gap-[10px] items-center")}
						>
							<GIFSvg width={19} height={19} />
							<FansText fontFamily="inter-bold" fontSize={19}>
								GIF
							</FansText>
						</View>
					</View>
					<View style={tw.style("grow")} />
				</View>
				<FansGap height={{ lg: 10 }} />
				<FansView width="full" style={tw.style("px-[17px]")}>
					<FansTextInput
						icon={SearchSvg}
						placeholder="Search"
						value={searchTerm}
						onChangeText={onSearch}
					/>
				</FansView>
				<FansGap height={{ lg: 5 }} />
				{gif && (
					<Gif
						gif={gif}
						width={width}
						height={width}
						noLink={true}
						hideAttribution={true}
					/>
				)}
				<ScrollView showsVerticalScrollIndicator={false}>
					{!gif && (
						<Grid
							key={searchTerm}
							width={width}
							columns={2}
							gutter={1}
							noLink={true}
							hideAttribution={true}
							onGifClick={(gif) => setGif(gif)}
							fetchGifs={fetchGifs}
						/>
					)}
				</ScrollView>
				{gif && (
					<FansView
						width="full"
						style={tw.style("px-[17px]")}
						position="absolute"
						bottom={20}
					>
						<FansButton3
							title="Send"
							onPress={() => onGifSelect(gif)}
						/>
					</FansView>
				)}
			</View>
		</BottomSheetWrapper>
	);
};

export default GifSheet;
