"use client";

import { Button } from "@/components/ui/button";
import botChatLogo from "@/assets/chat-page-image/bot-chat-logo.png";
import sendButtonIcon from "@/assets/chat-page-image/send-button-icon.png";
import chatPageRobot from "@/assets/chat-page-image/bot-chat-logo.png";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { fetchToken } from "@/utils/generateToken";

type FormValues = {
  query: string;
};

export default function ChatInterface() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string>("");

  const suggestions = [
    "Create a Functional Requirement Document for the attached Transcript",
    "Generate a Test Case Document for Customer Registration use case in an ECommerce website",
    "Generate Test Data for Registered Customers of an ECommerce Website",
  ];

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null); // Clear the selected file
  };

  const onSubmit = async (data: FormValues) => {
    const token = await fetchToken();

    const formData = new FormData();
    if (selectedFile) {
      formData.append("file", selectedFile); // Add the file
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/bff/users/xstore-chatgpt`,
        formData, // Send the form data
        {
          params: { userQuery: data.query }, // Send userQuery as URL parameter
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResponse(response.data.xstoreResponse);
    } catch (error) {
      console.error("Error:", error);
    }

    reset(); 
    setSelectedFile(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center">
                <img
                  src={botChatLogo}
                  alt="AI Assistant Avatar"
                  width={65}
                  height={65}
                  className="rounded-full"
                />
              </div>
              <p className="text-[#232323] bg-[#FFFFFF] drop-shadow-[0_3px_6px_#00000029] px-7 py-3 text-sm rounded-r-xl rounded-bl-2xl">
                How may I help you?
              </p>
              <Button
                variant="destructive"
                className="bg-[#EF4869] text-white font-normal rounded-full hover:bg-[#EF4869] hover:text-white"
                onClick={() => document.getElementById("fileInput")?.click()}
                type="button"
              >
                + Add a File
              </Button>
              <input
                name="file"
                type="file"
                id="fileInput"
                className="hidden"
                onChange={onFileChange}
              />
            </div>
            {/* <Button
            variant="outline"
            className="w-fit rounded-full text-sm ring-1 ring-[#804C9E] bg-[#804C9E0D]"
          >
            Customize GPT
          </Button> */}
          </div>

          {/* Suggestion Chips */}
          <div className="flex flex-col gap-3 mb-8 pl-20">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-fit rounded-full text-sm ring-1 ring-[#804C9E] bg-[#804C9E0D]"
                onClick={() => setValue("query", suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>

          {response && (
            <div
              className="text-sm w-4/6 text-[#232323] bg-[#FFFFFF] drop-shadow-[0_3px_6px_#00000029] ml-20 mb-24 px-7 py-4 text-[12px] rounded-r-xl rounded-bl-2xl"
              dangerouslySetInnerHTML={{ __html: response }}
            />
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
            className="flex flex-col"
          >
            {/* Chat Input */}
            <div className="mt-auto absolute bottom-24 w-1/2">
              <div className="relative">
                <input
                  placeholder="Type your question here..."
                  className={`w-full py-4 px-7 rounded-full drop-shadow-lg ${
                    selectedFile ? "pr-20" : ""
                  }`}
                  {...register("query")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSubmit(onSubmit)();
                    }
                  }}
                />
                {errors.query && (
                  <span className="text-red-500 text-sm absolute -bottom-6 left-0">
                    {errors.query.message}
                  </span>
                )}

                {/* Display Selected File */}
                {selectedFile && (
                  <div className="absolute top-1/4 -translate-y-1/2 flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                    <span className="text-sm text-gray-600">
                      {selectedFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-gray-500 hover:text-gray-800"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  className="absolute right-6 top-1/2 -translate-y-1/2"
                >
                  <img src={sendButtonIcon} width={30} alt="Send" />
                </button>
              </div>
            </div>

            {/* Bot Image */}
            <div className="fixed bottom-24 -right-7 pointer-events-none">
              <img
                src={chatPageRobot}
                alt="Decorative Robot"
                width={200}
                height={200}
                className="object-contain"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
