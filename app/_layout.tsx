import ProdModeSwitch from "@components/ProdModeSwitch";
import { AnimationLoadingModal } from "@components/common/dialog";
import SubscribeDialog from "@components/common/dialog/subscribeDialog";
import { MobileSidebar } from "@components/common/layout";
import {
	PostReportDialog,
	ProfileReportDialog,
} from "@components/dialogs/report";
import BlockCreatorModal from "@components/dialogs/report/BlockCreatorModal";
import { DeleteAccountSuccessModal } from "@components/modals";
import { SendMessageSuccessModal } from "@components/modals/contact";
import {
	PostMediaDialog,
	SendTipDialog,
	SendTipSuccessDialog,
} from "@components/posts/dialogs";
import PostModal from "@components/posts/postModal";
import { PwaInstallModal } from "@components/pwa";
import {
	ANIMATION_LOADING_DIALOG_ID,
	BLOCK_CREATOR_MODAL_ID,
	DELETE_ACCOUNT_SUCCESS_DIALOG_ID,
	POST_REPORT_DIALOG_ID,
	PROFILE_REPORT_DIALOG_ID,
	PWA_INSTALL_DIALOG_ID,
	SEND_MESSAGE_SUCCESS_MODAL_ID,
} from "@constants/modal";
import BackgroundTasks from "@context/BackgroundTasks";
import AppProvider from "@context/appProvider";
import { CommonActionType, useAppContext } from "@context/useAppContext";
import { SIFT_BEACON_KEY } from "@env";
import tw from "@lib/tailwind";
import { BeforeInstallPromptEvent } from "@usertypes/types";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { maybeCompleteAuthSession } from "expo-web-browser";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { EventProvider } from "react-native-outside-press";
import { PaperProvider } from "react-native-paper";
import Toast from "react-native-toast-message";
import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";
import { useDeviceContext } from "twrnc";
import { unregister as unregisterServiceWorker } from "../src/serviceWorkerRegistration";

// SplashScreen.preventAutoHideAsync();

interface Window {
	navigator: {
		userAgent: string;
	};
	_sift: unknown[];
	addEventListener(
		arg0: string,
		beforeInstallPromptListener: (e: BeforeInstallPromptEvent) => void,
	): unknown;
	removeEventListener(
		arg0: string,
		beforeInstallPromptListener: (e: BeforeInstallPromptEvent) => void,
	): unknown;
}

declare const window: Window;

function SiftTracker({ userId }: { userId: string }) {
	useEffect(() => {
		window._sift = window._sift || [];
		window._sift.push(["_setAccount", SIFT_BEACON_KEY]);
		window._sift.push(["_setUserId", userId]);
		window._sift.push(["_trackPageview"]);
	}, [userId]);

	useEffect(() => {
		const e = document.createElement("script");
		e.src = "https://cdn.sift.com/s.js";
		document.body.appendChild(e);
	}, []);

	return null;
}

function SiftScript() {
	const { state } = useAppContext();
	const { userInfo } = state.user;

	return <SiftTracker userId={userInfo?.id} />;
}

function PWA() {
	const { dispatch, state } = useAppContext();
	const { isPwaInstalled, pwaPromptEvent } = state.common;

	useEffect(() => {
		const beforeInstallPromptListener = (e: BeforeInstallPromptEvent) => {
			e.preventDefault();
			dispatch.setCommon({
				type: CommonActionType.SetPwaPromptEvent,
				data: e,
			});
		};

		const appInstalledListener = () => {
			dispatch.setCommon({
				type: CommonActionType.SetPwaInstalled,
				data: true,
			});
		};

		window.addEventListener(
			"beforeinstallprompt",
			beforeInstallPromptListener,
		);
		window.addEventListener("appinstalled", appInstalledListener);

		return () => {
			window.removeEventListener(
				"beforeinstallprompt",
				beforeInstallPromptListener,
			);
			window.removeEventListener("appinstalled", appInstalledListener);
		};
	}, [dispatch]);

	useEffect(() => {
		const hidePWAInstallPrompt = localStorage.getItem(
			"hidePWAInstallPrompt",
		);

		const userAgent = window.navigator.userAgent.toLowerCase();
		const isiOS = /iphone|ipad|ipod/.test(userAgent);
		const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
		const shouldShowPromptForiOS = isiOS && isSafari;
		const shouldShowPrompt =
			!hidePWAInstallPrompt &&
			((!isPwaInstalled && pwaPromptEvent) || shouldShowPromptForiOS);

		if (shouldShowPrompt) {
			dispatch.setCommon({
				type: CommonActionType.SetShowPWAInstallPrompt,
				data: true,
			});
		}
	}, [dispatch, isPwaInstalled, pwaPromptEvent]);

	return null;
}

export default function AppLayout() {
	const [fontsLoaded] = useFonts({
		"Inter-Black": require("@assets/fonts/Inter-Black.ttf"),
		"Inter-Light": require("@assets/fonts/Inter-Light.ttf"),
		"Inter-Regular": require("@assets/fonts/Inter-Regular.ttf"),
		"Inter-Medium": require("@assets/fonts/Inter-Medium.ttf"),
		"Inter-SemiBold": require("@assets/fonts/Inter-SemiBold.ttf"),
		"Inter-Bold": require("@assets/fonts/Inter-Bold.ttf"),
	});

	useEffect(() => {
		maybeCompleteAuthSession();
	}, []);

	useDeviceContext(tw, { withDeviceColorScheme: false });

	return (
		<RecoilRoot>
			<EventProvider>
				<PaperProvider>
					<RecoilNexus />
					<GestureHandlerRootView style={tw.style("grow")}>
						<AppProvider>
							<BackgroundTasks />
							<Slot />
							{/* Modals & Dialogs */}
							<MobileSidebar />
							<PostReportDialog key={POST_REPORT_DIALOG_ID} />
							<ProfileReportDialog
								key={PROFILE_REPORT_DIALOG_ID}
							/>
							<SendMessageSuccessModal
								key={SEND_MESSAGE_SUCCESS_MODAL_ID}
							/>
							<BlockCreatorModal key={BLOCK_CREATOR_MODAL_ID} />
							<AnimationLoadingModal
								key={ANIMATION_LOADING_DIALOG_ID}
							/>
							<SendTipDialog key="send-tip-dialog" />
							<SendTipSuccessDialog key="send-tip-success-dialog" />
							<PostMediaDialog key="post-media-dialog" />
							<SubscribeDialog key="subscribe-dialog" />
							<PostModal key="create-post-modal" />

							<PwaInstallModal key={PWA_INSTALL_DIALOG_ID} />

							<DeleteAccountSuccessModal
								key={DELETE_ACCOUNT_SUCCESS_DIALOG_ID}
							/>

							{Platform.OS === "web" && <SiftScript />}
							{/* {Platform.OS === "web" && <PWA />} */}
						</AppProvider>
					</GestureHandlerRootView>
					<Toast />
					<ProdModeSwitch />
				</PaperProvider>
			</EventProvider>
		</RecoilRoot>
	);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration();
// TODO: let's not use service workers until we have more engineering power to maintain backwards compat and have less breaking changes in the API
unregisterServiceWorker();
