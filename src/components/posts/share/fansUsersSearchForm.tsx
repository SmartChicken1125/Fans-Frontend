import RoundTextInput from "@components/common/RoundTextInput";
import { FypText } from "@components/common/base";
import { FansView } from "@components/controls";
import { SelectableUserListItem } from "@components/posts/common";
import { getFansUsers } from "@helper/endpoints/post/apis";
import tw from "@lib/tailwind";
import { IFansUser } from "@usertypes/types";
import React, { FC, useState, useEffect } from "react";
import { ScrollView } from "react-native";

interface Props {
	handleSave: (fans: IFansUser[]) => void;
}

const FansUsersSearchForm: FC<Props> = (props) => {
	const { handleSave } = props;

	const [searchKey, setSearchKey] = useState("");
	const [fanUsers, setFanUsers] = useState<IFansUser[]>([]);
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
			fanUsers.filter((user) => selectedUserIds.includes(user.id)),
		);
	};

	const fetchFanUsers = async () => {
		const resp = await getFansUsers({ query: searchKey });
		if (resp.ok) {
			setFanUsers(resp.data.fans);
		}
	};

	useEffect(() => {
		fetchFanUsers();
	}, [searchKey]);

	return (
		<FansView flex="1">
			<FansView
				flexDirection="row"
				alignItems="center"
				gap={34}
				margin={{ b: 32 }}
			>
				<FansView flex="1">
					<RoundTextInput
						placeholder="Add:"
						value={searchKey}
						onChangeText={setSearchKey}
					/>
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
			<FansView flex="1">
				<ScrollView>
					{fanUsers.map((fanUser) => (
						<SelectableUserListItem
							key={fanUser.id}
							avatar={fanUser.avatar}
							username={fanUser.username}
							displayName={fanUser.displayName}
							onSelect={() => handleToggleUser(fanUser.id)}
							selected={selectedUserIds.includes(fanUser.id)}
						/>
					))}
				</ScrollView>
			</FansView>
		</FansView>
	);
};

export default FansUsersSearchForm;
