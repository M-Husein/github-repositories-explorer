import { Metadata } from 'next';
import { RepoDetail } from '@/components/RepoDetail';
import { APP_NAME } from '@/const/APPS';

type pageProps = {
  params: { user?: string, repo?: string }
}

// export const metadata: Metadata = {
//   title: "Detail repository",
//   openGraph: {
//     title: "Detail repository | " + APP_NAME,
//   },
//   twitter: {
//     title: "Detail repository | " + APP_NAME
//   },
// }

export async function generateMetadata(
  { params }: pageProps,
  // parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  // const id = params.id
 
  // // fetch data
  // const product = await fetch(`https://.../${id}`).then((res) => res.json())
 
  // // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || []
 
  // return {
  //   title: product.title,
  //   openGraph: {
  //     images: ['/some-specific-page-image.jpg', ...previousImages],
  //   },
  // }

  const { user, repo } = params;
  const title = user && repo ? user + '/' + repo : "Detail repository";
  // const title = user + '/' + repo;

  return {
    title,
    openGraph: {
      title: title + " | " + APP_NAME,
    },
    twitter: {
      title: title + " | " + APP_NAME
    },
  }
}

export default function Detail({ params }: pageProps){
  return (
    <div className="w-full max-w-5xl mx-auto p-4 flex flex-col">
      <RepoDetail {...params} />
    </div>
  );
}
