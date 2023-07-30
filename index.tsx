import type { MinimatchOptions } from 'minimatch';

import logSymbols from 'log-symbols';
import { minimatch } from 'minimatch';
import { render } from 'preact';
import { useCallback, useState } from 'preact/hooks';

type MatchResult = {
  isMatch: boolean;
  path: string;
};

const { error: failureSymbol, success: successSymbol } = logSymbols;

function matchPaths(
  pattern: string,
  paths: string[],
  options: MinimatchOptions
): MatchResult[] {
  const result: MatchResult[] = [];

  for (const path of paths) {
    result.push({
      isMatch: minimatch(path, pattern, options),
      path
    });
  }

  return result;
}

function App() {
  const [matchBase, setMatchBase] = useState(true);

  const onChangeMatchBase = useCallback((event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      setMatchBase(event.target.checked);
    }
  }, []);

  const [pattern, setPattern] = useState('');
  const [pathLines, setPathLines] = useState('');

  const onInputPattern = useCallback((event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      setPattern(event.target.value);
    }
  }, []);

  const onInputPathLines = useCallback((event: Event) => {
    if (event.target instanceof HTMLTextAreaElement) {
      setPathLines(event.target.value);
    }
  }, []);

  const paths = pathLines.split('\n').filter(Boolean);

  const matchResults = matchPaths(pattern, paths, {
    matchBase
  });

  const items = matchResults.map(function (props) {
    const { isMatch, path } = props;

    const symbol = isMatch ? (
      <span aria-label="matched to ">{successSymbol}</span>
    ) : (
      <span aria-label="not matched to ">{failureSymbol}</span>
    );

    return (
      <li>
        {symbol}
        <span>{path}</span>
      </li>
    );
  });

  return (
    <>
      <div>
        <label for="pattern">pattern</label>
        <input
          id="pattern"
          type="text"
          value={pattern}
          onInput={onInputPattern}
          placeholder="./src/**/*.js"
        />
      </div>
      <div>
        <label for="pathLines">test paths</label>
        <textarea
          id="pathLines"
          rows={5}
          value={pathLines}
          onInput={onInputPathLines}
          placeholder={'./src/file.js\n./src/path.js'}
        />
      </div>
      <details>
        <summary>options</summary>
        <input
          id="matchBase"
          type="checkbox"
          checked={matchBase}
          onChange={onChangeMatchBase}
        />
        <label for="matchBase">matchBase</label>
      </details>
      <div>
        <span>results</span>
        <ol>{items}</ol>
      </div>
    </>
  );
}

function main(): void {
  const app = document.getElementById('js-app');

  if (app) {
    render(<App />, app);
  }
}
main();
