import { Sidebar } from "@components/common";
import {
	FansScreen2,
	FansVerticalDivider,
	FansView,
} from "@components/controls";
import { PostTypesDialog } from "@components/posts/dialogs";
import tw from "@lib/tailwind";
import { NavigationContainer } from "@react-navigation/native";
import { SettingsScreenContent } from "@screens/settings/Settings";
import React, { ReactNode } from "react";

const SettingsNavigationLayout = (navigator: ReactNode) => {
	return tw.prefixMatch("lg") ? (
		<FansScreen2>
			<FansView style={tw.style("ml-[140px]")} flexDirection="row" grow>
				<Sidebar />
				<FansVerticalDivider />
				<FansView width={434}>
					<SettingsScreenContent />
				</FansView>
				<FansVerticalDivider />
				<FansView grow>
					<NavigationContainer independent>
						{navigator}
					</NavigationContainer>
				</FansView>
			</FansView>
		</FansScreen2>
	) : (
		<NavigationContainer independent>
			{navigator}
			<PostTypesDialog />
		</NavigationContainer>
	);
};

export default SettingsNavigationLayout;
