import { Buffer } from 'node:buffer';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { fail, message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { GEMINI_API } from '$env/static/private';
import { IMAGE_SCHEMA } from '$lib/schema.js';

export const load = async () => {
	const form = await superValidate(zod(IMAGE_SCHEMA));
	return { form };
};

const genAI = new GoogleGenerativeAI(GEMINI_API);
const model = genAI.getGenerativeModel({
	model: "gemini-2.0-flash",
	systemInstruction: "You are a librarian, and it is your job to find and record all the books inside an image of a bookshelf.",
	generationConfig: {
		responseMimeType: "application/json",
	},
});
const prompt = `Tak a look at the following image of a bookshelf and record your finding via a list made out of JSON objects. 
	These JSON objects contain the book author, title, and where to find the book via a bounding box. 
	The list should look as follows: [{author: "George Orwell", title: "1984", box: [ymin, xmin, ymax, xmax]}, ...]. 
	If you can not figure out the author or title, skip the book and if you do not see any books in the image, return an empty list.`;
async function getBooks(file: File) {
	const imageParts = {
		inlineData: {
			data: new Buffer(await file.arrayBuffer()).toString("base64"),
			mimeType: "image/jpeg",
		},
	};
	return await model.generateContent([imageParts, prompt]);
}

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(IMAGE_SCHEMA));
		if (!form.valid) {
			return fail(400, { form });
		}
		const generatedContent = await getBooks(form.data.image);
		try {
			return message(form, JSON.parse(generatedContent.response.text()));
		} catch {
			return message(form, "[]");
		}
	},
};
