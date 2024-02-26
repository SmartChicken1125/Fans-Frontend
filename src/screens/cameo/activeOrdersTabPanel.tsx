import { FypSortButton, FypText } from "@components/common/base";
import { FansView } from "@components/controls";
import {
	CustomVideoOrderCard,
	ConfirmOrderModal,
	CongratModal,
} from "@components/videoCall";
import { formatPrice } from "@helper/Utils";
import {
	getCustomVideoOrders,
	cancelCustomVideoOrderById,
	fulfillCustomVideoOrderById,
} from "@helper/endpoints/cameo/apis";
import { CustomVideoOrdersRespBody } from "@helper/endpoints/cameo/schemas";
import tw from "@lib/tailwind";
import {
	MeetingStatusType,
	VideoCallOrderCardType,
} from "@usertypes/commonEnums";
import { SortType, ICustomVideoOrder } from "@usertypes/types";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { ScrollView, NativeScrollEvent } from "react-native";
import Toast from "react-native-toast-message";

const ActiveOrdersTabPanel = () => {
	const router = useRouter();
	const [orders, setOrders] = useState<CustomVideoOrdersRespBody>({
		page: 1,
		size: 10,
		total: 0,
		totalPrice: 0,
		orders: [],
	});
	const [orderBy, setOrderBy] = useState<SortType>("Newest");
	const [isLoading, setIsLoading] = useState(false);
	const [openCancelModal, setOpenCancelModal] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState<ICustomVideoOrder>();
	const [openCongratModal, setOpenCongratModal] = useState(false);

	const handleToggleSort = (val: SortType) => {
		setOrderBy(val);
		setOrders({
			...orders,
			page: 1,
		});
	};

	const onScrollView = (nativeEvent: NativeScrollEvent) => {
		const paddingToBottom = 20;
		const isScrollEnd =
			nativeEvent.layoutMeasurement.height +
				nativeEvent.contentOffset.y >=
			nativeEvent.contentSize.height - paddingToBottom;
		if (isScrollEnd && !isLoading) {
			if (orders.total > 10 * orders.page) {
				setIsLoading(true);
				setOrders({
					...orders,
					page: orders.page + 1,
				});
			}
		}
	};

	const fetchCustomVideoOrders = async () => {
		const resp = await getCustomVideoOrders({
			status: MeetingStatusType.Accepted.toLowerCase(),
			after: new Date().toJSON(),
			sort: orderBy === "Newest" ? "startDate:desc" : "startDate:asc",
			withAttendees: 1,
		});
		if (resp.ok) {
			setOrders(resp.data);
		}
	};

	const handleCancel = async () => {
		setOpenCancelModal(false);
		if (selectedOrder) {
			const resp = await cancelCustomVideoOrderById(null, {
				id: selectedOrder.id,
			});
			if (resp.ok) {
				Toast.show({
					type: "success",
					text1: "Order is canceled successfuly",
				});
				fetchCustomVideoOrders();
			} else {
				Toast.show({
					type: "error",
					text1: resp.data.message,
				});
			}
		}
	};

	const onPressCancel = (order: ICustomVideoOrder) => {
		setSelectedOrder(order);
		setOpenCancelModal(true);
	};

	const getCardTitle = (order: ICustomVideoOrder) => {
		// const diffSeconds = moment(meeting.startDate).diff(
		// 	moment(new Date()),
		// 	"seconds",
		// );
		// const diffHours = moment(meeting.startDate).diff(
		// 	moment(new Date()),
		// 	"hours",
		// );
		// const days = moment(meeting.startDate).diff(moment(new Date()), "days");
		// const hours = diffHours - days * 24;
		return `STARTS IN ${0} DAYS, ${0} HOURS`;
	};

	const handleAccept = async (order: ICustomVideoOrder) => {
		const resp = await fulfillCustomVideoOrderById(null, {
			id: order.id,
		});
		if (resp.ok) {
			Toast.show({
				type: "success",
				text1: "Order is fulfilled successfuly",
			});
			fetchCustomVideoOrders();
			setOpenCongratModal(true);
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	useEffect(() => {
		fetchCustomVideoOrders();
	}, [orders.page, orderBy]);

	return (
		<FansView flex="1">
			<FypText
				fontSize={23}
				lineHeight={31}
				fontWeight={600}
				margin={{ b: 23 }}
			>
				{`Active orders (${orders.total})`}
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
					{orders.orders.map((order) => (
						<CustomVideoOrderCard
							title="AWAITING ACCEPTANCE"
							key={order.id}
							data={order}
							cardType={VideoCallOrderCardType.Accepted}
							onPressAddCalendar={() => {}}
							onPressSubmit={() => handleAccept(order)}
							onPressCancel={() => onPressCancel(order)}
							cancelLabel="Cancel"
							submitLabel="Fulfill"
						/>
					))}
				</ScrollView>
			</FansView>

			<ConfirmOrderModal
				visible={openCancelModal}
				avatar=""
				title={`Confirm cancellation of ${selectedOrder?.recipientName}'s order`}
				text={`A full refund of ${formatPrice(
					selectedOrder?.price.amount ?? 0,
				)} USD will be issued. Note: try to avoid frequent cancellations for your fans experience`}
				handleClose={() => setOpenCancelModal(false)}
				handleConfirm={handleCancel}
			/>
			<CongratModal
				visible={openCongratModal}
				coverImage=""
				handleBack={() => router.replace("/posts")}
				handleConfirm={() => setOpenCongratModal(false)}
				title="Congrats! Custom video order completed"
				text={`${formatPrice(selectedOrder?.price.amount ?? 0)}`}
			/>
		</FansView>
	);
};

export default ActiveOrdersTabPanel;
