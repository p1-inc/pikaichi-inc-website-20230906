import { useState, useEffect, useRef, RefObject, ClipboardEvent, CompositionEvent, useLayoutEffect, KeyboardEvent } from "react";

import DOMPurify from "dompurify";
import { OutputBlockData, BlockControlType, BlockToolType, InlineToolType, P1GlobalClassNameType, InlineSelType, UndoType } from "../p1_EditorTypes";
import { autoID } from "../../../../util/autoID";

import { config, inlineToolClassNames } from "../p1_EditorConfig";
import { useDebouncedState, useTextSelection } from "@mantine/hooks";

const historyLimit = 200;

const getEffectiveOffset = (node: Node, offset: number) => {
	if (node.nodeType === Node.TEXT_NODE) {
		const len = (node as Text).length;
		return Math.min(len, offset);
	} else if (node.nodeType === Node.ELEMENT_NODE) {
		const len = node.childNodes.length;
		return Math.min(len, offset);
	} else {
		return 0;
	}
};

export const getValidOffset = (node: Node, offset: number) => {
	//指定されたオフセットが対象ノードの長さを超えている場合は、その上限。超えてない場合はオフセットをそのまま返す
	if (!node) {
		return 0;
	}

	let maxLength = offset;
	if (node.nodeType === Node.TEXT_NODE) {
		if (node.textContent.length < offset) {
			// console.log("指定されたオフセットが対象ノードの長さを超えています");
			maxLength = node.textContent.length;
		}
	} else if (node.nodeType === Node.ELEMENT_NODE) {
		if (node.childNodes.length < offset) {
			// console.log("指定されたオフセットが対象ノードの長さを超えています");
			maxLength = node.childNodes.length;
		}
	}
	return maxLength;
};

export const useSetBlocksState = (): BlockControlType => {
	//
	const [viewGrid, setViewGrid] = useState<boolean>(false);
	const [readOnly, setReadOnly] = useState<boolean>(false);

	const blockTools = useRef<BlockToolType[]>(config.blockTools);
	const inlineTools = useRef<InlineToolType[]>(config.inlineTools);
	const p1_globalClassName = useRef<P1GlobalClassNameType>(config.p1GlobalClassName);

	const [blockDataArr, setBlockDataArr] = useState<OutputBlockData[]>([]);

	const [inlineSel, setInlineSel] = useState<InlineSelType>(null);
	// const [inlineSelDebounced] = useDebouncedValue(inlineSel, 10);

	const [inlineSubPalette, setInlineSubPalette] = useState<{ name: string; component: JSX.Element | null }>(null);

	const undo = useRef<UndoType[]>([]);
	const redo = useRef<UndoType[]>([]);

	const caretPos = useRef<{ top: number; left: number }>(null);

	const [autoSave, setAutosave] = useDebouncedState<OutputBlockData[]>([], 10000);

	const selection = useTextSelection();
	useEffect(() => {
		//inlineTune発火
		handleSelectionChange();
	}, [selection?.toString()]);

	const hideInlineSel = () => {
		setInlineSel(null);
	};

	useLayoutEffect(() => {
		//
		if (!inlineSel || !inlineSel.blockId) {
			return;
		}

		if (inlineSel.blockId && !inlineSel.contentEl) {
			//新規ブロックの先頭にcaretを起きたい場合
			//blockIdのみ設定してあり、contentElがundefinedだった場合
			if (!inlineSel.startEl?.startOffset) {
				inlineSel.startEl.startOffset = 0;
			}
			if (!inlineSel.endEl?.endOffset) {
				inlineSel.endEl.endOffset = 0;
			}
			inlineSel.startEl.path = [];
			inlineSel.endEl.path = [];
		}
		const contentId = `${inlineSel.blockId}-${p1_globalClassName.current.blockContent}`;

		const contentEl = document.getElementById(contentId);

		const _startContainer = getElementFromParentUsingPath(contentEl, inlineSel.startEl.path);

		const startContainer = _startContainer ? _startContainer : contentEl;

		const startOffset = inlineSel.startEl.startOffset;
		const _endContainer = getElementFromParentUsingPath(contentEl, inlineSel.endEl.path);
		const endContainer = _endContainer ? _endContainer : contentEl;
		const endOffset = inlineSel.endEl.endOffset;

		const nStartOffset = getValidOffset(startContainer, startOffset);
		const nEndOffset = getValidOffset(endContainer, endOffset);

		const selection = window.getSelection();

		const range = document.createRange();
		range.setStart(startContainer, getEffectiveOffset(startContainer, nStartOffset));
		range.setEnd(endContainer, getEffectiveOffset(endContainer, nEndOffset));

		selection.removeAllRanges();
		selection.addRange(range);
		setAutosave(blockDataArr);
	}, [blockDataArr]);

	// useEffect(() => {
	// 	if (blockDataArr.length === 0) {
	// 		const _defaultData = config.blockTools.find((d) => d.id === config.defaultTool);
	// 		const defaultData = { ..._defaultData.defaultData };
	// 		const def = { id: autoID(10), type: config.defaultTool, data: defaultData };
	// 		handleSetBlockDataArr({ blockDataArr: [def] });
	// 	}
	// }, [blockDataArr]);

	const containerRef: RefObject<HTMLElement> = useRef(null);

	const sanitizeBlockdata = (blockDataArr: OutputBlockData[]) => {
		//
		const validateClassName = (text: string) => {
			const temporaryDiv = document.createElement("div");
			temporaryDiv.innerHTML = text;
			const boldElements = temporaryDiv.getElementsByTagName("b");
			for (const boldElement of boldElements) {
				boldElement.classList.add("pe-inline_bold");
			}
			const italicElements = temporaryDiv.getElementsByTagName("i");
			for (const italicElement of italicElements) {
				italicElement.classList.add("pe-inline_italic");
			}
			const linkElements = temporaryDiv.getElementsByTagName("a");
			for (const linkElement of linkElements) {
				linkElement.classList.add("pe-inline_link");
			}
			return temporaryDiv.innerHTML;
		};

		const nBlockDataArr = blockDataArr.map((d) => {
			const blockTool = config.blockTools.find((d2) => d2.id === d.type);
			if (!blockTool.isContentEditable || !("text" in d.data)) {
				return d;
			}
			const _pureBlockText1 = getPureBlockData(d.data.text);
			const _pureBlockText2 = validateClassName(_pureBlockText1);
			const pureBlockText = _pureBlockText2.replace("<br>", "\n");
			// const pureBlockText = _pureBlockText2.replace(`<br class="${LLABClassName}">`, "");
			d.data.text = pureBlockText;

			return d;
		});
		return nBlockDataArr;
	};

	const handleSelectionChange = () => {
		caretPos.current = null;

		const selection = document.getSelection();

		if (selection.rangeCount === 0) {
			return;
		}

		const range = selection.getRangeAt(0);

		if (selection?.isCollapsed) {
			const onInLineMenu = findParentWithClassNameAndPath(range.startContainer, "inlineTuneEl");
			if (onInLineMenu.el) {
				return;
			}

			setInlineSel(null);
			setInlineSubPalette(null); // setInlineSubPaletteもどこかで定義されている必要がある
			return;
		}

		const rangeObj = getRangeObj(range);

		const displayInlineTune = true;

		setInlineSel({ ...rangeObj, displayInlineTune });
	};

	// useEffect(() => {
	// 	document.addEventListener("mouseup", handleSelectionChange);
	// 	return () => {
	// 		document.removeEventListener("mouseup", handleSelectionChange);
	// 	};
	// }, [handleSelectionChange]);

	const getRangeElement = (range: Range, className: string) => {
		const { startContainer, startOffset, endContainer, endOffset } = range;

		const startEl = findParentWithClassNameAndPath(startContainer, className);
		const endEl = findParentWithClassNameAndPath(endContainer, className);
		return {
			startEl: { path: startEl.path, startOffset },
			endEl: { path: endEl.path, endOffset },
		};
	};

	const getRangeObj = (range: Range): InlineSelType => {
		//
		const { startEl, endEl } = getRangeElement(range, p1_globalClassName.current.blockContent);

		const commonAncestor = range.commonAncestorContainer as Element;

		const _contentElement = findParentWithClassNameAndPath(commonAncestor, p1_globalClassName.current.blockContent);
		const contentElement = {
			contentId: _contentElement.id,
			path: _contentElement.path,
		};

		const blockElement = findParentWithClassNameAndPath(commonAncestor, p1_globalClassName.current.blockWrapper);

		const { top, left } = range.getBoundingClientRect();
		const { top: contentTop, left: contentLeft } = containerRef.current.getBoundingClientRect();

		const computedStyle = getComputedStyle(containerRef.current?.parentElement);
		const paddingTop = parseFloat(computedStyle.paddingTop);
		const paddingLeft = parseFloat(computedStyle.paddingLeft);

		/////////////////////////////////////////////////wrappedStyles//////////////////////////////////////////////

		const contentEl = _contentElement.el;

		const extractClassNamesWithPathsFunc = (element: Element, path: number[] = []) => {
			const result: { classNames: string[]; path: number[] }[] = [];

			for (let i = 0; i < element.childNodes.length; i++) {
				const child = element.childNodes[i] as Element;

				if (child.nodeType === Node.ELEMENT_NODE) {
					let cList: string[] = [];
					if (child.classList) {
						const isIncludes = Array.from(child.classList).find((cl) => inlineToolClassNames.includes(cl));
						if (isIncludes) {
							cList = Array.from(child.classList);
						}
					}
					// const cList = child.classList
					// 	? Array.from(child.classList).find((cl) => inlineToolClassNames.includes(cl))
					// 	: [];

					if (cList.length > 0) {
						const newPath = [...path, i];
						result.push({ classNames: cList, path: newPath });
					}

					const childResult = extractClassNamesWithPathsFunc(child, [...path, i]);
					result.push(...childResult);
				}
			}

			return result;
		};

		const _wrappedStyles = extractClassNamesWithPathsFunc(contentEl);
		const wrappedStyles = _wrappedStyles.filter((d) => startEl.path[0] <= d.path[0] && d.path[0] <= endEl.path[0]);

		return {
			blockId: blockElement.id,
			collapsed: range.collapsed,
			displayInlineTune: true,
			contentEl: contentElement,
			startEl,
			endEl,
			wrappedStyles,
			top: top - contentTop + paddingTop,
			left: left - contentLeft + paddingLeft,
		};
	};

	const getElementFromParentUsingPath = (parentEl: Node | HTMLElement, path: number[]) => {
		let currentElement = parentEl;
		path.forEach((index) => {
			currentElement = currentElement.childNodes[index];
		});
		return currentElement;
	};

	const handleAddBlockData = ({
		id,
		data,
		undoSel,
		redoSel,
		selObj,
	}: {
		id: string;
		data: { [Index: string]: any };
		undoSel?: InlineSelType;
		redoSel?: InlineSelType;
		selObj?: InlineSelType;
	}) => {
		const nBlockData = [...blockDataArr];

		const blockIndex = nBlockData.findIndex((d) => d.id === id);
		const block = nBlockData[blockIndex];

		const nData = { ...block.data, ...data };
		const nBlock = { ...block, data: nData };

		if (JSON.stringify(nData) === JSON.stringify(block.data)) {
			return;
		} else {
			// console.log("id: ", id);
			// console.log("nData: ", nData);
			// console.log("block.data: ", block.data);
		}
		nBlockData[blockIndex] = nBlock;

		handleSetBlockDataArr({ blockDataArr: nBlockData, undoSel, redoSel, selObj });
	};

	const reorderBlock = ({ id, dir }: { id: string; dir: "up" | "down" | "del" }) => {
		const nBlocks = [...blockDataArr];
		const blockIndex = nBlocks.findIndex((d) => d.id === id);
		const item = nBlocks.splice(blockIndex, 1);
		if (dir === "up") {
			const index = blockIndex - 1;
			nBlocks.splice(index < 0 ? 0 : index, 0, item[0]);
		} else if (dir === "down") {
			nBlocks.splice(blockIndex + 1, 0, item[0]);
		}

		handleSetBlockDataArr({ blockDataArr: nBlocks });
	};

	const duplicateBlock = ({ id }: { id: string }) => {
		const nBlocks = [...blockDataArr];
		const blockIndex = nBlocks.findIndex((d) => d.id === id);
		const newBlock = JSON.parse(JSON.stringify(nBlocks[blockIndex]));
		newBlock.id = autoID(10);
		nBlocks.splice(blockIndex + 1, 0, newBlock);
		handleSetBlockDataArr({ blockDataArr: nBlocks });
		return newBlock.id;
	};

	const getCaretRelativePositionToContent = ({ contentEl, range }: { contentEl: Element; range: Range }) => {
		//
		const topOfcontentEl = contentEl.childNodes[0];
		const bottomOfcontentEl = contentEl.childNodes[contentEl.childNodes.length - 1];

		const elementRect = contentEl.getBoundingClientRect();
		const computedStyle = window.getComputedStyle(contentEl);

		const paddingTop = parseFloat(computedStyle.paddingTop);
		const paddingBottom = parseFloat(computedStyle.paddingBottom);
		const borderTop = parseFloat(computedStyle.borderTopWidth);
		const borderBottom = parseFloat(computedStyle.borderBottomWidth);

		const caretContainer = range.startContainer;
		const caretOffset = range.startOffset;
		const caretElement = caretContainer.nodeType === Node.TEXT_NODE ? caretContainer : caretContainer.childNodes[caretOffset];

		const caretRects = range.getBoundingClientRect();

		const lineHeight = parseFloat(getComputedStyle(contentEl).lineHeight);
		const caretPosition = caretRects.top + lineHeight / 2;

		const elementPositionTop = elementRect.top + paddingTop + borderTop;
		const elementPositionBottom = elementRect.bottom - paddingBottom - borderBottom;

		const isTextNodeAtTopinContentEl = topOfcontentEl.nodeType === Node.TEXT_NODE; //contentElementの最初の行(top)がtextNodeか他Nodeか(true/false)
		const isTextNodeAtBottominContentEl = bottomOfcontentEl.nodeType === Node.TEXT_NODE; //contentElementの最後の行(bottom)がtextNodeか他Nodeか(true/false)

		const isTextNodeAtSelection = caretContainer.nodeType === Node.TEXT_NODE;

		const endIndex = caretContainer.childNodes.length;

		let isCaretAtTopLine = false;
		let isCaretAtBottomLine = false;

		if (caretContainer.nodeType === Node.TEXT_NODE && caretPosition - elementPositionTop < lineHeight * 0.9) {
			isCaretAtTopLine = true;
		}
		if (caretContainer.nodeType !== Node.TEXT_NODE && caretContainer.childNodes[caretOffset] === topOfcontentEl) {
			isCaretAtTopLine = true;
		}

		if (caretContainer.nodeType === Node.TEXT_NODE && elementPositionBottom - caretPosition < lineHeight * 0.99) {
			isCaretAtBottomLine = true;
		}
		if (caretContainer.nodeType !== Node.TEXT_NODE && caretContainer.childNodes[caretOffset] === bottomOfcontentEl) {
			isCaretAtBottomLine = true;
		}

		let isCaretAtLeftEnd = false;
		let isCaretAtRightEnd = false;

		if (caretContainer.nodeType === Node.TEXT_NODE && caretPosition - elementPositionTop < lineHeight * 0.9 && caretOffset === 0) {
			isCaretAtLeftEnd = true;
		}

		if (caretContainer.nodeType !== Node.TEXT_NODE && caretOffset === 0) {
			isCaretAtLeftEnd = true;
		}

		if (
			caretContainer.nodeType === Node.TEXT_NODE &&
			elementPositionBottom - caretPosition < lineHeight * 0.99 &&
			caretOffset === caretContainer.nodeValue.length
		) {
			isCaretAtRightEnd = true;
		}

		if (caretContainer.nodeType !== Node.TEXT_NODE && caretOffset === endIndex) {
			isCaretAtRightEnd = true;
		}
		// console.log("caretContainer.nodeType !== Node.TEXT_NODE : ", caretContainer.nodeType !== Node.TEXT_NODE);
		// console.log("caretOffset: ", caretOffset);
		// console.log("caretContainer.childNodes.length: ", caretContainer.childNodes.length);
		// console.log(" caretContainer: ", caretContainer);

		console.table({
			isTextNodeAtTopinContentEl,
			isTextNodeAtBottominContentEl,
			isTextNodeAtSelection,
			isCaretAtTopLine,
			isCaretAtBottomLine,
			isCaretAtLeftEnd,
			isCaretAtRightEnd,
		});

		const caretPos2: { top: boolean; bottom: boolean; left: boolean; right: boolean } = { top: null, bottom: null, left: null, right: null };
		if (topOfcontentEl.nodeType === Node.TEXT_NODE && caretPosition - elementPositionTop < lineHeight * 0.9) {
			caretPos2.top = true;
		} else {
			if (caretContainer.nodeType === Node.TEXT_NODE) {
				if ((caretContainer.parentNode as Node) === contentEl.childNodes[0]) {
					caretPos2.top = true;
				}
			}
			if (caretContainer.childNodes[caretOffset] === topOfcontentEl) {
				caretPos2.top = true;
			}
		}
		if (bottomOfcontentEl.nodeType === Node.TEXT_NODE && elementPositionBottom - caretPosition < lineHeight * 0.9) {
			caretPos2.bottom = true;
		} else {
			if (caretContainer.nodeType === Node.TEXT_NODE) {
				if ((caretContainer.parentNode as Node) === contentEl.childNodes[contentEl.childNodes.length - 1]) {
					caretPos2.bottom = true;
				}
			}
			if (caretContainer.childNodes[caretOffset] === bottomOfcontentEl) {
				caretPos2.top = true;
			}
		}
		// if (topOfcontentEl.nodeType === Node.TEXT_NODE && caretPosition - elementPositionTop < lineHeight * 0.9) {
		// 	caretPos.top = true;
		// } else if (bottomOfcontentEl.nodeType === Node.TEXT_NODE && elementPositionBottom - caretPosition < lineHeight * 0.9) {
		// 	caretPos.bottom = true;
		// } else if (
		// 	topOfcontentEl.nodeType === Node.TEXT_NODE &&
		// 	caretPosition - elementPositionTop < lineHeight * 0.9 &&
		// 	bottomOfcontentEl.nodeType === Node.TEXT_NODE &&
		// 	elementPositionBottom - caretPosition < lineHeight * 0.9
		// ) {
		// 	caretPos.top = true;
		// 	caretPos.bottom = true;
		// } else {
		// 	if (selectContainer.nodeType === Node.TEXT_NODE) {
		// 		//selectContainerがtextNodeでtopLineがELEMENT_NODEの場合
		// 		if ((selectContainer.parentNode as Node) === contentEl.childNodes[0]) {
		// 			caretPos.top = true;
		// 		}
		// 		if ((selectContainer.parentNode as Node) === contentEl.childNodes[contentEl.childNodes.length - 1]) {
		// 			caretPos.bottom = true;
		// 		}
		// 	}
		// 	if (selectContainer.childNodes[selectOffset] === topOfcontentEl) {
		// 		caretPos.top = true;
		// 	}
		// 	if (selectContainer.childNodes[selectOffset] === bottomOfcontentEl) {
		// 		caretPos.bottom = true;
		// 	}
		// }

		return caretPos2;
	};
	const handleSetBlockDataArr = ({
		blockDataArr,
		history = true,
		undoSel,
		redoSel,
		selObj,
	}: {
		blockDataArr: OutputBlockData[];
		history?: boolean;
		undoSel?: InlineSelType;
		redoSel?: InlineSelType;
		selObj?: InlineSelType;
	}) => {
		//

		const puredata = sanitizeBlockdata(blockDataArr);
		const _undoSel = undoSel ? JSON.stringify(undoSel) : null;
		const _redoSel = redoSel ? JSON.stringify(redoSel) : null;
		const _blockDataArr = blockDataArr ? JSON.stringify(puredata) : null;

		setInlineSel(selObj);
		setBlockDataArr(JSON.parse(_blockDataArr));

		if (!history) {
			return;
		}

		undo.current.push({
			undoSel: _undoSel,
			redoSel: _redoSel,
			blockDataArr: _blockDataArr,
		});
		if (undo.current.length > historyLimit) {
			undo.current.shift();
		}
		redo.current = [];
	};

	type SearchResult = { container: number[]; offset: number; text: string } | null;
	type Texts = { [key: string]: SearchResult };

	const searchNodes = (node: Node, texts: Texts, path: number[] = []): Texts => {
		let newTexts = { ...texts }; // 新しい変数を作成し、textsのコピーを代入します。
		if (node.nodeType === Node.TEXT_NODE && node.textContent) {
			for (const text in newTexts) {
				const startOffset = node.textContent.indexOf(text);
				if (startOffset !== -1) {
					node.textContent = node.textContent.replace(text, "");
					newTexts[text] = { container: path, offset: startOffset, text };
				}
			}
		} else if (node.nodeType === Node.ELEMENT_NODE) {
			for (let i = 0; i < node.childNodes.length; i++) {
				newTexts = searchNodes(node.childNodes[i], newTexts, [...path, i]); // newTextsを更新します。
			}
		}
		return newTexts; // newTextsを返します。
	};

	const reSetInlineSel = ({
		node,
		inlineSel,
		startText,
		endText,
	}: { node: Node; inlineSel: InlineSelType; startText: string; endText: string; path?: number[] }) => {
		const texts: Texts = { [startText]: null, [endText]: null };
		const nNodes = searchNodes(node, texts);

		const st = nNodes[startText];
		const ed = nNodes[endText];

		inlineSel.startEl = { path: st?.container, startOffset: st?.offset };
		inlineSel.endEl = { path: ed?.container, endOffset: ed?.offset };

		return inlineSel;
	};

	const cloneElementForInlineSel = ({ node, inlineSel, startText, endText }: { node: Node; inlineSel: InlineSelType; startText: string; endText: string }) => {
		const cNode = node.cloneNode(true);

		const startEl = getElementFromParentUsingPath(cNode, inlineSel.startEl.path);
		const endEl = getElementFromParentUsingPath(cNode, inlineSel.endEl.path);

		if (!(startEl.nodeType === Node.TEXT_NODE && endEl.nodeType === Node.TEXT_NODE)) {
			return;
		}

		const beforeText = document.createTextNode(startText);
		const afterText = document.createTextNode(endText);

		const startOffset = inlineSel.startEl.startOffset;
		const endOffset = inlineSel.endEl.endOffset;

		// endOffsetの位置にテキストを挿入
		(endEl as Text).splitText(endOffset);
		endEl.parentNode.insertBefore(afterText, endEl.nextSibling);

		// startOffsetの位置にテキストを挿入
		(startEl as Text).splitText(startOffset);
		startEl.parentNode.insertBefore(beforeText, startEl.nextSibling);

		cNode.normalize();
		return cNode;
	};

	const updateInlineClassName = ({
		inlineSel,
		beforeClassNames,
		afterClassName,
	}: { inlineSel: InlineSelType; beforeClassNames: string[]; afterClassName?: string }) => {
		const originalEl = document.getElementById(inlineSel.contentEl.contentId);
		let afterSel: InlineSelType;
		//inlineSelのシミュレーションのためcloneする
		const startText = `_@_${autoID(10)}_@_`;
		const endText = `_@_${autoID(10)}_@_`;

		const contentEl = cloneElementForInlineSel({ node: originalEl, inlineSel, startText, endText }) as Element;

		const targetObjcts: {
			classNames: string[];
			path: number[];
			sort: number;
		}[] = inlineSel.wrappedStyles.flatMap((d) => {
			const isExist = d.classNames.find((d2) => beforeClassNames.includes(d2));
			const sortNumStr = d.path.map((d) => d + 1).join("");
			const sort = Number(sortNumStr) / 10 ** (sortNumStr.length - 1);
			return isExist ? { ...d, sort } : [];
		});

		targetObjcts.sort((a, b) => b.sort - a.sort);

		if (!afterClassName) {
			targetObjcts.forEach((obj) => {
				const targetEl = getElementFromParentUsingPath(contentEl, obj.path);

				const parentElPath = obj.path.slice(0, obj.path.length - 1);
				const parentEl = parentElPath.length === 0 ? contentEl : getElementFromParentUsingPath(contentEl, parentElPath);

				while (targetEl.childNodes.length > 0) {
					parentEl.insertBefore(targetEl.childNodes[0], targetEl);
				}
				parentEl.removeChild(targetEl);
			});
			contentEl.normalize();

			const cInlineSel = JSON.parse(JSON.stringify(inlineSel));
			afterSel = reSetInlineSel({ node: contentEl, inlineSel: cInlineSel, startText, endText });
		} else {
			targetObjcts.forEach((obj) => {
				const targetEl = getElementFromParentUsingPath(contentEl, obj.path) as Element;
				const nClassNmaes = obj.classNames.map((d) => (beforeClassNames.includes(d) ? afterClassName : d));
				targetEl.className = nClassNmaes.join(" ");
			});
			const cInlineSel = JSON.parse(JSON.stringify(inlineSel));
			afterSel = reSetInlineSel({ node: contentEl, inlineSel: cInlineSel, startText, endText });
		}

		const undoSel = { ...inlineSel, displayInlineTune: false };
		const redoSel = { ...afterSel, displayInlineTune: false };
		const selObj = redoSel;

		handleAddBlockData({
			id: inlineSel.blockId,
			data: { text: contentEl.innerHTML },
			undoSel,
			redoSel,
			selObj,
		});
	};

	const handleDeleteInlineStyle = ({ inlineSel }: { inlineSel: InlineSelType }) => {
		const beforeClassNames = inlineSel.wrappedStyles.flatMap((d) => d.classNames);
		updateInlineClassName({ inlineSel, beforeClassNames });
	};

	const getPureBlockData = (text: string): string => {
		DOMPurify.addHook("uponSanitizeElement", (node, data) => {
			if (node.tagName && node.tagName.toLowerCase() === "br") {
				return;
			}

			if (node.nodeType === Node.TEXT_NODE) {
				return;
			}

			if (!node.parentNode) {
				return;
			}

			const classAttr = node.getAttribute("class");

			if (!classAttr) {
				const textContent = node.textContent;
				const textNode = document.createTextNode(textContent);

				if (!node.parentNode) {
					return;
				}
				node.parentNode.insertBefore(textNode, node);
				node.remove();
				return;
			}

			const _existAloowedClassName = classAttr.split(" ").map((d) => inlineToolClassNames.includes(d));
			const existAloowedClassName = _existAloowedClassName.some((d) => d === true);

			if (!existAloowedClassName) {
				const textContent = node.textContent;
				const textNode = document.createTextNode(textContent);

				console.log("node: ", node);
				node.parentNode.insertBefore(textNode, node);

				node.remove();
			}
		});
		const sanitizedHtml = DOMPurify.sanitize(text, {
			FORBID_TAGS: ["meta"],
			FORBID_ATTR: ["style"],
			ADD_ATTR: ["class"],
			ALLOWED_ATTR: ["class", "href"],
		});

		return sanitizedHtml;
	};

	const handleAlignChange = (id: string, dir: "left" | "center" | "right") => {
		const data = { align: dir };
		handleAddBlockData({ id, data: data });
	};

	const addNewBlock = ({ id, blockTool, innerHTML }: { id: string; blockTool: string; innerHTML?: string }) => {
		const nBlocks = [...blockDataArr];
		const blockIndex = nBlocks.findIndex((d) => d.id === id);
		const blockToolConfig = blockTools.current.find((tool) => tool.id === blockTool);
		const newId = autoID(10);
		const data = innerHTML ? { text: innerHTML } : blockToolConfig.defaultData;
		const nData = { id: newId, type: blockToolConfig.id, data: data };
		nBlocks.splice(blockIndex + 1, 0, nData);
		handleSetBlockDataArr({ blockDataArr: nBlocks });
		return newId;
	};

	type FindNodeCallBackType = {
		toElement: Node;
		fromNode: Node;
		path: number[];
	};

	const findNodeCallBack = ({ toElement, fromNode, path }: FindNodeCallBackType) => {
		//
		type ResultType = {
			found: boolean;
			node: Node;
			path: number[];
		};
		let result: ResultType = {
			found: false,
			node: null,
			path: [],
		};

		const childNodesArr = Array.from(toElement.childNodes);

		childNodesArr.find((node, i) => {
			let nPath = path;

			if (node.nodeType === Node.ELEMENT_NODE) {
				const toElement = node as HTMLElement;
			}

			nPath = [...nPath, i];

			if (node === fromNode) {
				result = {
					found: true,
					node: node,
					path: nPath,
				};
				return true;
			} else if (node.childNodes.length > 0) {
				const childResult = findNodeCallBack({
					toElement: node,
					fromNode: fromNode,
					path: nPath,
				});

				if (childResult.found) {
					result = childResult;
					return true;
				}
			}
			return false;
		});
		return result;
	};

	const findNode = (toElement: Node, fromNode: Node) => {
		const path: number[] = [];
		const result = findNodeCallBack({
			toElement,
			fromNode,
			path: path,
		});
		return result;
	};

	const findParentWithClassNameAndPath = (_element: Node | Element, className: string, path: number[] = []): { el: Element; id: string; path: number[] } => {
		const element = _element as Element;

		if (!element) {
			return { el: null, id: null, path: [] };
		}

		if (element.classList?.contains(className)) {
			return { el: element, id: element.id, path: path.reverse() };
		}
		if (element.parentNode) {
			const siblings = Array.from(element.parentNode.childNodes);
			const index = siblings.indexOf(element);
			path.push(index);
		}

		return findParentWithClassNameAndPath(element.parentNode as Element, className, path);
	};

	const handleOnPaste = ({ event, id }: { event: ClipboardEvent<HTMLElement>; id: string }) => {
		event.preventDefault();

		const contentEl = document.getElementById(`${id}-${config.p1GlobalClassName.blockContent}`);

		const nSelection = document.getSelection();
		const nRange = nSelection.getRangeAt(0);
		// const nRange = _nRange.cloneRange();
		const rangeObj = getRangeObj(nRange);

		if (!nRange.collapsed) {
			nRange.deleteContents();
		}

		const pasteText = event.clipboardData.getData("text/html");
		const sanitizedHtml = getPureBlockData(pasteText);

		const tempDiv = document.createElement("div");
		tempDiv.innerHTML = sanitizedHtml;

		const selection = document.getSelection();
		if (selection.rangeCount === 0) {
			return;
		}

		const docFragment = document.createDocumentFragment();
		while (tempDiv.firstChild) {
			docFragment.appendChild(tempDiv.firstChild);
		}
		nRange.insertNode(docFragment);

		contentEl.normalize();

		selection.collapseToEnd();

		const _redoSel = getRangeObj(nRange);

		const undoSel = { ...rangeObj, displayInlineTune: false };
		const redoSel = { ..._redoSel, displayInlineTune: false };
		const selObj = redoSel;

		const htmlData = event.currentTarget.innerHTML;
		handleAddBlockData({
			id,
			data: { text: htmlData },
			undoSel,
			redoSel,
			selObj,
		});
	};

	const submitInlineTune = ({ inlineSel, element }: { inlineSel: InlineSelType; element: Element }) => {
		//
		const selection = document.getSelection();
		if (selection.rangeCount === 0) {
			return;
		}

		const contentEl = document.getElementById(inlineSel.contentEl.contentId);

		const startContainer = getElementFromParentUsingPath(contentEl, inlineSel.startEl.path);
		const endContainer = getElementFromParentUsingPath(contentEl, inlineSel.endEl.path);

		const range = new Range();
		range.setStart(startContainer, getEffectiveOffset(startContainer, inlineSel.startEl.startOffset));
		range.setEnd(endContainer, getEffectiveOffset(endContainer, inlineSel.endEl.endOffset));

		try {
			range.surroundContents(element);
		} catch (error) {
			console.log("error: ", error);
			return;
		}

		contentEl.normalize();

		const newRange = document.createRange();
		newRange.selectNode(element);

		const _redoSel = getRangeObj(newRange);

		const undoSel = { ...inlineSel, displayInlineTune: false };
		const redoSel = { ..._redoSel, displayInlineTune: false };
		const selObj = redoSel;

		const content = contentEl.innerHTML;

		handleAddBlockData({ id: inlineSel.blockId, data: { text: content }, undoSel, redoSel, selObj });
	};

	const handleUndo = () => {
		if (undo.current.length < 2) {
			return;
		}
		const undoData1 = undo.current.pop();

		redo.current.push(undoData1);
		const undoData2 = undo.current[undo.current.length - 1];
		handleSetBlockDataArr({
			blockDataArr: JSON.parse(undoData2.blockDataArr),
			history: false,
			undoSel: JSON.parse(undoData1.undoSel),
			redoSel: JSON.parse(undoData1.redoSel),
			selObj: JSON.parse(undoData1.undoSel),
		});
	};

	const handleRedo = () => {
		if (redo.current.length < 1) {
			return;
		}
		const redoData1 = redo.current.pop();

		undo.current.push(redoData1);

		handleSetBlockDataArr({
			blockDataArr: JSON.parse(redoData1.blockDataArr),
			history: false,
			undoSel: JSON.parse(redoData1.undoSel),
			redoSel: JSON.parse(redoData1.redoSel),
			selObj: JSON.parse(redoData1.redoSel),
		});
	};

	const handleOnCompositionEnd = ({ event, id }: { event: CompositionEvent<HTMLElement>; id: string }) => {
		if (!event || !event.currentTarget || !event.currentTarget.innerHTML) {
			return;
		}

		const selection = document.getSelection();
		if (selection.rangeCount === 0) {
			return;
		}
		const range = selection.getRangeAt(0);
		const rangeObj = getRangeObj(range);
		const textLength = event.data.length;
		const offset = rangeObj.startEl.startOffset - textLength;
		const _undoSel = {
			...rangeObj,
			startEl: { ...rangeObj.startEl, startOffset: offset },
			endEl: { ...rangeObj.endEl, endOffset: offset },
		};

		const undoSel = { ..._undoSel, displayInlineTune: false };
		const redoSel = { ...rangeObj, displayInlineTune: false };

		const selObj = redoSel;

		handleAddBlockData({ id, data: { text: event.currentTarget.innerHTML }, undoSel, redoSel, selObj });
	};

	// 	const handleContentEditableOnInput = ({ id, innerHTML, textContent }: { id: string; innerHTML: string; textContent: string }) => {
	// 		//
	// 		if (!innerHTML) {
	// 			return;
	// 		}
	//
	// 		const selection = document.getSelection();
	// 		if (selection.rangeCount === 0) {
	// 			return;
	// 		}
	// 		const range = selection.getRangeAt(0);
	// 		const rangeObj = getRangeObj(range);
	// 		const textLength = textContent.length;
	// 		const offset = rangeObj.startEl.startOffset - textLength;
	// 		const _undoSel = {
	// 			...rangeObj,
	// 			startEl: { ...rangeObj.startEl, startOffset: offset },
	// 			endEl: { ...rangeObj.endEl, endOffset: offset },
	// 		};
	//
	// 		const undoSel = { ..._undoSel, displayInlineTune: false };
	// 		const redoSel = { ...rangeObj, displayInlineTune: false };
	//
	// 		const selObj = redoSel;
	//
	// 		handleAddBlockData({ id, data: { text: innerHTML }, undoSel, redoSel, selObj });
	// 	};

	const handleContentEditableOnChange = ({ id, contentEl, undoSel: _undoSel }: { id: string; contentEl: Element; undoSel: InlineSelType }) => {
		//

		const selection = document.getSelection();
		if (selection.rangeCount === 0) {
			return;
		}
		const range = selection.getRangeAt(0);
		const rangeObj = getRangeObj(range);
		// const offset = rangeObj.startEl.startOffset - changedCount;
		// const _undoSel = {
		// 	...rangeObj,
		// 	startEl: { ...rangeObj.startEl, startOffset: offset },
		// 	endEl: { ...rangeObj.endEl, endOffset: offset },
		// };

		const undoSel = { ..._undoSel, displayInlineTune: false };
		const redoSel = { ...rangeObj, displayInlineTune: false };
		const selObj = redoSel;

		// const contentEl = document.getElementById(`${id}-${config.p1GlobalClassName.blockContent}`);
		contentEl.normalize();

		handleAddBlockData({ id, data: { text: contentEl.innerHTML }, undoSel, redoSel, selObj });
	};

	// 	const handleContentEditableOnChange = ({ id, beforeInlineSel }: { id: string; beforeInlineSel: InlineSelType }) => {
	// 		const selection = document.getSelection();
	// 		if (selection.rangeCount === 0) {
	// 			return;
	// 		}
	// 		const range = selection.getRangeAt(0);
	// 		const rangeObj = getRangeObj(range);
	//
	// 		const contentId = `${id}-${p1_globalClassName.current.blockContent}`;
	// 		const contentEl = document.getElementById(contentId);
	//
	// 		const undoSel = { ...beforeInlineSel, displayInlineTune: false };
	// 		const redoSel = { ...rangeObj, displayInlineTune: false };
	//
	// 		const selObj = redoSel;
	//
	// 		handleAddBlockData({ id, data: { text: contentEl.innerHTML }, undoSel, redoSel, selObj });
	// 	};

	const handleBlockSplit = ({ event, id }: { event: KeyboardEvent<HTMLElement>; id: string }) => {
		const eTarget = event.target;
		if (!(eTarget instanceof HTMLElement)) {
			return;
		}

		const originalElement = eTarget;

		const selection = document.getSelection();
		if (!selection || selection.rangeCount === 0) {
			return;
		}
		const range = selection.getRangeAt(0);
		const undoObj = getRangeObj(range);

		const clonedElement = originalElement.cloneNode(false) as HTMLDivElement;

		range.setEndAfter(originalElement.lastChild);
		clonedElement.appendChild(range.extractContents());

		const beforeHTML = originalElement.innerHTML;
		const afterHTML = clonedElement.innerHTML;

		const originalBlock = blockDataArr.find((d) => d.id === id);

		const _blockDataArr = [...blockDataArr];
		const beforeBlockIndex = _blockDataArr.findIndex((d) => d.id === id);
		const beforeBlock = _blockDataArr[beforeBlockIndex];

		if ("text" in beforeBlock.data) {
			beforeBlock.data.text = beforeHTML;
		}

		const newId = autoID(10);
		const afterBlock = { id: newId, type: originalBlock.type, data: { ...beforeBlock.data, text: afterHTML } };

		_blockDataArr.splice(beforeBlockIndex + 1, 0, afterBlock);

		const startEl = {
			path: [0],
			startOffset: 0,
		};

		const endEl = {
			path: [0],
			endOffset: 0,
		};

		const redoObj: InlineSelType = {
			blockId: newId,
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
		handleSetBlockDataArr({ blockDataArr: _blockDataArr, undoSel, redoSel, selObj });
	};
	const handleinsertLineBreak = ({ event, id }: { event: KeyboardEvent<HTMLElement>; id: string }) => {
		const eTarget = event.target;

		if (!(eTarget instanceof HTMLElement)) {
			return;
		}

		const selection = document.getSelection();
		if (!selection || selection.rangeCount === 0) {
			return;
		}
		const range = selection.getRangeAt(0);
		// const newRange = range.cloneRange();
		const _undoSel = getRangeObj(range);

		const textNode = document.createTextNode("\n");
		range.insertNode(textNode);

		// newRange.setStartAfter(textNode);
		// newRange.setEndAfter(textNode);

		// selection.removeAllRanges();
		// selection.addRange(newRange);

		// newRange.setStartAfter(range.endContainer);
		// newRange.setEndAfter(range.endContainer);
		// selection.removeAllRanges();
		// console.log("newRange : ", newRange);

		const _redoSel = {
			..._undoSel,
			startEl: { ..._undoSel.startEl, startOffset: _undoSel.startEl.startOffset + 1 },
			endEl: { ..._undoSel.endEl, endOffset: _undoSel.endEl.endOffset + 1 },
		};
		// console.log("_redoSel : ", _redoSel);
		// 		const startContainer = range.startContainer;
		//
		// 		const startPos = range.startOffset;
		// 		const endPos = range.endOffset;
		//
		// 		const newRange = document.createRange();
		// 		const brElement = document.createElement("br");
		//
		// 		if (startContainer.nodeType === Node.TEXT_NODE) {
		// 			//改行位置がテキストの途中だった場合
		// 			const textContent = startContainer.nodeValue;
		//
		// 			const beforeText = textContent.substring(0, startPos);
		// 			const afterText = textContent.substring(endPos);
		//
		// 			const beforeTextNode = document.createTextNode(beforeText);
		// 			const afterTextNode = document.createTextNode(afterText);
		//
		// 			const parentElement = startContainer.parentElement;
		//
		// 			const startContainerIndex = Array.from(parentElement.childNodes).indexOf(startContainer as Element);
		//
		// 			let caretIndex = 1;
		//
		// 			if (startPos === 0) {
		// 				//改行位置がテキストの最初だった場合
		// 				parentElement.replaceChild(afterTextNode, startContainer);
		// 				parentElement.insertBefore(brElement, afterTextNode);
		// 				caretIndex = startContainerIndex + 1;
		// 			} else if (startPos === textContent.length) {
		// 				//改行位置がテキストの最後だった場合
		// 				parentElement.replaceChild(brElement, startContainer);
		// 				parentElement.insertBefore(beforeTextNode, brElement);
		// 				caretIndex = startContainerIndex + 2;
		// 			} else {
		// 				//改行位置がテキストの途中だった場合
		// 				parentElement.replaceChild(afterTextNode, startContainer);
		// 				parentElement.insertBefore(brElement, afterTextNode);
		// 				parentElement.insertBefore(beforeTextNode, brElement);
		// 				caretIndex = startContainerIndex + 2;
		// 			}
		//
		// 			const brParentEl = brElement.parentElement;
		// 			const brIndex = Array.from(brParentEl.childNodes).findIndex((child) => child === brElement);
		//
		// 			newRange.setStart(parentElement, getEffectiveOffset(parentElement, caretIndex));
		// 			newRange.setEnd(parentElement, getEffectiveOffset(parentElement, caretIndex));
		//
		// 			newRange.collapse(true);
		//
		// 			selection.removeAllRanges();
		// 			selection.addRange(newRange);
		// 		} else {
		// 			//改行位置がテキストの前、後、など<br>を追加するだけの場合
		// 			startContainer.insertBefore(brElement, (startContainer as Element).childNodes[startPos]);
		// 			newRange.setStart(startContainer, startPos + 1);
		// 			newRange.setEnd(startContainer, startPos + 1);
		//
		// 			newRange.collapse(true);
		// 		}
		//
		// 		const _redoSel = getRangeObj(newRange);

		const undoSel = { ..._undoSel, displayInlineTune: false };
		const redoSel = { ..._redoSel, displayInlineTune: false };
		const selObj = redoSel;

		const content = eTarget.innerHTML;
		handleAddBlockData({ id, data: { text: content }, undoSel, redoSel, selObj });
	};

	// 	const handleinsertLineBreak = ({ event, id }: { event: KeyboardEvent<HTMLElement>; id: string }) => {
	// 		const eTarget = event.target;
	//
	// 		if (!(eTarget instanceof HTMLElement)) {
	// 			return;
	// 		}
	//
	// 		const selection = document.getSelection();
	// 		if (!selection || selection.rangeCount === 0) {
	// 			return;
	// 		}
	// 		const range = selection.getRangeAt(0);
	// 		const _undoSel = getRangeObj(range);
	// 		const startContainer = range.startContainer;
	//
	// 		const startPos = range.startOffset;
	// 		const endPos = range.endOffset;
	//
	// 		const newRange = document.createRange();
	// 		const brElement = document.createElement("br");
	//
	// 		if (startContainer.nodeType === Node.TEXT_NODE) {
	// 			//改行位置がテキストの途中だった場合
	// 			const textContent = startContainer.nodeValue;
	//
	// 			const beforeText = textContent.substring(0, startPos);
	// 			const afterText = textContent.substring(endPos);
	//
	// 			const beforeTextNode = document.createTextNode(beforeText);
	// 			const afterTextNode = document.createTextNode(afterText);
	//
	// 			const parentElement = startContainer.parentElement;
	//
	// 			const startContainerIndex = Array.from(parentElement.childNodes).indexOf(startContainer as Element);
	//
	// 			let caretIndex = 1;
	//
	// 			if (startPos === 0) {
	// 				//改行位置がテキストの最初だった場合
	// 				parentElement.replaceChild(afterTextNode, startContainer);
	// 				parentElement.insertBefore(brElement, afterTextNode);
	// 				caretIndex = startContainerIndex + 1;
	// 			} else if (startPos === textContent.length) {
	// 				//改行位置がテキストの最後だった場合
	// 				parentElement.replaceChild(brElement, startContainer);
	// 				parentElement.insertBefore(beforeTextNode, brElement);
	// 				caretIndex = startContainerIndex + 2;
	// 			} else {
	// 				//改行位置がテキストの途中だった場合
	// 				parentElement.replaceChild(afterTextNode, startContainer);
	// 				parentElement.insertBefore(brElement, afterTextNode);
	// 				parentElement.insertBefore(beforeTextNode, brElement);
	// 				caretIndex = startContainerIndex + 2;
	// 			}
	//
	// 			const brParentEl = brElement.parentElement;
	// 			const brIndex = Array.from(brParentEl.childNodes).findIndex((child) => child === brElement);
	//
	// 			newRange.setStart(parentElement, getEffectiveOffset(parentElement, caretIndex));
	// 			newRange.setEnd(parentElement, getEffectiveOffset(parentElement, caretIndex));
	//
	// 			newRange.collapse(true);
	//
	// 			selection.removeAllRanges();
	// 			selection.addRange(newRange);
	// 		} else {
	// 			//改行位置がテキストの前、後、など<br>を追加するだけの場合
	// 			startContainer.insertBefore(brElement, (startContainer as Element).childNodes[startPos]);
	// 			newRange.setStart(startContainer, startPos + 1);
	// 			newRange.setEnd(startContainer, startPos + 1);
	//
	// 			newRange.collapse(true);
	// 		}
	//
	// 		const _redoSel = getRangeObj(newRange);
	//
	// 		const undoSel = { ..._undoSel, displayInlineTune: false };
	// 		const redoSel = { ..._redoSel, displayInlineTune: false };
	// 		const selObj = redoSel;
	//
	// 		const content = eTarget.innerHTML;
	// 		handleAddBlockData({ id, data: { text: content }, undoSel, redoSel, selObj });
	// 	};

	const handleTuneBlocks = ({ beforeBlockId, afterBlockType }: { beforeBlockId: string; afterBlockType: string }) => {
		const _defaultBlockData = config.blockTools.find((d) => d.id === afterBlockType);
		const beforeBlockIndex = blockDataArr.findIndex((d) => d.id === beforeBlockId);
		const beforeBlock = blockDataArr[beforeBlockIndex];

		if (!_defaultBlockData || !beforeBlock) {
			return;
		}
		const defaultBlockData = _defaultBlockData.defaultData;

		if (!("text" in defaultBlockData) || !("text" in beforeBlock.data)) {
			return;
		}

		const afterBlockData = {
			...beforeBlock,
			type: afterBlockType,
			data: { ...defaultBlockData, text: beforeBlock.data.text },
		};

		const nBlockData = blockDataArr.map((d) => (d.id === beforeBlockId ? afterBlockData : d));
		handleSetBlockDataArr({ blockDataArr: nBlockData });
	};

	return {
		containerRef,
		blockDataArr,
		// setBlockDataArr,
		handleSetBlockDataArr,
		// handleSetBlockDataArr,
		blockTools: blockTools.current,
		inlineTools: inlineTools.current,
		p1_globalClassName: p1_globalClassName.current,
		readOnly,
		setReadOnly,
		handleAddBlockData,
		sanitizeBlockdata,
		// handleSetBlockData,
		// setBlockDataOnInput,
		getPureBlockData,
		// mergeBlockData,
		reorderBlock,
		duplicateBlock,
		handleAlignChange,
		findParentWithClassNameAndPath,
		getRangeElement,
		getElementFromParentUsingPath,
		// getElementWithClassNameForRange,
		addNewBlock,
		findNode,
		inlineSel,
		caretPos,
		// setInlineSel,
		// inlineSelDebounced,
		inlineSubPalette,
		setInlineSubPalette,
		handleOnCompositionEnd,
		handleContentEditableOnChange,
		handleBlockSplit,
		handleinsertLineBreak,
		handleDeleteInlineStyle,
		handleTuneBlocks,
		hideInlineSel,
		getCaretRelativePositionToContent,
		// handleSelectionChange,
		// inlineActiveClassName,
		// setInlineActiveClassName,
		// unwrapInlineTags,
		updateInlineClassName,
		// savedSelectionRef,
		getRangeObj,
		submitInlineTune,
		handleOnPaste,
		// findElementWithId,
		handleUndo,
		handleRedo,
		viewGrid,
		setViewGrid,
		// undoTest,
		// scroll,
		autoSave,
	};
};
