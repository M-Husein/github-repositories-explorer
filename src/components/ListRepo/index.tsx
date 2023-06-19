'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import FormControl from 'react-bootstrap/FormControl';
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
import { BsFillStarFill, BsSearch } from "react-icons/bs";
import { numShort, debounce } from '@/utils';

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
          <fieldset className="row g-2">
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
          </fieldset>
          <hr />
        </div>
      )}

      <div className="flex flex-col gap-y-4">
        {listData.length ?
          listData.map((repo: any) =>
            <Card
              key={repo.id}
              as={Link}
              prefetch={false}
              href={`/repo?user=${repo.owner.login}&repo=${repo.name}`} // `/repo/${repo.owner.login}/${repo.name}`
              className="bg-gray-100 hover:bg-gray-200 bg-mode-2 bg-mode-hover shadow-sm no-underline text-gray-600"
            >
              <Card.Body>
                <h5 className="flex flex-row flex-wrap">
                  <div className="grow font-bold">{repo.name}</div>
                  <small className="flex-none">
                    {repo.stargazers_count ? numShort(repo.stargazers_count) : 0}
                    <BsFillStarFill className="ml-1 align--2px" />
                  </small>
                </h5>

                {repo.description && <Card.Text>{repo.description}</Card.Text>}
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