'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import { useTheme } from 'next-themes';
import { BsGithub, BsFillSunFill, BsFillMoonFill } from "react-icons/bs";
import { FormSearch } from '@/components/FormSearch';
import { useApi } from '@/components/Apps';
import { APP_NAME } from '@/const/APPS';

const FormNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const api = useApi() as any;
  const { theme, setTheme } = useTheme();
  const [render, setRender] = useState(true);

  useEffect(() => {
    setRender(false);
  }, []);

  const doSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const req: any = await api.getUsers();
    
    if(req && pathname !== '/'){
      router.push('/');
    }
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
    
    document.querySelector('meta[name=theme-color]')?.setAttribute('content', theme === "dark" ? "#f8f9fa" : "#2b3035");
  }

  if(render){
    return null;
  }

  return (
    <div className="flex flex-row items-center">
      <Button
        as="a"
        variant={theme}
        className="px-2"
        href="https://github.com/M-Husein/github-repositories-explorer"
        target="_blank"
        rel="noopener noreferrer"
      >
        <BsGithub size={19} />
      </Button>

      <Button
        variant={theme}
        className="px-2 mx-1"
        title="Toggle theme"
        onClick={toggleTheme}
      >
        {theme === "dark" ? <BsFillSunFill color="yellow" /> : <BsFillMoonFill />}
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
        GRE
      </Link>

      <FormNav />
    </div>
  </nav>
);
