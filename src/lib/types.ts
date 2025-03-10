export type Book = {
	author: string | null;
	title: string | null;
	box: Array<number> | null;
};

export type GoogleBookVolume = {
	kind: string;
	id: string;
	etag: string;
	selfLink: string;
	volumeInfo: {
		title: string;
		subtitle: string;
		authors: string[];
		publisher: string;
		publishedDate: string;
		industryIdentifiers: Array<{
			type: string;
			identifier: string;
		}>;
		readingModes: {
			text: boolean;
			image: boolean;
		};
		pageCount: number;
		printedPageCount: number;
		dimensions: {
			height: string;
			// There might be other dimensions like width, thickness that aren't visible in the excerpt
		};
		printType: string;
		averageRating: number;
		previewLink: string;
		ratingsCount: number;
		maturityRating: string;
		allowAnonLogging: boolean;
		contentVersion: string;
		panelizationSummary: {
			containsEpubBubbles: boolean;
			containsImageBubbles: boolean;
		};
		// The JSON likely contains more fields not shown in the excerpt
	};
	// The JSON likely contains more top-level fields not shown in the excerpt
};
