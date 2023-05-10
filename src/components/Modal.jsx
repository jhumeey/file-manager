import { Transition, Dialog } from "@headlessui/react";
import { Fragment, useState, useEffect, useRef } from "react";
import { octokit } from "@/utils/github-config";
import { Base64 } from "js-base64";

export default function Modal({ open, closeModal, currentFileContent, path }) {
  const [content, setContent] = useState("");
  const preRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await octokit.request(
          `GET /repos/{owner}/{repo}/git/blobs/{file_sha}`,
          {
            owner: "jhumeey",
            repo: "play",
            file_sha: `${currentFileContent}`,
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
  }, [currentFileContent]);

  const handleSaveChanges = async () => {
    if (preRef.current) {
      const content = preRef.current.textContent.trim();
      const encodeChanges = Base64.encode(content.toString());
      console.log(path);

      try {
        await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
          owner: "jhumeey",
          repo: "play",
          path: `${path}`,
          message: "a new commit message",
          content: `${encodeChanges}`,
          sha: `${currentFileContent}`,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        });
        closeModal();
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
              <Dialog.Panel className="w-fit transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Edit File
                </Dialog.Title>
                <div className="mt-2 text-black">
                  <pre
                    contentEditable="true"
                    className="w-auto p-8"
                    id="content"
                    ref={preRef}
                  >
                    {content}
                  </pre>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex gap-4 sm:flex-row-reverse">
                <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={handleSaveChanges}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={closeModal}
                  >
                    Cancel
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
