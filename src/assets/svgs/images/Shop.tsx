import { IFansSvg } from "@usertypes/components";
import React from "react";
import { G, Path, Svg, Defs, Stop, LinearGradient } from "react-native-svg";

export const ShopImage: IFansSvg = () => {
	return (
		<Svg viewBox="0 0 43.312 54.82">
			<Defs>
				<LinearGradient
					id="shop-image-linear-gradient"
					x1="-0.341"
					y1="1.525"
					x2="1.451"
					y2="-0.376"
					gradientUnits="objectBoundingBox"
				>
					<Stop offset="0.283" stopColor="#5472ef" />
					<Stop offset="0.509" stopColor="#a854f5" />
					<Stop offset="0.774" stopColor="#deacfc" />
				</LinearGradient>
				<linearGradient
					id="shop-image-linear-gradient-2"
					x1="-1.51"
					y1="5.758"
					x2="2.169"
					y2="-4.399"
					xlinkHref="#shop-image-linear-gradient"
				/>
			</Defs>
			<G
				id="Group_60099"
				data-name="Group 60099"
				transform="translate(1016.429 2028.592)"
			>
				<Path
					id="Path_50150"
					data-name="Path 50150"
					d="M-1015.554-1976.068a5.157,5.157,0,0,0,4.492,2.293h26.136q3.245-.008,6.488,0a5.762,5.762,0,0,0,2.358-.5,5.132,5.132,0,0,0,2.951-5.01c-.071-1.356-.13-2.707-.187-4.058l-.467-10.184q-.27-5.754-.545-11.513l-.081-1.755c-.067-1.508-.136-3.068-.25-4.595a5.091,5.091,0,0,0-5.061-4.7h-.02c-.752-.007-1.5-.005-2.24,0l-1.12,0c-.111,0-.215-.009-.331-.016l-.624-.032,0-.763c0-.227.008-.445,0-.662a19.194,19.194,0,0,0-.143-2.047,10.678,10.678,0,0,0-.846-2.775,10.686,10.686,0,0,0-14.163-5.225,10.37,10.37,0,0,0-6.288,9.633c-.012.325-.008.633-.005.957l.005.931-1.024.006-1.125,0-1.118,0c-.371,0-.743,0-1.114.007a5.058,5.058,0,0,0-4.8,3.612,11.047,11.047,0,0,0-.3,2.353c-.077,1.305-.131,2.6-.186,3.889-.034.79-.067,1.58-.106,2.37l-.538,11.339q-.154,3.15-.3,6.306-.167,3.555-.315,7.115A4.867,4.867,0,0,0-1015.554-1976.068Zm16-47.979a7.729,7.729,0,0,1,8.756-.542,7.935,7.935,0,0,1,3.766,8.134l-.055.335h-15.343l-.057-.331A7.857,7.857,0,0,1-999.551-2024.047Zm-13.954,44.936c.046-1.324.109-2.674.17-4.023l.859-18q.189-4.188.39-8.389l.013-.3c.016-.4.034-.807.07-1.211a2.241,2.241,0,0,1,2.324-2.136c1.658-.011,3.339-.011,5.018-.011q8.916-.015,17.839-.042l1.043,0c1.908,0,3.818-.006,5.725-.04.035,0,.1-.005.168-.006a2.372,2.372,0,0,1,2.37,2.345c.044,1.477.121,2.961.2,4.445l.627,13.128q.2,4.107.381,8.215c.029.608.052,1.218.076,1.828.052,1.335.1,2.672.2,4.005a2.488,2.488,0,0,1,.005.45,2.371,2.371,0,0,1-.833,1.623,2.367,2.367,0,0,1-1.539.567c-.067,0-.132,0-.2-.008-3.909-.025-7.849-.021-11.792-.017l-3.193,0,0,0h-1.2q-8.08.009-16.164-.016a3.571,3.571,0,0,1-1.14-.159A2.167,2.167,0,0,1-1013.505-1979.111Z"
					fill="url(#shop-image-linear-gradient)"
				/>
				<Path
					id="Path_50151"
					data-name="Path 50151"
					d="M-994.814-1998.213h.161a10.638,10.638,0,0,0,10.219-7.536,5.656,5.656,0,0,0,.267-1.217,1.39,1.39,0,0,0-1.114-1.467,1.456,1.456,0,0,0-1.724.933,5.1,5.1,0,0,0-.148.519l-.059.229a7.847,7.847,0,0,1-5.4,5.425,7.745,7.745,0,0,1-5.928-.7,7.745,7.745,0,0,1-3.694-4.689l-.074-.281a4.626,4.626,0,0,0-.15-.521,1.422,1.422,0,0,0-1.406-.94h-.039a1.336,1.336,0,0,0-1.3.945,2.446,2.446,0,0,0,.007,1.093A10.617,10.617,0,0,0-994.814-1998.213Z"
					fill="url(#shop-image-linear-gradient-2)"
				/>
			</G>
		</Svg>
	);
};
