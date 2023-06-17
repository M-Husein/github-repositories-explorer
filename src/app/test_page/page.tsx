import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Test page",
}

export default function Page(){
  return (
    <div className="w-full max-w-5xl mx-auto p-4 flex flex-col">
      <h1>Test page</h1>
    </div>
  );
}
