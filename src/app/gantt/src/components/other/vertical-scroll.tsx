import React from "react";
import type {
  RefObject,
  SyntheticEvent,
} from "react";


export const VerticalScroll: React.FC<{
  ganttHeight: number;
  ganttFullHeight: number;
  headerHeight: number;
  isChangeInProgress: boolean;
  onScroll: (event: SyntheticEvent<HTMLDivElement>) => void;
  rtl: boolean;
  verticalScrollbarRef: RefObject<HTMLDivElement>;
}> = ({
  ganttHeight,
  ganttFullHeight,
  headerHeight,
  isChangeInProgress,
  onScroll,
  rtl,
  verticalScrollbarRef,
}) => {
  return (
    <div
      style={{
        height: ganttHeight,
        marginTop: headerHeight,
        marginLeft: rtl ? undefined : "-1rem",
        pointerEvents: isChangeInProgress ? 'none' : undefined,
      }}
      className="scroll"
      onScroll={onScroll}
      ref={verticalScrollbarRef}
    >
      <div style={{ height: ganttFullHeight, width: 1 }} />
    </div>
  );
};
