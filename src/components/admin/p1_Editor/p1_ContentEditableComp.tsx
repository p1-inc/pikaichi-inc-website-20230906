import { cArr } from "../../../styles/eStyle";

import { BlockControlType, BlockToolType, InlineSelType, OutputBlockData } from "./p1_EditorTypes";

import { Box } from "@mantine/core";
import { useState, CompositionEvent, KeyboardEvent, useEffect, FormEvent, useRef } from "react";
import { getHotkeyHandler, useDebouncedState, useDebouncedValue, useTextSelection } from "@mantine/hooks";
import { config } from "./p1_EditorConfig";
import { getValidOffset } from "./hooks/useSetBlocksState";
import { useGetComputedStyles } from "../../../hooks/useGetComputedStyles";

interface P1_ContentEditableComp {
	blockData: OutputBlockData;
	blockTool: BlockToolType;
	api: BlockControlType;
	pureBlockData: { [x: string]: any };
	[key: string]: any;
}

export const P1_ContentEditableComp = <T,>({ blockData, blockTool, api, pureBlockData, ...props }: P1_ContentEditableComp) => {
	//
	const {
		readOnly,
		p1_globalClassName,
		handleOnPaste,
		handleOnCompositionEnd,
		handleContentEditableOnChange,
		handleBlockSplit,
		handleinsertLineBreak,
	}: BlockControlType = api;

	const [isComposing, setIsComposing] = useState<boolean>(false);
	const [isComposingDebounced] = useDebouncedValue(isComposing, 30);

	const contentId = useRef<string>(`${blockData.id}-pe-block__content`);

	const { ref: contentRef, fz } = useGetComputedStyles();

	const [debouncedTmpInnerHTML, setDebouncedTmpInnerHTML] = useDebouncedState<{
		id: string;
		contentEl: Element;
	}>(null, 200);

	const [debouncedndoSel, setDebouncedUndoSel] = useState<InlineSelType>();
	// const [tmpInnerHTML, setTmpInnerHTML] = useState<{
	// 	id: string;
	// 	contentEl: Element;
	// 	undoSel: InlineSelType;
	// }>(null);

	// const [debouncedTmpInnerHTML] = useDebouncedValue(tmpInnerHTML, 200);

	useEffect(() => {
		if (!debouncedTmpInnerHTML) {
			return;
		}
		console.log(debouncedndoSel.startEl.startOffset);
		handleContentEditableOnChange({ ...debouncedTmpInnerHTML, undoSel: debouncedndoSel });
		setDebouncedTmpInnerHTML(null);
		setDebouncedUndoSel(null);
	}, [debouncedTmpInnerHTML]);

	// 	useEffect(() => {
	// 		if (!inputDebounced) {
	// 			return;
	// 		}
	//
	// 		handleContentEditableOnInput({ ...inputDebounced, textContent: bufferText });
	// 		setBufferText("");
	// 	}, [inputDebounced]);

	// useEffect(() => {
	// 	if (!delDebounced) {
	// 		return;
	// 	}
	// 	handleContentEditableOnChange(delDebounced);
	// }, [delDebounced]);

	const getAllTextNodes = (element: HTMLElement): [Text, DOMRect][] => {
		let textNodes: [Text, DOMRect][] = [];
		for (const child of element.childNodes) {
			if (child.nodeType === Node.TEXT_NODE) {
				const range = document.createRange();
				range.selectNodeContents(child);
				textNodes.push([child as Text, range.getBoundingClientRect()]);
			} else if (child.nodeType === Node.ELEMENT_NODE) {
				textNodes = textNodes.concat(getAllTextNodes(child as HTMLElement));
			}
		}
		return textNodes;
	};

	const handleSetCaretPos = ({
		event,
		id,
		caretRects,
		direction,
	}: {
		event: KeyboardEvent<HTMLDivElement>;
		id: string;
		caretRects: DOMRect;
		direction: "Up" | "Down" | "Left" | "Right";
	}) => {
		if (!id) {
			return;
		}

		const contentId = `${id}-pe-block__content`;
		const contentEl = document.getElementById(contentId);
		const childnodes = contentEl.childNodes;

		const textNodes = getAllTextNodes(contentEl);

		if (direction === "Up" || direction === "Left") {
			textNodes.reverse();
		}

		const selection = window.getSelection();

		if (!contentEl || !selection || selection.rangeCount === 0) {
			return;
		}

		const { left: caretLeft } = caretRects;

		const anchorPos = textNodes[0][1];
		const _nextTextNodes = textNodes.filter((d) => d[1].top === anchorPos.top);
		const _nextTextNode = _nextTextNodes.find((d, i, arr) => {
			const left = i === 0 ? 0 : d[1].left;
			const right = i === arr.length - 1 ? 999999 : d[1].right;
			if (left <= caretLeft && right >= caretLeft) {
				return true;
			} else {
				return false;
			}
		});

		if (_nextTextNode) {
			const nextTextNode = _nextTextNode[0];
			let targetPosition = 999999;
			const testRange = document.createRange();
			testRange.selectNodeContents(nextTextNode);

			for (let i = 0; i < nextTextNode.length; i++) {
				testRange.setStart(nextTextNode, i);
				testRange.setEnd(nextTextNode, i + 1);
				const { left: textLeft, right: textRight } = testRange.getBoundingClientRect();

				const left = i === 0 ? 0 : textLeft;

				if (left <= caretLeft && textRight >= caretLeft) {
					targetPosition = i;
					break;
				}
			}

			const valiPosition = getValidOffset(nextTextNode, targetPosition);

			const range = new Range();
			range.setStart(nextTextNode, valiPosition);
			range.setEnd(nextTextNode, valiPosition);

			selection.removeAllRanges();
			selection.addRange(range);

			event.preventDefault();
		}
	};
	const getNextTextBlock = ({
		blockDataArr,
		blockDataIndex,
		direction,
	}: { blockDataArr: OutputBlockData[]; blockDataIndex: number; direction: -1 | 1 }): string | null => {
		blockDataIndex = blockDataIndex + direction;
		if (blockDataIndex < 0 || blockDataIndex > blockDataArr.length - 1) {
			return null;
		}
		const nextBlock = blockDataArr[blockDataIndex];
		const nextBlockType = nextBlock.type;
		const toolConfig = config.blockTools.find((d) => d.id === nextBlockType);

		if (toolConfig?.isContentEditable) {
			return nextBlock.id;
		} else {
			return getNextTextBlock({ blockDataArr, blockDataIndex, direction });
		}
	};

	// 	const scrollWithCaretPos = async () => {
	// 		// const range = await getNextCaretPos();
	// 		const selection = document.getSelection();
	// 		if (!selection || selection.rangeCount === 0) {
	// 			return;
	// 		}
	//
	// 		const range = selection.getRangeAt(0);
	// 		const rects = range.getBoundingClientRect();
	//
	// 		const viewportWidth = window.innerWidth; // ビューポートの幅
	// 		const viewportHeight = window.innerHeight; // ビューポートの高さ
	//
	// 		if (rects.left < 40) {
	// 			window.scrollBy(rects.left - 40, 0); // 20pxのマージンを加えてスクロール
	// 		} else if (rects.left > viewportWidth - 40) {
	// 			window.scrollBy(rects.left - viewportWidth + 40, 0); // 20pxのマージンを加えてスクロール
	// 		}
	//
	// 		if (rects.top < 40) {
	// 			window.scrollBy(0, rects.top + 40); // 20pxのマージンを加えてスクロール
	// 		} else if (rects.top > viewportHeight - 40) {
	// 			window.scrollBy(0, rects.top - viewportHeight + 40); // 20pxのマージンを加えてスクロール
	// 		}
	// 	};

	const handleMoveCaretByLeftRight = ({
		event,
		id,
		blockDataArr,
		direction,
	}: {
		event: KeyboardEvent<HTMLDivElement>;
		id: string;
		blockDataArr: OutputBlockData[];
		direction: "Left" | "Right";
	}) => {
		api.caretPos.current = null;

		const selection = document.getSelection();
		if (!selection || selection.rangeCount === 0) {
			return;
		}

		const contentEl = document.getElementById(contentId.current);
		const childnodes = contentEl.childNodes;

		const range = selection.getRangeAt(0);
		const startContainer = range.startContainer;
		const startOffset = range.startOffset;

		const caretRects = range.getBoundingClientRect();

		if (!api.caretPos.current) {
			api.caretPos.current = { top: caretRects.top, left: caretRects.left };
		}

		const blockDataIndex = blockDataArr.findIndex((d) => d.id === id);

		const textNodes = getAllTextNodes(contentEl);
		const startNode = textNodes[0][0];
		const endNode = textNodes[textNodes.length - 1][0];

		//direction === "Left" or "right"
		//--toplineまたはbottomlineがtextNodeかどうか？
		//----現在のcaret位置が,最初または最後かどうか？
		if (direction === "Left") {
			let isOnLeft = false;

			if (childnodes[0].nodeType === Node.TEXT_NODE) {
				if (range.startContainer === startNode && range.startOffset === 0) {
					isOnLeft = true;
				}
			} else {
				if (startContainer.childNodes[startOffset] === childnodes[0]) {
					isOnLeft = true;
				}
			}

			if (isOnLeft) {
				console.log("isOnLeft: ");
			}
		} else if (direction === "Right") {
			let isOnRight = false;

			if (childnodes[childnodes.length - 1].nodeType === Node.TEXT_NODE) {
				if (range.startContainer === endNode && range.startOffset === range.startContainer.nodeValue.length) {
					isOnRight = true;
				}
			} else {
				// 				console.log("xxxx");
				//
				// 				console.log("startContainer: ", startContainer);
				// 				console.log("startContainer.childNodes[startOffset]: ", startContainer.childNodes[startOffset]);
				// 				console.log("childnodes[childnodes.length - 1]: ", childnodes[childnodes.length - 1]);
				if (startContainer.childNodes[startOffset] === childnodes[childnodes.length - 1]) {
					console.log("yyyy");
					isOnRight = true;
				}
			}
		}

		// 		if (childnodes[0].nodeType === Node.TEXT_NODE) {
		// 			const textNodes = getAllTextNodes(contentEl);
		// 			const startNode = textNodes[0][0];
		// 			const endNode = textNodes[textNodes.length - 1][0];
		// 			const isCaretAtStart = range.startContainer === startNode && range.startOffset === 0;
		// 			const isCaretAtEnd = range.endContainer === endNode && range.endOffset === endNode.textContent.length;
		//
		// 			if (range.startContainer === childnodes[0] && isCaretAtStart && direction === "Left") {
		// 				console.log("llllll");
		// 				const nextBlockId = getNextTextBlock({ blockDataArr, blockDataIndex, direction: -1 });
		// 				const nCaretRects: DOMRect = { ...caretRects, left: 999999 };
		// 				console.log("nCaretRects: ", nCaretRects);
		// 				handleSetCaretPos({ event, id: nextBlockId, caretRects: nCaretRects, direction: "Left" });
		// 			} else if (range.startContainer === childnodes[childnodes.length - 1] && isCaretAtEnd && direction === "Right") {
		// 				const nextBlockId = getNextTextBlock({ blockDataArr, blockDataIndex, direction: 1 });
		// 				const nCaretRects: DOMRect = { ...caretRects, left: 0 };
		// 				handleSetCaretPos({ event, id: nextBlockId, caretRects: nCaretRects, direction: "Right" });
		// 			}
		// 		} else {
		// 			if (range.startContainer.childNodes[range.startOffset] === childnodes[0]) {
		// 				if (direction === "Left") {
		// 					const nextBlockId = getNextTextBlock({ blockDataArr, blockDataIndex, direction: -1 });
		// 					const nCaretRects: DOMRect = { ...caretRects, left: 999999 };
		// 					handleSetCaretPos({ event, id: nextBlockId, caretRects: nCaretRects, direction: "Left" });
		// 				}
		// 			} else if (range.startContainer.childNodes[range.startOffset] === childnodes[childnodes.length - 1]) {
		// 				if (direction === "Right") {
		// 					const nextBlockId = getNextTextBlock({ blockDataArr, blockDataIndex, direction: 1 });
		// 					const nCaretRects: DOMRect = { ...caretRects, left: 0 };
		// 					handleSetCaretPos({ event, id: nextBlockId, caretRects: nCaretRects, direction: "Right" });
		// 				}
		// 			}
		// 		}

		// 		if (range.startContainer.nodeType === Node.TEXT_NODE) {
		// 			if (contentEl) {
		// 				const isCaretAtStart = range.startContainer === startNode && range.startOffset === 0;
		// 				const isCaretAtEnd = range.endContainer === endNode && range.endOffset === endNode.textContent.length;
		//
		// 				if (isCaretAtStart && direction === "Left") {
		// 					const nextBlockId = getNextTextBlock({ blockDataArr, blockDataIndex, direction: -1 });
		// 					const nCaretRects: DOMRect = { ...caretRects, left: 999999 };
		// 					handleSetCaretPos({ event, id: nextBlockId, caretRects: nCaretRects, direction: "Left" });
		// 				}
		//
		// 				if (isCaretAtEnd && direction === "Right") {
		// 					const nextBlockId = getNextTextBlock({ blockDataArr, blockDataIndex, direction: 1 });
		// 					const nCaretRects: DOMRect = { ...caretRects, left: 0 };
		// 					handleSetCaretPos({ event, id: nextBlockId, caretRects: nCaretRects, direction: "Right" });
		// 				}
		// 			}
		// 		} else {
		// 			console.log("hidsochdos");
		// 		}
	};

	const handleMoveCaretByUpDown = ({
		event,
		id,
		blockDataArr,
		direction,
	}: {
		event: KeyboardEvent<HTMLDivElement>;
		id: string;
		blockDataArr: OutputBlockData[];
		direction: "Up" | "Down";
	}) => {
		//
		const selection = document.getSelection();
		if (!selection || selection.rangeCount === 0) {
			return;
		}

		const contentEl = document.getElementById(contentId.current);
		const topOfcontentEl = contentEl.childNodes[0];
		const bottomOfcontentEl = contentEl.childNodes[contentEl.childNodes.length - 1];

		const range = selection.getRangeAt(0);
		const selectContainer = range.commonAncestorContainer;
		const selectOffset = range.startOffset;

		const caretRects = range.getBoundingClientRect();

		if (!api.caretPos.current) {
			api.caretPos.current = { top: caretRects.top, left: caretRects.left };
		}

		const lineHeight = parseFloat(getComputedStyle(contentEl).lineHeight);

		const _caretPosition = caretRects.top;
		const caretPosition = _caretPosition + lineHeight / 2;

		const elementRect = contentEl.getBoundingClientRect();
		const computedStyle = window.getComputedStyle(contentEl);

		const paddingTop = parseFloat(computedStyle.paddingTop);
		const paddingBottom = parseFloat(computedStyle.paddingBottom);
		const borderTop = parseFloat(computedStyle.borderTopWidth);
		const borderBottom = parseFloat(computedStyle.borderBottomWidth);

		const elementPositionTop = elementRect.top + paddingTop + borderTop;
		const elementPositionBottom = elementRect.bottom - paddingBottom - borderBottom;

		const blockDataIndex = blockDataArr.findIndex((d) => d.id === id);

		//direction === "Up" or "Down"
		//--toplineまたはbottomlineがtextNodeかどうか？
		//----現在のcaret位置が,topまたはbottomかどうか？
		//startContainerがtextNodeでtopLineまたはbottomlineがELEMENT_NODEの場合もある
		//その場合は、  ELEMENT_NODEが親に対して一番上（下）かどうか確認し
		if (direction === "Up") {
			const caretPos = api.getCaretRelativePositionToContent({ contentEl, range });
			if (caretPos.top) {
				const nextBlockId = getNextTextBlock({ blockDataArr, blockDataIndex, direction: -1 });
				// handleSetCaretPos({ event, id: nextBlockId, caretRects, direction: "Up" });
			}
		} else if (direction === "Down") {
			const caretPos = api.getCaretRelativePositionToContent({ contentEl, range });

			if (caretPos.bottom) {
				const nextBlockId = getNextTextBlock({ blockDataArr, blockDataIndex, direction: 1 });
				// handleSetCaretPos({ event, id: nextBlockId, caretRects, direction: "Down" });
			}
		}
		//最初のNodeがTextNodeだった場合と要素Nodeだった場合で処理を分ける
		// if (direction === "Up" && childnodes[0].nodeType === Node.TEXT_NODE && caretPosition - elementPositionTop < lineHeight * 0.9) {
		// 	const nextBlockId = getNextTextBlock({ blockDataArr, blockDataIndex, direction: -1 });
		// 	handleSetCaretPos({ event, id: nextBlockId, caretRects, direction: "Up" });
		// } else if (
		// 	direction === "Down" &&
		// 	childnodes[childnodes.length - 1].nodeType === Node.TEXT_NODE &&
		// 	elementPositionBottom - caretPosition < lineHeight * 0.9
		// ) {
		// 	const nextBlockId = getNextTextBlock({ blockDataArr, blockDataIndex, direction: 1 });
		// 	handleSetCaretPos({ event, id: nextBlockId, caretRects, direction: "Down" });
		// } else if (direction === "Up" && childnodes[0].nodeType !== Node.TEXT_NODE && startContainer.childNodes[startOffset] === childnodes[0]) {
		// 	console.log("uuuu");
		// } else if (
		// 	direction === "Down" &&
		// 	childnodes[childnodes.length - 1].nodeType !== Node.TEXT_NODE &&
		// 	startContainer.childNodes[startOffset] === childnodes[childnodes.length - 1]
		// ) {
		// 	console.log("bbbb");
		// }

		// if (caretPosition - elementPositionTop < lineHeight * 0.9 && direction === "Up") {
		// 	const nextBlockId = getNextTextBlock({ blockDataArr, blockDataIndex, direction: -1 });
		// 	handleSetCaretPos({ event, id: nextBlockId, caretRects, direction: "Up" });
		// } else if (elementPositionBottom - caretPosition < lineHeight * 0.9 && direction === "Down") {
		// 	const nextBlockId = getNextTextBlock({ blockDataArr, blockDataIndex, direction: 1 });
		// 	handleSetCaretPos({ event, id: nextBlockId, caretRects, direction: "Down" });
		// }

		// scrollWithCaretPos();
	};

	const handleMoveCaret = ({
		event,
		id,
		blockDataArr,
		direction,
	}: {
		event: KeyboardEvent<HTMLDivElement>;
		id: string;
		blockDataArr: OutputBlockData[];
		direction: "Up" | "Down" | "Left" | "Right";
	}) => {
		//
		const selection = document.getSelection();
		if (!selection || selection.rangeCount === 0) {
			return;
		}

		const contentEl = document.getElementById(contentId.current);
		const topOfcontentEl = contentEl.childNodes[0];
		const bottomOfcontentEl = contentEl.childNodes[contentEl.childNodes.length - 1];

		const range = selection.getRangeAt(0);
		const selectContainer = range.commonAncestorContainer;
		const selectOffset = range.startOffset;

		const caretRects = range.getBoundingClientRect();

		if (!api.caretPos.current) {
			api.caretPos.current = { top: caretRects.top, left: caretRects.left };
		}

		const lineHeight = parseFloat(getComputedStyle(contentEl).lineHeight);

		const _caretPosition = caretRects.top;
		const caretPosition = _caretPosition + lineHeight / 2;

		const elementRect = contentEl.getBoundingClientRect();
		const computedStyle = window.getComputedStyle(contentEl);

		const paddingTop = parseFloat(computedStyle.paddingTop);
		const paddingBottom = parseFloat(computedStyle.paddingBottom);
		const borderTop = parseFloat(computedStyle.borderTopWidth);
		const borderBottom = parseFloat(computedStyle.borderBottomWidth);

		const elementPositionTop = elementRect.top + paddingTop + borderTop;
		const elementPositionBottom = elementRect.bottom - paddingBottom - borderBottom;

		const blockDataIndex = blockDataArr.findIndex((d) => d.id === id);

		//direction === "Up" or "Down"
		//--toplineまたはbottomlineがtextNodeかどうか？
		//----現在のcaret位置が,topまたはbottomかどうか？
		//startContainerがtextNodeでtopLineまたはbottomlineがELEMENT_NODEの場合もある
		//その場合は、  ELEMENT_NODEが親に対して一番上（下）かどうか確認し
		if (direction === "Up") {
			const caretPos = api.getCaretRelativePositionToContent({ contentEl, range });
			if (caretPos.top) {
				const nextBlockId = getNextTextBlock({ blockDataArr, blockDataIndex, direction: -1 });
				// handleSetCaretPos({ event, id: nextBlockId, caretRects, direction: "Up" });
			}
		} else if (direction === "Down") {
			const caretPos = api.getCaretRelativePositionToContent({ contentEl, range });

			if (caretPos.bottom) {
				const nextBlockId = getNextTextBlock({ blockDataArr, blockDataIndex, direction: 1 });
				// handleSetCaretPos({ event, id: nextBlockId, caretRects, direction: "Down" });
			}
		} else if (direction === "Left") {
			const caretPos = api.getCaretRelativePositionToContent({ contentEl, range });
		} else if (direction === "Right") {
			const caretPos = api.getCaretRelativePositionToContent({ contentEl, range });
		}
	};

	const handleMargeByBS = ({
		event,
		blockData,
		blockDataArr,
		undoObj,
	}: {
		event: KeyboardEvent<HTMLDivElement>;
		blockData: OutputBlockData;
		blockDataArr: OutputBlockData[];
		undoObj: InlineSelType;
	}) => {
		const blockIndex = blockDataArr.findIndex((d) => d.id === blockData.id);
		if (blockIndex < 1) {
			return;
		}

		const beforeId = blockDataArr[blockIndex - 1].id;
		const beforeEl = document.getElementById(`${beforeId}-pe-block__content`);

		if (!beforeEl) {
			return;
		}

		const beforeElLength = beforeEl.childNodes.length;

		const thisType = blockDataArr[blockIndex].type;
		const beforeType = blockDataArr[blockIndex - 1].type;
		const isContentEditable = config.blockTools.find((d) => d.id === thisType)?.isContentEditable;

		if (!isContentEditable || thisType !== beforeType) {
			return;
		}

		const nBlocks = [...blockDataArr];

		if (!("text" in nBlocks[blockIndex].data) || !("text" in nBlocks[blockIndex - 1].data)) {
			return;
		}

		const beforeText = nBlocks[blockIndex - 1].data.text;
		const thisText = nBlocks[blockIndex].data.text;

		beforeEl.innerHTML = `${beforeText}${thisText}`;
		nBlocks[blockIndex - 1].data.text = `${beforeText}<br/>${thisText}`;

		nBlocks.splice(blockIndex, 1);

		const beforeObj = nBlocks[blockIndex - 1];

		const startEl = {
			path: [0],
			startOffset: beforeElLength,
		};

		const endEl = {
			path: [0],
			endOffset: beforeElLength,
		};

		const redoObj: InlineSelType = {
			blockId: beforeObj.id,
			collapsed: true,
			displayInlineTune: false,
			contentEl: null,
			startEl,
			endEl,
			wrappedStyles: null,
			top: 0,
			left: 0,
		};

		const undoSel = { ...undoObj, displayInlineTune: false };
		const redoSel = { ...redoObj, displayInlineTune: false };
		const selObj = redoSel;

		api.handleSetBlockDataArr({
			blockDataArr: nBlocks,
			undoSel,
			redoSel,
			selObj,
		});

		event.preventDefault();
	};

	const handleDeleteText = ({
		event,
		blockData,
		blockDataArr,
	}: { event: KeyboardEvent<HTMLDivElement>; blockData: OutputBlockData; blockDataArr: OutputBlockData[] }) => {
		// const selection = document.getSelection();
		// if (!selection || selection.rangeCount === 0) {
		// 	return;
		// }
		// const range = selection.getRangeAt(0);
		// const rangeObj = api.getRangeObj(range);

		// if ((rangeObj.startEl?.path?.[0] === 0 && rangeObj.startEl?.startOffset === 0) || rangeObj.startEl?.path?.length === 0) {
		// 	//前のブロックと結合
		// 	handleMargeByBS({ event, blockData, blockDataArr, undoObj: rangeObj });
		// }
		const contentId = `${blockData.id}-${config.p1GlobalClassName.blockContent}`;
		const contentEl = document.getElementById(contentId);

		const selection = document.getSelection();
		if (selection.rangeCount === 0) {
			return;
		}

		const range = selection.getRangeAt(0);
		const rangeObj = api.getRangeObj(range);

		setDebouncedTmpInnerHTML({
			id: blockData.id,
			contentEl: contentEl,
			// undoSel: rangeObj,
		});
		if (!debouncedndoSel) {
			setDebouncedUndoSel(rangeObj);
		}
		// setTimeout(() => {
		// 	setTmpInnerHTML({
		// 		id: blockData.id,
		// 		contentEl: contentEl,
		// 		changedCount: tmpInnerHTML?.changedCount ? tmpInnerHTML.changedCount - 1 : -1,
		// 		undoSel: rangeObj,
		// 	});
		// }, 0);

		// setDelDebounced({ id: blockData.id, beforeInlineSel: rangeObj });
	};

	const handleOnKeyDown = getHotkeyHandler([
		[
			"Enter",
			(event: KeyboardEvent<HTMLDivElement>) => {
				if (!isComposingDebounced) {
					handleBlockSplit({ event, id: blockData.id });
				}
			},
			{ preventDefault: true },
		],
		[
			"Enter+shift",
			(event: KeyboardEvent<HTMLDivElement>) => {
				if (!isComposing) {
					handleinsertLineBreak({ event, id: blockData.id });
				}
			},
			{ preventDefault: true },
		],
		[
			"Backspace",
			(event: KeyboardEvent<HTMLDivElement>) => {
				if (!isComposing) {
					handleDeleteText({ event, blockData, blockDataArr: api.blockDataArr });
				}
			},
			{ preventDefault: false },
		],
		[
			"mod+X",
			(event: KeyboardEvent<HTMLDivElement>) => {
				if (!isComposing) {
					handleDeleteText({ event, blockData, blockDataArr: api.blockDataArr });
				}
			},
			{ preventDefault: false },
		],
		[
			"ArrowUp",
			(event: KeyboardEvent<HTMLDivElement>) => {
				handleMoveCaret({ event, id: blockData.id, blockDataArr: api.blockDataArr, direction: "Up" });
				// handleMoveCaretByUpDown({ event, id: blockData.id, blockDataArr: api.blockDataArr, direction: "Up" });
			},
			{ preventDefault: false },
		],
		[
			"ArrowDown",
			(event: KeyboardEvent<HTMLDivElement>) => {
				handleMoveCaret({ event, id: blockData.id, blockDataArr: api.blockDataArr, direction: "Down" });
				// handleMoveCaretByUpDown({ event, id: blockData.id, blockDataArr: api.blockDataArr, direction: "Down" });
			},
			{ preventDefault: false },
		],
		[
			"ArrowLeft",
			(event: KeyboardEvent<HTMLDivElement>) => {
				handleMoveCaret({ event, id: blockData.id, blockDataArr: api.blockDataArr, direction: "Left" });

				// handleMoveCaretByLeftRight({ event, id: blockData.id, blockDataArr: api.blockDataArr, direction: "Left" });
			},
			{ preventDefault: false },
		],
		[
			"ArrowRight",
			(event: KeyboardEvent<HTMLDivElement>) => {
				handleMoveCaret({ event, id: blockData.id, blockDataArr: api.blockDataArr, direction: "Right" });

				// handleMoveCaretByLeftRight({ event, id: blockData.id, blockDataArr: api.blockDataArr, direction: "Right" });
			},
			{ preventDefault: false },
		],
	]);

	const defaultStyle = {
		"&:empty::before": {
			content: '"テキストを入力してください"',
			color: cArr.gray[8],
		},
		"&:hover": {
			cursor: "text",
		},
	};

	// const requireLastLine = pureBlockData.text.match(/^.*<br>$/);
	// const pureBlockText = requireLastLine ? `${pureBlockData.text}<br class="${LLABClassName}">` : pureBlockData.text;

	return (
		<Box
			ref={contentRef}
			// my={fz / -2}
			{...props}
			id={`${blockData.id}-${p1_globalClassName.blockContent}`}
			contentEditable={!readOnly}
			className={`${p1_globalClassName.block} ${p1_globalClassName.blockContent} ${blockTool.className}`}
			sx={{ ...props.sx, ...defaultStyle }}
			// rome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
			dangerouslySetInnerHTML={{ __html: pureBlockData.text }}
			onPaste={(event) => {
				handleOnPaste({ event, id: blockData.id });
			}}
			onKeyDown={(event) => {
				handleOnKeyDown(event);
			}}
			onInput={(e) => {
				if (!isComposing) {
					const inputEvent = e.nativeEvent as InputEvent;
					if (inputEvent.data !== null) {
						const selection = document.getSelection();
						if (selection.rangeCount === 0) {
							return;
						}
						const range = selection.getRangeAt(0);
						const rangeObj = api.getRangeObj(range);
						rangeObj.startEl.startOffset--;
						rangeObj.endEl.endOffset--;

						if (!debouncedndoSel) {
							setDebouncedUndoSel(rangeObj);
						}

						setDebouncedTmpInnerHTML({
							id: blockData.id,
							contentEl: e.currentTarget,
						});

						// const text = bufferText + inputEvent.data;
						// setBufferText(text);
					}
					// console.log("通常のキーボード入力");
				} else {
					// console.log("IME入力中");
				}
			}}
			onCompositionStart={() => {
				setIsComposing(true);
			}}
			onCompositionEnd={(e) => {
				setIsComposing(false);
				handleOnCompositionEnd({ event: e, id: blockData.id });
			}}
		/>
	);
};
