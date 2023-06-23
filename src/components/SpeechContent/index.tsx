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
  text?: string
  dropdownProps?: any
}

export const SpeechContent = ({
  className,
  text,
  dropdownProps,
}: SpeechContentProps) => {
  const { theme } = useTheme();
  const utteranceRef = useRef() as any;
  const [voice, setVoice] = useState('0');
  const [rateValue, setRateValue] = useState<number>(1);
  const [pitchValue, setPitchValue] = useState(1);
  const [volumeValue, setVolumeValue] = useState(1);
  const [isSpeak, setIsSpeak] = useState(!1);

  const speechSyn: any = typeof window !== 'undefined' && window.speechSynthesis;
  const SpeechUtterance: any = typeof window !== 'undefined' && window.SpeechSynthesisUtterance;
  const [supported, setSupported] = useState(false);
  
  useEffect(() => {
    setSupported(!!speechSyn && !!SpeechUtterance); // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const endSpeak = () => {
      setIsSpeak(false);
      // console.log(`Utterance has finished being spoken after ${e.elapsedTime} seconds.`);
    }

    const errorSpeak = (e: any) => {
      if(e.error !== 'interrupted'){
        setIsSpeak(false);
      }
      // console.log('speech synthesis error: ' + e.error); // 'An error has occurred with the speech synthesis: ' + e.error
    }

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
  }, [utteranceRef.current]);

  const voices = speechSyn.getVoices().map((item: any, i: number) => Object.assign(item, { value: '' + i }) );

  const voiceOptions = voices
    .map(({ value, name, lang }: any) => ({ value, name, lang }) )
    .sort((a: any, b: any) => {
      const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
      if ( aname < bname ) return -1;
      else if ( aname == bname ) return 0;
      else return +1;
    });

  const toggleSpeak = (value?: any) => {
    if(text && window.SpeechSynthesisUtterance){
      if(speechSyn.speaking && !speechSyn.paused){
        speechSyn.pause(); // pause narration
        setIsSpeak(false);
        return;
      }

      setIsSpeak(true);

      if(speechSyn.paused){
        speechSyn.resume(); // unpause/resume narration
        return;
      }

      utteranceRef.current = new SpeechUtterance(text);

      utteranceRef.current.voice = voices[value || voice];
      utteranceRef.current.rate = rateValue;
      utteranceRef.current.pitch = pitchValue;
      utteranceRef.current.volume = volumeValue;

      speechSynthesis.speak(utteranceRef.current);
    }
  }

  const stopSpeak = () => {
    if(speechSyn.speaking){
      speechSyn.cancel(); // stop narration
      setIsSpeak(false);
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

  if(!supported){
    return null;
  }

  return (
    <div className={cx("flex gap-1", className)}>
      <FormSelect
        value={voice}
        onChange={changeVoice}
      >
        {voiceOptions.map((item: any) =>
          <option key={item.value} value={item.value}>{item.name} ({item.lang})</option>
        )}
      </FormSelect>

      <Dropdown {...dropdownProps}>
        <Dropdown.Toggle
          variant={theme}
          bsPrefix=" "
          title="Speech rate"
        >
          <BsSpeedometer />
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
          variant={theme}
          bsPrefix=" "
          title="Speech pitch"
        >
          <BsMusicNoteBeamed />
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
          disabled={isSpeak}
          variant={theme}
          bsPrefix=" "
          title="Speech volume"
        >
          {volumeValue < 1 ? <BsVolumeMuteFill /> : <BsVolumeUpFill />}
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
        variant={theme}
        title={isSpeak ? 'Pause' : 'Speak'}
        onClick={() => toggleSpeak()}
      >
        {isSpeak ? <BsPauseFill /> : <BsMegaphone />}
      </Button>
      
      <Button
        variant={theme}
        title="Stop speak"
        disabled={!isSpeak}
        onClick={stopSpeak}
      >
        <BsStopFill />
      </Button>
    </div>
  )
}
