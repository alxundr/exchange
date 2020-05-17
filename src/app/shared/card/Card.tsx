import React from "react";
import styles from "./Card.module.scss";

export enum CardColor {
  Default = "white",
  Dark = "#d6d6d6",
}

export interface CardProps {
  color?: CardColor;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, style, color = CardColor.Default }) => {
  return (
    <div className={styles.card} style={{ ...style, backgroundColor: color }}>
      {children}
    </div>
  );
};

export default Card;
