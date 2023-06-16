import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { GithubRepoResponse, GithubUsernameResponse } from '@/types/github';

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username") || "";

    if(!username){
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    const { data: profile }: GithubUsernameResponse = await octokit.request(
      "GET /users/{username}",
      { username }
    );

    const { data: repos }: GithubRepoResponse = await octokit.request(
      "GET /users/{username}/repos",
      {
        username,
        per_page: profile.public_repos,
      }
    );

    return NextResponse.json({ profile, repos });
  } catch(e){
    return NextResponse.json(
      { message: "Something wrong" },
      { status: 500 }
    );
  }
};
