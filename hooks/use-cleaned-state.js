import { useState, useCallback } from 'react';

/**
 * Parse any JSON-encoded strings inside the inner objects of a top-level object.
 * Example input:
 * { "0": { "11111111": "{\"name\":\"guest 1\",\"amount\":10}" }, "2": {} }
 * becomes:
 * { "0": { "11111111": { name: "guest 1", amount: 10 } }, "2": {} }
 */
function parseInnerJsonStrings(input) {
  if (!input || typeof input !== 'object') return input;

  const out = {};
  for (const outerKey of Object.keys(input)) {
    const inner = input[outerKey];

    if (!inner || typeof inner !== 'object') {
      out[outerKey] = inner;
      continue;
    }

    const newInner = {};
    for (const innerKey of Object.keys(inner)) {
      const val = inner[innerKey];
      if (typeof val === 'string') {
        try {
          newInner[innerKey] = JSON.parse(val);
        } catch (err) {
          // keep original string if parse fails
          console.warn(`parseInnerJsonStrings: failed to JSON.parse [${outerKey}][${innerKey}]`, err);
          newInner[innerKey] = val;
        }
      } else {
        newInner[innerKey] = val;
      }
    }

    out[outerKey] = newInner;
  }

  return out;
}

/**
 * Custom hook that behaves like useState but automatically cleans JSON-encoded inner strings.
 * @param {any} initialState
 * @returns {[state, setState]}
 */
export function useCleanedState(initialState) {
  const [state, setState] = useState(() => parseInnerJsonStrings(initialState));

  const setCleanedState = useCallback((valueOrUpdater) => {
    setState(prev => {
      const next = typeof valueOrUpdater === 'function'
        ? valueOrUpdater(prev)
        : valueOrUpdater;

      return parseInnerJsonStrings(next);
    });
  }, []);

  return [state, setCleanedState];
}