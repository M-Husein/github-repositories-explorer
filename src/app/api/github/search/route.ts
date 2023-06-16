import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { GithubSearchUsersResponse } from '@/types/github';

export const POST = async (request: Request) => {
  try {
    const { username } = await request.json();

    if(!username){
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    const { data }: GithubSearchUsersResponse = await octokit.search.users({
      q: username,
      per_page: 5,
    });

    return NextResponse.json(data);
  } catch(e) {
    return NextResponse.json(
      { message: "Something wrong" },
      { status: 500 }
    );
  }
};
