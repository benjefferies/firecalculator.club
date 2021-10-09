import React from 'react';

interface Props {
  border: string;
  color: string;
  children?: React.ReactNode;
  height: string;
  onClick: () => void;
  radius: string;
  width: string;
  background: string;
  fontSize: string;
  fontWeight: number;
  fontFamily: string;
}

const Button: React.FC<Props> = ({ color, border, background, children, height, onClick, radius, width, fontSize, fontFamily, fontWeight }) => {
  return (
    <button
      onClick={onClick}
      style={{
        background,
        border,
        borderRadius: radius,
        height,
        width,
        color,
        fontSize,
      fontFamily,
      fontWeight,
      }}>
      {children}
    </button>
  );
};

export default Button;
