import React from "react";

import styles from "./Text.module.scss";

export enum TextType {
  Primary = "text-primary",
  Secondary = "text-secondary",
  Highlight = "text-highlight",
}

export enum TextSize {
  Small = "0.5",
  Regular = "1rem",
  Large = "3rem",
}

export interface TextProps {
  type?: TextType;
  style?: React.CSSProperties;
  size?: TextSize;
}

const Text: React.FC<TextProps> = ({ children, type = TextType.Primary, style, size = TextSize.Regular }) => {
  return (
    <div
      className={styles[type]}
      style={{
        ...style,
        fontSize: size,
        lineHeight: "1.25rem",
      }}
    >
      {children}
    </div>
  );
};

export default Text;
