import UserAvatar from "@components/avatar/UserAvatar";
import { FypText, FypNullableView, FypSwitch } from "@components/common/base";
import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { IUserList } from "@usertypes/types";
import React, { FC } from "react";
import { Avatar } from "react-native-paper";

interface Props {
	data: IUserList;
	onChangeEnable: (val: boolean) => void;
	onEidtUserList: (id: string) => void;
}

const UserList: FC<Props> = (props) => {
	const { data, onChangeEnable, onEidtUserList } = props;

	return (
		<FansView flexDirection="row" alignItems="center" height={78}>
			<FypSwitch
				value={data.enabled}
				onValueChange={(val) => onChangeEnable(val)}
			/>
			<FansView
				margin={{ l: 20 }}
				pressableProps={{
					onPress: () => onEidtUserList(data.id),
				}}
			>
				<FypText
					fontSize={17}
					lineHeight={22}
					fontWeight={600}
					style={tw.style("text-fans-black dark:text-fans-white")}
				>
					{data.title}
				</FypText>
				<FypText
					fontSize={16}
					lineHeight={21}
					style={tw.style(
						"mt-[-3px] text-fans-grey-70 dark:text-fans-grey-b1",
					)}
				>
					{`${data.creators.length} people`}
				</FypText>
			</FansView>

			<FansView
				style={tw.style("ml-auto flex-row-reverse items-center")}
				pressableProps={{
					onPress: () => onEidtUserList(data.id),
				}}
			>
				{data.creators.slice(0, 3).map((user, index) => (
					<FansView
						key={user.id}
						alignItems="center"
						style={tw.style(
							"rounded-full",
							"border-[2px] border-fans-white dark:border-fans-black-1d",
							"bg-fans-white dark:bg-fans-black-1d",
							index !== 0 ? "mr-[-14px]" : "",
						)}
					>
						<UserAvatar image={user.avatar} size="30px" />
					</FansView>
				))}
				<FypNullableView visible={data.creators.length > 3}>
					<FansView
						alignItems="center"
						border={2}
						margin={{ r: -14 }}
						style={tw.style(
							"rounded-full",
							"border-[2px] border-fans-white dark:border-fans-black-1d",
						)}
					>
						<Avatar.Text
							size={30}
							label={`+${data.creators.length - 3}`}
							style={tw.style("bg-fans-purple text-white")}
						/>
					</FansView>
				</FypNullableView>
			</FansView>
		</FansView>
	);
};

export default UserList;
