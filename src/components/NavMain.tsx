'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { useTheme } from 'next-themes';
import { BsSearch, BsGithub, BsFillSunFill, BsFillMoonFill } from "react-icons/bs";
import { useApi } from '@/components/Provider';
import { APP_NAME } from '@/const/APPS';

const FormNav = () => {
  const [render, setRender] = useState(true);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const api = useApi() as any;

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
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? <BsFillSunFill color="yellow" /> : <BsFillMoonFill />}
      </Button>

      <form
        className="input-group max-md:w-calc-screen--175px"
        role="search"
        onSubmit={doSearch}
      >
        <FormControl
          type="search"
          placeholder="Search by username"
          disabled={api.loading}
          value={api.query}
          onChange={changeInput}
        />
        <Button
          type="submit"
          className="px-2"
          variant={`outline-${theme === 'dark' ? 'light' : 'secondary'}`}
          disabled={api.loading}
        >
          {api.loading ? <Spinner animation="border" size="sm" /> : <BsSearch />}
        </Button>
      </form>
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
