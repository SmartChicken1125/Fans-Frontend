import { ThreeLineSvg, GemSvg, LogoSvg } from "@assets/svgs/common";
import { FypSvg, FypText } from "@components/common/base";
import { FansView } from "@components/controls";
import { useAppContext, CommonActionType } from "@context/useAppContext";
import tw from "@lib/tailwind";
import { useRouter } from "expo-router";
import React from "react";
import { Image } from "react-native";

const AppBar = () => {
	const router = useRouter();
	const { state, dispatch } = useAppContext();
	const { userInfo } = state.user;

	const handleOpenGemModal = () => {
		router.push({ pathname: "get-gems", params: { gems: 1000 } });
	};

	const handleOpenSidebar = () => {
		dispatch.setCommon({
			type: CommonActionType.toggleSidebar,
			data: true,
		});
	};

	return (
		<FansView
			padding={18}
			justifyContent="center"
			alignItems="center"
			style={tw.style("md:hidden")}
		>
			<FansView
				position="absolute"
				left={18}
				pressableProps={{
					onPress: handleOpenSidebar,
				}}
			>
				<FypSvg
					width={25}
					height={25}
					svg={ThreeLineSvg}
					color="fans-black dark:fans-white"
				/>
			</FansView>
			{/* <LogoSvg width={114} height={23} /> */}
			<Image
				source={require("@assets/images/fypfanswebsitelogo.png")}
				style={{ width: 155, height: 30 }}
			/>
			<FansView
				position="absolute"
				flexDirection="row"
				alignItems="center"
				borderRadius={34}
				style={tw.style(
					"right-[18px] pl-[9.3px] pr-[12.2px] py-[5px] min-w-[74px]",
					"bg-fans-grey-f0 dark:bg-fans-grey-43",
				)}
				pressableProps={{
					onPress: handleOpenGemModal,
				}}
			>
				{/* <GemSvg size={18.8} /> */}
				<Image
					source={require("@assets/images/gem.png")}
					style={{ width: 18.8, height: 17.43 }}
				/>
				<FypText
					fontSize={18}
					lineHeight={24}
					style={tw.style("text-fans-black dark:text-fans-white")}
					fontWeight={500}
					margin={{ l: 4 }}
				>
					{userInfo.gems}
				</FypText>
			</FansView>
		</FansView>
	);
};

export default AppBar;
