import { Buffer } from 'node:buffer';
import { GoogleGenerativeAI } from "@google/generative-ai";
import sharp from "sharp";
import { fail, message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { GEMINI_API } from '$env/static/private';
import { IMAGE_SCHEMA } from '$lib/schema.js';

export const load = async () => {
	const form = await superValidate(zod(IMAGE_SCHEMA));
	return { form };
};

async function imageToBase64(image: Buffer) {
	const sharpImage = sharp(image);
	const metadata = await sharpImage.metadata();
	const landscape =
		metadata.width && metadata.height && metadata.width > metadata.height;
	const buff: Buffer = await sharpImage
		.resize({
			// 3:4 or 4:3 aspect ratio, 768x768 costs 258 tokens
			height: landscape ? 3 * 768 : 4 * 768,
			width: landscape ? 4 * 768 : 3 * 768,
			withoutEnlargement: true,
			fit: "inside",
		})
		.jpeg({
			quality: 95,
			chromaSubsampling: '4:4:4'
		})
		.toBuffer();
	return buff.toString("base64");
}

async function getBooks(file: File) {
	const genAI = new GoogleGenerativeAI(GEMINI_API);

	const model = genAI.getGenerativeModel({
		model: "gemini-2.0-flash",
		generationConfig: {
			responseMimeType: "application/json",
		},
	});
	const prompt = `You are a librarian, and it is your job to find and record all the books inside an image of a bookshelf. 
	You must record your finding via a list made out of valid JSON objects. 
	These JSON objects contain the book author, title, and where to find the book via a bounding box. 
	The list should look as follows: [{author: "George Orwell", title: "1984", box: [ymin, xmin, ymax, xmax]}, ...]. 
	If you can not figure out a value, set the value to null and if you do not see any books in the image, return an empty list [].`;
	const image = Buffer.from(await file.arrayBuffer());
	const imageParts = {
		inlineData: {
			data: await imageToBase64(image),
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
