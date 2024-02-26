import { FypSortButton, FypText } from "@components/common/base";
import { FansView } from "@components/controls";
import { CustomVideoOrderCard } from "@components/videoCall";
import {
	getCustomVideoOrders,
	acceptCustomVideoOrderById,
	declineCustomVideoOrderById,
} from "@helper/endpoints/cameo/apis";
import { CustomVideoOrdersRespBody } from "@helper/endpoints/cameo/schemas";
import tw from "@lib/tailwind";
import {
	MeetingStatusType,
	VideoCallOrderCardType,
} from "@usertypes/commonEnums";
import { SortType } from "@usertypes/types";
import React, { useState, useEffect } from "react";
import { ScrollView, NativeScrollEvent } from "react-native";
import Toast from "react-native-toast-message";

const PendingOrdersTabPanel = () => {
	const [orders, setOrders] = useState<CustomVideoOrdersRespBody>({
		page: 1,
		size: 10,
		total: 0,
		totalPrice: 0,
		orders: [],
	});
	const [orderBy, setOrderBy] = useState<SortType>("Newest");
	const [isLoading, setIsLoading] = useState(false);

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
			status: MeetingStatusType.Pending.toLowerCase(),
			after: new Date().toJSON(),
			sort: orderBy === "Newest" ? "startDate:desc" : "startDate:asc",
			withAttendees: 1,
		});
		if (resp.ok) {
			setOrders(resp.data);
		}
	};

	const handleAccept = async (id: string) => {
		const resp = await acceptCustomVideoOrderById(null, { id });
		if (resp.ok) {
			Toast.show({
				type: "success",
				text1: "Order is accepted successfuly",
			});
			fetchCustomVideoOrders();
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const handleCancel = async (id: string) => {
		const resp = await declineCustomVideoOrderById(null, { id: id });
		if (resp.ok) {
			Toast.show({
				type: "success",
				text1: "Order is rejected successfuly",
			});
			fetchCustomVideoOrders();
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
							cardType={VideoCallOrderCardType.Pending}
							onPressSubmit={() => handleAccept(order.id)}
							onPressCancel={() => handleCancel(order.id)}
							submitLabel="Accept"
							cancelLabel="Reject"
						/>
					))}
				</ScrollView>
			</FansView>
		</FansView>
	);
};

export default PendingOrdersTabPanel;
