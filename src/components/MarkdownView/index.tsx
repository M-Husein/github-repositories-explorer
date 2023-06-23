'use client';

import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { CodeView } from '@/components/CodeView';
import { cx } from '@/utils';

export const MarkdownView = ({
  children,
  className,
  blockquoteClass,
  iframeClass,
  linkClass,
  paragraphClass,
  tableClass,
  onMounted
}: any) => {
  
  useEffect(() => {
    if(typeof onMounted === 'function'){
      onMounted();
    }
  }, [onMounted]);

  const a = ({ node, className, ...props }: any) => {
    const isExternal = props.href !== window.location.origin;
    return (
      <a
        {...props}
        className={cx(className, linkClass)}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      />
    );
  }

  const blockquote = ({ node, className, ...props }: any) => (
    <blockquote {...props} className={cx("blockquote", className, blockquoteClass)} />
  );

  const code = ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <CodeView
        language={match[1]}
        {...props}
      >
        {children}
      </CodeView>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  }

  const headerTag = ({ node, align, level, className, ...props }: any) => {
    const As = node.tagName;
    return (
      <As
        {...props}
        className={cx(align === 'center' && 'text-center', className)}
      />
    )
  }

  const iframe = ({ node, className, width, height, ...props }: any) => (
    <iframe
      {...props}
      className={cx("aspect-video w-full", className, iframeClass)}
    />
  );

  
  const img = ({ node, alt, ...props }: any) => (
    // eslint-disable-next-line
    <img
      {...props}
      alt={alt || "i"}
      loading="lazy"
      decoding="async"
      // fetchPriority="low" // OPTION: https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/fetchPriority
      draggable={false}
    />
  );

  const p = ({ node, align, className, ...props }: any) => (
    <p
      {...props}
      className={cx(align === 'center' && 'text-center', className, paragraphClass)}
    />
  );

  const table = ({ node, className, ...props }: any) => (
    <div className="table-responsive">
      <table
        {...props}
        className={cx("table", className, tableClass)}
      />
    </div>
  );

  return (
    <ReactMarkdown
      className={cx("md-view", className)}
      remarkPlugins={[
        remarkGfm, // @ts-ignore
        { singleTilde: false, tableCellPadding: true, tablePipeAlign: true }
      ]}
      rehypePlugins={[rehypeRaw]}
      components={{
        a,
        blockquote,
        code,
        h1: headerTag,
        h2: headerTag,
        h3: headerTag,
        h4: headerTag,
        h5: headerTag,
        h6: headerTag,
        img,
        iframe,
        p,
        table,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
