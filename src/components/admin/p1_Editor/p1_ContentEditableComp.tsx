import { cArr } from "../../../styles/eStyle";

import { BlockControlType, BlockToolType, InlineSelType, OutputBlockData } from "./p1_EditorTypes";

import { Box } from "@mantine/core";
import { useState, CompositionEvent, KeyboardEvent, useEffect, FormEvent, useRef } from "react";
import { getHotkeyHandler, useDebouncedState, useDebouncedValue, useTextSelection } from "@mantine/hooks";
import { config } from "./p1_EditorConfig";
import { getValidOffset } from "./hooks/useSetBlocksState";
import { useGetComputedStyles } from "../../../hooks/useGetComputedStyles";
import { autoID } from "../../../util/autoID";

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

	useEffect(() => {
		if (!debouncedTmpInnerHTML) {
			return;
		}
		handleContentEditableOnChange({ ...debouncedTmpInnerHTML, undoSel: debouncedndoSel });
		setDebouncedTmpInnerHTML(null);
		setDebouncedUndoSel(null);
	}, [debouncedTmpInnerHTML]);

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

		const textNodes = getAllTextNodes(contentEl);
		const textNodeAtTop = textNodes[0];
		const textNodeAtBottom = textNodes[textNodes.length - 1];

		const selection = window.getSelection();
		if (!contentEl || !selection || selection.rangeCount === 0) {
			return;
		}

		const getTargetPos = ({ nextTextNode, caretRects }: { nextTextNode: Text; caretRects: DOMRect }) => {
			const testRange = document.createRange();
			testRange.selectNodeContents(nextTextNode);

			const positions = []; //複数行にまたがっているelementの場合一致するpositionが複数ある
			for (let i = 0; i < nextTextNode.length; i++) {
				testRange.setStart(nextTextNode, i);
				testRange.setEnd(nextTextNode, i + 1);

				const { left: textLeft, right: textRight } = testRange.getBoundingClientRect();
				const left = i === 0 ? 0 : textLeft;

				if (testRange.toString() === "\n" && left <= caretRects.left) {
					//改行だった場合右側の範囲を拡大する
					positions.push(i);
					continue;
				}
				if (left <= caretRects.left && textRight >= caretRects.left) {
					//caretRects.leftがその範囲内にあるかどうか
					positions.push(i);
				}
			}
			return positions.length !== 0 ? positions : [999999];
		};

		let _nextTextNode: [Text, DOMRect];
		let targetPosition = 999999;

		if (direction === "Down") {
			_nextTextNode = textNodeAtTop;
			const positions = getTargetPos({ nextTextNode: _nextTextNode[0], caretRects });
			targetPosition = positions[0];
		} else if (direction === "Up") {
			_nextTextNode = textNodeAtBottom;
			const positions = getTargetPos({ nextTextNode: _nextTextNode[0], caretRects });
			targetPosition = positions[positions.length - 1];
		} else if (direction === "Left") {
			_nextTextNode = textNodeAtBottom;
			targetPosition = 999999;
		} else if (direction === "Right") {
			_nextTextNode = textNodeAtTop;
			targetPosition = 0;
		}

		if (!_nextTextNode) {
			return;
		}
		const nextTextNode = _nextTextNode[0];

		//指定されたオフセットが対象ノードの長さを超えている場合は、その上限。超えてない場合はオフセットをそのまま返す
		const valiPosition = getValidOffset(nextTextNode, targetPosition);

		const range = new Range();
		range.setStart(nextTextNode, valiPosition);
		range.setEnd(nextTextNode, valiPosition);

		selection.removeAllRanges();
		selection.addRange(range);

		event.preventDefault();
		// }
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

		const range = selection.getRangeAt(0);

		const caretRects = range.getBoundingClientRect();

		if (!api.caretPos.current) {
			api.caretPos.current = { top: caretRects.top, left: caretRects.left };
		}

		const blockDataIndex = blockDataArr.findIndex((d) => d.id === id);

		if (direction === "Up") {
			const caretPos = api.getCaretRelativePositionToContent({ contentEl, range });
			if (caretPos.isCaretAtTopLine) {
				const nextBlockId = getNextTextBlock({ blockDataArr, blockDataIndex, direction: -1 });
				handleSetCaretPos({ event, id: nextBlockId, caretRects: caretPos.nCaretRects, direction: "Up" });
			}
		} else if (direction === "Down") {
			const caretPos = api.getCaretRelativePositionToContent({ contentEl, range });
			if (caretPos.isCaretAtBottomLine) {
				const nextBlockId = getNextTextBlock({ blockDataArr, blockDataIndex, direction: 1 });
				handleSetCaretPos({ event, id: nextBlockId, caretRects: caretPos.nCaretRects, direction: "Down" });
			}
		} else if (direction === "Left") {
			const caretPos = api.getCaretRelativePositionToContent({ contentEl, range });
			if (caretPos.isCaretAtLeftEnd) {
				const nextBlockId = getNextTextBlock({ blockDataArr, blockDataIndex, direction: -1 });
				handleSetCaretPos({ event, id: nextBlockId, caretRects: caretPos.nCaretRects, direction: "Left" });
			}
		} else if (direction === "Right") {
			const caretPos = api.getCaretRelativePositionToContent({ contentEl, range });
			if (caretPos.isCaretAtRightEnd) {
				const nextBlockId = getNextTextBlock({ blockDataArr, blockDataIndex, direction: 1 });
				handleSetCaretPos({ event, id: nextBlockId, caretRects: caretPos.nCaretRects, direction: "Right" });
			}
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

		const spCode = `_@_${autoID(10)}_@_`;
		beforeEl.innerHTML = `${beforeText}${spCode}${thisText}`;
		nBlocks[blockIndex - 1].data.text = `${beforeText}${thisText}`;

		// const afterSel = api.setCaretPosByAtSymbol({ element: beforeEl, symbol: spCode, endText: spCode });

		const pos = api.getSymbolPositions({ element: beforeEl, symbol: spCode });
		beforeEl.innerHTML = pos.innerHTML;
		nBlocks.splice(blockIndex, 1);

		const beforeObj = nBlocks[blockIndex - 1];

		const startEl = {
			path: [...pos.path],
			startOffset: pos.startOffset,
		};

		const endEl = {
			path: [...pos.path],
			endOffset: pos.endOffset,
		};

		const redoObj: InlineSelType = {
			blockId: beforeObj.id,
			collapsed: true,
			displayInlineTune: false,
			contentEl: {
				contentId: beforeId,
				path: pos.path,
			},
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
		const contentId = `${blockData.id}-${config.p1GlobalClassName.blockContent}`;
		const contentEl = document.getElementById(contentId);

		const selection = document.getSelection();
		if (selection.rangeCount === 0) {
			return;
		}

		const range = selection.getRangeAt(0);
		const rangeObj = api.getRangeObj(range);

		const caretPos = api.getCaretRelativePositionToContent({ contentEl, range });
		if (caretPos?.isCaretAtLeftEnd) {
			//前のブロックと結合
			handleMargeByBS({ event, blockData, blockDataArr, undoObj: rangeObj });
		}

		setDebouncedTmpInnerHTML({
			id: blockData.id,
			contentEl: contentEl,
		});
		if (!debouncedndoSel) {
			setDebouncedUndoSel(rangeObj);
		}
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
