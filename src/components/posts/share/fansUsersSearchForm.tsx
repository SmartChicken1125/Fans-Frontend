import RoundTextInput from "@components/common/RoundTextInput";
import { FypText } from "@components/common/base";
import { FansView } from "@components/controls";
import { SelectableUserListItem } from "@components/posts/common";
import { getFansUsers } from "@helper/endpoints/post/apis";
import { FansUsersRespBody } from "@helper/endpoints/post/schemas";
import tw from "@lib/tailwind";
import { IFansUser } from "@usertypes/types";
import React, { FC, useState, useEffect } from "react";
import { NativeScrollEvent, ScrollView } from "react-native";

interface Props {
	handleSave: (fans: IFansUser[]) => void;
}

const SCROLL_SIZE = 10;

const FansUsersSearchForm: FC<Props> = (props) => {
	const { handleSave } = props;

	const [searchKey, setSearchKey] = useState("");
	const [inLoadingMore, setInLoadingMore] = useState(false);
	const [fanUsers, setFanUsers] = useState<FansUsersRespBody>({
		fans: [],
		page: 1,
		size: SCROLL_SIZE,
		total: 0,
	});
	const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

	const handleToggleUser = (userId: string) => {
		setSelectedUserIds(
			selectedUserIds.includes(userId)
				? selectedUserIds.filter((el) => el !== userId)
				: [...selectedUserIds, userId],
		);
	};

	const handlePressDone = () => {
		handleSave(
			fanUsers.fans.filter((user) => selectedUserIds.includes(user.id)),
		);
	};

	const fetchFanUsers = async (page: number) => {
		const filterObject = {
			page: page,
			size: SCROLL_SIZE,
			query: searchKey,
		};

		const resp = await getFansUsers(filterObject);
		setInLoadingMore(false);
		if (resp.ok) {
			setFanUsers({
				...resp.data,
				fans:
					resp.data.page === 1
						? resp.data.fans
						: [...fanUsers.fans, ...resp.data.fans],
			});
		}
	};

	const onScrollView = (nativeEvent: NativeScrollEvent) => {
		const paddingToBottom = 20;
		const isScrollEnd =
			nativeEvent.layoutMeasurement.height +
				nativeEvent.contentOffset.y >=
			nativeEvent.contentSize.height - paddingToBottom;
		if (
			isScrollEnd &&
			!inLoadingMore &&
			fanUsers.total > SCROLL_SIZE * fanUsers.page
		) {
			setInLoadingMore(true);
			fetchFanUsers(fanUsers.page + 1);
		}
	};

	useEffect(() => {
		fetchFanUsers(1);
	}, [searchKey]);

	return (
		<FansView flex="1">
			<FansView
				flexDirection="row"
				alignItems="center"
				gap={34}
				margin={{ b: 32 }}
			>
				<FansView flex="1" position="relative">
					{selectedUserIds.length === 0 ? (
						<RoundTextInput
							placeholder="Add:"
							value={searchKey}
							onChangeText={setSearchKey}
						/>
					) : (
						<FansView
							height={42}
							borderRadius={42}
							justifyContent="center"
							padding={{ x: 20 }}
							style={tw.style(
								"bg-fans-grey-f0 dark:bg-fans-grey-43",
							)}
						>
							<FypText
								fontSize={18}
								lineHeight={24}
								fontFamily="inter-v"
								numberOfLines={1}
							>
								Add:{" "}
								{fanUsers.fans
									.filter((user) =>
										selectedUserIds.includes(user.id),
									)
									.map((el) => el.displayName)
									.join(", ")}
							</FypText>
						</FansView>
					)}
				</FansView>
				<FypText
					fontSize={17}
					lineHeight={22}
					fontWeight={600}
					style={tw.style("text-fans-purple")}
					onPress={handlePressDone}
				>
					Done
				</FypText>
			</FansView>
			<FypText
				fontSize={17}
				lineHeight={22}
				fontWeight={600}
				margin={{ b: 15 }}
			>
				Fans
			</FypText>
			<ScrollView
				style={tw.style("max-h-[480px]")}
				onScroll={({ nativeEvent }) => onScrollView(nativeEvent)}
				scrollEventThrottle={16}
				showsVerticalScrollIndicator
				showsHorizontalScrollIndicator={false}
			>
				<FansView flex="1">
					{fanUsers.fans.map((fanUser) => (
						<SelectableUserListItem
							key={fanUser.id}
							avatar={fanUser.avatar}
							username={fanUser.username}
							displayName={fanUser.displayName}
							onSelect={() => handleToggleUser(fanUser.id)}
							selected={selectedUserIds.includes(fanUser.id)}
						/>
					))}
				</FansView>
			</ScrollView>
		</FansView>
	);
};

export default FansUsersSearchForm;
