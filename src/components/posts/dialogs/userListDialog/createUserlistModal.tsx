import { SearchSvg } from "@assets/svgs/common";
import FormControl from "@components/common/FormControl";
import RoundButton from "@components/common/RoundButton";
import RoundTextInput from "@components/common/RoundTextInput";
import { FypText } from "@components/common/base";
import BottomSheetWrapper from "@components/common/bottomSheetWrapper";
import { getProfiles } from "@helper/endpoints/profile/apis";
import {
	createUserlist,
	updateUserlist,
} from "@helper/endpoints/userlist/apis";
import tw from "@lib/tailwind";
import { RoundButtonType, SnapPoints } from "@usertypes/commonEnums";
import { IProfile, IUserList } from "@usertypes/types";
import React, { FC, useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import UserChip from "./userChip";
import UserLine from "./userLine";

export type CreateUserlistPayload = {
	title: string;
	creators: string[];
};

export type UpdateUserlistPayload = {
	id: string;
	title?: string;
	creators?: string[];
};

interface Props {
	open: boolean;
	onClose: () => void;
	userlist: IUserList | null;
	onSubmitCallback: () => void;
}

const CreateUserListModal: FC<Props> = (props) => {
	const { open, onClose, userlist, onSubmitCallback } = props;

	const [userlistName, setUserlistName] = useState("");
	const [query, setQuery] = useState("");
	const [queryInput, setQueryInput] = useState("");
	const [creators, setCreators] = useState<IProfile[]>([]);
	const [selectedCreators, setSelectedCreators] = useState<IProfile[]>([]);
	const [page, setPage] = useState(1);
	const [size, setSize] = useState(10);
	const [total, setTotal] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

	const onToggleCreator = (userId: string) => {
		const userIds = selectedCreators.map((el) => el.id);
		if (!userIds.includes(userId)) {
			const selectedCreator = creators.find((c) => c.id === userId);
			if (selectedCreator)
				setSelectedCreators([...selectedCreators, selectedCreator]);
		} else {
			setSelectedCreators(
				selectedCreators.filter((el) => el.id !== userId),
			);
		}
	};

	const onDeselectCreator = useCallback(
		(id: string) => {
			setSelectedCreators((prevState) => {
				const deselectedCreator = creators.find((c) => c.id === id);
				if (
					deselectedCreator &&
					prevState.find((item) => item.id === id)
				) {
					return prevState.filter((c) => c.id !== id);
				}
				return prevState;
			});
		},
		[selectedCreators, setSelectedCreators],
	);

	useEffect(() => {
		if (userlist) {
			setUserlistName(userlist.title);
			setSelectedCreators(userlist.creators);
			setQuery("");
		}
	}, [userlist]);

	useEffect(() => {
		(async () => {
			try {
				const resp = await getProfiles({
					page,
					size,
					name: query,
				});
				if (resp.ok) {
					setPage(resp.data.page);
					setSize(resp.data.size);
					setTotal(resp.data.total);
					setCreators((prevState) => [
						...prevState,
						...resp.data.profiles,
					]);
				}
			} catch (error) {
				console.log(error);
			}
		})();
	}, [page, size, query]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setQuery(queryInput);
			setPage(1);
			setCreators([]);
		}, 500);
		return () => {
			clearTimeout(timeoutId);
		};
	}, [queryInput]);

	const handleEndReached = useCallback(() => {
		if (page * size < total) {
			setPage(page + 1);
		}
	}, [page, size, total]);

	const handleClickSubmit = async () => {
		setIsLoading(true);
		if (userlist) {
			const resp = await updateUserlist(
				{
					title: userlistName,
					creators: selectedCreators.map((c) => c.id),
				},
				{
					id: userlist.id,
				},
			);
			setIsLoading(false);
			if (resp.ok) {
				onClose();
				onSubmitCallback();
			} else {
				Toast.show({
					type: "error",
					text1: resp.data.message,
				});
			}
		} else {
			const resp = await createUserlist({
				title: userlistName,
				creators: selectedCreators.map((c) => c.id),
			});
			setIsLoading(false);
			if (resp.ok) {
				onClose();
				onSubmitCallback();
			} else {
				Toast.show({
					type: "error",
					text1: resp.data.message,
				});
			}
		}
	};

	return (
		<BottomSheetWrapper
			open={open}
			onClose={onClose}
			snapPoint={SnapPoints.Ninety}
		>
			<View
				style={tw.style(
					"relative mb-[30px] px-[18px] justify-center flex-row",
				)}
			>
				<FypText
					fontSize={19}
					lineHeight={26}
					fontWeight={700}
					textAlign="center"
					style={tw.style("flex-none")}
				>
					Add or edit list
				</FypText>
			</View>

			<View style={tw.style("px-[18px] pb-5")}>
				<View style={tw.style("mb-[30px]")}>
					<FypText
						fontSize={17}
						lineHeight={22}
						fontWeight={600}
						margin={{ b: 15 }}
					>
						List name
						<Text style={tw.style("text-[#eb2121]")}>*</Text>
					</FypText>
					<FormControl
						value={userlistName}
						onChangeText={(text: string) => {
							setUserlistName(text);
						}}
						placeholder="e.g. Friends"
					/>
				</View>

				<View style={tw.style("mb-2")}>
					<FypText
						fontSize={17}
						lineHeight={22}
						fontWeight={600}
						margin={{ b: 15 }}
					>
						Add users
					</FypText>

					{selectedCreators.length > 0 ? (
						<View
							style={tw.style(
								"flex-row bg-fans-grey py-1 px-[5px] rounded-[24px] flex-wrap gap-1",
							)}
						>
							{selectedCreators.map((creator) => (
								<UserChip
									creator={creator}
									key={`tag-${creator.id}`}
									onCancel={() =>
										onDeselectCreator(creator.id)
									}
								/>
							))}
						</View>
					) : (
						<RoundTextInput
							icon={
								<SearchSvg
									width={13.14}
									height={13.26}
									color="#000"
								/>
							}
							placeholder="Search"
							customStyles="pl-11"
							value={queryInput}
							onChangeText={setQueryInput}
						/>
					)}
				</View>

				<View style={tw.style("max-h-[200px] min-h-[150px]")}>
					<FlatList
						renderItem={({ item: creator }) => (
							<UserLine
								avatar={creator.avatar}
								displayName={creator.displayName}
								username={creator.username ?? ""}
								selected={selectedCreators
									.map((c) => c.id)
									.includes(creator.id)}
								key={creator.id}
								onSelect={() => onToggleCreator(creator.id)}
							/>
						)}
						data={creators}
						keyExtractor={(creator) => creator.id}
						onEndReached={handleEndReached}
						onEndReachedThreshold={0.5}
					/>
				</View>

				<View style={tw.style("pt-[2px]")}>
					<RoundButton
						disabled={
							userlistName.length === 0 ||
							selectedCreators.length === 0
						}
						variant={RoundButtonType.OUTLINE_PRIMARY}
						onPress={handleClickSubmit}
						loading={isLoading}
					>
						{userlist ? "Update list" : "Create list"}
					</RoundButton>
				</View>
			</View>
		</BottomSheetWrapper>
	);
};

export default CreateUserListModal;
