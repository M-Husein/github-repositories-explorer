// import { Metadata } from 'next';
import { RepoDetail } from '@/components/RepoDetail';
// import { APP_NAME } from '@/const/APPS';

type pageProps = {
  params: { user: string, reponame: string }
}

// export async function generateMetadata(
//   { params }: pageProps,
// ): Promise<Metadata> {
//   const title = params.user + '/' + params.reponame;
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

export default function Detail({ params }: pageProps){
  return (
    <div className="w-full max-w-5xl mx-auto p-4 flex flex-col">
      <RepoDetail {...params} />
    </div>
  );
}
