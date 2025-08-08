import React, { memo } from "react";
import type { RetroGridProps } from "@/types/types";

const RetroGrid = ({ opacity = 1, speedSec = 6, lineColor = "#00d6fc" }: RetroGridProps) => {
    return (
        <div
            className="retro-grid"
            style={
                {
                    "--grid-opacity": opacity,
                    "--grid-speed": `${speedSec}s`,
                    "--grid-color": lineColor,
                } as React.CSSProperties
            }
        />
    );
};

export default memo(RetroGrid);
