'use client';

import { createContext, useContext, useState } from 'react';
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

export function Provider({ children }: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>();
  const [searchResult, setSearchResult] = useState<any>({});
  const [query, setQuery] = useState<string>('');

  const getUsers = async () => {
    const valueTrim = query.trim();
    if(valueTrim.length){
      setLoading(true);

      return await fetchApi('/api/github/search', {
        method: 'POST',
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify({ username: valueTrim })
      })
      .then((res) => {
        setSearchResult(res);
        return res;
      })
      .catch(setError)
      .finally(() => setLoading(false));
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
          searchResult,
          query,
          error,
          getUsers,
          setQuery,
          setSearchResult,
          setError
        }}
      >
        {children}

        <ToastContainer
          containerPosition=""
          position="bottom-center"
          className="fixed mx-auto bottom-0 left-0 right-0 p-4 empty:hidden"
        >
          <Toast
            className="max-md:w-screen bg-red-500 text-white"
            autohide={false}
            show={!!error}
            onClose={() => setError(null)}
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
      </ApiContext.Provider>
    </ThemeProvider>
  );
}

export const useApi = () => {
  return useContext(ApiContext);
};
