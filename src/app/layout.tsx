import '../styles/globals.scss';
import type { Metadata } from 'next';
import { Provider } from '@/components/Provider';
import { NavMain } from '@/components/NavMain';
import { Main } from '@/components/Main';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'GitHub repositories explorer',
  description: 'React application which integrates with github.com API and allows user to search for up to 5 users with a username similar to the value entered in text input.',
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
