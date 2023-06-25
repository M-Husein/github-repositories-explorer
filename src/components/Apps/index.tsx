'use client';

import { childrenOnly } from '@/types/common';
import { createContext, useContext, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { ThemeProvider } from 'next-themes';
import { fetchApi } from '@/utils';

export const ApiContext = createContext({
  loading: false,
  searchResult: {},
  query: "",
  error: null,
  getUsers: () => {},
  setQuery: (e: any) => {},
  setSearchResult: (data: any) => {},
  setError: (data: any) => {},
});

export function Apps({ children }: childrenOnly){
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>();
  const [searchResult, setSearchResult] = useState<any>({});
  const [query, setQuery] = useState<string>('');

  const getUsers = (val?: any) => {
    const valueTrim = (val || query).trim();
    if(valueTrim.length){
      setLoading(true);

      fetchApi('/api/github/search', {
        method: 'POST',
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username: valueTrim })
      })
      .then((res) => {
        setSearchResult(res);
        if(res && pathname !== '/'){
          router.push('/');
        }
      })
      .catch((e: any) => {
        if(e.name !== 'AbortError'){
          setError(e);
        }
      })
      .finally(() => {
        setLoading(false);
        setQuery(val || query);
      });
    }
    else{
      setSearchResult({});
    }
  }

  return (
    <ThemeProvider
      attribute="data-bs-theme"
      defaultTheme="system"
      disableTransitionOnChange
    >
      <ApiContext.Provider
        value={{
          loading,
          query,
          error,
          searchResult,
          getUsers,
          setQuery,
          setSearchResult,
          setError
        }}
      >
        <NextTopLoader
          color="#0d6efd"
          showSpinner={false}
        />
        
        {children}

        {!!error && (
          <ToastContainer
            containerPosition=""
            position="bottom-center"
            className="fixed mx-auto bottom-0 left-0 right-0 p-4"
          >
            <Toast
              show
              autohide
              onClose={() => setError(null)}
              className="max-md:w-screen bg-red-500 text-white"
            >
              <Toast.Header
                closeVariant="white"
                className="bg-red-500 text-white"
              >
                <strong className="mr-auto">Info</strong>
              </Toast.Header>
              <Toast.Body>{error?.message || error}</Toast.Body>
            </Toast>
          </ToastContainer>
        )}
      </ApiContext.Provider>
    </ThemeProvider>
  );
}

export const useApi = () => {
  return useContext(ApiContext);
};
