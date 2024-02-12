import { FypSortButton, FypText } from "@components/common/base";
import { FansView } from "@components/controls";
import { OrderCard } from "@components/videoCall";
import { useAppContext } from "@context/useAppContext";
import {
	getVideoCallMeetings,
	cancelMeetingById,
} from "@helper/endpoints/videoCalls/apis";
import { VideoCallMeetingsRespBody } from "@helper/endpoints/videoCalls/schemas";
import tw from "@lib/tailwind";
import {
	VideoCallOrderCardType,
	MeetingStatusType,
} from "@usertypes/commonEnums";
import { SortType } from "@usertypes/types";
import React, { useState, useEffect } from "react";
import { ScrollView, NativeScrollEvent } from "react-native";
import Toast from "react-native-toast-message";

const PastOrdersForm = () => {
	const { state } = useAppContext();
	const { profile } = state;
	const [meetings, setMeetings] = useState<VideoCallMeetingsRespBody>({
		page: 1,
		size: 10,
		total: 0,
		meetings: [],
	});
	const [orderBy, setOrderBy] = useState<SortType>("Newest");
	const [isLoading, setIsLoading] = useState(false);

	const handleToggleSort = (val: SortType) => {
		setOrderBy(val);
		setMeetings({
			...meetings,
			page: 1,
		});
	};

	const fetchVideoCallMeetings = async () => {
		const resp = await getVideoCallMeetings({
			sort: orderBy === "Newest" ? "startDate:desc" : "startDate:asc",
			withAttendees: 1,
			before: new Date().toJSON(),
		});
		if (resp.ok) {
			setMeetings(resp.data);
		}
	};

	const handleRefund = async (id: string) => {
		const resp = await cancelMeetingById(null, { id: id });
		if (resp.ok) {
			fetchVideoCallMeetings();
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const handleView = (id: string) => {};

	const onScrollView = (nativeEvent: NativeScrollEvent) => {
		const paddingToBottom = 20;
		const isScrollEnd =
			nativeEvent.layoutMeasurement.height +
				nativeEvent.contentOffset.y >=
			nativeEvent.contentSize.height - paddingToBottom;
		if (isScrollEnd && !isLoading) {
			if (meetings.total > 10 * meetings.page) {
				setIsLoading(true);
				setMeetings({
					...meetings,
					page: meetings.page + 1,
				});
			}
		}
	};

	useEffect(() => {
		fetchVideoCallMeetings();
	}, [meetings.page, orderBy]);

	return (
		<FansView flex="1">
			<FypText
				fontSize={23}
				lineHeight={31}
				fontWeight={600}
				margin={{ b: 23 }}
			>
				Past orders
			</FypText>
			<FansView margin={{ b: 28 }}>
				<FypSortButton
					value={orderBy}
					handleToggle={handleToggleSort}
				/>
			</FansView>
			<FansView gap={14} flex="1">
				<ScrollView
					onScroll={({ nativeEvent }) => onScrollView(nativeEvent)}
					scrollEventThrottle={30}
					nestedScrollEnabled
					style={tw.style("flex-1")}
					contentContainerStyle={tw.style("gap-[14px]")}
				>
					{meetings.meetings.map((meeting) => (
						<OrderCard
							title="FULFILLED"
							profile={profile}
							key={meeting.id}
							data={meeting}
							cardType={VideoCallOrderCardType.Past}
							submitLabel="View"
							cancelLabel="Refund"
							disabledCancel={
								meeting.status !== MeetingStatusType.Accepted
							}
							onPressSubmit={() => handleView(meeting.id)}
							onPressCancel={() => {
								if (
									meeting.status ===
									MeetingStatusType.Accepted
								) {
									handleRefund(meeting.id);
								} else {
									return undefined;
								}
							}}
						/>
					))}
				</ScrollView>
			</FansView>
		</FansView>
	);
};

export default PastOrdersForm;
