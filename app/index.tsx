import { useAppContext } from "@context/useAppContext";
import { SIFT_ACCOUNT_ID, SIFT_BEACON_KEY, SIFT_SERVER_URL_FORMAT } from "@env";
import { postVisitReferralLink } from "@helper/endpoints/referral/apis";
import LandingScreen from "@screens/Landing";
import { AuthState, authStateAtom } from "@state/auth";
import { StorageKeyTypes } from "@usertypes/commonEnums";
import { setStorage } from "@utils/storage";
import { validateReferralCode } from "@utils/validateHelper";
import { Redirect, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { useRecoilValue } from "recoil";
import SiftReactNative from "sift-react-native";

const IndexScreen = () => {
	const { dispatch } = useAppContext();
	const authState = useRecoilValue(authStateAtom);
	const { r } = useLocalSearchParams();

	useEffect(() => {
		dispatch.fetchUserInfo().then((resp) => {
			if (!resp.ok) return;
			dispatch.fetchProfile();
			dispatch.fetchSuggestedCreators();

			const user = resp.data;
			SiftReactNative.setSiftConfig(
				SIFT_ACCOUNT_ID,
				SIFT_BEACON_KEY,
				true,
				SIFT_SERVER_URL_FORMAT,
			);
			SiftReactNative.setUserId(user.id);
		});

		if (typeof r === "string" && validateReferralCode(r as string)) {
			setStorage(StorageKeyTypes.FeatureReferrralCode, r);
			postVisitReferralLink({}, { id: r as string });
		}
	}, []);

	if (authState === AuthState.Loading) {
		return null;
	} else if (authState === AuthState.Authenticated) {
		return <Redirect href="/posts" />;
	} else if (Platform.OS !== "web") {
		return <Redirect href="/auth/login" />;
	} else {
		return <LandingScreen />;
	}
};

export default IndexScreen;
