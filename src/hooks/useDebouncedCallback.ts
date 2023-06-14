import { useRef, useCallback } from 'react';
import { debounce } from 'lodash';

// ----------------------------------------------------------------------

const useDebouncedCallback = (callback: any, delay: number) => {
  const callbackRef = useRef(callback).current;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    debounce((...args) => callbackRef(...args), delay),
    []
  );
};

export default useDebouncedCallback;
