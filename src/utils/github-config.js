import { Octokit } from "octokit";

export const octokit = new Octokit({ 
  auth: process.env.NEXT_PUBLIC_F_TOKEN,
});