import { useRef, useState } from "react";

import Marker from "./marker";
import { useEditorContext } from "./editor-provider";

const markers = Array.from({ length: 83 }, (_, i) => i);

const Ruler = () => {
  const { leftMargin, setLeftMargin, rightMargin, setRightMargin } =
    useEditorContext();

  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);
  const rulerRef = useRef<HTMLDivElement>(null);

  const handleLeftMouseDown = () => setIsDraggingLeft(true);
  const handleRightMouseDown = () => setIsDraggingRight(true);

  const handleMouseMove = (e: React.MouseEvent) => {
    const PAGE_WIDTH = 816;
    const SPACE_WIDTH = 100;
    if (isDraggingLeft || (isDraggingRight && rulerRef.current)) {
      const container = rulerRef.current?.querySelector("#ruler-container");
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const relativeX = e.clientX - containerRect.left;
        const rowPosition = Math.max(0, Math.min(PAGE_WIDTH, relativeX));

        if (isDraggingLeft) {
          const maxLeftPosition = PAGE_WIDTH - rightMargin - SPACE_WIDTH;
          const newLeftPosition = Math.min(rowPosition, maxLeftPosition);
          setLeftMargin(newLeftPosition);
        } else {
          const maxRightPosition = PAGE_WIDTH - (leftMargin + SPACE_WIDTH);
          const newRightPosition = Math.max(PAGE_WIDTH - rowPosition, 0);
          const constrainedRightPosition = Math.min(
            newRightPosition,
            maxRightPosition
          );
          setRightMargin(constrainedRightPosition);
        }
      }
    }
  };

  const handleMouseUp = () => {
    setIsDraggingLeft(false);
    setIsDraggingRight(false);
  };

  const handleLeftDoubleClick = () => {
    setLeftMargin(56);
  };

  const handleRightDoubleClick = () => {
    setRightMargin(56);
  };

  return (
    <div
      ref={rulerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="h-6 border-b hidden xl:flex max-w-[816px] mx-auto  border-muted-foreground items-end relative select-none print:hidden"
    >
      <div className="w-full h-full relative" id="ruler-container">
        <Marker
          position={leftMargin}
          isLeft={true}
          onDoubleClick={handleLeftDoubleClick}
          onMouseDown={handleLeftMouseDown}
          isDragging={isDraggingLeft}
        />
        <Marker
          position={rightMargin}
          isLeft={false}
          onDoubleClick={handleRightDoubleClick}
          onMouseDown={handleRightMouseDown}
          isDragging={isDraggingRight}
        />
        <div className="absolute inset-x-0 bottom-0 h-full ">
          <div className="relative h-full w-[816px]">
            {markers.map((marker) => {
              const position = (marker * 816) / 82;
              return (
                <div
                  key={marker}
                  className="absolute bottom-0"
                  style={{ left: `${position}px` }}
                >
                  {marker % 10 === 0 && (
                    <>
                      <div className="absolute bottom-0 w-[1px] h-2.5 bg-muted-foreground" />
                      <span className="absolute bottom-2.5 text-[10px] text-muted-foreground -translate-x-1/2">
                        {marker / 10 + 1}
                      </span>
                    </>
                  )}

                  {marker % 5 === 0 && marker % 10 !== 0 && (
                    <>
                      <div className="absolute bottom-0 w-[1px] h-2 bg-muted-foreground" />
                    </>
                  )}

                  {marker % 5 !== 0 && marker % 10 !== 0 && (
                    <>
                      <div className="absolute bottom-0 w-[1px] h-1 bg-muted-foreground" />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ruler;
