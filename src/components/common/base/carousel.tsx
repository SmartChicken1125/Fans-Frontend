import { FansView } from "@components/controls";
import { ICarouselMedia } from "@usertypes/types";
import React, { FC, useRef, useState } from "react";
import {
	FlatList,
	NativeScrollEvent,
	NativeSyntheticEvent,
} from "react-native";
import Badge from "../carousel/badge";
import Indicator from "../carousel/indicator";
import { FypNullableView } from "./nullableView";

interface Props {
	id: string;
	width: number;
	data: ICarouselMedia[];
	showBadge?: boolean;
	renderItem: (item: ICarouselMedia, index: number) => React.ReactElement;
}

export const FypCarousel: FC<Props> = (props) => {
	const { width, data, renderItem, id, showBadge } = props;

	const carouselRef = useRef<FlatList>(null);
	const [activeIndex, setActiveIndex] = useState(0);

	const goToIndex = (index: number) => {
		carouselRef.current?.scrollToIndex({
			index: index,
			animated: true,
		});
	};

	const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		const scrollPosition = e.nativeEvent.contentOffset.x;
		const index = scrollPosition / width;
		if (index % 1 === 0) setActiveIndex(index);
	};

	const getItemLayout = (index: number) => {
		return {
			length: width,
			offset: width * index,
			index: index,
		};
	};

	return (
		<FansView>
			<FlatList
				id={id}
				ref={carouselRef}
				data={data}
				horizontal
				pagingEnabled
				renderItem={({ item, index }) => renderItem(item, index)}
				onScroll={handleScroll}
				showsHorizontalScrollIndicator={false}
				keyExtractor={(item) => item.id}
				getItemLayout={(data, index) => getItemLayout(index)}
			/>
			<Indicator
				index={activeIndex}
				length={data.length}
				onClickDot={goToIndex}
			/>
			<FypNullableView visible={!!showBadge}>
				<Badge index={activeIndex} length={data.length} />
			</FypNullableView>
		</FansView>
	);
};
