import { Svg, Rect, G, Line, Path } from "react-native-svg";

export type SeatStatus = "available" | "booked" | "reserved" | "selected";

interface SeatIconProps {
  status: SeatStatus;
}

export default function SeatIcon({ status }: SeatIconProps) {
  const mainColor = {
    available: "#3D4EC0",
    selected: "#8693f7",
    booked: "#1C1E32",
    reserved: "#3D4EC0",
  }[status];

  const armColor = {
    available: "#5868D8",
    selected: "#7B8EFF",
    booked: "#252840",
    reserved: "#5868D8",
  }[status];

  return (
    <Svg viewBox="0 0 28 30" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <Rect x={2} y={1} width={24} height={14} rx={3} fill={mainColor} />
      <Rect x={0} y={13} width={28} height={3} rx={1.5} fill={armColor} />
      <Rect x={3} y={17} width={22} height={9} rx={2.5} fill={mainColor} />
      <Rect x={5} y={26} width={3} height={3} rx={1} fill={mainColor} />
      <Rect x={20} y={26} width={3} height={3} rx={1} fill={mainColor} />

      {status === "booked" && (
        <G stroke="#3A3E5C" strokeWidth={2.5} strokeLinecap="round">
          <Line x1={9} y1={4} x2={19} y2={13} />
          <Line x1={19} y1={4} x2={9} y2={13} />
        </G>
      )}

      {status === "reserved" && (
        <Path d="M10 4 L18 4 L14 9 L18 14 L10 14 L14 9 Z" fill="#8090FF" opacity={0.9} />
      )}
    </Svg>
  );
}
