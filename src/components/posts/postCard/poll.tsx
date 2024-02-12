import { PollSvg } from "@assets/svgs/common";
import { FypText, FypSvg, FypNullableView } from "@components/common/base";
import { FansView } from "@components/controls";
import { createPollVote } from "@helper/endpoints/post/apis";
import tw from "@lib/tailwind";
import { IPost, IPollAnswer } from "@usertypes/types";
import { getAgoTime } from "@utils/common";
import React, { FC, useState, useEffect } from "react";
import Toast from "react-native-toast-message";

interface PollAnswerProps {
	showPercent: boolean;
	voteCounts: number;
	onPressAnswer: () => void;
	answer: IPollAnswer;
}

const PollAnswer: FC<PollAnswerProps> = (props) => {
	const { answer, onPressAnswer, voteCounts, showPercent } = props;
	const percent =
		voteCounts === 0
			? 0
			: Math.round((answer.voteCount / voteCounts) * 100);
	return (
		<FansView
			position="relative"
			height={42}
			borderRadius={42}
			width="full"
			flexDirection="row"
			alignItems="center"
			justifyContent="between"
			padding={{ l: 22, r: 18 }}
			gap={8}
			style={tw.style(
				"border border-fans-grey-de dark:text-fans-grey-50",
			)}
			pressableProps={{
				onPress: onPressAnswer,
			}}
		>
			<FypText
				fontSize={17}
				lineHeight={22}
				numberOfLines={1}
				style={tw.style("flex-1 relative z-10")}
			>
				{answer.answer}
			</FypText>
			<FypNullableView visible={showPercent}>
				<FypText
					fontSize={16}
					lineHeight={21}
					style={tw.style(
						"text-fans-grey-70 dark:text-fans-grey-b1 relative z-10",
					)}
				>
					{`${percent}%`}
				</FypText>
			</FypNullableView>
			<FypNullableView visible={showPercent}>
				<FansView
					position="absolute"
					height={42}
					top={0}
					left={0}
					borderRadius={42}
					style={tw.style("bg-fans-purple", `w-${percent}/100`)}
				></FansView>
			</FypNullableView>
		</FansView>
	);
};

interface Props {
	data: IPost;
	handleUpdatePost: (postId: string, data: Partial<IPost>) => void;
}

const Poll: FC<Props> = (props) => {
	const { data, handleUpdatePost } = props;
	const { poll } = data;

	const [voteCounts, setVoteCounts] = useState(0);

	const [showPercent, setShowPercent] = useState(false);

	const onPressAnswer = async (answerId: string) => {
		if (poll) {
			const resp = await createPollVote({
				pollId: poll?.id ?? "",
				answerId: answerId,
			});
			setShowPercent(true);
			if (resp.ok) {
				handleUpdatePost(data.id, {
					poll: { ...poll, answers: resp.data.answers },
				});
			} else {
				Toast.show({
					type: "error",
					text1: resp.data.message,
				});
			}
		}
	};

	useEffect(() => {
		let sum = 0;
		poll?.answers.forEach((answer) => {
			sum += answer.voteCount;
		});
		setVoteCounts(sum);
	}, [poll]);

	return (
		<FansView style={tw.style("px-[18px] pt-[6px] pb-3 md:px-0")}>
			<FansView margin={{ b: 14 }} gap={7}>
				{poll?.answers.map((answer, index) => (
					<PollAnswer
						key={index}
						answer={answer}
						voteCounts={voteCounts}
						onPressAnswer={() => onPressAnswer(answer.id)}
						showPercent={showPercent}
					/>
				))}
			</FansView>
			<FansView flexDirection="row" alignItems="center">
				<FypSvg
					svg={PollSvg}
					width={14}
					height={14}
					color="fans-grey-70 dark:fans-grey-b1"
					style={tw.style("mr-3")}
				/>
				<FypText
					fontSize={16}
					fontWeight={600}
					lineHeight={21}
					margin={{ r: 10 }}
					style={tw.style("text-fans-grey-70 dark:text-fans-grey-b1")}
				>
					Poll
				</FypText>
				<FypText
					fontSize={16}
					fontWeight={400}
					lineHeight={21}
					style={tw.style("text-fans-grey-70 dark:text-fans-grey-b1")}
				>
					{`${voteCounts} votes`}
				</FypText>
				<FansView
					margin={{ x: 9 }}
					width={4}
					height={4}
					borderRadius={4}
					style={tw.style("bg-fans-grey-70 dark:bg-fans-grey-b1")}
				></FansView>
				<FypText
					fontSize={16}
					fontWeight={400}
					lineHeight={21}
					style={tw.style("text-fans-grey-70 dark:text-fans-grey-b1")}
				>
					{`${getAgoTime(poll?.endDate ?? "", false)} left`}
				</FypText>
			</FansView>
		</FansView>
	);
};

export default Poll;
