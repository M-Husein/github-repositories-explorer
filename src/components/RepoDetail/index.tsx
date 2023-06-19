'use client';

import { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import Dropdown from 'react-bootstrap/Dropdown';
import { BsEye, BsStarFill, BsLink45Deg, BsDownload } from "react-icons/bs";
import { Img } from '@/components/Img';
import { MarkdownView } from '@/components/MarkdownView';
import { fetchApi, numShort, parseDate } from '@/utils';
import { useApi } from '@/components/Apps';

type RepoDetailProps = {
  user?: string
  repo?: string
}

export const RepoDetail = ({ user, repo }: RepoDetailProps) => {
  const api = useApi() as any;
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState<any>(true);
  const [markdown, setMarkdown] = useState<any>('');

  useEffect(() => {
    let controllerGetDetail: AbortController = new AbortController();
    let controllerGetReadme: null | AbortController = null;

    (async () => {
      try {
        const res: any = await fetchApi(`/api/github/detail?username=${user}&repo=${repo}`, { signal: controllerGetDetail.signal });
        setData(res);

        if(res){
          controllerGetReadme = new AbortController();
          try {
            const req: any = await fetch(
              `https://raw.githubusercontent.com/${user}/${repo}/${res.default_branch}/README.md`,
              { signal: controllerGetReadme.signal }
            );
            if(req?.ok){
              const getMarkdown = await req.text();
              setMarkdown(getMarkdown);
            }else{
              setMarkdown(null);
              api.setError("Failed get detail");
            }
          } catch(e: any) {
            if(e.name !== 'AbortError'){
              api.setError(e);
            }
          } finally {
            setLoading(false);
          }
        }else{
          api.setError("Failed get detail");
        }
      } catch(e: any) {
        if(e.name !== 'AbortError'){
          api.setError(e);
        }
      }
    })();

    return () => {
      controllerGetDetail.abort();

      if(controllerGetReadme){
        controllerGetReadme.abort();
      }
    }
    // eslint-disable-next-line
  }, [user, repo]);

  const selectAll = (e: any) => {
    e.target.select()
  }

  const copyToClipboard = (e: any) => {
    const input = e.target.previousElementSibling;

    input.focus();
    input.select();
    input.setSelectionRange(0, 99999); // For mobile devices

    navigator?.clipboard?.writeText?.(input.value);
  }

  return !data || loading ?
    <Spinner animation="border" className="text-blue-600 mx-auto my-4" />
    :
    <>
      <h1 className="text-3xl break-all">
        <a
          href={data.owner.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline font-normal"
        >
          <Img
            width={32}
            height={32}
            draggable={false}
            alt={user}
            src={data.owner.avatar_url}
            className="rounded mr-4"
          />
          {user}
        </a>
        <span className="mx-1">/</span>
        <a
          href={data.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline"
        >
          {repo}
        </a>
        <small className="inline-block align-middle py-1 px-2 rounded-xl bg-blue-100 bg-mode text-xs ml-2">
          {data.private ? 'Private' : 'Public'}
        </small>
      </h1>

      <div className="text-xs mt-2">
        <span className="inline-block py-1 px-2 rounded bg-gray-200 bg-mode mb-1">
          Created at: <time dateTime={data.created_at}>{parseDate(data.created_at)}</time>
        </span>
        <span className="inline-block py-1 px-2 rounded bg-gray-200 bg-mode mb-1 mx-1">
          Updated at: <time dateTime={data.updated_at}>{parseDate(data.updated_at)}</time>
        </span>
        <span className="inline-block py-1 px-2 rounded bg-gray-200 bg-mode mb-1">
          Pushed at: <time dateTime={data.pushed_at}>{parseDate(data.pushed_at)}</time>
        </span>
      </div>

      <div className="my-5 flex flex-col lg:flex-row flex-wrap gap-2">
        <Button
          as="div"
          variant="outline-secondary"
          className="flex items-center gap-x-2 cursor-auto"
        >
          <BsEye />
          Watch
          <b className="border border-solid border-gray-400 px-2 rounded-lg ml-auto">
            {data.watchers_count ? numShort(data.watchers_count) : 0}
          </b>
        </Button>
        <Button
          as="div"
          variant="outline-secondary"
          className="flex items-center gap-x-2 cursor-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/>
          </svg>
          Fork
          <b className="border border-solid border-gray-400 px-2 rounded-lg ml-auto">
            {data.forks_count ? numShort(data.forks_count) : 0}
          </b>
        </Button>
        <Button
          as="div"
          variant="outline-secondary"
          className="flex items-center gap-x-2 cursor-auto"
        >
          <BsStarFill />
          Starred
          <b className="border border-solid border-gray-400 px-2 rounded-lg ml-auto">
            {data.stargazers_count ? numShort(data.stargazers_count) : 0}
          </b>
        </Button>
        <Dropdown>
          <Dropdown.Toggle variant="outline-secondary" className="w-full" id="ddCode">
            Code
          </Dropdown.Toggle>
          <Dropdown.Menu className="shadow w-full lg:min-w-400px">
            <Dropdown.Header>Clone</Dropdown.Header>
            {
              [
                { label: "HTTPS", value: data.clone_url },
                { label: "SSH", value: data.ssh_url },
                { label: "GitHub CLI", value: 'gh repo clone ' + data.full_name },
              ].map((item: any, idx: number) =>
                <div key={item.label} className="py-2 px-4">
                  <label htmlFor={"cloneInput" + idx}>{item.label}</label>
                  <div className="input-group input-group-sm mt-1">
                    <FormControl
                      readOnly
                      defaultValue={item.value}
                      onMouseUp={selectAll}
                      className="truncate"
                      id={"cloneInput" + idx}
                    />
                    <Button onClick={copyToClipboard} variant="outline-secondary">Copy</Button>
                  </div>
                </div>
              )
            }
            <hr className="my-2" />
            <Dropdown.Item
              href={`https://github.com/${user}/${repo}/archive/refs/heads/${data.default_branch}.zip`}
              download
            >
              <BsDownload className="mr-2" />Download ZIP
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <hr />

      {data.description && <p className="lead">{data.description}</p>}

      {data.homepage && (
        <a href={data.homepage} target="_blank" rel="noopener noreferrer" className="no-underline font-semibold break-all">
          <BsLink45Deg /> {data.homepage}
        </a>
      )}

      {!!data?.topics?.length && (
        <p className="flex flex-row flex-wrap gap-2 mt-5 font-semibold text-xs">
          {data.topics.map((item: string) =>
            <a
              key={item}
              href={`https://github.com/topics/${item}`}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline py-1 px-2 rounded-xl bg-blue-200 bg-mode"
            >
              {item}
            </a>
          )}
        </p>
      )}
      
      {!!markdown && (
        <MarkdownView className="my-5">
          {markdown}
        </MarkdownView>
      )}
    </>
}
