import type { ReactElement } from "react";
import type { NextPageWithLayout } from "./_app";
import Layout from "@/layouts/main";
import { GetServerSideProps } from "next";
import { octokit } from "../utils/github-config";
import { PlusSmallIcon, FolderIcon, DocumentIcon, EllipsisHorizontalIcon } from "@heroicons/react/20/solid";

type Props = {
  repo: any;
  contents: any;
};

const Home: NextPageWithLayout<Props> = (props) => {
  // console.log(props.contents)
  const sortedData = props.contents.sort((a, b) => {
    // First, sort by type: "dir" comes before "file"
    if (a.type === "dir" && b.type === "file") {
      return -1; // "dir" comes first
    } else if (a.type === "file" && b.type === "dir") {
      return 1; // "file" comes first
    }
  
    // If the types are the same or both are not "dir" or "file",
    // sort alphabetically based on the name
    return a.name.localeCompare(b.name);
  });
  
  return (
    <div>
      {" "}
      <div className="relative isolate overflow-hidden pt-16">
        {/* Secondary navigation */}
        <header className="pb-4 pt-6 sm:pb-6">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
            <h1 className="text-2xl font-medium leading-7 text-white capitalize">
              {props.repo.name}
            </h1>

            <a
              href="#"
              className="ml-auto flex items-center gap-x-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlusSmallIcon className="-ml-1.5 h-5 w-5" aria-hidden="true" />
              New invoice
            </a>
          </div>
        </header>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="-mx-4 mt-8 sm:-mx-0">
          <table className="min-w-full divide-y divide-gray-600">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                >
                  Size
                </th>

                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {sortedData.map((content) => (
                <tr key={content.name}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                   <div className="flex gap-1 text-white">{content.type === "dir" ? <FolderIcon className="-ml-1.5 h-5 w-5" aria-hidden="true" /> :<DocumentIcon className="-ml-1.5 h-5 w-5" aria-hidden="true" />} <a> {content.name}</a></div>
                  </td>
                  <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell">
                    <a> {content.size}</a>
                  </td>
                  <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <a
                      href="#"
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <EllipsisHorizontalIcon className="-ml-1.5 h-5 w-5" aria-hidden="true" /><span className="sr-only">, {content.name}</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await octokit.request("GET /repos/{owner}/{repo}", {
    owner: "jhumeey",
    repo: "file-manager",
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  const content = await octokit.request("GET /repos/{owner}/{repo}/contents", {
    owner: "jhumeey",
    repo: "file-manager",
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  return {
    props: { repo: data.data, contents: content.data },
  };
};

export default Home;
