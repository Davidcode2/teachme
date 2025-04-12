import { ReactNode, type JSX } from "react";

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
 const isDevelopment = import.meta.env.DEV;
 const isProduction = import.meta.env.PROD;

  return (
    <>
      <div className="relative">
        {(!isDevelopment && isProduction && false) && (
          <div
            className={`${animate ? "animate-gradient" : ""} absolute inset-0 bg-gradient-to-r from-${fromColor} to-${toColor} ${viaColor ? `via-${viaColor}` : ""} blur-${blurSize} lg:blur-${blurSizeLg}`}
          />
        )}
        <div className="relative">{children}</div>
      </div>
    </>
  );
}

export default BorderColorBlur;
