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
import { useSearchParams } from "react-router";
import { useAppSelector } from "@/redux/hooks";
import {
  selectCustomerId,
  selectIsCustomerIdSelected,
} from "@/redux/slices/userSlice";
import { useToast } from "@/hooks/use-toast";
// import { useToast } from "@/hooks/use-toast";

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
  const [searchParams] = useSearchParams();
  const storeCode = searchParams.get("storeCode") || "aspiresys-ai-xstore";
  const selectedEmail = useAppSelector(selectCustomerId);
  const isEmailSelected = useAppSelector(selectIsCustomerIdSelected);
  const { toast } = useToast();

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
    if (isLoading) return;
    if (!isEmailSelected) {
      toast({
        title: "Name Required",
        description: "Please select a name before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // setError(null);
    setResponse("");

    try {
      const token = await getAccessToken();
      const formData = new FormData();

      if (selectedFile) {
        const allowedTypes = [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        if (!allowedTypes.includes(selectedFile.type))
          throw new Error("Only PDF and DOCX files are allowed");

        formData.append("file", selectedFile);
      }

      // Add storeCode to the form data
      formData.append("storeCode", storeCode);

      const URL = import.meta.env.VITE_SERVER_BASE_URL;
      // const URL = "http://localhost:5000";

      // Step 1: Submit request and get jobId
      const { data: jobResponse } = await axios.post(
        `${URL}/api/bff/users/xstore-chatgpt?userId=${selectedEmail}&registered=true`,
        formData,
        {
          params: {
            userQuery: data.query,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const jobId = jobResponse.jobId;
      if (!jobId) throw new Error("Failed to get jobId");

      // Step 2: Poll for job completion
      let status = "processing";
      let responseData = null;

      while (status === "processing") {
        await new Promise((resolve) => setTimeout(resolve, 8000)); // Poll every 5 seconds

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
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
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
    <div className="flex flex-col h-[calc(100vh-8rem)] w-full">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl flex flex-col items-center mx-auto p-4">
          <div className="flex items-center w-full justify-between mb-4">
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
                accept=".docs, .pdf"
                onChange={onFileChange}
              />
            </div>
          </div>

          {/* Suggestion Chips */}
          <div className="flex flex-col w-full gap-3 mb-8 pl-20">
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

          {response && (
            <div
              className="prose w-full prose-sm max-w-none text-sm text-[#232323] bg-[#FFFFFF] drop-shadow-[0_3px_6px_#00000029] ml-20 mb-24 px-7 py-4 text-[12px] rounded-r-xl rounded-bl-2xl"
              dangerouslySetInnerHTML={{ __html: response }}
            />
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
            className="flex flex-col items-center"
          >
            {/* Chat Input */}
            <div className="absolute bottom-8 w-1/2 rounded-full drop-shadow-lg border bg-[#FFFFFF]">
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
                    className={`absolute right-6 top-1/2 -translate-y-1/2 transition-all duration-200 ${
                      typeof watch("query") === "undefined" ||
                      watch("query") === "" ||
                      isLoading ||
                      !isEmailSelected
                        ? "opacity-60"
                        : ""
                    }`}
                    disabled={
                      typeof watch("query") === "undefined" ||
                      watch("query") === "" ||
                      isLoading ||
                      !isEmailSelected
                    }
                    onClick={(e) => {
                      if (!isEmailSelected) {
                        e.preventDefault();
                        toast({
                          title: "Name Required",
                          description: "Please select a name before submitting",
                          variant: "destructive",
                        });
                      }
                    }}
                    title={
                      !isEmailSelected ? "Please select a name first" : "Send"
                    }
                    style={{
                      cursor:
                        typeof watch("query") === "undefined" ||
                        watch("query") === "" ||
                        isLoading ||
                        !isEmailSelected
                          ? "not-allowed"
                          : "pointer",
                      filter:
                        typeof watch("query") === "undefined" ||
                        watch("query") === "" ||
                        isLoading ||
                        !isEmailSelected
                          ? "grayscale(80%)"
                          : "none",
                    }}
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
