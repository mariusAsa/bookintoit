import { HARDCOVER_API } from "$env/static/private";
import type { RequestHandler } from "@sveltejs/kit";

function fetchGraphQL(operationsDoc: string, operationName: string) {
	return fetch("https://api.hardcover.app/v1/graphql", {
		method: "POST",
		headers: {
			authorization: HARDCOVER_API,
			"content-type": "application/json",
		},
		body: JSON.stringify({
			query: operationsDoc,
			operationName,
		}),
	}).then((result) => result.json());
}

export const GET: RequestHandler = async ({ url }) => {
	const title = url.searchParams.get("title") ?? "";
	const author = url.searchParams.get("author") ?? "";
	if (title === "" && author === "") return new Response("{}");
	const operation = `
		query LordOfTheRingsBooks {
			search(
			query: "${author}, ${title}"
			query_type: "Book"
			per_page: 5
			page: 1
		) {
			results
			}
		}
	`;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const resp: any = await fetchGraphQL(operation, "LordOfTheRingsBooks");
	if (!resp?.data?.search?.results?.hits) return new Response("{}");
	return new Response(JSON.stringify(resp.data.search.results.hits));
};
