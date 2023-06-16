'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import Dropdown from 'react-bootstrap/Dropdown';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight, materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';
import { BsEye, BsStarFill, BsLink45Deg, BsDownload } from "react-icons/bs";
import { Img } from '@/components/Img';
import { fetchApi, numShort, parseDate } from '@/utils';
import { useApi } from '@/components/Provider';

const CodeDisplay = ({
  language,
  children,
  ...etc
}: any) => {
  const [render, setRender] = useState<boolean>(true);
  const { theme } = useTheme();

  useEffect(() => {
    setRender(false);
  }, []);

  if(render){
    return null;
  }

  return (
    <SyntaxHighlighter
      language={language}
      PreTag="div"
      style={theme === 'dark' ? materialDark : materialLight}
      {...etc}
    >
      {/* eslint-disable-next-line */}
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  );
}

export default function Detail({ params }: { params: { user: string, reponame: string } }){
  const { user, reponame } = params;
  const api = useApi() as any;
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState<any>(true);
  const [markdown, setMarkdown] = useState<any>('');

  useEffect(() => {
    (async () => {
      try {
        const res: any = await fetchApi(`/api/github/detail?username=${user}&repo=${reponame}`);
        setData(res);

        if(res){
          try {
            const req: any = await fetch(`https://raw.githubusercontent.com/${user}/${reponame}/${res.default_branch}/README.md`);
            if(req?.ok){
              const getMarkdown = await req.text();
              setMarkdown(getMarkdown);
            }else{
              setMarkdown(null);
              api.setError("Failed get detail");
            }
          } catch(e) {
            api.setError(e);
          } finally {
            setLoading(false);
          }
        }else{
          api.setError("Failed get detail");
        }
      } catch(e) {
        api.setError(e);
      }
    })();

    /* eslint-disable-next-line */
  }, [user, reponame]);

  const selectAll = (e: any) => {
    e.target.select()
  }

  const copyToClipboard = (e: any) => {
    const input = e.target.previousElementSibling;

    input.select();
    input.setSelectionRange(0, 99999); // For mobile devices

    navigator.clipboard.writeText(input.value);
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 flex flex-col">
      {!data || loading ?
        <Spinner animation="border" className="text-blue-600 mx-auto my-4" />
        :
        <>
          <h1 className="text-3xl">
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
              {reponame}
            </a>
            <small className="inline-block align-middle py-1 px-2 rounded-xl bg-blue-100 bg-mode text-xs ml-2">
              {data.private ? 'Private' : 'Public'}
            </small>
          </h1>

          <div className="text-sm mt-2">
            <span className="py-1 px-2 rounded bg-gray-200 bg-mode">
              Created at : <time dateTime={data.created_at}>{parseDate(data.created_at)}</time>
            </span>
            <span className="py-1 px-2 rounded bg-gray-200 bg-mode mx-2">
              Updated at : <time dateTime={data.updated_at}>{parseDate(data.updated_at)}</time>
            </span>
            <span className="py-1 px-2 rounded bg-gray-200 bg-mode">
              Pushed at : <time dateTime={data.pushed_at}>{parseDate(data.pushed_at)}</time>
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
              <Dropdown.Toggle variant="outline-secondary" id="ddCode">
                Code
              </Dropdown.Toggle>
              <Dropdown.Menu className="shadow min-w-[400px]">
                <Dropdown.Header>Clone</Dropdown.Header>
                {
                  [
                    { label: "HTTPS", value: data.clone_url },
                    { label: "SSH", value: data.ssh_url },
                    { label: "GitHub CLI", value: 'gh repo clone ' + data.full_name },
                  ].map((item: any) =>
                    <div key={item.label} className="input-group input-group-sm py-2 px-4">
                      <div className="input-group-text">{item.label}</div>
                      <FormControl onMouseUp={selectAll} defaultValue={item.value} readOnly className="truncate" />
                      <Button onClick={copyToClipboard} variant="outline-secondary">Copy</Button>
                    </div>
                  )
                }
                <hr className="my-2" />
                <Dropdown.Item
                  href={`https://github.com/${user}/${reponame}/archive/refs/heads/${data.default_branch}.zip`}
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
            <a href={data.homepage} target="_blank" rel="noopener noreferrer" className="no-underline font-semibold">
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
          
          {markdown && (
            <div className="markdown-view my-5">
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                components={{
                  code({ node, inline, className, children, ...props }){
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <CodeDisplay
                        language={match[1]}
                        {...props}
                      >
                        {children}
                      </CodeDisplay>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {markdown}
              </ReactMarkdown>
            </div>
          )}
        </>
      }
    </div>
  );
}
