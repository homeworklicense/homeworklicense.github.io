// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface ShareButton extends HTMLElement {
	isShareText: boolean;
}

export interface DataElement<T, E> {
	data: T;
	i: number;
	setURL?: () => void;
	getURL?: () => void;
	element?: E;
}

export type DataElementStrings = "year" | "option" | "licenser";

interface StateDataElementsInterace {
	year: DataElement<string, HTMLInputElement>;
	option: DataElement<number, null>;
	licenser: DataElement<string, HTMLInputElement>
}

export interface StateInterface
	extends StateDataElementsInterace {
	i: number;
	on: boolean;
}
