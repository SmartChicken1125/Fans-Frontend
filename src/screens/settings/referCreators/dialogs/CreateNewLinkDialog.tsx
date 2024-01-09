import { CloseSvg, PhonewithCashSvg } from "@assets/svgs/common";
import FormControl from "@components/common/FormControl";
import RoundButton from "@components/common/RoundButton";
import { FypText } from "@components/common/base";
import BottomSheetWrapper from "@components/common/bottomSheetWrapper";
import { FansGap, FansText, FansView } from "@components/controls";
import { CommonActionType, useAppContext } from "@context/useAppContext";
import { createReferralLink } from "@helper/endpoints/referral/apis";
import tw from "@lib/tailwind";
import { RoundButtonType } from "@usertypes/commonEnums";
import { IFansModal } from "@usertypes/components";
import { validateReferralCode } from "@utils/validateHelper";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { IconButton } from "react-native-paper";

const CreateNewLinkDialog: IFansModal = (props) => {
	const { onSubmit } = props;

	const { state, dispatch } = useAppContext();
	const { openCreateNewReferralLinkModal } = state.common;

	const [newLink, setNewLink] = useState("");
	const [isNewLinkValid, setIsNewLinkValid] = useState(false);
	const [submitted, setSubmitted] = useState<boolean>(false);
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const open = useMemo(
		() => (openCreateNewReferralLinkModal ? true : false),
		[openCreateNewReferralLinkModal],
	);
	useEffect(() => {
		if (open) {
			setNewLink("");
		}
	}, [open]);

	const onClose = () => {
		dispatch.setCommon({
			type: CommonActionType.toggleCreateNewReferralLinkModal,
			data: false,
		});
	};

	const handleCreateLink = useCallback(async () => {
		setSubmitted(true);

		if (newLink && isNewLinkValid) {
			setLoading(true);
			const resp = await createReferralLink({
				code: newLink,
			});

			setLoading(false);

			if (resp.ok) {
				onClose();
				onSubmit(newLink);
			} else {
				if (resp.data.code === 4009) {
					setErrorMessage(
						"This link is already created, create a different one",
					);
				} else {
					setErrorMessage(
						"Failed to create a link. Please try again",
					);
				}
			}
		} else {
			setErrorMessage(
				"Please enter a valid code(alphanumeric, 1-20 length)",
			);
		}
	}, [newLink]);

	return (
		<BottomSheetWrapper
			open={open}
			onClose={onClose}
			dialogWrapperStyle="md:max-w-[740px]"
			topLineStyle="md:hidden"
		>
			<View style={tw.style("pb-3 md:pb-0 px-[19px] md:px-[32px]")}>
				<View
					style={tw.style(
						"relative md:pb-[34px] md:pt-[15px] items-center",
					)}
				>
					<View
						style={tw.style(
							"hidden absolute right-[0px] top-[6px] md:flex w-7.5 h-7.5",
						)}
					>
						<IconButton
							icon={() => <CloseSvg size={13.2} color="#fff" />}
							containerColor="rgba(0,0,0,0.3)"
							style={tw.style("m-0 w-7.5 h-7.5 ")}
							onPress={onClose}
						/>
					</View>

					<PhonewithCashSvg width={70.6} height={65.3} />

					<FansGap height={20} />

					<FypText
						fontWeight={700}
						textAlign="center"
						style={tw.style(
							"text-[19px] leading-[26px] md:text-[23px] md:leading-[31px]",
						)}
					>
						Create new referral link
					</FypText>

					<FansGap height={13} />

					<FansText
						fontFamily="inter-regular"
						fontSize={16}
						textAlign="center"
					>
						Earn LIFETIME 10% on creators income when they sign up
						with your link
					</FansText>

					<FansGap height={{ xs: 21, lg: 37.6 }} />

					<FansView
						width="full"
						flexDirection="row"
						alignItems="center"
					>
						<FansText fontSize={18}>fyp.fans/?r=</FansText>
						<FansGap width={10} />
						<FormControl
							placeholder=""
							value={newLink}
							onChangeText={(text: string) => {
								setNewLink(text);
								setIsNewLinkValid(validateReferralCode(text));
							}}
							hasError={submitted && errorMessage.length > 0}
							validateString={errorMessage}
							styles="grow"
						/>
					</FansView>

					<FansGap height={23} />

					<RoundButton
						disabled={loading || newLink.length === 0}
						variant={RoundButtonType.SECONDARY}
						customStyles="w-full"
						onPress={handleCreateLink}
					>
						<FansView
							style={tw.style(
								"flex flex-row items-center gap-[10px]",
							)}
						>
							<FansText
								fontSize={19}
								style={tw.style("font-inter-bold")}
							>
								Create link
							</FansText>
						</FansView>
					</RoundButton>
				</View>
			</View>
		</BottomSheetWrapper>
	);
};

export default CreateNewLinkDialog;
