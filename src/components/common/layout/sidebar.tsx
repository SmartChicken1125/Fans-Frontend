import { FansView } from "@components/controls";
import {
	CommonActionType,
	ProfileActionType,
	useAppContext,
} from "@context/useAppContext";
import { authLogout } from "@helper/endpoints/auth/apis";
import tw from "@lib/tailwind";
import { AuthState, authAtom, authStateAtom } from "@state/auth";
import { StorageKeyTypes } from "@usertypes/commonEnums";
import { setObjectStorage, setStorage } from "@utils/storage";
import { useRouter, useSegments, useGlobalSearchParams } from "expo-router";
import React, { useCallback, useState, FC, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import MainMenu from "./mainMenu";
import SettingsMenu from "./settingsMenu";
import TabMenu from "./tabMenu";

interface Props {
	toggleTheme: () => void;
}

const Sidebar: FC<Props> = (props) => {
	const { toggleTheme } = props;
	const router = useRouter();
	const segments = useSegments();
	const { screen } = useGlobalSearchParams();

	const { dispatch } = useAppContext();
	const setAuth = useSetRecoilState(authAtom);
	const setAuthState = useSetRecoilState(authStateAtom);

	const [collapsedTabMenu, setCollapsedTabMenu] = useState(false);
	const [collapsesMainMenu, setCollapsesMainMenu] = useState(true);

	const onToggleMore = () => {
		setCollapsesMainMenu(collapsedTabMenu ? true : false);
		setCollapsedTabMenu(!collapsedTabMenu);
	};

	const handleLogout = async () => {
		dispatch.setShowLoading();
		setAuthState(AuthState.Loading);
		await setStorage(StorageKeyTypes.AccessToken, null);
		await setObjectStorage(StorageKeyTypes.UserInfo, null);
		await authLogout(null);
		dispatch.setProfile({
			type: ProfileActionType.initProfile,
			data: {},
		});
		dispatch.setHideLoading();
		dispatch.setCommon({
			type: CommonActionType.toggleLayoutSidebar,
			data: {
				collapsedTabMenu: false,
			},
		});
		setAuth(undefined);
		setAuthState(AuthState.Unauthenticated);
		router.push("/auth/login");
	};

	const handleOpenTabMenu = () => {
		// dispatch.setCommon({
		// 	type: CommonActionType.toggleLayoutSidebar,
		// 	data: {
		// 		collapsedTabMenu: false,
		// 		collapsesSettings: true,
		// 	},
		// });
		setCollapsedTabMenu(false);
		setCollapsesMainMenu(true);
	};

	const handleBackFromSettings = () => {
		// dispatch.setCommon({
		// 	type: CommonActionType.toggleLayoutSidebar,
		// 	data: {
		// 		collapsedTabMenu: true,
		// 		collapsesSettings: true,
		// 	},
		// });
	};

	useEffect(() => {
		setCollapsedTabMenu(false);
		setCollapsesMainMenu(true);
	}, [screen, segments.join("/")]);

	return (
		<FansView
			style={tw.style(
				"hidden md:flex pl-10 xl:pl-[114px] h-full flex-row z-10 absolute left-0 top-0",
				"bg-fans-white dark:bg-fans-black-1d",
			)}
		>
			<TabMenu
				onToggleMore={onToggleMore}
				collapsed={collapsedTabMenu}
				onLogout={handleLogout}
			/>
			{collapsedTabMenu && !collapsesMainMenu ? (
				<MainMenu
					onClose={handleOpenTabMenu}
					onLogout={handleLogout}
					toggleTheme={toggleTheme}
				/>
			) : null}
			{/* {!collapsesMainMenu ? (
				<SettingsMenu
					onClose={handleOpenTabMenu}
					onClickBack={handleBackFromSettings}
				/>
			) : null} */}
		</FansView>
	);
};

export default Sidebar;
