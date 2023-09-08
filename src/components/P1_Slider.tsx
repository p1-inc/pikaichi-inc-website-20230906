/** @jsxImportSource @emotion/react */

import { useState, useEffect } from "react";

import { css } from "@emotion/react";
import { MediaLib,  } from "../types/types";
import { UnstyledButton } from "@mantine/core";

type Props = {
	images: MediaLib[];
	startCount?: number;
	thumb?: Boolean;
	width?: string;
	maxWidth?: string;
};

export default function P1_Slider({ images = [], startCount = 0, thumb = false, width = "100%", maxWidth = "100%" }: Props) {
	//
	const [imagesArr, setImagesArr] = useState<MediaLib[]>([]);

	const thumbWidth = 10; //サムネールのサイズ

	//最後の画像番号を定義しておく、４つの画像だった場合3になる
	const lastImageNum = imagesArr.length - 1;
	//画像配列の数
	const imageLength = imagesArr.length;

	const [slideCount, setSlideCount] = useState(startCount); //スライドのカウント
	const [indicatorCount, setIndicatorCount] = useState(0); //真ん中のインジケーターのカウント
	const [indicatorWidth, setIndicatorWidth] = useState("50%"); //真ん中のインジケーターの総幅（数が少ないとき調整する）

	const [toggleSlideInterval, setToggleSlideInterval] = useState<boolean>(false);



	useEffect(() => {
		const newArr = [...images];
		const last = newArr.pop();
		newArr.unshift(last);

		setImagesArr(newArr);
	}, [images]);

	const slideRight = () => {
		setSlideCount(slideCount + 1);
		setIndicatorCount(indicatorCount !== lastImageNum ? indicatorCount + 1 : 0);
		setToggleSlideInterval(!toggleSlideInterval);
	};

	const slideLeft = () => {
		setSlideCount(slideCount - 1);
		setIndicatorCount(indicatorCount !== 0 ? indicatorCount - 1 : lastImageNum);
	};

	useEffect(() => {
		const interval = setInterval(slideRight, 5000);
		return () => clearInterval(interval);
	}, [toggleSlideInterval]);

	const topview = css`
        label: topview;
        width: ${width};
        max-width: ${maxWidth};
        margin: 0 auto;
        position: relative;
        overflow: hidden;
    `;

	const viewWrapper = css`
        label: viewWrapper;
        position: relative;
        top: 0;
        left: 0;
		width:100%;
        height: 50vw;
        transition: 0.3s;
        @media (max-width: 699px) {
            height: 65vw;
        }
        @media (max-width: 499px) {
            height: 80vw;
        }
    `;

	const imageWrapper = css`
        label: imageWrapper;
        position: relative;
        top: 0;
        left: -100vw;	
		width:100%;
        height: 100%;
        transition: 0.3s;
    `;

	const inner = css``;

	const arrow = css`
        label: arrow;
        position: absolute;
        top: 50%;
        opacity: 0.6;
        width: 2rem;
        height: 3rem;
        transition: 0.1s;
        overflow: hidden;

        &:hover {
            opacity: 0.3;
        }
    `;

	const arrowLeft = css`
        label: arrowLeft;
        left: 0.5rem;
    `;

	const arrowRight = css`
        label: arrowRight;
        right: 0.5rem;
        transform: rotate(180deg);
    `;

	const indi = css`
        label: indi;
        position: absolute;
        left: 50%;
        bottom: 1rem;
        transform: translateX(-50%);
        opacity: 0.6;
        width: min(${5 * imagesArr.length}rem, 50%);
        overflow: hidden;
    `;

	const thumbCss = css`
        label: thumbCss;
        position: relative;
        width: ${imagesArr.length * thumbWidth}vw;
        height: 10rem;
        margin: 0 auto;
        margin-top: 1rem;
    `;

	const imgCoverStyle = css`
        width: 100%;
        height: 100%;
        object-fit: cover;
    `;

	const imgContainStyle = css`
        width: 100%;
        height: 100%;
        object-fit: contain;
    `;

	return (
		<>
			<section css={topview}>

				<div css={viewWrapper}>
					<div css={imageWrapper}>
						{imagesArr.map((image, index) => {
						
							const count = slideCount % imageLength;
							let leftVal = 100 * index + count * -100;
							if (leftVal < 0) {
								//左にはみ出た場合
								leftVal = leftVal + imageLength * 100;
							}
							if (leftVal > (imageLength - 1) * 100) {
								//右にはみ出た場合
								leftVal = leftVal - imageLength * 100;
							}
							let zIndex = 0; //z-index
							if (leftVal === 0 || leftVal === imageLength - 1) zIndex = -1;
					

							return (
								<li
									css={css`
                                        position: absolute;
                                        top: 0;
                                        left: ${leftVal}vw;
                                        width: 100%;
                                        height: 100%;
                                        transition: 0.3s;
                                        z-index: ${zIndex};
                                    `}
									key={image.id}
								>
									<img
										css={imgCoverStyle}
										src={image.src}
									
										alt="イメージ画像"
									/>
								</li>
							);
						})}
					</div>

					<UnstyledButton css={[arrowLeft, arrow]} onClick={slideLeft}>
						{/* <img css={imgContainStyle} src="/img/arrow.svg" alt="矢印左" /> */}
					</UnstyledButton>

					<UnstyledButton css={[arrowRight, arrow]} onClick={slideRight}>
						{/* <img css={imgContainStyle} src="/img/arrow.svg" alt="矢印右" /> */}
					</UnstyledButton>

					<div css={indi}>
						{imagesArr.map((indi, index) => {
							if (!indi) {
								return;
							}
							const fill = index === indicatorCount ? "#FFF " : "transparent";
							const widthSize = 100 / imagesArr.length - 2;
							return (
								<li
									key={indi.id}
									css={css`
                                        display: inline-block;
                                        width: min(5rem, ${widthSize}%);
                                        height: 0.5rem;
                                        border: 1px solid #fff;
                                        border-radius: 0.15rem;
                                        margin-right: 2%;
                                        transition: all 0.5s;
                                        background-color: ${fill};
                                    `}
								/>
							);
						})}
					</div>
				</div>

				{/* {thumb && (
					<div css={thumbCss}>
						{imagesArr.map((image, index) => {
							const count = slideCount % imageLength;
							let leftVal = thumbWidth * index + count * -thumbWidth;
							if (leftVal < 0) {
								//左にはみ出た場合
								leftVal = leftVal + imageLength * thumbWidth;
							}
							if (leftVal > (imageLength - 1) * thumbWidth) {
								//右にはみ出た場合
								leftVal = leftVal - imageLength * thumbWidth;
							}
							let zIndex = 0; //z-index
							if (leftVal === 0 || leftVal === imageLength - 1) zIndex = -100000;
							return (
								<li
									css={css`
                                        position: absolute;
                                        top: 0;
                                        left: ${leftVal}vw;
                                        width: ${thumbWidth}vw;
                                        height: ${thumbWidth}vw;
                                        transition: 0.3s;
                                        z-index: ${zIndex};
                                    `}
									key={image.id}
								>
									<img css={imgCoverStyle} src={image.src} alt="イメージ画像" />
								</li>
							);
						})}
					</div>
				)} */}
			</section>
		</>
	);
}
