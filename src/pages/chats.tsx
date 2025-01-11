'use client'

import { Button } from "@/components/ui/button"
import botChatLogo from "@/assets/chat-page-image/bot-chat-logo.png"
import sendButtonIcon from "@/assets/chat-page-image/send-button-icon.png"
import chatPageRobot from "@/assets/chat-page-image/bot-chat-logo.png"


export default function ChatInterface() {
  const suggestions = [
    "Create a Functional Requirement Document for the attached Transcript",
    "Generate a Test Case Document for Customer Registration use case in an ECommerce website",
    "Generate Test Data for Registered Customers of an ECommerce Website"
  ]

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col">
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
              Hi! I'm Auras. How may I help you?
            </p>
            <Button variant="destructive" className="bg-[#EF4869] text-white font-normal rounded-full ">
              + Add a File
            </Button>
          </div>
            <Button variant="outline" className="w-fit rounded-full text-sm ring-1  ring-[#804C9E] bg-[#804C9E0D]">
              Customize GPT
            </Button>
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-col gap-3 mb-8 pl-20">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-fit rounded-full text-sm ring-1  ring-[#804C9E] bg-[#804C9E0D]"
            >
              {suggestion}
            </Button>
          ))}
        </div>

        {/* Chat Input */}
        <div className="mt-auto absolute bottom-24 w-1/2">
          <input
            placeholder="Type your question here..."
            className="w-full  py-4 px-7 rounded-full drop-shadow-lg"
          />
          
          <button
            className="absolute right-6 top-1/2 -translate-y-1/2 "
          >
            <img src={sendButtonIcon} width={30} alt="" />
          </button>
        </div>

        {/* Decorative Image */}
        <div className="fixed  bottom-24 -right-7  pointer-events-none">
          <img
            src={chatPageRobot}
            alt="Decorative Robot"
            width={200}
            height={200}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  )
}