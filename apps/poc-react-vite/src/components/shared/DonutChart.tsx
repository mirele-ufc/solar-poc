import { useState } from "react";

type DonutSlice = {
  name: string;
  value: number;
  color: string;
};

type DonutChartProps = {
  data: DonutSlice[];
  innerRadius?: number;
  outerRadius?: number;
  paddingAngle?: number;
  width?: number;
  height?: number;
  formatTooltip?: (value: number, name: string) => string;
};

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number,
) {
  const sweep = endAngle - startAngle;
  const largeArc = sweep > 180 ? 1 : 0;

  const outerStart = polarToCartesian(cx, cy, outerR, startAngle);
  const outerEnd = polarToCartesian(cx, cy, outerR, endAngle);
  const innerStart = polarToCartesian(cx, cy, innerR, endAngle);
  const innerEnd = polarToCartesian(cx, cy, innerR, startAngle);

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
    "Z",
  ].join(" ");
}

export function DonutChart({
  data,
  innerRadius = 60,
  outerRadius = 90,
  paddingAngle = 3,
  width = 240,
  height = 240,
  formatTooltip,
}: DonutChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return null;

  const cx = width / 2;
  const cy = height / 2;
  const padAngle = paddingAngle;

  let currentAngle = 0;
  const slices = data
    .filter((d) => d.value > 0)
    .map((d) => {
      const sweep = (d.value / total) * 360;
      const start = currentAngle + padAngle / 2;
      const end = currentAngle + sweep - padAngle / 2;
      currentAngle += sweep;
      return { ...d, start, end: Math.max(end, start + 0.1) };
    });

  return (
    <div
      className="relative"
      style={{ width, height }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      onMouseLeave={() => setHovered(null)}
    >
      <svg width={width} height={height} aria-hidden="true">
        {slices.map((slice, i) => (
          <path
            key={i}
            d={describeArc(
              cx,
              cy,
              innerRadius,
              outerRadius,
              slice.start,
              slice.end,
            )}
            fill={slice.color}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{ transition: "opacity 0.15s" }}
            opacity={hovered !== null && hovered !== i ? 0.6 : 1}
          />
        ))}
      </svg>

      {hovered !== null && slices[hovered] && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg border border-[#e0e0e0] bg-white px-3 py-2 text-[13px] shadow-md"
          style={{
            left: mouse.x + 12,
            top: mouse.y - 10,
            whiteSpace: "nowrap",
          }}
        >
          {formatTooltip
            ? formatTooltip(slices[hovered].value, slices[hovered].name)
            : `${slices[hovered].name}: ${slices[hovered].value}`}
        </div>
      )}
    </div>
  );
}
