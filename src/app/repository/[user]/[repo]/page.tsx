import { Metadata } from 'next';
import { RepoDetail } from '@/components/RepoDetail';
import { APP_NAME, APP_URL } from '@/const/APPS';

type pageProps = {
  params: { user?: string, repo?: string }
}

export async function generateMetadata(
  { params }: pageProps
): Promise<Metadata> {
  const { user, repo } = params;
  const title = user && repo ? user + '/' + repo : "Detail repository";
  const description = `Information about a GitHub repository called ${repo} created by ${user}.`;

  return {
    title,
    description,
    openGraph: {
      title: title + " | " + APP_NAME,
      description,
      url: APP_URL + "/" + title,
      siteName: APP_NAME,
      locale: "en",
      type: "website",
      images: [
        {
          url: APP_URL + "/img/logo-512x512.png",
          width: 512,
          height: 512,
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: title + " | " + APP_NAME,
      description,
      images: [APP_URL + "/img/logo-512x512.png"],
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
