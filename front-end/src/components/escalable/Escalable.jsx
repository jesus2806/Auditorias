import React from 'react';
import { useResizeDetector } from 'react-resize-detector';

export function Escalable({
  baseWidth = 600,
  children,
  style = {},
  ...props
}) {
  const { width, ref } = useResizeDetector();

  const scale = width && width < baseWidth
    ? width / baseWidth
    : 1;

  return (
    <div
      ref={ref}
      style={{
        overflow: 'hidden',      // para que no desborde
        width: '100%',           // llena el padre
        ...style
      }}
      {...props}
    >
      <div
        style={{
          width: baseWidth,             // ancho “original”
          transform: `scale(${scale})`,
          transformOrigin: 'top left',  // anclar arriba-izq
        }}
      >
        {children}
      </div>
    </div>
  );
}