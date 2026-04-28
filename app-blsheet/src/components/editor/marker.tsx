import { FaCaretDown } from "react-icons/fa";

interface MarkerProsp {
  position: number;
  isLeft: boolean;
  isDragging: boolean;
  onMouseDown: () => void;
  onDoubleClick: () => void;
}

const Marker = ({
  isLeft,
  position,
  onDoubleClick,
  onMouseDown,
  isDragging,
}: MarkerProsp) => {
  return (
    <div
      className="absolute top-0 w-4 h-full cursor-ew-resize z-[5] group -ml-2"
      style={{ [isLeft ? "left" : "right"]: `${position}px` }}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
    >
      <FaCaretDown className="size-4 absolute left-1/2 top-0 h-full fill-primary transform -translate-x-1/2" />
      <div
        className="absolute left-1/2 top-4 bg-primary transform -translate-x-1/2 transition-opacity duration-150"
        style={{
          height: "100vh",
          width: "1px",
          transform: "scaleX(0.5)",
          display: isDragging ? "block" : "none",
        }}
      />
    </div>
  );
};

export default Marker;
