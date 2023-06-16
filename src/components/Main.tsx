'use client';

import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { BsChevronUp } from "react-icons/bs";
import { debounce } from '@/utils';

type MainProps = {
  children: React.ReactNode,
};

export const Main = ({ children }: MainProps) => {
  const [showBackTop, setShowBackTop] = useState<boolean>(false);

  useEffect(() => {
    const onScroll = debounce(() => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setShowBackTop(scrollY > 95 ? true : !(scrollY < 1));
    });

    document.addEventListener('scroll', onScroll);

    return () => {
      document.removeEventListener('scroll', onScroll);
    }
  }, []);

  const back2Top = () => {
    document.documentElement.scrollTo({ top: 0 });
  }

  return (
    <main className="min-h-calc-screen--128px">
      {children}

      {showBackTop && (
        <Button
          onClick={back2Top}
          title="Back to top"
          className="rounded-full w-10 h-10 fixed z-50 bottom-2 right-2"
        >
          <BsChevronUp className="align-baseline" />
        </Button>
      )}
    </main>
  );
}
