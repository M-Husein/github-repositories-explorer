import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { GithubDetailRepoResponse } from '@/types/github';

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const repo = searchParams.get("repo") || "";

    if(!username){
      return NextResponse.json(
        { error: "username is required" },
        { status: 400 }
      );
    }

    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    const { data }: GithubDetailRepoResponse = await octokit.request(
      'GET /repos/{owner}/{repo}',
      {
        owner: username,
        repo,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    );

    return NextResponse.json(data);
  } catch(e){
    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
};
