'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import Button from 'react-bootstrap/Button';
import FormSelect from 'react-bootstrap/FormSelect';
import Dropdown from 'react-bootstrap/Dropdown';
import { BsSpeedometer, BsMusicNoteBeamed, BsVolumeUpFill, BsVolumeMuteFill, BsMegaphone, BsStopFill, BsPauseFill } from "react-icons/bs";
import { cx } from '@/utils';

type SpeechContentProps = {
  className?: string
  text?: string | any
  dropdownProps?: any
}

export const SpeechContent = ({
  className,
  text,
  dropdownProps,
}: SpeechContentProps) => {
  const { resolvedTheme } = useTheme();
  const utteranceRef = useRef() as any;
  const [voice, setVoice] = useState<string>('0');
  const [rateValue, setRateValue] = useState<number>(1);
  const [pitchValue, setPitchValue] = useState<number>(1);
  const [volumeValue, setVolumeValue] = useState<number>(1);
  const [isSpeak, setIsSpeak] = useState<boolean>(false);
  const [isPause, setIsPause] = useState<boolean>(false);

  let speechSyn: any = typeof window !== 'undefined' && window.speechSynthesis;
  const SpeechUtterance: any = typeof window !== 'undefined' && window.SpeechSynthesisUtterance;
  const [voices, setVoices] = useState<Array<any> | undefined | null>();
  
  useEffect(() => {
    if(!!speechSyn && !!SpeechUtterance){
      // console.log('speechSyn: ', speechSyn);

      const optionVoices = speechSyn.getVoices().map((item: any, i: number) => Object.assign(item, { value: '' + i }) );
      setVoices(optionVoices);

      // console.log('optionVoices: ', optionVoices);
      // console.log('speechSyn.onvoiceschanged: ', speechSyn.onvoiceschanged);

      // Older browser don't support the voiceschanged event, 
      // and just return a list of voices when SpeechSynthesis.getVoices() is fired.
      // While on others, such as Chrome, you have to wait for the event to fire before populating the list
      if(speechSyn.onvoiceschanged !== undefined){
        speechSyn.onvoiceschanged = optionVoices;
      }
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const endSpeak = () => {
      setIsSpeak(false);
      setIsPause(false);
    }

    const errorSpeak = (e: any) => {
      if(e.error !== 'interrupted'){
        setIsSpeak(false);
        setIsPause(false);
      }
    }

    // Stop speech when reload page or close tab
    const beforeUnload = () => {
      speechSyn.cancel(); // Stop
    }

    if(utteranceRef.current){
      utteranceRef.current.addEventListener("error", errorSpeak);
      utteranceRef.current.addEventListener("end", endSpeak);
      window.addEventListener("beforeunload", beforeUnload, { capture: true });
    }
    
    return () => {
      utteranceRef.current?.removeEventListener?.("error", errorSpeak);
      utteranceRef.current?.removeEventListener?.("end", endSpeak);
      window.removeEventListener("beforeunload", beforeUnload, { capture: true });
    }
    // eslint-disable-next-line
  }, [utteranceRef.current, speechSyn]);

  // Stop speech when unmounted
  useEffect(() => {
    return () => {
      if(utteranceRef.current){
        stopSpeak();
      }
    }
    // eslint-disable-next-line
  }, []);

  const voiceOptions = () => Object.entries(
    (voices || []).reduce((acc: any, obj: any) => {
      const key = obj.lang;
      const curGroup = acc[key] ?? [];
      return { ...acc, [key]: [...curGroup, obj] };
    }, {})
  )
  .sort((a: any, b: any) => {
    const aname = a[0].toUpperCase();
    const bname = b[0].toUpperCase();
    if (aname < bname) return -1;
    else if (aname == bname) return 0;
    else return +1;
  });

  const toggleSpeak = (value?: any) => {
    if(text && window.SpeechSynthesisUtterance){
      if(speechSyn.speaking && !speechSyn.paused){
        speechSyn.pause(); // pause narration
        setIsSpeak(false);
        setIsPause(true);
        return;
      }

      setIsSpeak(true);

      if(speechSyn.paused){
        speechSyn.resume(); // unpause/resume narration
        setIsPause(false);
        return;
      }

      utteranceRef.current = new SpeechUtterance(text);

      utteranceRef.current.rate = rateValue;
      utteranceRef.current.pitch = pitchValue;
      utteranceRef.current.volume = volumeValue;
      utteranceRef.current.voice = (voices || [])[+(value || voice)];

      speechSynthesis.speak(utteranceRef.current);
    }
  }

  const stopSpeak = () => {
    if(speechSyn.speaking){
      speechSyn.cancel(); // stop narration
      setIsSpeak(false);
      setIsPause(false);
    }
  }

  const changeVoice = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setVoice(val);

    if(isSpeak){
      stopSpeak(); // Stop
      toggleSpeak(val);
    }
  }

  if(!voices){
    return null;
  }

  return (
    <div className={cx("flex gap-1", className)}>
      <FormSelect
        value={voice}
        onChange={changeVoice}
      >
        {voiceOptions().map(([key, options]: [string, any]) =>
          <optgroup key={key} label={key}>
            {options.map((item: any) =>
              <option key={item.value} value={item.value}>
                {item.name}
                {item.default ? ' -- DEFAULT' : ''}
              </option>
            )}
          </optgroup>
        )}
      </FormSelect>

      <Dropdown {...dropdownProps}>
        <Dropdown.Toggle
          variant={resolvedTheme}
          bsPrefix="border-0"
          title="Speech rate"
        >
          <BsSpeedometer className="align--2px" />
        </Dropdown.Toggle>
        <Dropdown.Menu className="min-w-0 w-full shadow-md">
          <div className="flex flex-col items-center">
            <b>+</b>
            <div className="range-v">
              <input
                className="form-range"
                type="range"
                min={0.5}
                max={2}
                step={0.1}
                autoComplete="off"
                value={rateValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRateValue(+e.target.value)}
              />
            </div>
            <b>-</b>
          </div>
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown {...dropdownProps}>
        <Dropdown.Toggle
          variant={resolvedTheme}
          bsPrefix="border-0"
          title="Speech pitch"
        >
          <BsMusicNoteBeamed className="align--2px" />
        </Dropdown.Toggle>
        <Dropdown.Menu className="min-w-0 w-full shadow-md">
          <div className="flex flex-col items-center">
            <b>+</b>
            <div className="range-v">
              <input
                className="form-range"
                type="range"
                min={0.5}
                max={2}
                step={0.1}
                autoComplete="off"
                value={pitchValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPitchValue(+e.target.value)}
              />
            </div>
            <b>-</b>
          </div>
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown {...dropdownProps}>
        <Dropdown.Toggle
          disabled={isSpeak || isPause}
          variant={resolvedTheme}
          bsPrefix="border-0"
          title="Speech volume"
        >
          {volumeValue === 0 ? <BsVolumeMuteFill className="align--2px scale-125" /> : <BsVolumeUpFill className="align--2px scale-125" />}
        </Dropdown.Toggle>
        <Dropdown.Menu className="min-w-0 w-full shadow-md">
          <div className="flex flex-col items-center">
            <b>+</b>
            <div className="range-v">
              <input
                className="form-range"
                type="range"
                min={0}
                max={1}
                step={0.05}
                autoComplete="off"
                value={volumeValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVolumeValue(+e.target.value)}
              />
            </div>
            <b>-</b>
          </div>
        </Dropdown.Menu>
      </Dropdown>

      <Button
        variant={resolvedTheme}
        className="border-0"
        title={isSpeak ? 'Pause' : 'Speak'}
        onClick={() => toggleSpeak()}
      >
        {isSpeak ? <BsPauseFill className="align--2px" /> : <BsMegaphone className="align--2px" />}
      </Button>
      
      <Button
        variant={resolvedTheme}
        className="border-0"
        title="Stop speak"
        disabled={!isSpeak}
        onClick={stopSpeak}
      >
        <BsStopFill className="align--2px" />
      </Button>
    </div>
  )
}
