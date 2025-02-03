"use client";

import { Button } from "@/components/ui/button";
import botChatLogo from "@/assets/chat-page-image/bot-chat-logo.png";
import sendButtonIcon from "@/assets/chat-page-image/send-button-icon.png";
import chatPageRobot from "@/assets/chat-page-image/bot-chat-logo.png";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { getAccessToken } from "@/utils/getAccessToken";
import { Paperclip } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string>("");

  // const [error, setError] = useState<string | null>(null);

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

  // const onSubmit = async (data: FormValues) => {
  //   if (isLoading) return;

  //   setIsLoading(true);

  //   try {
  //     const token = await getAccessToken();
  //     const formData = new FormData();

  //     if (selectedFile) {
  //       formData.append("file", selectedFile); // Add the file
  //     }

  //     // const URL = "http://localhost:5000";
  //     const URL = "https://aspiresys-ai-server.vercel.app";

  //     const response = await axios.post(
  //       `${URL}/api/bff/users/xstore-chatgpt`,
  //       formData, // Send the form data
  //       {
  //         params: { userQuery: data.query }, // Send userQuery as URL parameter
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         timeout: 360000, // 6 minutes
  //       }
  //     );
  //     setResponse(response.data.xstoreResponse);
  //     reset(); // Clear form only on success
  //     setSelectedFile(null);
  //   } catch (error) {
  //     console.error("Error:", error);
  //   } finally {
  //     setIsLoading(false);
  //     // abortControllerRef.current = null;
  //   }
  // };

  // Enhanced onSubmit function
  // const onSubmit = async (data: FormValues) => {
  //   if (isLoading) return;

  //   setIsLoading(true);
  //   setError(null);

  //   try {
  //     const token = await getAccessToken();
  //     const formData = new FormData();

  //     if (selectedFile) {
  //       // Validate file type before upload
  //       const allowedTypes = [
  //         "application/pdf",
  //         "text/plain",
  //         "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  //       ];

  //       if (!allowedTypes.includes(selectedFile.type)) {
  //         throw new Error("Only PDF, TXT, and DOCX files are allowed");
  //       }

  //       formData.append("file", selectedFile);
  //     }

  //     // const URL = "http://localhost:5000";
  //     const URL = "https://aspiresys-ai-server.vercel.app";

  //     const response = await axios.post(
  //       `${URL}/api/bff/users/xstore-chatgpt`,
  //       formData,
  //       {
  //         params: { userQuery: data.query },
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           // Let axios set Content-Type automatically
  //         },
  //         timeout: 360000,
  //       }
  //     );

  //     setResponse(response.data.xstoreResponse);
  //     reset();
  //     setSelectedFile(null);
  //   } catch (error) {
  //     let errorMessage = "An unexpected error occurred";

  //     if (axios.isAxiosError(error)) {
  //       errorMessage = error.response?.data?.error || error.message;
  //     } else if (error instanceof Error) {
  //       errorMessage = error.message;
  //     }

  //     setError(errorMessage);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const onSubmit = async (data: FormValues) => {
    if (isLoading) return;

    setIsLoading(true);
    // setError(null);
    setResponse("");

    try {
      const token = await getAccessToken();
      const formData = new FormData();

      if (selectedFile) {
        const allowedTypes = [
          "application/pdf",
          "text/plain",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        if (!allowedTypes.includes(selectedFile.type))
          throw new Error("Only PDF, TXT, and DOCX files are allowed");

        formData.append("file", selectedFile);
      }

      const URL = "https://aspiresys-ai-server.vercel.app";
      // const URL = "http://localhost:5000";

      // Step 1: Submit request and get jobId
      const { data: jobResponse } = await axios.post(
        `${URL}/api/bff/users/xstore-chatgpt`,
        formData,
        {
          params: { userQuery: data.query },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const jobId = jobResponse.jobId;
      if (!jobId) throw new Error("Failed to get jobId");

      // Step 2: Poll for job completion
      let status = "processing";
      let responseData = null;

      while (status === "processing") {
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Poll every 5 seconds

        const { data: statusResponse } = await axios.get(
          `${URL}/api/bff/users/xstore-chatgpt/status/${jobId}`
        );
        status = statusResponse.status;

        if (status === "completed") {
          responseData = statusResponse.data;
        } else if (status === "failed") {
          throw new Error(statusResponse.error || "Job failed");
        }
      }

      setResponse(responseData.xstoreResponse);
      reset(); // Clear form only on success
      setSelectedFile(null);
    } catch (error) {
      let errorMessage = "An unexpected error occurred";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.log("Error:", errorMessage);
      // setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
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

          {isLoading && (
            <div className="ml-20 animate-spin rounded-full h-6 w-6 border-b-2 border-purple-700" />
          )}

          {/* {error && (
            <div className="text-red-500 mb-4 pl-20 flex items-center gap-2 animate-fade-in">
              ⚠️ {error}
              <button
                onClick={() => setError(null)}
                className="text-gray-500 hover:text-gray-700 ml-2"
              >
                ×
              </button>
            </div>
          )} */}

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

                  {/* File selection */}
                  <Button
                    className="absolute right-16 top-1/2 -translate-y-1/2 font-normal rounded-full bg-[#804C9E] hover:bg-[#804C9E] text-white"
                    onClick={() =>
                      document.getElementById("fileInput")?.click()
                    }
                    type="button"
                  >
                    <Paperclip />
                  </Button>
                  <button
                    type="submit"
                    className="absolute right-6 top-1/2 -translate-y-1/2"
                    disabled={
                      !selectedFile ||
                      typeof watch("query") === "undefined" ||
                      isLoading
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
