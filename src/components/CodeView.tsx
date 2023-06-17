'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Prism } from 'react-syntax-highlighter';
import { materialLight, materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const CodeView = ({
  language,
  children,
  ...etc
}: any) => {
  const [noRender, setNoRender] = useState<boolean>(true);
  const { theme } = useTheme();

  useEffect(() => {
    setNoRender(false);
  }, []);

  if(noRender){
    return null;
  }

  return (
    <Prism
      language={language}
      PreTag="div"
      style={theme === 'dark' ? materialDark : materialLight}
      {...etc}
    >
      {/* eslint-disable-next-line */}
      {String(children).replace(/\n$/, '')}
    </Prism>
  );
}
