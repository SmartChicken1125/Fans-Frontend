import React from "react";
import { Svg, Path, SvgProps } from "react-native-svg";

export default function ClickSvg({ ...props }: SvgProps) {
	return (
		<Svg {...props} viewBox="0 0 12.043 15.707">
			<Path
				d="M297.6,463.883a.444.444,0,0,0-.354.344.466.466,0,0,0,.12.467,1.062,1.062,0,0,1,.186,1.2,1.088,1.088,0,0,1-1.054.648h-.881c-.56,0-1.122,0-1.682,0a.476.476,0,0,0-.5.408.511.511,0,0,0,.082.358l1.156,2.055c.234.416.469.833.7,1.251a1.1,1.1,0,0,1-1.039,1.623,1.1,1.1,0,0,1-.925-.625q-.511-.965-1.027-1.928l-.438-.823c-.14-.265-.28-.53-.427-.792a.479.479,0,0,0-.613-.234.558.558,0,0,0-.283.289l-.547,1.045q-.342.651-.68,1.3a.735.735,0,0,1-.477.39,1.064,1.064,0,0,1-1.26-.675,1.674,1.674,0,0,1-.1-.585q-.005-4.208,0-8.417V459.55a1.062,1.062,0,0,1,.62-.967,1.048,1.048,0,0,1,1.141.122l4.514,3.367c.244.184.489.368.738.544a.487.487,0,0,0,.4.081.471.471,0,0,0,.309-.24.491.491,0,0,0-.185-.654l-1.207-.9q-2.015-1.505-4.034-3.006a2.038,2.038,0,0,0-2.609.161,2.063,2.063,0,0,0-.655,1.592v9.981c0,.071,0,.142,0,.214a2.1,2.1,0,0,0,1.073,1.753,1.928,1.928,0,0,0,1.594.177,1.641,1.641,0,0,0,1.02-.9,7.719,7.719,0,0,1,.362-.716c.059-.106.119-.214.178-.327a.3.3,0,0,1,.263-.161h0a.3.3,0,0,1,.264.155l-.264.147h0l.269-.138.458.855c.256.483.512.967.778,1.445a1.972,1.972,0,0,0,1.691,1.069,1.932,1.932,0,0,0,1.867-.959,1.971,1.971,0,0,0,.054-2.119c-.243-.446-.494-.889-.744-1.333l-.376-.668c-.021-.039-.039-.077-.06-.123l-.027-.059a.3.3,0,0,1,.273-.431l.414,0c.293,0,.578,0,.863,0a2.074,2.074,0,0,0,1.516-3.479A.434.434,0,0,0,297.6,463.883Z"
				transform="translate(-286.589 -457.5)"
				fill={props.color ?? "#fff"}
			/>
		</Svg>
	);
}
