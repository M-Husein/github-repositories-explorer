'use client';

import { useRef, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import { BsPeople, BsGeoAlt, BsLink45Deg, BsTwitter, BsSearch, BsGithub, BsEnvelope } from "react-icons/bs";
import { Img } from '@/components/Img';
import { ListRepo } from '@/components/ListRepo';
import { useApi } from '@/components/Apps';
import { fetchApi, numShort } from '@/utils';

export function SearchResult(){
  const api = useApi() as any;
  const list = api.searchResult?.items || [];
  const refController: any = useRef();
  const [loadingGetRepos, setLoadingGetRepos] = useState<any>();

  const onSelectItem = async (eventKey: any, e: any) => {
    const dataId = +e.target.parentElement.getAttribute('data-id');
    const item = list.find((f: any) => dataId === f.id);

    e.target.blur();

    if(eventKey.includes(dataId) && item){
      setLoadingGetRepos(item.id);
      
      const controller = new AbortController();
      refController.current = controller;

      try {
        const detail: any = await fetchApi(`/api/github/repos?username=${item.login}`, { signal: controller.signal });
        if(detail){  
          api.setSearchResult({
            ...api.searchResult,
            items: list.map((val: any) => (val.id === item.id ? { ...val, detail } : val))
          });
        }
      } catch(e: any) {
        if(e.name !== 'AbortError'){
          api.setError(e);
        }
        
        api.setSearchResult({
          ...api.searchResult,
          items: list.map((val: any) => (val.id === item.id ? { ...val, detail: null } : val))
        });
      } finally {
        setLoadingGetRepos(null);
      }
    }else{
      if(refController.current){
        refController.current.abort();
        refController.current = null;
        setLoadingGetRepos(null);
      }
    }
  }

  const doSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    api.getUsers();
  }

  if(!!list.length){
    return (
      <div className="w-full max-w-5xl mx-auto py-4 lg:px-4">
        <p className="text-gray-500 max-md:px-4">
          Showing users for <b>&quot;{api.query}&quot;</b>
        </p>
        <Accordion
          alwaysOpen
          className="accordion-search-result"
          onSelect={onSelectItem}
        >
          {list.map((item: any) =>
            <Accordion.Item
              key={item.id}
              eventKey={item.id}
              className="mb-4"
            >
              <Accordion.Header
                className="sticky top-14 z-30"
                data-id={item.id}
              >
                <span className="inline-block truncate" title={item.login}>
                  <Img
                    width={25}
                    height={25}
                    draggable={false}
                    alt={item.login}
                    src={item.avatar_url}
                    className="mr-2 rounded"
                  />
                  {item.login}
                </span>
              </Accordion.Header>
              <Accordion.Body className="flex flex-col pt-0">
                {
                  loadingGetRepos === item.id ? 
                    <Spinner animation="border" className="text-blue-600 mx-auto mt-4" />
                    :
                    item?.detail?.profile || !!item?.detail?.repos?.length ? 
                      <div className="row">
                        <div className="col-md-4">
                          {!!item?.detail?.profile && (
                            <div className="lg:sticky top-108px pt-4">
                              {!!item.detail.profile.avatar_url && (
                                <p className="text-center">
                                  <Img
                                    width={155}
                                    height={155}
                                    draggable={false}
                                    alt={item.login}
                                    src={item.detail.profile.avatar_url}
                                    className="rounded"
                                  />
                                </p>
                              )}

                              {!!item.detail.profile.name && (
                                <h5>
                                  <a href={item.html_url} target="_blank" rel="noopener noreferrer" className="no-underline">
                                    {item.detail.profile.name}
                                  </a>
                                </h5>
                              )}

                              <h6>
                                <a href={item.html_url} target="_blank" rel="noopener noreferrer" className="no-underline">
                                  @{item.login}
                                </a>
                              </h6>

                              <hr />
                              
                              {!!item.detail.profile.bio && <p>{item.detail.profile.bio}</p>}

                              {typeof item.detail.profile.followers == 'number' && (
                                <p>
                                  <BsPeople className="mr-2" />
                                  {numShort(item.detail.profile.followers)} followers · {numShort(item.detail.profile.following)} following
                                </p>
                              )}

                              {!!item.detail.profile.location && (
                                <p>
                                  <BsGeoAlt className="mr-2" />
                                  {item.detail.profile.location}
                                </p>
                              )}

                              {!!item.detail.profile.email && (
                                <p>
                                  <a href={"mailto:" + item.detail.profile.email} className="no-underline">
                                    <BsEnvelope className="mr-2" />
                                    {item.detail.profile.email}
                                  </a>
                                </p>
                              )}
                              
                              {!!item.detail.profile.blog && (
                                <p>
                                  <a href={item.detail.profile.blog} target="_blank" rel="noopener noreferrer" className="no-underline">
                                    <BsLink45Deg className="mr-2" />
                                    {item.detail?.profile.blog}
                                  </a>
                                </p>
                              )}

                              {!!item.detail.profile.twitter_username && (
                                <p>
                                  <a href={"https://twitter.com/" + item.detail.profile.twitter_username} target="_blank" rel="noopener noreferrer" className="no-underline">
                                    <BsTwitter className="mr-2" />
                                    @{item.detail.profile.twitter_username}
                                  </a>
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="col-md-8 bg-body-tertiary">
                          <ListRepo
                            id={item.id}
                            list={item?.detail?.repos || []}
                          />
                        </div>
                      </div>
                      :
                      <div className="pt-4 text-center font-semibold">No Data</div>
                }
              </Accordion.Body>
            </Accordion.Item>
          )}
        </Accordion>
      </div>
    );
  }
  
  return (
    <div className="min-h-calc-screen--128px flex justify-center items-center bg-stripe">
      <div className="row items-center gap-y-4 w-full p-4 max-w-5xl mx-auto">
        <div className="col-md-9">
          <form
            className="input-group input-group-lg"
            role="search"
            onSubmit={doSearch}
          >
            <FormControl
              type="search"
              placeholder="Search by username"
              disabled={api.loading}
              value={api.query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => api.setQuery(e.target.value)}
            />
            <Button type="submit" variant="light">
              {api.loading ? <Spinner animation="border" size="sm" /> : <BsSearch />}
            </Button>
          </form>
        </div>

        <div className="col-md-3 p-6 text-center">
          <BsGithub className="w-full h-full" />
          <h1 className="h4 mt-2">GitHub repositories explorer</h1>
        </div>
      </div>
    </div>
  );
}
