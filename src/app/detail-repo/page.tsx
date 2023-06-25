// import type { Metadata, NextPageContext } from 'next';
import { RepoDetail } from '@/components/RepoDetail';
// import { APP_NAME } from '@/const/APPS';

type pageProps = {
  // params: { user: string, repo: string }
  searchParams?: { user?: string, repo?: string }
}

// export async function generateMetadata(
//   { searchParams }: pageProps,
// ): Promise<Metadata> {
//   const title = [searchParams?.user, searchParams?.repo].filter(Boolean).join("/");
//   return {
//     title,
//     openGraph: {
//       title: title + ' | ' + APP_NAME,
//     },
//     twitter: {
//       title: title + ' | ' + APP_NAME,
//     },
//   }
// }

// export const metadata: Metadata = {
//   title: "Detail repository",
//   openGraph: {
//     title: "Detail repository | " + APP_NAME,
//   },
//   twitter: {
//     title: "Detail repository | " + APP_NAME
//   },
// }

export default function Detail({ searchParams }: pageProps){
  // const { user, repo } = searchParams || {};
  // const dynamicData: any = await fetch(`http://localhost:3000/api/github/detail?user=M-Husein&repo=gmap-places-autocomplete-react`, { cache: 'no-store' });

  // console.log('user: ', user);
  // console.log('repo: ', repo);
  // console.log('dynamicData: ', dynamicData);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 flex flex-col">
      <RepoDetail {...searchParams} />
    </div>
  );
}
