import React from "react";
import {
	Svg,
	Defs,
	ClipPath,
	Path,
	Pattern,
	Image,
	G,
	SvgProps,
	Circle,
} from "react-native-svg";

interface FansSvgProps extends SvgProps {
	color?: string;
	fill?: string;
	size?: number;
}

export default function Expand({ ...props }: FansSvgProps) {
	return (
		<Svg
			width={props.width ?? props.size}
			height={props.height ?? props.size}
			{...props}
			viewBox="0 0 31.127 31.132"
		>
			<G data-name="Group 52067">
				<G data-name="Group 52070">
					<G data-name="Group 52069">
						<G data-name="Group 52067-2">
							<Path
								data-name="Path 46831"
								d="M8.712 8.712H4.355A4.368 4.368 0 010 4.355V0"
								fill="none"
								stroke={props.color ?? "currentColor"}
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								transform="translate(1 1) translate(.173 .007) translate(20.241)"
							/>
						</G>
						<G data-name="Group 52068">
							<Path
								data-name="Path 46832"
								d="M0 0h4.355a4.368 4.368 0 014.357 4.355v4.354"
								fill="none"
								stroke={props.color ?? "currentColor"}
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								transform="translate(1 1) translate(.173 .007) translate(0 20.241)"
							/>
						</G>
					</G>
				</G>
				<G data-name="Group 52074">
					<G data-name="Group 52073">
						<G data-name="Group 52071">
							<Path
								data-name="Path 46833"
								d="M8.764 0v4.388a4.394 4.394 0 01-4.381 4.383H0"
								fill="none"
								stroke={props.color ?? "currentColor"}
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								transform="translate(1 1)"
							/>
						</G>
						<G data-name="Group 52072">
							<Path
								data-name="Path 46834"
								d="M0 8.764V4.381A4.4 4.4 0 014.383 0h4.381"
								fill="none"
								stroke={props.color ?? "currentColor"}
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								transform="translate(1 1) translate(20.361 20.368)"
							/>
						</G>
					</G>
				</G>
			</G>
		</Svg>
	);
}
