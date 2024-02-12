const b83lut = [
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, 63, 64,
	-1, -1, -1, -1, 65, 66, 67, 68, 69, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 70,
	71, -1, 72, -1, 73, 74, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
	23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 75, -1, 76, 77, 78, -1,
	36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54,
	55, 56, 57, 58, 59, 60, 61, 79, 80, 81, 82, -1, -1, -1, -1, -1, -1, -1, -1,
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	-1, -1, -1, -1, -1, -1, -1,
];
const sRGBToLinearLut = [
	0.0, 0.000303527, 0.000607054, 0.000910581, 0.0012141079, 0.0015176349,
	0.0018211619, 0.0021246889, 0.0024282159, 0.0027317429, 0.0030352698,
	0.0033465358, 0.0036765073, 0.004024717, 0.004391442, 0.0047769535,
	0.0051815167, 0.0056053916, 0.006048833, 0.0065120908, 0.0069954102,
	0.007499032, 0.008023193, 0.0085681256, 0.0091340587, 0.0097212173,
	0.010329823, 0.010960094, 0.0116122452, 0.0122864884, 0.0129830323,
	0.013702083, 0.0144438436, 0.0152085144, 0.0159962934, 0.0168073758,
	0.0176419545, 0.0185002201, 0.019382361, 0.0202885631, 0.0212190104,
	0.0221738848, 0.0231533662, 0.0241576324, 0.0251868596, 0.0262412219,
	0.0273208916, 0.0284260395, 0.0295568344, 0.0307134437, 0.0318960331,
	0.0331047666, 0.0343398068, 0.0356013149, 0.0368894504, 0.0382043716,
	0.0395462353, 0.0409151969, 0.0423114106, 0.0437350293, 0.0451862044,
	0.0466650863, 0.0481718242, 0.049706566, 0.0512694584, 0.052860647,
	0.0544802764, 0.05612849, 0.0578054302, 0.0595112382, 0.0612460542,
	0.0630100177, 0.0648032667, 0.0666259386, 0.0684781698, 0.0703600957,
	0.0722718507, 0.0742135684, 0.0761853815, 0.0781874218, 0.0802198203,
	0.0822827071, 0.0843762115, 0.086500462, 0.0886555863, 0.0908417112,
	0.0930589628, 0.0953074666, 0.0975873471, 0.0998987282, 0.1022417331,
	0.1046164841, 0.107023103, 0.1094617108, 0.1119324278, 0.1144353738,
	0.1169706678, 0.119538428, 0.1221387722, 0.1247718176, 0.1274376804,
	0.1301364767, 0.1328683216, 0.1356333297, 0.138431615, 0.1412632911,
	0.1441284709, 0.1470272665, 0.1499597898, 0.152926152, 0.1559264637,
	0.1589608351, 0.1620293756, 0.1651321945, 0.1682694002, 0.1714411007,
	0.1746474037, 0.177888416, 0.1811642442, 0.1844749945, 0.1878207723,
	0.1912016827, 0.1946178304, 0.1980693196, 0.2015562538, 0.2050787364,
	0.2086368701, 0.2122307574, 0.2158605001, 0.2195261997, 0.2232279573,
	0.2269658735, 0.2307400485, 0.2345505822, 0.2383975738, 0.2422811225,
	0.2462013267, 0.2501582847, 0.2541520943, 0.2581828529, 0.2622506575,
	0.2663556048, 0.270497791, 0.2746773121, 0.2788942635, 0.2831487404,
	0.2874408377, 0.2917706498, 0.2961382708, 0.3005437944, 0.3049873141,
	0.3094689228, 0.3139887134, 0.3185467781, 0.3231432091, 0.3277780981,
	0.3324515363, 0.337163615, 0.3419144249, 0.3467040564, 0.3515325995,
	0.3564001441, 0.3613067798, 0.3662525956, 0.3712376805, 0.376262123,
	0.3813260114, 0.3864294338, 0.3915724777, 0.3967552307, 0.4019777798,
	0.4072402119, 0.4125426135, 0.4178850708, 0.42326767, 0.4286904966,
	0.4341536362, 0.4396571738, 0.4452011945, 0.4507857828, 0.4564110232,
	0.4620769997, 0.4677837961, 0.4735314961, 0.4793201831, 0.4851499401,
	0.4910208498, 0.4969329951, 0.502886458, 0.5088813209, 0.5149176654,
	0.5209955732, 0.5271151257, 0.533276404, 0.539479489, 0.5457244614,
	0.5520114015, 0.5583403896, 0.5647115057, 0.5711248295, 0.5775804404,
	0.5840784179, 0.5906188409, 0.5972017884, 0.6038273389, 0.6104955708,
	0.6172065624, 0.6239603917, 0.6307571363, 0.637596874, 0.644479682,
	0.6514056374, 0.6583748173, 0.6653872983, 0.672443157, 0.6795424696,
	0.6866853124, 0.6938717613, 0.7011018919, 0.7083757799, 0.7156935005,
	0.7230551289, 0.7304607401, 0.7379104088, 0.7454042095, 0.7529422168,
	0.7605245047, 0.7681511472, 0.7758222183, 0.7835377915, 0.7912979403,
	0.799102738, 0.8069522577, 0.8148465722, 0.8227857544, 0.8307698768,
	0.8387990117, 0.8468732315, 0.8549926081, 0.8631572135, 0.8713671192,
	0.8796223969, 0.8879231179, 0.8962693534, 0.9046611744, 0.9130986518,
	0.9215818563, 0.9301108584, 0.9386857285, 0.9473065367, 0.9559733532,
	0.9646862479, 0.9734452904, 0.9822505503, 0.9911020971, 1.0,
];
const linearToSRGBLut = [
	0, 13, 22, 28, 34, 38, 42, 46, 50, 53, 56, 59, 61, 64, 66, 69, 71, 73, 75,
	77, 79, 81, 83, 85, 86, 88, 90, 92, 93, 95, 96, 98, 99, 101, 102, 104, 105,
	106, 108, 109, 110, 112, 113, 114, 115, 117, 118, 119, 120, 121, 122, 124,
	125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139,
	140, 141, 142, 143, 144, 145, 146, 147, 148, 148, 149, 150, 151, 152, 153,
	154, 155, 155, 156, 157, 158, 159, 159, 160, 161, 162, 163, 163, 164, 165,
	166, 167, 167, 168, 169, 170, 170, 171, 172, 173, 173, 174, 175, 175, 176,
	177, 178, 178, 179, 180, 180, 181, 182, 182, 183, 184, 185, 185, 186, 187,
	187, 188, 189, 189, 190, 190, 191, 192, 192, 193, 194, 194, 195, 196, 196,
	197, 197, 198, 199, 199, 200, 200, 201, 202, 202, 203, 203, 204, 205, 205,
	206, 206, 207, 208, 208, 209, 209, 210, 210, 211, 212, 212, 213, 213, 214,
	214, 215, 215, 216, 216, 217, 218, 218, 219, 219, 220, 220, 221, 221, 222,
	222, 223, 223, 224, 224, 225, 226, 226, 227, 227, 228, 228, 229, 229, 230,
	230, 231, 231, 232, 232, 233, 233, 234, 234, 235, 235, 236, 236, 237, 237,
	238, 238, 238, 239, 239, 240, 240, 241, 241, 242, 242, 243, 243, 244, 244,
	245, 245, 246, 246, 246, 247, 247, 248, 248, 249, 249, 250, 250, 251, 251,
	251, 252, 252, 253, 253, 254, 254, 255, 255,
];

function decode83Int(str: string): number {
	let result = 0;
	for (let i = 0; i < str.length; i++) {
		const c = str.charCodeAt(i);
		const digit = b83lut[c];
		if (digit < 0) throw new Error("Invalid character in Base83 string");
		result = result * 83 + digit;
	}

	return result;
}

function isValidBlurhash(blurhash: string): boolean {
	if (blurhash.length < 6) return false;
	const sizeFlag = decode83Int(blurhash[0]);
	const numY = Math.floor(sizeFlag / 9) + 1;
	const numX = (sizeFlag % 9) + 1;
	return blurhash.length === 4 + 2 * numX * numY;
}

function chunkSubstr(
	str: string,
	size: number,
	startOff: number = 0,
): string[] {
	if (startOff >= str.length) return [];
	const numChunks = Math.ceil((str.length - startOff) / size);
	const chunks = new Array(numChunks);

	for (let i = 0, o = startOff; i < numChunks; ++i, o += size) {
		chunks[i] = str.substring(o, o + size);
	}

	return chunks;
}

export const defaultDataURL =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mPsqAcAAZUBCZuIJhEAAAAASUVORK5CYII=";

export function decodeToPixelData(
	blurhash: string,
	width: number,
	height: number,
	punch: number = 1,
): Uint8ClampedArray | undefined {
	if (!isValidBlurhash(blurhash)) {
		return undefined;
	}

	punch = punch < 1 ? 1 : punch;

	const sizeFlag = decode83Int(blurhash[0]);
	const numY = Math.floor(sizeFlag / 9) + 1;
	const numX = (sizeFlag % 9) + 1;

	const quantizedMaxValue = decode83Int(blurhash[1]);
	const maxValue = ((quantizedMaxValue + 1) / 166) * punch;

	const colors = new Float32Array(numX * numY * 3);
	const chunks = chunkSubstr(blurhash, 2, 4);
	console.log(chunks);

	const value = decode83Int(blurhash.substring(2, 6));
	colors[0] = sRGBToLinearLut[value >> 16];
	colors[1] = sRGBToLinearLut[(value >> 8) & 0xff];
	colors[2] = sRGBToLinearLut[value & 0xff];

	for (let i = 1; i < colors.length / 3; i++) {
		const value = decode83Int(chunks[i]);
		let quantR = Math.floor(value / (19 * 19));
		let quantG = Math.floor(value / 19) % 19;
		let quantB = value % 19;
		quantR = (quantR - 9) / 9;
		quantG = (quantG - 9) / 9;
		quantB = (quantB - 9) / 9;
		quantR = (quantR < 0 ? -1 : 1) * quantR * quantR * maxValue;
		quantG = (quantG < 0 ? -1 : 1) * quantG * quantG * maxValue;
		quantB = (quantB < 0 ? -1 : 1) * quantB * quantB * maxValue;
		colors[i * 3] = quantR;
		colors[i * 3 + 1] = quantG;
		colors[i * 3 + 2] = quantB;
	}

	const bytesPerRow = width * 4;
	const pixels = new Uint8ClampedArray(bytesPerRow * height);

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			let r = 0;
			let g = 0;
			let b = 0;

			for (let j = 0; j < numY; j++) {
				const basisY = Math.cos((Math.PI * y * j) / height);
				for (let i = 0; i < numX; i++) {
					const basis = Math.cos((Math.PI * x * i) / width) * basisY;
					const idx = (j * numX + i) * 3;

					r += colors[idx] * basis;
					g += colors[idx + 1] * basis;
					b += colors[idx + 2] * basis;
				}
			}

			r = (Math.min(Math.max(r, 0), 1) * 255) | 0;
			g = (Math.min(Math.max(g, 0), 1) * 255) | 0;
			b = (Math.min(Math.max(b, 0), 1) * 255) | 0;

			const pixelIdx = y * bytesPerRow + x * 4;
			pixels[pixelIdx] = linearToSRGBLut[r];
			pixels[pixelIdx + 1] = linearToSRGBLut[g];
			pixels[pixelIdx + 2] = linearToSRGBLut[b];
			pixels[pixelIdx + 3] = 255;
		}
	}

	return pixels;
}

const blurhashCache = new Map<string, string>();

export function decodeToDataURL(blurhash: string | undefined): string {
	if (!blurhash) return defaultDataURL;

	if (blurhashCache.has(blurhash)) {
		return blurhashCache.get(blurhash) ?? defaultDataURL;
	}

	const width = 16;
	const height = 16;

	const pixelData = decodeToPixelData(blurhash, width, height);
	if (!pixelData) return defaultDataURL;

	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	if (!ctx) return defaultDataURL;

	const imageData = new ImageData(pixelData, width, height);
	ctx.putImageData(imageData, 0, 0);

	const dataURL = canvas.toDataURL();
	blurhashCache.set(blurhash, dataURL);
	return dataURL;
}
