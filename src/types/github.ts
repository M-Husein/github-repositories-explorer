import { Endpoints } from '@octokit/types';

export type GithubSearchUsersResponse = Endpoints["GET /search/users"]["response"];

export type GithubRepoResponse = Endpoints["GET /users/{username}/repos"]["response"];

export type GithubUsernameResponse = Endpoints["GET /users/{username}"]["response"];

export type GithubDetailRepoResponse = Endpoints["GET /repos/{owner}/{repo}"]["response"];
