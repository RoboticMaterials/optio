import { useRef, useEffect } from "react";

/**
 * This will take a value and store its current state
 * This can be used to see if the stored state has changed
 * For example: Does the new state differ from the previous state
 * @param {var} val
 */
const usePrevious = (val) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = val;
  });
  return ref.current;
};

export default usePrevious;
