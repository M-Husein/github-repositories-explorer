'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { PrismAsync } from 'react-syntax-highlighter'; // Prism
import { materialLight, materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Button from 'react-bootstrap/Button';
import { BsClipboard, BsCheck2 } from 'react-icons/bs';

export const CodeView = ({
  language,
  children,
  ...etc
}: any) => {
  const { theme } = useTheme();
  const [noRender, setNoRender] = useState<boolean>(true);
  const [copyMessage, setCopyMessage] = useState<string>('Copy');

  useEffect(() => {
    setNoRender(false);
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator?.clipboard?.writeText?.(Array.isArray(children) ? children.join('') : children);
      setCopyMessage('Copied');
      setTimeout(() => {
        setCopyMessage('Copy');
      }, 500);
    } catch(e) {
      // console.log('e: ', e);
    }
  }

  if(noRender){
    return null;
  }

  return (
    <div className="relative codeView">
      <Button
        size="sm"
        variant={theme}
        title={copyMessage}
        className="absolute top-1 right-1 z-1"
        tabIndex={-1}
        onClick={copyToClipboard}
      >
        {copyMessage === 'Copy' ? <BsClipboard /> : <BsCheck2 />}
      </Button>

      <PrismAsync
        language={language}
        PreTag="div"
        style={theme === 'dark' ? materialDark : materialLight}
        showLineNumbers={language !== 'bash'}
        {...etc}
      >
        {/* eslint-disable-next-line */}
        {String(children).replace(/\n$/, '')}
      </PrismAsync>
    </div>
  );
}
