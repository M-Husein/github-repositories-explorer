import { Metadata } from 'next';
import { RepoDetail } from '@/components/RepoDetail';
import { APP_NAME } from '@/const/APPS';

type pageProps = {
  // params: { user: string, repo: string }
  searchParams?: { user?: string, repo?: string }
}

export async function generateMetadata(
  { searchParams }: pageProps,
): Promise<Metadata> {
  const title = [searchParams?.user, searchParams?.repo].filter(Boolean).join("/");
  return {
    title,
    openGraph: {
      title: title + ' | ' + APP_NAME,
    },
    twitter: {
      title: title + ' | ' + APP_NAME,
    },
  }
}

export default function Detail({ searchParams }: pageProps){
  return (
    <div className="w-full max-w-5xl mx-auto p-4 flex flex-col">
      <RepoDetail {...searchParams} />
    </div>
  );
}
