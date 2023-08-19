import { Box } from "@mantine/core";

import { Dispatch, FC, MutableRefObject, ReactElement, RefObject, SetStateAction, ClipboardEvent, CompositionEvent, KeyboardEvent } from "react";
/**
 * Object returned by Tool's {@link BlockTool#save} method
 * Specified by Tool developer, so leave it as object
 */
export type BlockToolData<T extends object = any> = T;
// export type BlockTuneData = any;
export type BlockId = string;

/**
 * Output of one Tool
 *
 * @template Type - the string literal describing a tool type
 * @template Data - the structure describing a data object supported by the tool
 */
// export interface OutputBlockData<Type extends string = string, Data extends object = any> {
// 	/**
// 	 * Unique Id of the block
// 	 */
// 	id?: BlockId;
// 	/**
// 	 * Tool type
// 	 */
// 	type: Type;
// 	/**
// 	 * Saved Block data
// 	 */
// 	data: BlockToolData<Data>;
//
// 	/**
// 	 * Block Tunes data
// 	 */
// 	tunes?: { [name: string]: BlockTuneData };
// }

export interface OutputBlockData {
	id?: BlockId;

	type: string;

	data: { [index: string]: any };

	// tunes?: { [name: string]: BlockTuneData };
}

export interface OutputData {
	/**
	 * Editor's version
	 */
	version?: string;

	/**
	 * Timestamp of saving in milliseconds
	 */
	time?: number;

	/**
	 * Saved Blocks
	 */
	blocks: OutputBlockData[];
}

export const OutputDataInit: OutputData = {
	version: undefined,
	time: 0,
	blocks: [],
};

export type InlinetoolbarlistType = string[];
// export type APIType = { styles: { blockWrapper: string; blockContent: string }; readOnly: boolean };
// export type BlockDataType = OutputBlockData<string, any>;
// export type BlockDataType = BlockToolData;

export type GetPureBlockDataType = {
	data: { [index: string]: any };
	// sanitize: { [key: string]: { [tag: string]: boolean } };
};

export type InitialBlockControlPropsType = {
	rowBlockData: OutputBlockData[];
	blockTools: BlockToolType[];
	p1_globalClassName: { [index: string]: string };
	readOnly: boolean;
};

export type P1GlobalClassNameType = {
	blockWrapper: string;
	block: string;
	blockContent: string;
};

export type WrapperRefType = {
	[id: string]: RefObject<HTMLDivElement>;
};

export type InlineSelType = {
	blockId: string;
	collapsed: boolean;
	displayInlineTune: boolean;
	contentEl: {
		contentId: string;
		path: number[];
	};
	startEl: {
		path: number[]; // blockContent: "pe-block__content" からのpath
		startOffset: number;
	};
	endEl: {
		path: number[]; // blockContent: "pe-block__content" からのpath
		endOffset: number;
	};
	wrappedStyles: { classNames: string[]; path: number[] }[];
	top: number;
	left: number;
};

export type UndoType = {
	undoSel: string;
	redoSel: string;
	blockDataArr: string;
};

export interface BlockControlType {
	containerRef: MutableRefObject<any>;
	blockDataArr: OutputBlockData[];
	blockTools: BlockToolType[];
	inlineTools: InlineToolType[];
	p1_globalClassName: P1GlobalClassNameType;

	handleAddBlockData: ({
		id,
		data,
		undoSel,
		redoSel,
		selObj,
	}: {
		id: string;
		data: {
			[Index: string]: any;
		};
		undoSel?: InlineSelType;
		redoSel?: InlineSelType;
		selObj?: InlineSelType;
	}) => void;

	handleSetBlockDataArr: ({
		blockDataArr,
		history,
		undoSel,
		redoSel,
		selObj,
	}: {
		blockDataArr: OutputBlockData[];
		history?: boolean;
		undoSel?: InlineSelType;
		redoSel?: InlineSelType;
		selObj?: InlineSelType;
	}) => void;

	getPureBlockData: (text: string) => string;

	reorderBlock: ({
		id,
		dir,
	}: {
		id: string;
		dir: "up" | "down" | "del";
	}) => void;

	duplicateBlock: ({
		id,
	}: {
		id: string;
	}) => any;

	handleAlignChange: (id: string, dir: "left" | "center" | "right") => void;

	findParentWithClassNameAndPath: (
		_element: Node | Element,
		className: string,
		path?: number[],
	) => {
		el: Element;
		id: string;
		path: number[];
	};

	getRangeElement: (
		range: Range,
		className: string,
	) => {
		startEl: {
			startOffset: number;
			path: number[];
		};
		endEl: {
			endOffset: number;
			path: number[];
		};
	};

	getElementFromParentUsingPath: (parentEl: Node, path: number[]) => Node;

	addNewBlock: ({
		id,
		blockTool,
	}: {
		id: string;
		blockTool: string;
	}) => string;
	// inlineSel: Selection;
	findNode: (
		element: Node,
		targetNode: Node,
		path?: number[],
	) => {
		found: boolean;
		node: Node;
		path: number[];
	};
	inlineSel: InlineSelType;

	handleinsertLineBreak: ({
		event,
		id,
	}: {
		event: KeyboardEvent<HTMLElement>;
		id: string;
	}) => void;

	handleDeleteInlineStyle: ({
		inlineSel,
	}: {
		inlineSel: InlineSelType;
	}) => void;

	caretPos: MutableRefObject<{
		top: number;
		left: number;
	}>;
	handleOnCompositionEnd: ({
		event,
		id,
	}: {
		event: CompositionEvent<HTMLElement>;
		id: string;
	}) => void;
	handleContentEditableOnInput: ({
		id,
		innerHTML,
		textContent,
	}: {
		id: string;
		innerHTML: string;
		textContent: string;
	}) => void;

	handleContentEditableOnChange: ({
		id,
		beforeInlineSel,
	}: {
		id: string;
		beforeInlineSel: InlineSelType;
	}) => void;

	handleBlockSplit: ({
		event,
		id,
	}: {
		event: KeyboardEvent<HTMLElement>;
		id: string;
	}) => void;
	inlineSubPalette: { name: string; component: JSX.Element | null };
	setInlineSubPalette: Dispatch<SetStateAction<{ name: string; component: JSX.Element | null }>>;

	updateInlineClassName: ({
		inlineSel,
		beforeClassNames,
		afterClassName,
	}: {
		inlineSel: InlineSelType;
		beforeClassNames: string[];
		afterClassName?: string;
	}) => void;
	// savedSelectionRef: MutableRefObject<SavedSelectionRefType>;
	getRangeObj: (range: Range) => InlineSelType;
	submitInlineTune: ({
		inlineSel,
		element,
	}: {
		inlineSel: InlineSelType;
		element: Element;
	}) => void;

	handleOnPaste: ({
		event,
		id,
	}: {
		event: ClipboardEvent<HTMLElement>;
		id: string;
	}) => void;

	handleUndo: () => void;
	handleRedo: () => void;

	viewGrid: boolean;
	setViewGrid: Dispatch<SetStateAction<boolean>>;

	readOnly: boolean;
	setReadOnly: Dispatch<SetStateAction<boolean>>;

	handleTuneBlocks: ({
		beforeBlockId,
		afterBlockType,
	}: {
		beforeBlockId: string;
		afterBlockType: string;
	}) => void;

	hideInlineSel: () => void;

	autoSave: OutputBlockData[];
}

export interface BlockToolType {
	id: string;
	label: string;
	icon: JSX.Element;
	className: string;
	component: FC;
	isContentEditable: boolean;
	inlinetoolbarList: InlinetoolbarlistType;
	defaultData: { [index: string]: any };
	markerColor?: string;
}

export interface InlineToolType {
	id: string;
	label: string;
	icon: JSX.Element;
	className: string;
	handle: (tool: InlineToolType, api: BlockControlType, isActive: boolean) => void;
	// subPalette: (prop: any) => JSX.Element;
}

export interface InitialToolPropsType {
	blockData: OutputBlockData;
	blockTool: BlockToolType;
	api: BlockControlType;
}

export type InlineTunesType = {
	inlineSel: { selection: Selection; top: number; left: number };
	inlineTools: InlineToolType[];
	target: MutableRefObject<any>;
	blockDataArr: OutputBlockData[];
};
