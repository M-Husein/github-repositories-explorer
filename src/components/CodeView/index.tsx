'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { PrismAsync } from 'react-syntax-highlighter'; // OPTION: Prism
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; // OPTION theme: materialLight, materialDark
import Button from 'react-bootstrap/Button';
import { BsClipboard, BsCheck2 } from 'react-icons/bs';

export const CodeView = ({
  language,
  children,
  ...etc
}: any) => {
  const { resolvedTheme } = useTheme();
  const [noRender, setNoRender] = useState<boolean>(true);
  const [copyMessage, setCopyMessage] = useState<boolean>(false);

  useEffect(() => {
    setNoRender(false);
  }, []);

  const copyToClipboard = async () => {
    if(!copyMessage){
      try {
        await navigator?.clipboard?.writeText?.(Array.isArray(children) ? children.join('') : children);
        setCopyMessage(true);
        setTimeout(() => {
          setCopyMessage(false);
        }, 3e3);
      } catch(e) {
        // console.log('e: ', e);
      }
    }
  }

  if(noRender){
    return null;
  }

  return (
    <div className="relative codeView">
      <Button
        size="sm"
        variant={resolvedTheme}
        className="absolute top-1 right-1 z-1"
        tabIndex={-1}
        aria-label="Copy to clipboard"
        disabled={copyMessage}
        onClick={copyToClipboard}
      >
        {copyMessage ? <BsCheck2 /> : <BsClipboard />}
      </Button>

      <PrismAsync
        language={language}
        PreTag="div"
        style={resolvedTheme === 'dark' ? oneDark : oneLight}
        showLineNumbers={language !== 'bash'}
        {...etc}
      >
        {/* eslint-disable-next-line */}
        {String(children).replace(/\n$/, '')}
      </PrismAsync>
    </div>
  );
}
