import React from 'react';
import { Highlight, themes } from 'prism-react-renderer';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language = 'json', className = '' }: CodeBlockProps) {
  return (
    <Highlight
      theme={themes.nightOwl}
      code={code}
      language={language as any}
    >
      {({ className: highlightClassName, style, tokens, getLineProps, getTokenProps }) => (
        <pre 
          className={`${highlightClassName} ${className} rounded-md p-4 overflow-auto text-sm`} 
          style={style}
        >
          {tokens.map((line, i) => {
            const { key: lineKey, ...lineProps } = getLineProps({ line, key: i });
            return (
              <div key={i} {...lineProps}>
                {line.map((token, k) => {
                  const { key: tokenKey, ...tokenProps } = getTokenProps({ token, key: k });
                  return <span key={k} {...tokenProps} />;
                })}
              </div>
            );
          })}
        </pre>
      )}
    </Highlight>
  );
} 