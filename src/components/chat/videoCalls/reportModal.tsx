import RoundTextInput from "@components/common/RoundTextInput";
import { FypRadio, FypText } from "@components/common/base";
import { FansDivider, FansView } from "@components/controls";
import tw from "@lib/tailwind";
import React, { FC, useState } from "react";
import { Modal, ScrollView } from "react-native";

const POST_REPORT_FLAG = [
	{ code: "ILLEGAL_CONTENT", label: "Illegal conduct or content" },
	{ code: "UNDERAGE_CONTENT", label: "Underage content" },
	{ code: "HARASSMENT_OR_BULLYING", label: "Harassment or bullying" },
	{ code: "SPAM_OR_SCAM", label: "Spam or scam" },
	{
		code: "UNCOMFORTABLE_CONTENT",
		label: "Uncomfortable content",
	},
	{ code: "OTHER", label: "Other" },
] as const;

interface Props {
	visible: boolean;
	handleClose: () => void;
}

const ReportModal: FC<Props> = (props) => {
	const { visible, handleClose } = props;

	const [index, setIndex] = useState(0);
	const [reason, setReason] = useState("");

	const handleSubmit = () => {
		handleClose();
	};

	return (
		<Modal transparent visible={visible}>
			<FansView
				width="full"
				height="full"
				position="relative"
				alignItems="center"
				style={tw.style(
					"bg-fans-black/30 justify-end md:justify-center",
				)}
				touchableOpacityProps={{
					activeOpacity: 1,
					onPress: handleClose,
				}}
			>
				<FansView
					touchableOpacityProps={{ activeOpacity: 1 }}
					style={tw.style(
						"w-full md:w-[450px]",
						"h-9/10 md:h-auto md:max-h-9/10",
						"rounded-t-[7px] md:rounded-[15px] md:rounded-t-[15px]",
						"bg-fans-white dark:bg-fans-black-1d",
					)}
				>
					<FansView flex="1" style={tw.style("pt-9")}>
						<ScrollView>
							<FansView padding={{ x: 18, b: 10 }}>
								<FypText
									fontWeight={700}
									fontSize={19}
									textAlign="center"
									margin={{ b: 26 }}
								>
									Why are you reporting?
								</FypText>
								{POST_REPORT_FLAG.map((flag, i) => (
									<React.Fragment key={i}>
										<FansView padding={{ y: 11 }}>
											<FypRadio
												key={flag.code}
												label={flag.label}
												checked={index === i}
												onPress={() => setIndex(i)}
											/>
										</FansView>

										{i < POST_REPORT_FLAG.length - 1 && (
											<FansDivider />
										)}
									</React.Fragment>
								))}
								<FansView margin={{ y: 25 }}>
									<FypText
										fontSize={17}
										fontWeight={600}
										margin={{ b: 15 }}
									>
										Details (optional)
									</FypText>
									<RoundTextInput
										placeholder="Give additional details"
										value={reason}
										onChangeText={setReason}
										multiline
										numberOfLines={4}
										maxLength={1000}
										customStyles="py-3 px-5 rounded-[7px] h-[128px]"
									/>
								</FansView>
								<FansView
									height={42}
									borderRadius={42}
									alignItems="center"
									justifyContent="center"
									style={tw.style(
										"border border-fans-purple",
									)}
									pressableProps={{
										onPress: handleSubmit,
									}}
								>
									<FypText
										fontSize={19}
										fontWeight={700}
										style={tw.style("text-fans-purple")}
									>
										Submit
									</FypText>
								</FansView>
							</FansView>
						</ScrollView>
					</FansView>
				</FansView>
			</FansView>
		</Modal>
	);
};

export default ReportModal;
