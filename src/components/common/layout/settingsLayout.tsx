import {
	FansScreen2,
	FansView,
	FansVerticalDivider,
} from "@components/controls";
import tw from "@lib/tailwind";
import { SettingsScreenContent } from "@screens/settings/Settings";
import React, { FC } from "react";
import Sidebar from "../Sidebar";

interface Props {
	children: React.ReactNode;
}

const SettingsLayout: FC<Props> = (props) => {
	const { children } = props;
	return tw.prefixMatch("lg") ? (
		<FansScreen2>
			<FansView style={tw.style("ml-[140px]")} flexDirection="row" grow>
				<Sidebar />
				<FansVerticalDivider />
				<FansView width={434}>
					<SettingsScreenContent />
				</FansView>
				<FansVerticalDivider />
				<FansView grow>{children}</FansView>
			</FansView>
		</FansScreen2>
	) : (
		children
	);
};

export default SettingsLayout;
