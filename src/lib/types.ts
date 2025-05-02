export type Book = {
	author: string | null;
	title: string | null;
	box: Array<number> | null;
};

export type ApiResponse = BookItem[];

interface BookItem {
	document: {
		title?: string;
		author_names: string[];
		rating: number;
		isbns: string[];
		slug?: string;
	};
}
