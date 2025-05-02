<script lang="ts">
import DisplayBooks from "$lib/DisplayBooks.svelte";
import type { Book } from "$lib/types.js";
import Button from "$lib/wrappers/Button.svelte";
import Input from "$lib/wrappers/Input.svelte";
import { fileProxy, superForm } from "sveltekit-superforms";

let { data } = $props();
const { form, errors, message, enhance, delayed } = superForm(data.form, {
	delayMs: 500,
	onUpdated({ form }) {
		if (form.message) {
			books = $message;
		}
	},
});
const file = fileProxy(form, "image");
const _defaultBooks: Array<Book> = [
	{
		author: "Peter Robinson",
		title: "Abattoir Blues",
		box: [105, 9, 369, 66],
	},
	{
		author: "Peter Robinson",
		title: "All the Colours of Darkness",
		box: [193, 116, 369, 172],
	},
	{
		author: "Peter Robinson",
		title: "Bad Boy",
		box: [220, 174, 368, 230],
	},
	{
		author: "Peter Robinson",
		title: "Careless Love",
		box: [105, 233, 370, 292],
	},
	{
		author: "Peter Robinson",
		title: "Children of the Revolution",
		box: [104, 296, 369, 351],
	},
	{
		author: "Peter Robinson",
		title: "Friend of the Devil",
		box: [104, 352, 369, 407],
	},
	{
		author: "Peter Robinson",
		title: "No Cure for Love",
		box: [104, 410, 368, 465],
	},
	{
		author: "Peter Robinson",
		title: "Piece of My Heart",
		box: [104, 465, 368, 520],
	},
	{
		author: "Peter Robinson",
		title: "When the Music's Over",
		box: [104, 520, 368, 575],
	},
	{
		author: "Peter Robinson",
		title: "Gallows View",
		box: [104, 575, 368, 628],
	},
	{
		author: "Peter Robinson",
		title: "A Necessary End",
		box: [104, 629, 370, 682],
	},
	{
		author: "Michael Robotham",
		title: "The Other Wife",
		box: [136, 685, 368, 760],
	},
	{
		author: "Monique Roffey",
		title: "When She Was Good",
		box: [140, 748, 367, 813],
	},
	{
		author: "James Rollins",
		title: "Ice Hunt",
		box: [143, 793, 367, 867],
	},
	{
		author: "James Rollins",
		title: "Subterranean",
		box: [146, 822, 367, 892],
	},
	{
		author: "James Rollins",
		title: "The Doomsday Key",
		box: [150, 856, 366, 923],
	},
	{
		author: "Linwood Barclay",
		title: "No Time For Goodbye",
		box: [154, 892, 366, 962],
	},
	{
		author: "Lee Child",
		title: "The Midnight Line",
		box: [147, 939, 366, 989],
	},
	{
		author: "Harlan Coben",
		title: "Fool Me Once",
		box: [150, 963, 366, 1000],
	},
	{
		author: "Rainbow Rowell",
		title: "Carry On",
		box: [412, 35, 709, 137],
	},
	{
		author: "J.K. Rowling",
		title: "The Casual Vacancy",
		box: [413, 124, 705, 209],
	},
	{
		author: "J.K. Rowling",
		title: "Harry Potter and the Deathly Hallows",
		box: [413, 202, 683, 275],
	},
	{
		author: "J.K. Rowling",
		title: "Harry Potter and the Half-Blood Prince",
		box: [421, 291, 683, 380],
	},
	{
		author: "Arundhati Roy",
		title: "The God of Small Things",
		box: [449, 378, 680, 465],
	},
	{
		author: "Arundhati Roy",
		title: "The God of Small Things",
		box: [453, 462, 670, 500],
	},
	{
		author: "Jed Rubenfeld",
		title: "The Interpretation of Murder",
		box: [451, 498, 670, 542],
	},
	{
		author: "Jed Rubenfeld",
		title: "The Interpretation of Murder",
		box: [464, 535, 666, 586],
	},
	{
		author: "Richard Russo",
		title: "Bridge of Sighs",
		box: [472, 576, 664, 641],
	},
	{
		author: "Richard Russo",
		title: "Straight Man",
		box: [473, 632, 662, 682],
	},
	{
		author: "Carlos Ruiz Zafón",
		title: "The Shadow of the Wind",
		box: [458, 679, 651, 738],
	},
	{
		author: "Christopher Ruocchio",
		title: "Howling Dark",
		box: [418, 719, 646, 795],
	},
	{
		author: "Salman Rushdie",
		title: "The Moor's Last Sigh",
		box: [427, 775, 642, 848],
	},
	{
		author: "Beth Nonte Russell",
		title: "Garden of Lilies",
		box: [431, 821, 640, 883],
	},
	{
		author: "Richard Russo",
		title: "Empire Falls",
		box: [435, 843, 638, 924],
	},
	{
		author: "Richard Russo",
		title: "Empire Falls",
		box: [435, 871, 636, 951],
	},
	{
		author: "Edward Rutherfurd",
		title: "New York",
		box: [436, 907, 630, 981],
	},
	{
		author: "James Runcie",
		title: "The Four Agreements",
		box: [400, 894, 609, 927],
	},
	{
		author: "Liz Rosenberg",
		title: "The Dark Meadow",
		box: [405, 957, 626, 1000],
	},
	{
		author: "Karl Sabbagh",
		title: "Dr. Riemann's Zeros",
		box: [713, 72, 986, 137],
	},
	{
		author: "Michael Sadler",
		title: "An Englishman",
		box: [707, 123, 975, 196],
	},
	{ author: "Sapphire", title: "Push", box: [740, 143, 970, 200] },
	{
		author: "Steven Sater",
		title: "Alice by Heart",
		box: [709, 255, 955, 315],
	},
	{
		author: "Saenz",
		title: "Aristotle and Dante Discover the Secrets of the Universe",
		box: [704, 291, 946, 351],
	},
	{
		author: "Tara Sams",
		title: "The Pavilion",
		box: [702, 327, 931, 384],
	},
	{
		author: "George Saunders",
		title: "Alice by Heart",
		box: [715, 368, 935, 411],
	},
	{
		author: "George Saunders",
		title: "Alice by Heart",
		box: [715, 400, 934, 445],
	},
	{
		author: "George Saunders",
		title: "The Doubter's Companion",
		box: [715, 383, 935, 450],
	},
	{
		author: "George Saunders",
		title: "A Swim in a Pond in the Rain",
		box: [715, 443, 921, 505],
	},
	{
		author: "George Saunders",
		title: "Tenth of December",
		box: [707, 470, 916, 514],
	},
	{
		author: "George Saunders",
		title: "Lincoln in the Bardo",
		box: [707, 495, 914, 543],
	},
	{
		author: "Kate Saunders",
		title: "Marrying",
		box: [706, 538, 910, 583],
	},
	{
		author: "Kate Saunders",
		title: "The Marrying Game",
		box: [706, 569, 901, 616],
	},
	{
		author: "Roberto Saviano",
		title: "Piranhas",
		box: [694, 690, 880, 745],
	},
	{
		author: "Simon Scarrow",
		title: "Praetorian",
		box: [689, 727, 880, 794],
	},
	{
		author: "Simon Scarrow",
		title: "Eagles of the Empire I",
		box: [686, 684, 884, 750],
	},
	{
		author: "Simon Scarrow",
		title: "The Legionaries",
		box: [686, 654, 888, 718],
	},
	{
		author: "Simon Scarrow",
		title: "The Brigands",
		box: [686, 630, 893, 690],
	},
	{
		author: "Simon Scarrow",
		title: "Scimitar",
		box: [685, 578, 898, 628],
	},
	{
		author: "Simon Scarrow",
		title: "Sword & Scimitar",
		box: [684, 606, 900, 664],
	},
	{
		author: "Simon Scarrow",
		title: "When the Eagle Hunts",
		box: [675, 663, 962, 769],
	},
	{
		author: "Simon Scarrow",
		title: "Under the Eagle",
		box: [675, 693, 965, 797],
	},
	{
		author: "Simon Scarrow",
		title: "The Gladiator",
		box: [675, 730, 968, 833],
	},
	{
		author: "Simon Scarrow",
		title: "The Eagles' Prophecy",
		box: [675, 771, 970, 874],
	},
	{
		author: "Simon Scarrow",
		title: "The Eagle's Prey",
		box: [675, 799, 970, 896],
	},
	{
		author: "Simon Scarrow",
		title: "The Eagle's Conquest",
		box: [675, 832, 970, 922],
	},
	{
		author: "Simon Scarrow",
		title: "The Eagle in the Sand",
		box: [675, 864, 970, 947],
	},
	{
		author: "Simon Scarrow",
		title: "The Eagle and the Wolves",
		box: [675, 891, 970, 971],
	},
];
let books: Array<Book> = $state(_defaultBooks);
let selectedBook: Book | undefined = $state(undefined);

let disabled = $state(true);
$effect(() => {
	if ($delayed || $errors._errors !== undefined) {
		disabled = true;
	}
});
function enableButton() {
	if ($file.length > 0) {
		disabled = false;
	}
}
</script>

<Input {file} {selectedBook} blur={$delayed} {enableButton}/>
{#if $delayed}
    <div class="justify-center flex mt-4">
        Awaiting response from Gemini<span class="animate-[bounce_1s_infinite_100ms]">.</span><span class="animate-[bounce_1s_infinite_200ms]">.</span><span class="animate-[bounce_1s_infinite_300ms]">.</span>
    </div>
{/if}
<div class="justify-center flex {disabled ? 'pt-4' : 'p-4'}">
    <form 
        method="POST" 
        use:enhance 
        enctype="multipart/form-data"
    >
        <input
            accept="image/*"
            type="file"
            name="image"
            required
            hidden
            bind:files={$file}
        />
        <Button type="submit" {disabled}>
            Send to Gemini
        </Button>
    </form>
</div>
<DisplayBooks bind:selectedBook {books}/>