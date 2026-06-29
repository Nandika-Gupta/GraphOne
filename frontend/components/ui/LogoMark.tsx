export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="15,2 27,8.5 27,21.5 15,28 3,21.5 3,8.5" fill="#FF4D7A" />
      <g fill="none" stroke="#fff" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
        <polygon points="15,10 21,13.5 15,17 9,13.5" fill="#fff" stroke="none" />
        <polyline points="9,16.5 15,20 21,16.5" />
        <polyline points="9,19.5 15,23 21,19.5" />
      </g>
    </svg>
  );
}
