import { ReactNode } from "react";

function BorderColorBlur({
  children: children,
  blurSize: blurSize = "sm",
  blurSizeLg: blurSizeLg = "sm",
  fromColor: fromColor = "blue-300",
  toColor: toColor = "purple-400",
  viaColor: viaColor = "",
  animate: animate = false,
}: {
  children: ReactNode;
  blurSize?: string;
  blurSizeLg?: string;
  fromColor?: string;
  toColor?: string;
  viaColor?: string;
  animate?: boolean;
}): JSX.Element {
  return (
    <>
      <div className="relative">
        <div
          className={`${animate ? "animate-gradient" : ""} absolute inset-0 bg-gradient-to-r from-${fromColor} to-${toColor} ${viaColor ? `via-${viaColor}` : ""} blur-${blurSize} lg:blur-${blurSizeLg}`}
        />
        <div className="relative">{children}</div>
      </div>
    </>
  );
}

export default BorderColorBlur;
