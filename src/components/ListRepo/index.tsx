'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import FormControl from 'react-bootstrap/FormControl';
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
import { BsFillStarFill, BsSearch } from "react-icons/bs";
import { numShort, parseNumber, debounce } from '@/utils';

type ListRepoProps = {
  id: number | string
  list?: any
}

export const ListRepo = ({ id, list }: ListRepoProps) => {
  const [filterValue, setFilterValue] = useState<string>('');
  const [filterLang, setFilterLang] = useState<string>('all');
  const [filterResult, setFilterResult] = useState<any>([]);
  const [loadingFilter, setLoadingFilter] = useState<boolean>(false);
  const listData = filterValue.length || filterLang !== 'all' ? filterResult : list; // @ts-ignore
  const parseLanguages = [...new Set(list.map((repo: any) => repo.language || "unknown"))];

  // eslint-disable-next-line
  const debouncedFilter = useCallback(debounce((val: string) => {
    setFilterResult(
      list.filter((item: any) => 
        item.name.includes(val.toLowerCase())
        &&
        (filterLang === 'all' || item.language === (filterLang === 'unknown' ? null : filterLang))
      )
    );

    setLoadingFilter(false); // End loading
  }, 500), []);

  const filterByRepo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFilterValue(val);
    if(val){
      setLoadingFilter(true); // Begin loading
      debouncedFilter(val);
      return;
    }
    // Reset filter result
    if(filterResult.length){
      setFilterResult(list);
    }
  }

  const filterByLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFilterLang(val);
    setFilterResult(
      list.filter((item: any) => 
        (val === 'all' || item.language === (val === 'unknown' ? null : val)) 
        &&
        item.name.includes(filterValue.toLowerCase())
      )
    );
  }

  return (
    <>
      {!!list.length && (
        <div className="sticky top-108px z-20 pt-4 bg-body-tertiary">
          <h6>Repositories ({ list.length })</h6>
          <div className="row g-2">
            <div className="col-sm-9">
              <div className="input-group">
                <label className="input-group-text" htmlFor={"iFindRepo" + id}>
                  {loadingFilter ? <Spinner size="sm" animation="border" /> : <BsSearch />}
                </label>
                <FormControl
                  id={"iFindRepo" + id}
                  type="search"
                  placeholder="Search repository"
                  value={filterValue}
                  onChange={filterByRepo}
                />
              </div>
            </div>
            <div className="col-sm-3">
              <select
                className="form-select capitalize"
                value={filterLang}
                onChange={filterByLanguage}
              >
                <option value="all">All</option>
                {parseLanguages.map((lang: string) =>
                  <option key={lang} value={lang}>{lang}</option>
                )}
              </select>
            </div>
          </div>
          <hr />
        </div>
      )}

      <div className="flex flex-col gap-y-4">
        {listData.length ?
          listData.map((repo: any) =>
            <Card
              key={repo.id}
              className="block text-gray-600 overflow-hidden focus-within:ring"
            >
              <a
                href={`https://github.com/${repo.owner.login}/${repo.name}/stargazers`}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={-1}
                title={repo.stargazers_count ? parseNumber(repo.stargazers_count) + ' Stars' : ''}
                className="text-mode small no-underline float-right rounded-bl-2xl rounded-tr pt-1 px-2 pb-2 bg-gray-300 bg-body-tertiary shadow"
              >
                {repo.stargazers_count ? numShort(repo.stargazers_count) : 0}
                <BsFillStarFill className="ml-1 align--2px" />
              </a>

              <Card.Body
                as={Link}
                prefetch={false}
                href={`/repository/${repo.owner.login}/${repo.name}`}
                className="block bg-gray-100 hover:bg-gray-200 bg-mode-2 bg-mode-hover no-underline"
              >
                <h5>
                  <div className="font-bold break-word pr-2">{repo.name}</div>
                </h5>

                {!!repo.description && <Card.Text>{repo.description}</Card.Text>}
              </Card.Body>
            </Card>
          )
          :
          !loadingFilter && (
            <div className="py-4 text-center font-semibold">
              {list.length ? 'Not Found' : 'This user has no repositories'}
            </div>
          )
        }
      </div>
    </>
  );
}