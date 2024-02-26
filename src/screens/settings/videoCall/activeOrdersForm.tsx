import { FypSortButton, FypText } from "@components/common/base";
import { FansView } from "@components/controls";
import {
	VideoCallOrderCard,
	ConfirmCancelOrderModal,
} from "@components/videoCall";
import { useAppContext } from "@context/useAppContext";
import {
	getVideoCallMeetings,
	cancelMeetingById,
} from "@helper/endpoints/videoCalls/apis";
import { VideoCallMeetingsRespBody } from "@helper/endpoints/videoCalls/schemas";
import tw from "@lib/tailwind";
import {
	MeetingStatusType,
	VideoCallOrderCardType,
} from "@usertypes/commonEnums";
import { IVideoCallMeeting, SortType } from "@usertypes/types";
import { useRouter } from "expo-router";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { ScrollView, NativeScrollEvent } from "react-native";
import Toast from "react-native-toast-message";

const ActiveOrdersForm = () => {
	const router = useRouter();
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
	const [openCancelModal, setOpenCancelModal] = useState(false);
	const [selectedId, setSelectedId] = useState("");

	const handleToggleSort = (val: SortType) => {
		setOrderBy(val);
		setMeetings({
			...meetings,
			page: 1,
		});
	};

	const fetchVideoCallMeetings = async () => {
		const resp = await getVideoCallMeetings({
			status: MeetingStatusType.Accepted.toLowerCase(),
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

	const handleCancel = async () => {
		setOpenCancelModal(false);
		const resp = await cancelMeetingById(null, { id: selectedId });
		if (resp.ok) {
			fetchVideoCallMeetings();
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const onPressCancel = (id: string) => {
		setSelectedId(id);
		setOpenCancelModal(true);
	};

	const getCardTitle = (meeting: IVideoCallMeeting) => {
		const diffSeconds = moment(meeting.startDate).diff(
			moment(new Date()),
			"seconds",
		);
		const diffHours = moment(meeting.startDate).diff(
			moment(new Date()),
			"hours",
		);
		const days = moment(meeting.startDate).diff(moment(new Date()), "days");
		const hours = diffHours - days * 24;
		return `STARTS IN ${days} DAYS, ${hours} HOURS`;
	};

	const getEnableJoin = (meeting: IVideoCallMeeting) => {
		const diffSeconds = moment(meeting.startDate).diff(
			moment(new Date()),
			"seconds",
		);
		return diffSeconds < 300;
	};

	const handleAccept = (meeting: IVideoCallMeeting) => {
		if (getEnableJoin(meeting)) {
			router.replace({
				pathname: "videocall",
				params: {
					screen: "CreatorCall",
					id: meeting.id,
				},
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
							title={
								getEnableJoin(meeting)
									? "Now"
									: getCardTitle(meeting)
							}
							key={meeting.id}
							profile={profile}
							data={meeting}
							cardType={
								getEnableJoin(meeting)
									? VideoCallOrderCardType.Now
									: VideoCallOrderCardType.Accepted
							}
							onPressAddCalendar={() => {
								if (getEnableJoin(meeting)) {
									return undefined;
								} else {
									console.log("add to calendar");
								}
							}}
							onPressSubmit={() => handleAccept(meeting)}
							onPressCancel={() => onPressCancel(meeting.id)}
							cancelLabel="Cancel"
							submitLabel="Join"
							disabledSubmit={!getEnableJoin(meeting)}
						/>
					))}
				</ScrollView>
			</FansView>

			<ConfirmCancelOrderModal
				visible={openCancelModal}
				profile={profile}
				meeting={meetings.meetings.find((el) => el.id === selectedId)}
				handleClose={() => setOpenCancelModal(false)}
				handleConfirm={handleCancel}
			/>
		</FansView>
	);
};

export default ActiveOrdersForm;
