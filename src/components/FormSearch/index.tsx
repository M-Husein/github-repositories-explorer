'use client';

import { useRef, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import Spinner from 'react-bootstrap/Spinner';
import { useTheme } from 'next-themes';
import { BsSearch, BsMicFill } from 'react-icons/bs';
import { useApi } from '@/components/Apps';
import { cx } from '@/utils';

type FormSearchProps = {
  loading?: boolean
  value?: string
  size?: string
  className?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
}

export const FormSearch = ({
  loading,
  value,
  size,
  className,
  onChange,
  onSubmit,
}: FormSearchProps) => {
  const { theme } = useTheme();
  const { setQuery, getUsers } = useApi() as any;
  const recognition = useRef(null) as any;
  const inputRef = useRef() as any;
  const [isEnabled, setIsEnabled] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<boolean>(false);
  const [noRender, setNoRender] = useState<boolean>(true);

  useEffect(() => {
    setNoRender(false);
  }, []);

  useEffect(() => {
    const isSupported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
    setSpeechRecognition(isSupported);

    if(isSupported && isEnabled && recognition.current === null){ // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;

      recognition.current.addEventListener('result', (e: any) => {
        const resultItem = e.results.item(e.resultIndex);
        const { transcript } = resultItem.item(0);

        if(!resultItem.isFinal){
          return;
        }

        recognition.current.stop();
        setIsEnabled(false);
        setQuery(transcript);
        getUsers(transcript);
      });
    }

    if(recognition.current){
      isEnabled ? recognition.current.start() : recognition.current.stop();
    }

    return () => {
      if(recognition.current !== null){
        recognition.current.stop();
      }
    }
  }, [isEnabled, setQuery, getUsers]);

  const toggleSpeak = () => {
    setIsEnabled(!isEnabled);
    inputRef.current.focus();
  }

  const clickSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(!value?.length){
      e.preventDefault();
      e.stopPropagation();
      inputRef.current.focus();
    }
  }

  if(noRender){
    return null;
  }

  return (
    <form
      tabIndex={-1}
      role="search"
      className={
        cx(
          "input-group",
          size && "input-group-" + size,
          className
        )
      }
      onSubmit={onSubmit}
    >
      <FormControl
        ref={inputRef}
        type="search"
        placeholder="Search by username"
        disabled={loading}
        value={value}
        onChange={onChange}
      />
      
      {speechRecognition && (
        <div className="relative flex">
          <Button
            variant={theme}
            className={cx("rounded-none px-2 relative", isEnabled && "overflow-hidden transition-none")}
            title={isEnabled ? 'Stop' : 'Search by voice'}
            disabled={loading}
            onClick={toggleSpeak}
          >
            <BsMicFill className="relative z-1 align--2px" />
            {isEnabled && <span className="animate-ping absolute inset-0 inline-flex h-full w-full rounded-full bg-red-500" />}
          </Button>
          
          {isEnabled && (
            <div className="invalid-tooltip block min-w-max right-0">
              Speech now
            </div>
          )}
        </div>
      )}
      
      <Button
        variant={theme}
        type="submit"
        className="px-2 btn-search"
        disabled={loading}
        onClick={clickSubmit}
      >
        {loading ? <Spinner animation="border" size="sm" /> : <BsSearch className="align--2px" />}
      </Button>
    </form>
  );
}
