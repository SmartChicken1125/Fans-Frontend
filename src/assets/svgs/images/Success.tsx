import { FansSvgProps } from "@usertypes/components";
import React, { FC } from "react";
import { Svg, G, Path, Defs, Stop } from "react-native-svg";

const SuccessImage: FC<FansSvgProps> = (props) => {
	return (
		<Svg width={props.size} height={props.size} viewBox="0 0 82.255 79.155">
			<Defs>
				<linearGradient
					id="linear-gradient"
					x1="-0.201"
					y1="0.954"
					x2="1.081"
					y2="0.124"
					gradientUnits="objectBoundingBox"
				>
					<Stop offset="0.054" stopColor="#161fe4" />
					<Stop offset="0.625" stopColor="#a854f5" />
					<Stop offset="0.915" stopColor="#d885ff" />
				</linearGradient>
				<linearGradient
					id="linear-gradient-2"
					x1="-1.004"
					y1="1.783"
					x2="1.725"
					y2="-0.661"
					xlinkHref="#linear-gradient"
				/>
			</Defs>
			<G
				id="Group_56297"
				data-name="Group 56297"
				transform="translate(-1416.457 -143.368)"
			>
				<G
					id="Group_52992"
					data-name="Group 52992"
					transform="translate(1416.957 144.022)"
				>
					<Path
						id="Path_47180"
						data-name="Path 47180"
						d="M1467.808,222.023a9.174,9.174,0,0,1-4.954-1.621c-.663-.425-1.3-.894-1.932-1.36-.415-.309-.828-.618-1.254-.907-.666-.458-1.355-.884-2.039-1.307l-.232.16c-1.011.7-2.022,1.4-3,2.135a13.205,13.205,0,0,1-6.668,2.834,6.991,6.991,0,0,1-6.542-3.206,17.505,17.505,0,0,1-2.413-5.473l-.241-.79c-.2-.636-.451-1.256-.7-1.877l-.1-.246-.243-.013c-.988-.051-2-.1-2.974-.086a17.628,17.628,0,0,1-5.647-.537,7.309,7.309,0,0,1-5.273-5.316,8.677,8.677,0,0,1-.225-1.547l-.051-.714a16.986,16.986,0,0,1,1.2-5.422c.131-.38.266-.762.39-1.145.213-.669.393-1.35.56-2.034l-.4-.3c-.887-.669-1.77-1.332-2.644-2.018l-.635-.489a20.726,20.726,0,0,1-2.353-1.993,7.8,7.8,0,0,1,.048-11.472,25.494,25.494,0,0,1,2.973-2.421c.428-.314.859-.628,1.274-.955l1.71-1.37c-.145-.545-.3-1.081-.445-1.623l-.173-.615c-.144-.522-.3-1.041-.453-1.56a38.014,38.014,0,0,1-.983-3.758,7.545,7.545,0,0,1,4.992-8.507,17.185,17.185,0,0,1,5.957-.737c1.132,0,2.264-.023,3.394-.058l.8-2.193c.172-.471.332-.94.494-1.411a31.95,31.95,0,0,1,1.385-3.551,7.648,7.648,0,0,1,6.091-4.439,7.321,7.321,0,0,1,4.648.97c.995.575,1.945,1.226,2.894,1.877.438.3.876.6,1.32.889l.486.324c.57.377,1.137.755,1.72,1.1.519-.314,1.025-.653,1.532-.993l.747-.5c.408-.266.808-.55,1.211-.831a25.085,25.085,0,0,1,3.054-1.932c3.9-1.975,7.825-.876,10.239,2.864a18.48,18.48,0,0,1,2.031,4.908l.255.838c.175.557.391,1.1.605,1.644.053.144.111.284.165.428,1.134.048,2.269.086,3.4.086a17.686,17.686,0,0,1,6.027.745,7.42,7.42,0,0,1,4.959,6.926,16.756,16.756,0,0,1-1.233,6.1l-.329.983c-.216.656-.391,1.325-.555,1.993l.469.347c.962.717,1.922,1.433,2.87,2.17l.356.274a21.65,21.65,0,0,1,2.3,1.96h0a7.825,7.825,0,0,1-.028,11.546,26.044,26.044,0,0,1-2.958,2.4c-.436.317-.868.636-1.289.965-.456.36-.9.722-1.355,1.089l-.327.263c.147.557.3,1.117.458,1.671l.165.593c.144.527.3,1.048.451,1.568a38.7,38.7,0,0,1,.978,3.753,7.532,7.532,0,0,1-4.825,8.421,16.263,16.263,0,0,1-5.721.793l-3.8.056c-.162.433-.319.866-.479,1.3l-.317.869c-.17.466-.331.94-.494,1.416a31.486,31.486,0,0,1-1.37,3.535,7.584,7.584,0,0,1-6.215,4.488C1468.309,222.01,1468.059,222.023,1467.808,222.023Zm-10.223-9.986a3.421,3.421,0,0,1,1.848.547l.6.37c.742.463,1.487.924,2.208,1.418.471.324.934.664,1.4,1,.547.408,1.1.818,1.671,1.183a4.374,4.374,0,0,0,2.788.894,3.025,3.025,0,0,0,2.568-1.917,27.562,27.562,0,0,0,1.165-3.042c.172-.509.347-1.016.532-1.517l.309-.851c.225-.618.451-1.236.689-1.846a3.716,3.716,0,0,1,3.479-2.449l4.173-.066a12.766,12.766,0,0,0,4.323-.5,2.939,2.939,0,0,0,1.965-3.295c-.207-1.081-.529-2.17-.868-3.32-.165-.55-.327-1.1-.479-1.651l-.16-.58c-.218-.785-.438-1.57-.638-2.36a3.505,3.505,0,0,1,1.223-3.69l.8-.648c.468-.38.94-.762,1.415-1.137.458-.357.932-.707,1.408-1.053a22.846,22.846,0,0,0,2.454-1.973,3.325,3.325,0,0,0-.03-5.105h0a17.877,17.877,0,0,0-1.834-1.542l-.367-.281c-.924-.719-1.861-1.416-2.8-2.115l-.894-.669a3.738,3.738,0,0,1-1.378-4c.223-.917.454-1.844.75-2.743l.352-1.043a13.013,13.013,0,0,0,.987-4.477,2.878,2.878,0,0,0-1.927-2.776c-2.532-.9-5.731-.471-8.768-.6a3.454,3.454,0,0,1-3.176-2.32l-.37-.965c-.256-.648-.507-1.294-.712-1.955l-.271-.884a14.626,14.626,0,0,0-1.5-3.746c-1.15-1.79-2.53-2.186-4.346-1.271a20.826,20.826,0,0,0-2.494,1.593c-.441.309-.879.62-1.328.914l-.719.476c-.778.519-1.558,1.038-2.37,1.489a3.653,3.653,0,0,1-3.371.005c-.876-.479-1.719-1.036-2.563-1.6l-.474-.314c-.466-.306-.924-.621-1.385-.937-.859-.585-1.715-1.178-2.611-1.7a2.877,2.877,0,0,0-1.782-.39,3.085,3.085,0,0,0-2.558,1.894,27.952,27.952,0,0,0-1.183,3.057c-.17.5-.344,1.005-.527,1.5l-1,2.738a3.57,3.57,0,0,1-3.322,2.419c-2.976.1-6.119-.322-8.57.555a2.939,2.939,0,0,0-2.049,3.358,34.012,34.012,0,0,0,.871,3.307c.165.547.33,1.1.482,1.651l.167.6c.21.75.418,1.5.61,2.256a3.556,3.556,0,0,1-1.234,3.773l-.959.772c-.418.337-.835.674-1.258,1.005-.453.357-.922.7-1.393,1.043a21.653,21.653,0,0,0-2.459,1.986,3.3,3.3,0,0,0,.013,5.05,16.849,16.849,0,0,0,1.851,1.55l.684.527c.846.666,1.71,1.314,2.571,1.96l.843.636a3.686,3.686,0,0,1,1.357,3.923c-.228.94-.466,1.884-.762,2.811-.137.418-.281.833-.423,1.246a13.514,13.514,0,0,0-.95,3.882l.038.415a4.252,4.252,0,0,0,.086.719,2.812,2.812,0,0,0,2.158,2.115,14.475,14.475,0,0,0,4.265.355c1.1-.035,2.2.035,3.3.091l.927.046a3.343,3.343,0,0,1,3.054,2.181l.352.889c.291.732.583,1.461.815,2.208l.256.828a13.6,13.6,0,0,0,1.73,4.105c.969,1.327,1.782,1.433,2.388,1.362a8.8,8.8,0,0,0,4.389-1.932c1.036-.783,2.1-1.517,3.166-2.251l.848-.59A3.392,3.392,0,0,1,1457.584,212.037Zm-.578,4.4.01.008Zm-18.563-6.04h0Zm-.986-.742.005.013Zm51.775-15.732-.01.005Zm-63.292-21.785-.01.005Zm12.4-16.487h0Zm38.41-.013h0Zm-18.669-6.111.018.008Z"
						transform="translate(-1416.957 -144.022)"
						strokeWidth="0"
						fill="url(#linear-gradient)"
					/>
				</G>
				<Path
					id="Path_47181"
					data-name="Path 47181"
					d="M1439.42,180.96a2.271,2.271,0,0,1-1.613-.669l-11.68-11.677a2.28,2.28,0,1,1,3.224-3.226l10.069,10.069,20.315-20.321a2.281,2.281,0,1,1,3.226,3.226l-21.931,21.929A2.266,2.266,0,0,1,1439.42,180.96Z"
					transform="translate(13.028 16.011)"
					strokeWidth="0"
					fill="url(#linear-gradient-2)"
				/>
			</G>
		</Svg>
	);
};

export default SuccessImage;
