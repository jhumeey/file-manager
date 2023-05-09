import type { ReactElement } from "react";
import { Fragment, useState } from "react";
import { Menu, Transition, Dialog } from "@headlessui/react";
import type { NextPageWithLayout } from "./_app";
import Layout from "@/layouts/main";
import { GetServerSideProps } from "next";
import { octokit } from "../utils/github-config";
import {
  PlusSmallIcon,
  FolderIcon,
  DocumentIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/20/solid";
import Modal from "@/components/Modal";

type Props = {
  repo: any;
  contents: any;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Home: NextPageWithLayout<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [currentBlobUrl, setBlobUrl] = useState("");
  function closeModal() {
    setOpen(false);
  }

  function openModal(url) {
    setBlobUrl(url);
    setOpen(true);
  }
  console.log(props.contents);
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
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
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
                    <div className="flex gap-1 text-white">
                      {content.type === "dir" ? (
                        <FolderIcon
                          className="-ml-1.5 h-5 w-5"
                          aria-hidden="true"
                        />
                      ) : (
                        <DocumentIcon
                          className="-ml-1.5 h-5 w-5"
                          aria-hidden="true"
                        />
                      )}{" "}
                      <a href={content.html_url}> {content.name}</a>
                    </div>
                  </td>
                  <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell">
                    <a> {content.size}</a>
                  </td>
                  <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 px-3 py-2 text-sm font-semibold text-white shadow-sm">
                          <EllipsisHorizontalIcon
                            className="-ml-1.5 h-5 w-5"
                            aria-hidden="true"
                          />
                        </Menu.Button>
                      </div>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="py-1">
                            {content.type === "dir" ? (
                              ""
                            ) : (
                              <>
                                <Menu.Item>
                                  {({ active }) => (
                                    <a
                                      href="#"
                                      className={classNames(
                                        active
                                          ? "bg-gray-100 text-gray-900"
                                          : "text-gray-700",
                                        "block px-4 py-2 text-sm"
                                      )}
                                      onClick={() =>
                                        openModal(`${content.sha}`)
                                      }
                                    >
                                      Edit
                                    </a>
                                  )}
                                </Menu.Item>
                              </>
                            )}
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="#"
                                  className={classNames(
                                    active
                                      ? "bg-gray-100 text-gray-900"
                                      : "text-gray-700",
                                    "block px-4 py-2 text-sm"
                                  )}
                                >
                                  Delete
                                </a>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal open={open} closeModal={closeModal} currentBlob={currentBlobUrl} />
    </div>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getServerSideProps: GetServerSideProps = async () => {
  let data, content;
  try {
    data = await octokit.request("GET /repos/{owner}/{repo}", {
      owner: "jhumeey",
      repo: "file-manager",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
  } catch (error) {
    // Handle the error for the first request
    console.error("Error occurred while fetching repo data:", error);
  }
  try {
    content = await octokit.request("GET /repos/{owner}/{repo}/contents", {
      owner: "jhumeey",
      repo: "file-manager",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
  } catch (error) {
    // Handle the error for the second request
    console.error("Error occurred while fetching contents:", error);
  }
  return {
    props: { repo: data?.data, contents: content?.data },
  };
};

export default Home;
