export type Book = {
	author: string | null;
	title: string | null;
	box: Array<number> | null;
};

export type ApiResponse = BookItem[];

interface BookItem {
	document: {
		activities_count: number;
		alternative_titles: string[];
		author_names: string[];
		compilation: boolean;
		content_warnings: string[];
		contribution_types: string[];
		contributions: Contribution[];
		featured_series: FeaturedSeries;
		featured_series_position: number;
		genres: string[];
		has_audiobook: boolean;
		has_ebook: boolean;
		id: string;
		image: Record<string, unknown>;
		isbns: string[];
		lists_count: number;
		moods: string[];
		pages: number;
		prompts_count: number;
		rating: number;
		ratings_count: number;
		release_date: string; // Format: "YYYY-MM-DD"
		release_year: number;
		reviews_count?: number;
		series_names?: string[];
		slug?: string;
		tags?: string[];
		title?: string;
		users_count?: number;
		users_read_count?: number;
	};
}

interface Contribution {
	author: {
		cachedImage: Record<string, unknown>;
		name: string;
		slug: string;
	};
	contribution: null | string;
}

interface FeaturedSeries {
	details: string;
	position: number;
	series_books_count: number;
	series_name: string;
	series_primary_books_count: number;
	series_slug: string;
}
