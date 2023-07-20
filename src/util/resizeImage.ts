import { loginFunc } from "./../firebase/firebaseAuth";
//
type resType = { fileName: string; width: number; height: number; blob: Blob };

export const longBound = [600, 1200]; //長辺の種類
export const longBoundStr = ["low", "high"];

export const resizeImage = async (
	_mediaArr: File[],
	nLongBound = longBound, //長辺の種類
): Promise<{ fileName: string; width: number; height: number; blob: Blob }[]> => {
	//

	//type確認　、svgとicoは分ける。image以外を除く
	const imgSVG: File[] = [];
	const imgICO = [];

	const imgArr = _mediaArr.filter((media) => {
		const mType = media.type;
		const isImageType = mType.match(/^image\//);
		const isSVGType = mType.match(/^image\/svg\+xml/);
		const isIcoType = mType.match(/^image\/vnd\.microsoft\.icon/);

		if (isSVGType) {
			imgSVG.push(media);
			return false;
		} else if (isIcoType) {
			imgICO.push(media);
		} else if (isImageType) {
			return true;
		} else {
			false;
		}
	});
	const promise_img = await convertIMG(imgArr, nLongBound);
	const promise_SVG = await convertSVG(imgSVG, nLongBound);

	const allPromise = [...promise_img, ...promise_SVG];
	try {
		const resizeImages: { fileName: string; width: number; height: number; blob: Blob }[] = await Promise.all(
			allPromise,
		);

		return resizeImages;
	} catch (error) {
		console.log(error);
		return null;
	}
};

const convertImageObject = async (mediaArr: File[]) => {
	let result;
	const promises: Promise<unknown>[] = [];
	mediaArr.forEach((media) => {
		// 画像のサイズを取得
		const image = new Promise((resolve, reject) => {
			const image = new Image();
			image.addEventListener("load", () => resolve(image));
			image.addEventListener("error", () => resolve(null));
			image.src = URL.createObjectURL(media);
			image.id = media.name.replace(/\.[^.]*$/, "");
		});
		promises.push(image);
	});

	try {
		result = await Promise.all(promises);
	} catch (error) {
		console.log(error);
		return [];
	}

	return result;
};

export const convertIMG = async (mediaArr: File[], longBound: number[]) => {
	// const promise1 = [];

	const promise2: resType[] = [];

	const _images = (await convertImageObject(mediaArr)) as HTMLImageElement[];

	if (_images.includes(null)) {
		return [];
	}

	_images.forEach((image) => {
		//
		if (!image) {
			return;
		}

		const { naturalHeight: bHeight, naturalWidth: bWidth } = image;

		const natulalLongBound = Math.max(bHeight, bWidth);
		const nLowBound = longBound[0] < natulalLongBound ? longBound[0] : natulalLongBound;
		const nHighBound = longBound[1] < natulalLongBound ? longBound[1] : natulalLongBound;

		const nLongBound = [nLowBound, nHighBound];

		const context = nLongBound.map((bound, index) => {
			const context = document.createElement("canvas").getContext("2d");
			if (context == null) {
				return null;
			}
			const type = index === 0 ? longBoundStr[0] : longBoundStr[1];

			return {
				longBound: bound,
				context: context,
				type: type,
			};
		});

		const tmpContext: resType[] = [];
		context.forEach((cTxt) => {
			let aWidth: number;
			let aHeight: number;

			if (bWidth < cTxt.longBound || bHeight < cTxt.longBound) {
				aWidth = bWidth;
				aHeight = bHeight;
			} else {
				if (bWidth > bHeight) {
					aWidth = cTxt.longBound;
					aHeight = Math.floor(bHeight * (aWidth / bWidth));
				} else {
					aHeight = cTxt.longBound;
					aWidth = Math.floor(bWidth * (aHeight / bHeight));
				}
			}

			// Canvas 上に描画
			cTxt.context.canvas.width = aWidth;
			cTxt.context.canvas.height = aHeight;
			cTxt.context.drawImage(image, 0, 0, bWidth, bHeight, 0, 0, aWidth, aHeight);

			// JPEGデータにして返す
			const blobImage = new Promise<resType>((resolve) => {
				const cType = cTxt.type === longBoundStr[0] ? "png" : "webp";
				const getBlob = (blob: Blob) => {
					// const bo = cTxt.longBound;
					// const fName = `${image.id}_${bo}✕${bo}.${cType}`;
					const fName = `${image.id}__${cTxt.type}__.${cType}`;

					resolve({ fileName: fName, width: aWidth, height: aHeight, blob: blob });
				};
				cTxt.context.canvas.toBlob(getBlob, `image/${cType}`, 0.9);
			});

			tmpContext.push(blobImage as unknown as resType);
		});
		promise2.push(...tmpContext);
	});

	return [...promise2];
};

export const convertSVG = async (mediaArr: File[], longBound: number[]) => {
	const promise2: resType[] = [];

	const _images = (await convertImageObject(mediaArr)) as HTMLImageElement[];

	if (_images.includes(null)) {
		return [];
	}

	_images.forEach((image, gid, arr) => {
		//
		if (!image) {
			return;
		}
		const context = longBound.map((bound, index) => {
			const context = document.createElement("canvas").getContext("2d");
			if (context == null) {
				return null;
			}
			if (index === 0) {
				return {
					longBound: bound,
					context: context,
					type: longBoundStr[0],
					name: null,
					size: null,
					arrayBuffer: null,
					slice: null,
					stream: null,
					text: null,
				};
			} else {
				return mediaArr[gid];
			}
		});

		const { naturalHeight: bHeight, naturalWidth: bWidth } = image;

		const tmpContext: resType[] = [];
		context.forEach((cTxt) => {
			let aWidth: number;
			let aHeight: number;

			if (cTxt?.type === longBoundStr[0] && "longBound" in cTxt) {
				//lowはpng変換、highはsvgのままにする分岐
				if (bWidth < cTxt.longBound || bHeight < cTxt.longBound) {
					aWidth = bWidth;
					aHeight = bHeight;
				} else {
					if (bWidth > bHeight) {
						aWidth = cTxt.longBound;
						aHeight = Math.floor(bHeight * (aWidth / bWidth));
					} else {
						aHeight = cTxt.longBound;
						aWidth = Math.floor(bWidth * (aHeight / bHeight));
					}
				}

				// Canvas 上に描画
				cTxt.context.canvas.width = aWidth;
				cTxt.context.canvas.height = aHeight;
				cTxt.context.drawImage(image, 0, 0, bWidth, bHeight, 0, 0, aWidth, aHeight);

				// JPEGデータにして返す
				const blobImage = new Promise((resolve) => {
					const cType = cTxt.type === longBoundStr[0] ? "png" : "webp";
					const getBlob = (blob: Blob) => {
						const bo = cTxt.longBound;
						const fName = `${image.id}__${cTxt.type}__.${cType}`;
						resolve({ fileName: fName, width: aWidth, height: aHeight, blob: blob });
					};
					cTxt.context.canvas.toBlob(getBlob, `image/${cType}`, 0.9);
				});

				tmpContext.push(blobImage as unknown as resType);
			} else if (cTxt?.type === "image/svg+xml") {
				const res = new Promise((resolve, reject) => {
					const fileReader = new FileReader();
					fileReader.onload = () => {
						const fRes = fileReader.result;
						let vBox: string[];

						if (typeof fRes === "string") {
							vBox = fRes.match(/viewBox=".+?"/)[0].match(/\".+\"/)[0].replace(/\"/g, "").split(" ");
						}

						let w = vBox?.[2];
						let h = vBox?.[3];
						if (w === undefined && !w?.match(/[+-]?[0-9]+(?:\.[0-9]+)?/)) {
							w = "100";
						}
						if (h === undefined && !h?.match(/[+-]?[0-9]+(?:\.[0-9]+)?/)) {
							h = "100";
						}
						// const vBox=fileReader.result.match(/viewBox=".+"/)

						const _fName = cTxt.name.replace(/\.svg$/, "");
						const fName = `${_fName}__high__.svg`;
						const tmp = {
							fileName: fName,
							width: Number(w),
							height: Number(h),
							blob: new Blob([fRes], { type: "image/svg+xml" }),
						};

						resolve(tmp);
					};

					fileReader.readAsText(cTxt as File);
				});

				tmpContext.push(res as unknown as resType);
			}
		});
		promise2.push(...tmpContext);
	});

	return [...promise2];
};

// export const convertICO = async (
//     typeIcoArr
// ): Promise<{ fileName: string; width: string; height: string; blob: Blob }[]> => {
//     //type確認　svg以外は除く
//     const mediaArr = typeIcoArr.filter((media) => {
//         const mType = media.type;
//         const isIcoType = mType.match(/^image\/vnd\.microsoft\.icon/);
//         if (isIcoType) {
//             return true;
//         } else {
//             return false;
//         }
//     });
//
//     let promises = [];
//
//     let context = longBound.map((bound, index) => {});
//
//     mediaArr.forEach((media) => {
//         const lowPromise = new Promise((resolve, reject) => {
//             const fileReader = new FileReader();
//             fileReader.onload = () => {
//                 const fRes = fileReader.result;
//                 let vBox;
//
//                 const _fName = media.name.replace(/\.ico$/, "");
//                 const fName = `${_fName}__low__.png`;
//                 const tmp = {
//                     fileName: fName,
//                     width: 256,
//                     height: 256,
//                     blob: new Blob([fRes], { type: "image/png" }),
//                 };
//                 resolve(tmp);
//             };
//             fileReader.readAsText(media);
//         });
//
//         const highPromise = new Promise((resolve, reject) => {
//             const fileReader = new FileReader();
//             fileReader.onload = () => {
//                 const fRes = fileReader.result;
//                 let vBox;
//
//                 const _fName = media.name.replace(/\.ico$/, "");
//                 const fName = `${_fName}__high__.ico`;
//                 const tmp = {
//                     fileName: fName,
//                     width: 256,
//                     height: 256,
//                     blob: new Blob([fRes], { type: "image/vnd.microsoft.icon" }),
//                 };
//                 resolve(tmp);
//             };
//             fileReader.readAsText(media);
//         });
//
//         promises.push(lowPromise);
//         promises.push(highPromise);
//     });
//
//     return promises;
// };

// export const convertICO3 = async (mediaArr, longBound) => {
//     const promise1 = [];
//     const promise2 = [];
//
//     mediaArr.forEach((media) => {
//         // 画像のサイズを取得
//         const image = new Promise((resolve, reject) => {
//             const image = new Image();
//             image.addEventListener("load", () => resolve(image));
//             image.addEventListener("error", reject);
//             image.src = URL.createObjectURL(media);
//             image.id = media.name.replace(/\.[^.]*$/, "");
//         });
//         promise1.push(image);
//     });
//
//     let _images;
//     try {
//         _images = await Promise.all(promise1);
//     } catch (error) {
//         console.log(error);
//         return null;
//     }
//
//     console.log(_images);
//
//     // const _images = await convertImageObject(mediaArr);
//
//     // if (_images.includes(null)) {
//     //     return [];
//     // }
//
//     _images.forEach((image, gid, arr) => {
//         //
//         if (!image) {
//             return;
//         }
//
//         let context = longBound.map((bound, index) => {
//             const context = document.createElement("canvas").getContext("2d");
//             if (context == null) {
//                 return null;
//             }
//             if (index === 0) {
//                 return {
//                     longBound: bound,
//                     context: context,
//                     type: longBoundStr[0],
//                 };
//             } else {
//                 return mediaArr[gid];
//             }
//         });
//
//         const { naturalHeight: bHeight, naturalWidth: bWidth } = image;
//
//         context.forEach((cTxt) => {
//             let aWidth: number;
//             let aHeight: number;
//
//             if (cTxt.type === longBoundStr[0]) {
//                 //lowはpng変換、highはsvgのままにする分岐
//                 if (bWidth < cTxt.longBound || bHeight < cTxt.longBound) {
//                     aWidth = bWidth;
//                     aHeight = bHeight;
//                 } else {
//                     if (bWidth > bHeight) {
//                         aWidth = cTxt.longBound;
//                         aHeight = Math.floor(bHeight * (aWidth / bWidth));
//                     } else {
//                         aHeight = cTxt.longBound;
//                         aWidth = Math.floor(bWidth * (aHeight / bHeight));
//                     }
//                 }
//
//                 // Canvas 上に描画
//                 cTxt.context.canvas.width = aWidth;
//                 cTxt.context.canvas.height = aHeight;
//                 cTxt.context.drawImage(image, 0, 0, bWidth, bHeight, 0, 0, aWidth, aHeight);
//
//                 // JPEGデータにして返す
//                 const blobImage = new Promise((resolve) => {
//                     const cType = cTxt.type === longBoundStr[0] ? "png" : "webp";
//                     const getBlob = (blob) => {
//                         const bo = cTxt.longBound;
//                         // const fName = `${image.id}_${bo}✕${bo}.${cType}`;
//                         const fName = `${image.id}__${cTxt.type}__.${cType}`;
//                         resolve({ fileName: fName, width: aWidth, height: aHeight, blob: blob });
//                     };
//                     cTxt.context.canvas.toBlob(getBlob, `image/${cType}`, 0.9);
//                 });
//                 promise2.push(blobImage);
//             } else if (cTxt.type === "image/vnd.microsoft.icon") {
//                 const res = new Promise((resolve, reject) => {
//                     const fileReader = new FileReader();
//                     fileReader.onload = () => {
//                         const fRes = fileReader.result;
//
//                         const _fName = cTxt.name.replace(/\.ico$/, "");
//                         const fName = `${_fName}__high__.ico`;
//
//                         const tmp = {
//                             fileName: fName,
//                             width: 256,
//                             height: 256,
//                             blob: new Blob([fRes], { type: "image/vnd.microsoft.icon" }),
//                         };
//
//                         resolve(tmp);
//                     };
//                     // fileReader.readAsDataURL(image);
//                     fileReader.readAsText(cTxt);
//                 });
//
//                 promise2.push(res);
//             }
//         });
//     });
//
//     return promise2;
// };

// export const convertSVG2 = async (
//     typeSVGArr
// ): Promise<{ fileName: string; width: string; height: string; blob: Blob }[]> => {
//     //type確認　svg以外は除く
//     const mediaArr = typeSVGArr.filter((media) => {
//         const mType = media.type;
//         const isSVGType = mType.match(/^image\/svg\+xml/);
//         if (isSVGType) {
//             return true;
//         } else {
//             return false;
//         }
//     });
//
//     let promises = [];
//     mediaArr.forEach((media) => {
//         const res = new Promise((resolve, reject) => {
//             const fileReader = new FileReader();
//             fileReader.onload = () => {
//                 const fRes = fileReader.result;
//                 let vBox;
//
//                 if (typeof fRes === "string") {
//                     vBox = fRes
//                         .match(/viewBox=".+?"/)[0]
//                         .match(/\".+\"/)[0]
//                         .replace(/\"/g, "")
//                         .split(" ");
//                 }
//
//                 let w = vBox?.[2];
//                 let h = vBox?.[3];
//                 if (w === undefined && !w?.match(/[+-]?[0-9]+(?:\.[0-9]+)?/)) {
//                     w = 100;
//                 }
//                 if (h === undefined && !h?.match(/[+-]?[0-9]+(?:\.[0-9]+)?/)) {
//                     h = 100;
//                 }
//                 // const vBox=fileReader.result.match(/viewBox=".+"/)
//                 const tmp = {
//                     fileName: media.name,
//                     width: w,
//                     height: h,
//                     blob: new Blob([fRes], { type: "image/svg+xml" }),
//                 };
//                 resolve(tmp);
//             };
//             // fileReader.readAsDataURL(media);
//             fileReader.readAsText(media);
//         });
//
//         promises.push(res);
//     });
//
//     const result = Promise.all(promises);
//     return result;
// };
//
// export const convertIco2 = async (
//     typeIcoArr
// ): Promise<{ fileName: string; width: string; height: string; blob: Blob }[]> => {
//     //type確認　svg以外は除く
//     const mediaArr = typeIcoArr.filter((media) => {
//         const mType = media.type;
//         const isIcoType = mType.match(/^image\/vnd\.microsoft\.icon/);
//         if (isIcoType) {
//             return true;
//         } else {
//             return false;
//         }
//     });
//
//     let promises = [];
//     mediaArr.forEach((media) => {
//         const res = new Promise((resolve, reject) => {
//             const fileReader = new FileReader();
//             fileReader.onload = () => {
//                 const fRes = fileReader.result;
//                 let vBox;
//
//                 // const vBox=fileReader.result.match(/viewBox=".+"/)
//                 const tmp = {
//                     fileName: media.name,
//                     width: 256,
//                     height: 256,
//                     blob: new Blob([fRes], { type: "image/vnd.microsoft.icon" }),
//                 };
//                 resolve(tmp);
//             };
//             fileReader.readAsText(media);
//         });
//
//         promises.push(res);
//     });
//
//     const result = Promise.all(promises);
//     return result;
// };
