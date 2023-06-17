'use client';

import { useState } from 'react';
import Link from 'next/link';
import FormControl from 'react-bootstrap/FormControl';
import Card from 'react-bootstrap/Card';
import { BsFillStarFill, BsSearch } from "react-icons/bs";
import { numShort } from '@/utils';

type ListRepoProps = {
  id: number | string
  list?: any
}

export const ListRepo = ({ id, list }: ListRepoProps) => {
  const [filterValue, setFilterValue] = useState<string>('');
  const [filterLang, setFilterLang] = useState<string>('all');
  const [filterResult, setFilterResult] = useState<any>([]);
  const listData = filterValue.length || filterLang !== 'all' ? filterResult : list;
  // @ts-ignore
  const parseLanguages = [...new Set(list.map((repo: any) => repo.language || "unknown"))];

  const filterByRepo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFilterValue(val);
    setFilterResult(
      list.filter((item: any) => 
        item.name.includes(val.toLowerCase()) 
        && 
        (filterLang === 'all' || item.language === (filterLang === 'unknown' ? null : filterLang))
      )
    );
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

  if(list?.length){
    return (
      <>
        <div className="sticky top-108px z-20 pt-4 bg-body-tertiary">
          <h6>Repositories ({ list.length })</h6>
          <div className="row g-2">
            <div className="col-sm-9">
              <div className="input-group">
                <label className="input-group-text" htmlFor={"iFindRepo" + id}>
                  <BsSearch />
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

        <div className="flex flex-col gap-y-4">
          {listData.length ?
            listData.map((repo: any) =>
              <Card
                key={repo.id}
                as={Link}
                prefetch={false}
                href={`/repo/${repo.owner.login}/${repo.name}`}
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
            <div className="py-4 text-center font-semibold">Not Found</div>
          }
        </div>
      </>
    )
  }

  return null;
}