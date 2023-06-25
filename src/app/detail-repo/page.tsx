import type { Metadata } from 'next';
import { RepoDetail } from '@/components/RepoDetail';
import { APP_NAME } from '@/const/APPS';

type pageProps = {
  searchParams?: { user?: string, repo?: string }
}

export const metadata: Metadata = {
  title: "Detail repository",
  openGraph: {
    title: "Detail repository | " + APP_NAME,
  },
  twitter: {
    title: "Detail repository | " + APP_NAME
  },
}

export default function Detail({ searchParams }: pageProps){
  return (
    <div className="w-full max-w-5xl mx-auto p-4 flex flex-col">
      <RepoDetail {...searchParams} />
    </div>
  );
}
