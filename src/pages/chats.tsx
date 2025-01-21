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
    watch,
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${
      sizes[i]
    }`;
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
              className="prose prose-sm max-w-none text-sm w-4/6 text-[#232323] bg-[#FFFFFF] drop-shadow-[0_3px_6px_#00000029] ml-20 mb-24 px-7 py-4 text-[12px] rounded-r-xl rounded-bl-2xl"
              dangerouslySetInnerHTML={{ __html: response }}
            />
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
            className="flex flex-col"
          >
            {/* Chat Input */}
            <div className="absolute bottom-24 w-1/2 rounded-full drop-shadow-lg border bg-[#FFFFFF]">
              <div className="container mx-auto max-w-4xl px-5">
                {selectedFile && (
                  <div className="flex flex-wrap gap-2 mb-1 items-center px-7 py-1 w-6/12 rounded-full drop-shadow-lg">
                    <div className="flex flex-col">
                      <span className="text-sm text-ellipsis truncate max-w-[200px]">
                        {selectedFile.name}
                      </span>
                      <span className="text-xs ">
                        {formatFileSize(selectedFile.size)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-gray-500 hover:text-gray-800"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="flex gap-2">
                  <textarea
                    placeholder={
                      errors.query
                        ? errors.query.message
                        : `Type your question here...`
                    }
                    className={`w-full px-7 pt-5 rounded-full drop-shadow-lg bg-transparent outline-none ${
                      errors.query ? "placeholder-red-500" : ""
                    }`}
                    {...register("query", { required: "Question is required" })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSubmit(onSubmit)();
                      }
                    }}
                  />
                  <button
                    type="submit"
                    className="absolute right-6 top-1/2 -translate-y-1/2"
                    disabled={
                      !selectedFile || typeof watch("query") === "undefined"
                    }
                  >
                    <img src={sendButtonIcon} width={30} alt="Send" />
                  </button>
                </div>
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
