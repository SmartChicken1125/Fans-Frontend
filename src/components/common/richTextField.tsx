import tw from "@lib/tailwind";
import React, { useRef, useState } from "react";
import {
	Pressable,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import {
	actions,
	RichEditor,
	RichToolbar,
} from "react-native-pell-rich-editor";

const handleHead = ({ tintColor }: { tintColor: string }) => (
	<Text style={{ color: tintColor }}>H1</Text>
);

const RichTextField = () => {
	const richText = useRef<RichEditor | null>(null);

	const [descHTML, setDescHTML] = useState("");
	const [showDescError, setShowDescError] = useState(false);

	return (
		<View style={styles.container}>
			<ScrollView>
				{/* <KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={{ flex: 1 }}
				>
					<Text>Description:</Text>
					<RichEditor
						ref={richText}
						onChange={(descriptionText) => {
							console.log("descriptionText:", descriptionText);
						}}
					/>
				</KeyboardAvoidingView> */}
				<RichEditor ref={richText} onChange={(descriptionText) => {}} />
			</ScrollView>

			<RichToolbar
				editor={richText}
				actions={[
					actions.setBold,
					actions.setItalic,
					actions.setUnderline,
					actions.heading1,
					actions.indent,
				]}
				iconMap={{ [actions.heading1]: handleHead }}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: "100%",
		backgroundColor: "#ccaf9b",
		padding: 20,
		alignItems: "center",
	},

	headerStyle: {
		fontSize: 20,
		fontWeight: "600",
		color: "#312921",
		marginBottom: 10,
	},

	htmlBoxStyle: {
		height: 200,
		width: 330,
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 20,
		marginBottom: 10,
	},

	richTextContainer: {
		display: "flex",
		flexDirection: "column-reverse",
		width: "100%",
		marginBottom: 10,
	},

	richTextEditorStyle: {
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
		borderWidth: 1,
		borderColor: "#ccaf9b",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.23,
		shadowRadius: 2.62,
		elevation: 4,
		fontSize: 20,
	},

	richTextToolbarStyle: {
		backgroundColor: "#c6c3b3",
		borderColor: "#c6c3b3",
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderWidth: 1,
	},

	errorTextStyle: {
		color: "#FF0000",
		marginBottom: 10,
	},

	saveButtonStyle: {
		backgroundColor: "#c6c3b3",
		borderWidth: 1,
		borderColor: "#c6c3b3",
		borderRadius: 10,
		padding: 10,
		width: "25%",
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.23,
		shadowRadius: 2.62,
		elevation: 4,
		fontSize: 20,
	},

	textButtonStyle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#312921",
	},
});

export default RichTextField;
