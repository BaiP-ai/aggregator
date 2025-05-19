import { createSignal } from 'solid-js';

const AILogoChip = (props) => {
  const size = props.size || 70;
  const color = props.color || '#2563EB';
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 300 300"
      width={size}
      height={size}
      class={props.class || ''}
      aria-label="Boston AI Partners logo"
    >
      {/* Horizontal lines */}
      <line x1="50" y1="150" x2="110" y2="150" stroke={color} stroke-width="4" />
      <line x1="190" y1="150" x2="250" y2="150" stroke={color} stroke-width="4" />
      
      {/* Vertical lines */}
      <line x1="150" y1="50" x2="150" y2="110" stroke={color} stroke-width="4" />
      <line x1="150" y1="190" x2="150" y2="250" stroke={color} stroke-width="4" />
      
      {/* Diagonal lines - top right quadrant */}
      <line x1="177" y1="123" x2="219" y2="81" stroke={color} stroke-width="4" />
      <line x1="177" y1="81" x2="219" y2="123" stroke={color} stroke-width="4" />
      
      {/* Diagonal lines - bottom right quadrant */}
      <line x1="177" y1="177" x2="219" y2="219" stroke={color} stroke-width="4" />
      <line x1="177" y1="219" x2="219" y2="177" stroke={color} stroke-width="4" />
      
      {/* Diagonal lines - bottom left quadrant */}
      <line x1="123" y1="177" x2="81" y2="219" stroke={color} stroke-width="4" />
      <line x1="123" y1="219" x2="81" y2="177" stroke={color} stroke-width="4" />
      
      {/* Diagonal lines - top left quadrant */}
      <line x1="123" y1="123" x2="81" y2="81" stroke={color} stroke-width="4" />
      <line x1="123" y1="81" x2="81" y2="123" stroke={color} stroke-width="4" />
      
      {/* Circuit endpoints (circular dots) */}
      <circle cx="50" cy="150" r="6" fill={color} />
      <circle cx="250" cy="150" r="6" fill={color} />
      <circle cx="150" cy="50" r="6" fill={color} />
      <circle cx="150" cy="250" r="6" fill={color} />
      
      <circle cx="219" cy="81" r="6" fill={color} />
      <circle cx="177" cy="81" r="6" fill={color} />
      <circle cx="219" cy="123" r="6" fill={color} />
      <circle cx="219" cy="177" r="6" fill={color} />
      <circle cx="219" cy="219" r="6" fill={color} />
      <circle cx="177" cy="219" r="6" fill={color} />
      <circle cx="81" cy="219" r="6" fill={color} />
      <circle cx="123" cy="219" r="6" fill={color} />
      <circle cx="81" cy="177" r="6" fill={color} />
      <circle cx="81" cy="123" r="6" fill={color} />
      <circle cx="81" cy="81" r="6" fill={color} />
      <circle cx="123" cy="81" r="6" fill={color} />
      
      {/* Central AI square */}
      <rect
        x="110"
        y="110"
        width="80"
        height="80"
        fill={color}
        rx="2"
        ry="2"
      />
      
      {/* AI text */}
      <text
        x="150"
        y="162"
        font-family="Arial, sans-serif"
        font-weight="bold"
        font-size="42"
        text-anchor="middle"
        fill="white"
      >
        AI
      </text>
    </svg>
  );
};

export default AILogoChip;
