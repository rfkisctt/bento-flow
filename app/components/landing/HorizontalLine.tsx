import React from "react";

type HorizontalLineProps = {
  className?: string;
  style?: React.CSSProperties;
};

export const HorizontalLine = ({
  className = "",
  style,
}: HorizontalLineProps) => {
  return (
    <div
      className={`w-full h-[1px] bg-[#2a2a2a] relative z-10 ${className}`}
      style={style}
    />
  );
};
