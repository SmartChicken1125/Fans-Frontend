import CustomTopNavBar from "@components/common/customTopNavBar";
import { FansView } from "@components/controls";
import { InviteNewUserForm } from "@components/posts/share";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PostsNavigationStacks } from "@usertypes/navigations";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const InviteNewUserScreen = (
	props: NativeStackScreenProps<PostsNavigationStacks, "Invite">,
) => {
	const { navigation } = props;
	const insets = useSafeAreaInsets();

	const [inProgress, setInProgress] = useState(false);

	return (
		<FansView
			flex="1"
			position="relative"
			padding={{ t: insets.top }}
			style={tw.style("bg-fans-white dark:bg-fans-black-1d")}
		>
			<CustomTopNavBar
				title="Invite new user"
				onClickLeft={() => navigation.goBack()}
			/>
			<FansView style={tw.style("pt-6 px-[18px]")}>
				<InviteNewUserForm
					inProgress={inProgress}
					handleToggleLoading={setInProgress}
				/>
			</FansView>
		</FansView>
	);
};

export default InviteNewUserScreen;
