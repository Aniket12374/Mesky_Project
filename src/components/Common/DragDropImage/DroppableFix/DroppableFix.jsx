import { useEffect, useState } from "react";
import { Droppable } from "react-beautiful-dnd";

const DroppableFix = ({ children, ...props }) => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) {
    return null;
  }
  return (
    <Droppable direction="horizontal" {...props}>
      {children}
    </Droppable>
  );
};

export default DroppableFix;
