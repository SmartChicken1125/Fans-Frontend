import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ChatRoom } from "@screens/rooms/fans/ChatRoom";
import { ChatRoomHeader } from "@screens/rooms/fans/ChatRoomHeader";
import { PostsNavigationStacks } from "@usertypes/navigations";
import React from "react";
import PostDesignScreen from "./PostDesignScreen";
import {
	AddGiveAwayScreen,
	AdvancedSettingsScreen,
	AnalyzeFansLevelsScreen,
	AudioDetailScreen,
	CaptionScreen,
	CategoriesScreen,
	FundraiserScreen,
	InviteNewUserScreen,
	LocationScreen,
	NewCategoryScreen,
	NewTextPostScreen,
	PaidPostAccessScreen,
	PaidPostScreen,
	PollScreen,
	RoleScreen,
	SchedulePostScreen,
	TagPeopleScreen,
	TagPeopleSearchScreen,
	ThumbnailScreen,
	ViewSettingScreen,
	VaultScreen,
	NewTierScreen,
} from "./create";

const Stack = createNativeStackNavigator<PostsNavigationStacks>();

const Layout = () => {
	return (
		<Stack.Navigator initialRouteName="Home">
			<Stack.Screen
				name="Home"
				component={PostDesignScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="Fundraiser"
				component={FundraiserScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="Poll"
				component={PollScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="Text"
				component={NewTextPostScreen}
				options={{
					headerShown: false,
				}}
			/>

			<Stack.Screen
				name="Thumbnail"
				component={ThumbnailScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="Chatroom"
				component={ChatRoom}
				options={({ navigation, route }) => ({
					header: (props) => (
						<ChatRoomHeader
							{...props}
							navigation={navigation}
							route={route}
						/>
					),
					headerStyle: {
						backgroundColor: "black",
					},
					headerTintColor: "white",
					headerTitle: "",
				})}
			/>

			<Stack.Screen
				name="Caption"
				component={CaptionScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="AudioDetail"
				component={AudioDetailScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="ViewSetting"
				component={ViewSettingScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="Role"
				component={RoleScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="FansLevels"
				component={AnalyzeFansLevelsScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="Categories"
				component={CategoriesScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="NewCategory"
				component={NewCategoryScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="PaidPost"
				component={PaidPostScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="PaidPostAccess"
				component={PaidPostAccessScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="TagPeople"
				component={TagPeopleScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="TagPeopleSearch"
				component={TagPeopleSearchScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="Invite"
				component={InviteNewUserScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="Giveaway"
				component={AddGiveAwayScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="Location"
				component={LocationScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="Schedule"
				component={SchedulePostScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="AdvancedSettings"
				component={AdvancedSettingsScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="Vault"
				component={VaultScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="NewTier"
				component={NewTierScreen}
				options={{
					headerShown: false,
				}}
			/>
		</Stack.Navigator>
	);
};

export default Layout;
