import { Octokit } from "octokit";

export const octokit = new Octokit({ 
  auth: process.env.F_TOKEN,
});