export const BranchSVG = ({ width = "100%", height = "100%", color = "rgb(84,85,84)", rotate = "0" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 15 21">
            <rect fill={color} width="2" height="21" />
            <rect fill={color} y="9.2" width="15" height="2" />
        </svg>
    );
};
