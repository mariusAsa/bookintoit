import { search } from "@chewhx/google-books";
import type { Schema$Volume } from "@chewhx/google-books/dist/types/Resource";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
	const title = url.searchParams.get("title") ?? "";
	const author = url.searchParams.get("author") ?? "";
	const resp = await search({ q: "", intitle: title, inauthor: author });
	return new Response(JSON.stringify(resp));
};
