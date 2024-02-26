import { FypSortButton, FypText } from "@components/common/base";
import { FansView } from "@components/controls";
import { VideoCallOrderCard } from "@components/videoCall";
import { testPaymentToken } from "@constants/common";
import { useAppContext } from "@context/useAppContext";
import {
	getVideoCallMeetings,
	acceptMeetingById,
	declineMeetingById,
} from "@helper/endpoints/videoCalls/apis";
import { VideoCallMeetingsRespBody } from "@helper/endpoints/videoCalls/schemas";
import tw from "@lib/tailwind";
import {
	MeetingStatusType,
	VideoCallOrderCardType,
} from "@usertypes/commonEnums";
import { SortType } from "@usertypes/types";
import React, { useState, useEffect } from "react";
import { ScrollView, NativeScrollEvent } from "react-native";
import Toast from "react-native-toast-message";

const PendingAcceptanceForm = () => {
	const { state } = useAppContext();
	const { profile } = state;
	const [meetings, setMeetings] = useState<VideoCallMeetingsRespBody>({
		page: 1,
		size: 10,
		total: 0,
		totalPrice: 0,
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
			status: MeetingStatusType.Pending.toLowerCase(),
			after: new Date().toJSON(),
			sort: orderBy === "Newest" ? "startDate:desc" : "startDate:asc",
			withAttendees: 1,
		});
		if (resp.ok) {
			setMeetings(resp.data);
		}
	};

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

	const handleAccept = async (id: string) => {
		const resp = await acceptMeetingById(null, { id });
		if (resp.ok) {
			fetchVideoCallMeetings();
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const handleCancel = async (id: string) => {
		const resp = await declineMeetingById(null, { id: id });
		if (resp.ok) {
			fetchVideoCallMeetings();
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
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
				{`Active orders (${meetings.total})`}
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
						<VideoCallOrderCard
							title="AWAITING ACCEPTANCE"
							key={meeting.id}
							profile={profile}
							data={meeting}
							cardType={VideoCallOrderCardType.Pending}
							onPressSubmit={() => handleAccept(meeting.id)}
							onPressCancel={() => handleCancel(meeting.id)}
							submitLabel="Accept"
							cancelLabel="Reject"
						/>
					))}
				</ScrollView>
			</FansView>
		</FansView>
	);
};

export default PendingAcceptanceForm;
