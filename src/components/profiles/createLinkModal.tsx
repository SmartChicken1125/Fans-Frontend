import { StarCheckSvg } from "@assets/svgs/common";
import UserAvatar from "@components/avatar/UserAvatar";
import RoundButton from "@components/common/RoundButton";
import RoundTextInput from "@components/common/RoundTextInput";
import { FypDropdown } from "@components/common/base";
import BottomSheetWrapper from "@components/common/bottomSheetWrapper";
import { FansText, FansView, FansSwitch1 } from "@components/controls";
import {
	createLinkOfferLimitOptions,
	createLinkDurationOptions,
} from "@constants/common";
import { useAppContext } from "@context/useAppContext";
import tw from "@lib/tailwind";
import React, { FC, useState } from "react";

interface Props {
	visible: boolean;
	onClose: () => void;
}

const CreateLinkModal: FC<Props> = (props) => {
	const { visible, onClose } = props;
	const { state, dispatch } = useAppContext();
	const { profile } = state;

	const [isFree, setIsFree] = useState(false);
	const [limit, setLimit] = useState<string>("");
	const [duration, setDuration] = useState("1");

	return (
		<BottomSheetWrapper
			open={visible}
			onClose={() => {
				onClose();
			}}
		>
			<FansView padding={{ x: 18, b: 40 }}>
				<FansText
					fontFamily="inter-bold"
					fontSize={19}
					lineHeight={26}
					textAlign="center"
					style={tw.style("text-fans-black dark:text-fans-white")}
				>
					Create link
				</FansText>
				<FansView margin={{ t: 20, b: 36 }} alignItems="center">
					<UserAvatar image={profile.avatar} size="95px" />
					<FansView
						flexDirection="row"
						alignItems="center"
						margin={{ t: 5 }}
						gap={13}
						justifyContent="center"
					>
						<FansText
							fontSize={19}
							lineHeight={26}
							style={tw.style(
								"font-bold text-fans-black dark:text-fans-white",
							)}
						>
							Jane Love
						</FansText>
						<FansView
							width={15.66}
							height={16}
							justifyContent="center"
						>
							<StarCheckSvg width={15.66} height={15} />
						</FansView>
					</FansView>
				</FansView>

				<FansView
					flexDirection="row"
					alignItems="center"
					gap={18}
					margin={{ b: 15 }}
				>
					<FansText
						fontSize={18}
						lineHeight={24}
						style={tw.style("text-fans-black dark:text-fans-white")}
					>
						fyp.fans/henry/
					</FansText>
					<FansView flex="1">
						<RoundTextInput maxLength={50} />
					</FansView>
				</FansView>
				<FansSwitch1
					label="Free trial link"
					value={isFree}
					onValueChange={(val) => setIsFree(val)}
					height={52}
				/>

				<FansView margin={{ b: 32 }}>
					<FansText
						fontSize={17}
						lineHeight={22}
						style={tw.style(
							"font-semibold mb-[15px] text-fans-black dark:text-fans-white",
						)}
					>
						Offer limit
					</FansText>
					<FypDropdown
						data={createLinkOfferLimitOptions}
						value={limit}
						onSelect={(val) => setLimit(val as string)}
					/>
				</FansView>
				<FansView margin={{ b: 32 }}>
					<FansText
						fontSize={17}
						lineHeight={22}
						style={tw.style(
							"font-semibold mb-[15px] text-fans-black dark:text-fans-white",
						)}
					>
						Free trial duration
					</FansText>
					<FypDropdown
						data={createLinkDurationOptions}
						value={duration}
						onSelect={(val) => setDuration(val as string)}
					/>
				</FansView>
				<RoundButton>Create link</RoundButton>
			</FansView>
		</BottomSheetWrapper>
	);
};

export default CreateLinkModal;
