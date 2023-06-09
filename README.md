![GRE](https://raw.githubusercontent.com/M-Husein/github-repositories-explorer/main/img/logo-96x96.png)

# GitHub repositories explorer

React application which integrates with github.com API and allows user to search for up to 5 users with a username similar to the value entered in text input.
	
### Demo App:

**[GitHub repositories explorer](https://github-repositories-explorer-q.netlify.app/)**

### Features:

- Search user by username.
- User repository list.
- Repository details.
- Responsive design.
- Toggle light or dark color scheme.
- Search by voice using **[SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)**, the interface of the **[Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)**.
- Speech content in repository detail page using **[Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)**.

### App screenshots:

![Home](https://raw.githubusercontent.com/M-Husein/github-repositories-explorer/main/img/home.png)

![Home dark](https://raw.githubusercontent.com/M-Husein/github-repositories-explorer/main/img/home_dark.png)

![Search result](https://raw.githubusercontent.com/M-Husein/github-repositories-explorer/main/img/search_result.png)

![Search result dark](https://raw.githubusercontent.com/M-Husein/github-repositories-explorer/main/img/search_result_dark.png)

## Project setup

Clone or download this repo.

First is important copy or rename file **.env.example** to **.env** and configuration your **[GitHub access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)**.

Then install dependencies:

```bash
npm install
```

#### For development, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

#### For Production:

```bash
npm run build
```

<hr />

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
