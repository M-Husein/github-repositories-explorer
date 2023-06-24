'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import { useTheme } from 'next-themes';
import { BsGithub, BsFillSunFill, BsFillMoonFill } from "react-icons/bs";
import { Img } from '@/components/Img';
import { FormSearch } from '@/components/FormSearch';
import { useApi } from '@/components/Apps';
import { APP_NAME } from '@/const/APPS';
import logo from '@/assets/img/logo-96x96.png';

const FormNav = () => {
  const api = useApi() as any;
  const { resolvedTheme: theme, setTheme } = useTheme();
  const [render, setRender] = useState(true);

  useEffect(() => {
    setRender(false);
  }, []);

  useEffect(() => {
    if(typeof window !== 'undefined'){
      // Toggle meta theme-color
      if(theme && theme !== "system"){
        document.querySelector('meta[name=theme-color]')?.setAttribute('content', theme === "dark" ? "#2b3035" : "#f8f9fa");
      }
    }
  }, [theme]);

  const doSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    api.getUsers();
  }

  const changeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    api.setQuery(val);
    if(!val.length){
      api.setSearchResult({});
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  if(render){
    return null;
  }

  return (
    <div className="flex flex-row items-center">
      <Button
        as="a"
        variant={theme}
        className="px-2 border-0"
        href="https://github.com/M-Husein/github-repositories-explorer"
        target="_blank"
        rel="noopener noreferrer"
      >
        <BsGithub className="align--2px scale-125" />
      </Button>

      <Button
        variant={theme}
        className="px-2 border-0 mx-1"
        title="Toggle theme"
        onClick={toggleTheme}
      >
        {theme === "dark" ? <BsFillSunFill className="align--2px" color="yellow" /> : <BsFillMoonFill className="align--2px" />}
      </Button>

      <FormSearch
        className="max-md:w-calc-screen--175px max-md:search-navmain"
        loading={api.loading}
        value={api.query}
        onChange={changeInput}
        onSubmit={doSearch}
      />
    </div>
  );
}

export const NavMain = () => (
  <nav className="navbar navbar-expand-lg bg-body-tertiary shadow sticky top-0 z-1040 h-14">
    <div className="container-xxl w-full max-w-5xl mx-auto px-4">
      <Link href="/" className="navbar-brand font-semibold" title={APP_NAME}>
        <Img
          priority
          width={30}
          height={30}
          className="inline-block align-top rounded-full"
          alt="GRE"
          src={logo}
        />
      </Link>

      <FormNav />
    </div>
  </nav>
);
