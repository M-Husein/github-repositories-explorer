import type { Metadata } from 'next';
import { APP_NAME, APP_URL } from '@/const/APPS';

export const metadata: Metadata = {
  title: "About",
  openGraph: {
    title: "About | " + APP_NAME,
    url: APP_URL,
    siteName: APP_NAME,
    images: [
      {
        url: APP_URL + "/img/logo-512x512.png",
        width: 512,
        height: 512,
      }
    ],
    locale: "en",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About | " + APP_NAME,
    images: [APP_URL + "/img/logo-512x512.png"],
  },
}

export default function About(){
  return (
    <div className="w-full max-w-5xl mx-auto p-4 flex flex-col">
      <h1 className="h3 text-center">About {APP_NAME}</h1>
    </div>
  );
}
