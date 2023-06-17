import '../styles/globals.scss';
import type { Metadata } from 'next';
import { Provider } from '@/components/Provider';
import { NavMain } from '@/components/NavMain';
import { Main } from '@/components/Main';
import { Footer } from '@/components/Footer';
import { APP_NAME, APP_DESCRIPTION, APP_URL } from '@/const/APPS';

export const metadata: Metadata = {
  title: {
    template:  `%s | ${APP_NAME}`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  authors: [{ name: "Muhamad Husein", url: "https://www.linkedin.com/in/muhamad-husein" }],
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f9fa' },
    { media: '(prefers-color-scheme: dark)', color: '#2b3035' },
  ],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    url: APP_URL,
    siteName: APP_NAME,
    images: [
      {
        url: APP_URL + "/img/gre.png",
        width: 1917,
        height: 927,
      }
    ],
    locale: "en",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [APP_URL + "/img/gre.png"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <Provider>
          <NavMain />
          <Main>{children}</Main>
          <Footer />
        </Provider>
      </body>
    </html>
  )
}
