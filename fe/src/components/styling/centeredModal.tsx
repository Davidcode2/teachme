import { ReactNode, type JSX } from "react";

type PropTypes = {
  children: ReactNode;
};

export default function CenteredModal({
  children: children,
}: PropTypes): JSX.Element {
  return (
    <div className="fixed top-0 left-0 z-50 h-screen w-screen backdrop-blur-sm">
      <div className="flex h-full items-center justify-center">{children}</div>
    </div>
  );
}
