import { Buffer } from "node:buffer";
import { GEMINI_API } from "$env/static/private";
import { IMAGE_SCHEMA } from "$lib/schema.js";
import { GoogleGenAI, Type } from "@google/genai";
import { message, superValidate } from "sveltekit-superforms";
import { setError } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
export const load = async () => {
	const form = await superValidate(zod(IMAGE_SCHEMA));
	return { form };
};

const genAI = new GoogleGenAI({ apiKey: GEMINI_API });
const prompt = `Take a look at the following image of a bookshelf and record your findings via a list made out of JSON objects. 
These JSON objects contain the book author, title, and where to find the book via a bounding box. 
The list should look as follows: [{author: "George Orwell", title: "1984", box: [ymin, xmin, ymax, xmax]}, ...]. 
If you can not figure out the author or title, skip the book, and if you do not see any books in the image, return an empty list.`;

async function getBooks(file: File) {
	const contents = [
		{
			inlineData: {
				mimeType: "image/jpeg",
				data: Buffer.from(await file.arrayBuffer()).toString("base64"),
			},
		},
		{ text: prompt },
	];
	const modelOutput = genAI.models.generateContent({
		model: "gemini-2.0-flash",
		config: {
			responseMimeType: "application/json",
			systemInstruction:
				"You are a librarian, and it is your job to find and record all the books inside an image of a bookshelf. You write down your findings in JSON and in sentance case.",
			responseSchema: {
				type: Type.ARRAY,
				items: {
					type: Type.OBJECT,
					properties: {
						author: {
							type: Type.STRING,
							description: "The name of the book author",
						},
						title: {
							type: Type.STRING,
							description: "The title of the book",
						},
						box: {
							type: Type.ARRAY,
							items: {
								type: Type.NUMBER,
								description:
									"The bounding box coordinates [ymin, xmin, ymax, xmax] normalized to 0-1000.",
							},
						},
					},
					required: ["author", "title", "box"],
				},
			},
		},
		contents: contents,
	});
	return await modelOutput;
}

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(IMAGE_SCHEMA));
		if (!form.valid) {
			return setError(form, "Please Reload");
		}
		try {
			const generatedContent = await getBooks(form.data.image);
			return message(form, JSON.parse(generatedContent.text ?? "[]"));
		} catch {
			return setError(
				form,
				"Ran into an API call limit. Please try again later.",
			);
		}
	},
};
