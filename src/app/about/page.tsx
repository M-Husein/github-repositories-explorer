import type { Metadata } from 'next';
import { APP_NAME, APP_URL } from '@/const/APPS';

const description = `${APP_NAME} is a web-based application created by Muhamad Husein.`;

export const metadata: Metadata = {
  title: "About",
  description,
  openGraph: {
    title: "About | " + APP_NAME,
    description,
    url: APP_URL + "/about",
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
    title: "About | " + APP_NAME,
    description,
    images: [APP_URL + "/img/logo-512x512.png"],
  },
}

export default function About(){
  return (
    <div className="w-full max-w-5xl mx-auto p-4 flex flex-col">
      <h1 className="h3 text-center">
        About
        <br />
        {APP_NAME}
      </h1>
    </div>
  );
}
