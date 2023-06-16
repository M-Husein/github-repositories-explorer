import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
// import { GithubSearchUsersResponse } from "@/types/github";

export const POST = async (request: Request) => {
  try {
    const { username } = await request.json();

    if(!username){
      return NextResponse.json(
        { error: "username is required" },
        { status: 400 }
      );
    }

    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    // GithubSearchUsersResponse
    const { data }: any = await octokit.search.users({
      q: username,
      per_page: 5,
    });

    return NextResponse.json(data);
  } catch(e) {
    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
};
