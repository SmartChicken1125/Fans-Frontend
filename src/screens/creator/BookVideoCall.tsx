import { VideoCameraSvg } from "@assets/svgs/common";
import {
	FypSvg,
	FypText,
	FypLinearGradientView,
} from "@components/common/base";
import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import React from "react";
import { Image } from "react-native";

interface BookVideoCallProps {
	username: string;
	onClick: () => void;
}

const BookVideoCall: React.FC<BookVideoCallProps> = ({ username, onClick }) => {
	const handleBookVideoCall = () => {
		onClick();
	};

	return (
		<FansView
			borderRadius={15}
			margin={{ b: 30, t: 12 }}
			padding={{ l: 17, r: 15, t: 18, b: 19 }}
			flexDirection="row"
			gap={17}
			style={tw.style(
				"border border-fans-grey-f0 dark:border-fans-grey-43",
			)}
		>
			<Image
				source={require("@assets/images/call-to-action-video.png")}
				style={tw.style("w-[75px] h-[90px]")}
				resizeMode="cover"
			/>
			<FansView flex="1">
				<FypText fontSize={19} fontWeight={600} margin={{ b: 6 }}>
					Just for you
				</FypText>
				<FypText fontSize={16} margin={{ b: 19 }}>
					Have an exclusive 1:1 video call with {username}!
				</FypText>
				<FansView pressableProps={{ onPress: handleBookVideoCall }}>
					<FypLinearGradientView
						colors={["#1D21E5", "#D885FF"]}
						start={[0, 1]}
						end={[1, 0]}
						height={42}
						flexDirection="row"
						alignItems="center"
						justifyContent="center"
						gap={9}
						borderRadius={42}
					>
						<FypSvg
							svg={VideoCameraSvg}
							width={15}
							height={14}
							color="fans-white"
						/>
						<FypText
							fontSize={19}
							fontWeight={700}
							style={tw.style("text-fans-white")}
						>
							Book video call
						</FypText>
					</FypLinearGradientView>
				</FansView>
			</FansView>
		</FansView>
	);
};

export default BookVideoCall;
