import { CloseSvg } from "@assets/svgs/common";
import RoundButton from "@components/common/RoundButton";
import { FypSvg } from "@components/common/base";
import { FansText, FansView, FansIconButton } from "@components/controls";
import tw from "@lib/tailwind";
import { StorageKeyTypes } from "@usertypes/commonEnums";
import { setStorage, getStorage } from "@utils/storage";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { Image } from "react-native";

const BecomeCreator = () => {
	const router = useRouter();

	const [hide, setHide] = useState(false);

	const onBecomeCreator = () => {
		router.push({
			pathname: "profile",
			params: { screen: "ProfileName" },
		});
	};

	const handleClose = async () => {
		setHide(true);
		setStorage(StorageKeyTypes.HideBecomeCreator, "true");
	};

	useEffect(() => {
		getStorage(StorageKeyTypes.HideBecomeCreator).then((val) => {
			setHide(val !== null);
		});
	}, []);

	return hide ? null : (
		<FansView
			position="relative"
			style={tw.style(
				"py-6 px-4 rounded-[15px] flex-row items-center md:py-10 md:px-6",
				"bg-fans-purple-f6 dark:bg-fans-purple-47",
			)}
		>
			<FansIconButton
				backgroundColor="bg-transparent"
				style={tw.style("absolute top-2 right-2")}
				onPress={handleClose}
			>
				<FypSvg
					svg={CloseSvg}
					width={12}
					height={12}
					color="fans-black"
				/>
			</FansIconButton>
			<Image
				source={require("@assets/images/profile/medias-set.png")}
				style={tw.style("w-[74px] h-[78px]")}
			/>
			<FansView style={tw.style("ml-5 md:ml-10")}>
				<FansText
					fontSize={19}
					lineHeight={21}
					style={tw.style(
						"font-semibold mb-1.5",
						"text-fans-black dark:text-fans-white",
					)}
				>
					Are you a creator?
				</FansText>
				<FansText
					fontSize={16}
					lineHeight={21}
					style={tw.style(
						"mb-4",
						"text-fans-black dark:text-fans-white",
					)}
				>
					Sign up to start posting now
				</FansText>
				<FansView width={204}>
					<RoundButton onPress={onBecomeCreator}>
						Become creator
					</RoundButton>
				</FansView>
			</FansView>
		</FansView>
	);
};

export default BecomeCreator;
