import { Menu, Transition, Dialog } from "@headlessui/react";
import { Fragment, useState, useEffect, useRef } from "react";
import { octokit } from "@/utils/github-config";
import { Base64 } from "js-base64";

export default function Modal({ open, closeModal, currentBlob, path }) {
  const [content, setContent] = useState("");
  const preRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await octokit.request(
          `GET /repos/{owner}/{repo}/git/blobs/{file_sha}`,
          {
            owner: "jhumeey",
            repo: "file-manager",
            file_sha: `${currentBlob}`,
            headers: {
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );
        const blobData = await response.data;
        const decodedContent = Base64.decode(blobData.content);
        setContent(decodedContent);
      } catch (error) {
        console.error("Error fetching blob content:", error);
      }
    };

    fetchData();
  }, [currentBlob]);

  const handleSaveChanges = async () => {
    if (preRef.current) {
      const content = preRef.current;
      const encodeChanges = Base64.encode(content.toString());
      console.log(path);

      try {
        await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}?ref=main", {
          owner: "jhumeey",
          repo: "file-manager",
          path: `${path}`,
          message: "a new commit message",
          content: `${encodeChanges}`,
          sha: `${currentBlob}`,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        });
      } catch (error) {
        console.error("Error fetching blob content:", error);
      }
    }
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-[1200px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Edit File
                </Dialog.Title>
                <div className="mt-2">
                  <pre
                    contentEditable="true"
                    className="w-auto"
                    id="content"
                    ref={preRef}
                  >
                    {content}
                  </pre>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={handleSaveChanges}
                  >
                    Save Changes
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
