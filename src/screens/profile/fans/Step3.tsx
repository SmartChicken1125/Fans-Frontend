import { EditUserSvg } from "@assets/svgs/common";
import ThemeItem from "@components/common/ThemeItem";
import { FansGap, FansSvg, FansText, FansView } from "@components/controls";
import { ProfileActionType, useAppContext } from "@context/useAppContext";
import {
	getUserSettings,
	updateFanProfileSettings,
} from "@helper/endpoints/profile/apis";
import { IProfileSettings } from "@usertypes/types";
import React from "react";
import { FlatList, View } from "react-native";

const Step3: React.FC = () => {
	const { state, dispatch } = useAppContext();

	const { theme } = state.profile.settings.fanProfile;

	const { fanProfile } = state.profile.settings;

	const updateSettings = async (updatedSettings: IProfileSettings) => {
		const response = await updateFanProfileSettings(updatedSettings);

		if (response.ok) {
			fetchProfileSettings();
		}
	};

	const fetchProfileSettings = async () => {
		const response = await getUserSettings();
		if (response.ok) {
			const profileSettings = response.data;
			dispatch.setProfile({
				type: ProfileActionType.updateSettings,
				data: profileSettings,
			});
		}
	};

	const updateTheme = async (theme: string) => {
		const updatedSettings = {
			...state.profile.settings,
			fanProfile: {
				...fanProfile,
				theme: theme,
			},
		};

		await updateSettings(updatedSettings);
	};

	const options = [
		{
			id: "minimal",
			title: "Minimal",
			iconToRender: (
				<FansSvg
					width={27.3}
					height={26.23}
					svg={EditUserSvg}
					color1="purple"
				/>
			),
			iconColor: "#edfaea",
			primaryColor: "white",
			secondaryColor: "white",
			secondaryBorderColor: "#f0f0f0",
		},
		{
			id: "dark",
			title: "Dark",
			iconToRender: (
				<FansSvg
					width={27.3}
					height={26.23}
					svg={EditUserSvg}
					color1="purple"
				/>
			),
			iconColor: "#e8f6ff",
			primaryColor: "#1d1d1d",
			secondaryColor: "#2e2e2e",
		},
		{
			id: "spring",
			title: "Spring",
			iconToRender: (
				<FansSvg
					width={27.3}
					height={26.23}
					svg={EditUserSvg}
					color1="purple"
				/>
			),
			iconColor: "#f6edff",
			primaryColor: "#c6c7f9",
			secondaryColor: "rgba(255, 255, 255, 0.8);",
		},
		{
			id: "tech",
			title: "Tech",
			iconToRender: (
				<FansSvg
					width={27.3}
					height={26.23}
					svg={EditUserSvg}
					color1="purple"
				/>
			),
			iconColor: "#f6edff",
			primaryColor: "#ad86ff",
			secondaryColor: "#4d31b2",
		},
	];

	const numColumns = 2; // Number of columns you want
	//const itemWidth = Dimensions.get("window").width / numColumns;
	const itemWidth = 157; // Set the desired width
	const itemHeight = 186; // Set the desired height
	const renderListPreferences = () => {
		return (
			<FlatList
				data={options}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => (
					<ThemeItem
						title={item.title}
						selected={theme === item.id}
						onPress={() => updateTheme(item.id)}
						iconToRender={item.iconToRender}
						//iconColor={item.iconColor}
						primaryColor={item.primaryColor}
						secondaryColor={item.secondaryColor}
					/>
				)}
				numColumns={numColumns}
				columnWrapperStyle={{
					justifyContent: "space-between",
					margin: 10,
				}}
			/>
		);
	};

	return (
		<FansView>
			<FansGap height={34} />
			<FansView>
				<FansText
					textAlign="center"
					fontFamily="inter-semibold"
					fontSize={27}
				>
					Select theme
				</FansText>
				<FansGap height={12} />
				<FansText textAlign="center" fontSize={16}>
					Personalize your profile page by selecting a theme that
					suits your style. You can always change it later
				</FansText>
			</FansView>
			<FansGap height={40} />
			<FansText fontFamily="inter-semibold" fontSize={17}>
				Themes
			</FansText>

			<FansGap height={20} />
			<View>{renderListPreferences()}</View>
		</FansView>
	);
};

export default Step3;
