"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import regisernow from "@/assets/registernnow.png";

type FormValues = {
  email: string;
  password: string;
  retypePassword: string;
};

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
      retypePassword: "",
    },
  });

  const fetchToken = async (): Promise<string | null> => {
    const URL = "https://aspiresys-ai-server.vercel.app";
    // const URL = import.meta.env.VITE_API_URL;
    try {
      const response = await axios.get(`${URL}/api/auth/token`);
      if (response.status === 200 && response.data.access_token) {
        return response.data.access_token;
      } else {
        console.error("Failed to fetch token:", response.data);
        return null;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error fetching token:", error.response || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      return null;
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { email, password } = data;
    const [localPart] = email.split("@");
    const [firstName, lastName = "Unknown"] = localPart.split(".");

    const payload = {
      firstName,
      lastName,
      emailId: email,
      password,
    };

    try {
      const token = await fetchToken();
      if (!token) {
        alert("Failed to fetch token. Please try again.");
        return;
      }

      // Save token in localStorage
      localStorage.setItem("registrationToken", token);
      // "https://dev.aurascc.net/web-bff/customers",
      // "http://localhost:5000/api/web-bff/customers",
      const URL = "https://aspiresys-ai-server.vercel.app";

      const response = await axios.post(
        `${URL}/api/web-bff/customers`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Registration successful!");
        reset();
      } else {
        console.error("Failed to register user:", response.data);
        alert(
          `Registration failed: ${
            response.data.message || "Please try again later."
          }`
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "API Error during registration:",
          error.response || error.message
        );
      } else {
        console.error("Unexpected error:", error);
      }
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="bg-[#FAFAFA] pl-24 flex flex-col md:flex-row items-center justify-between">
      {/* Form Section */}
      <div className="w-full max-w-96">
        <h1 className="text-2xl font-bold mb-3">REGISTER NOW</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <div>
            <Label
              htmlFor="email"
              className="block text-xs text-[#000000] font-medium mb-1"
            >
              Your Aspire Email ID:
            </Label>
            <Input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email address",
                },
              })}
              className=" p-2 text-sm border border-solid border-[#707070] rounded"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <Label
              htmlFor="password"
              className="block text-xs font-medium mb-1"
            >
              Your Password:
            </Label>
            <Input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className=" p-2 text-sm border border-solid border-[#707070] rounded"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>

          <div>
            <Label
              htmlFor="retypePassword"
              className="block text-xs font-medium mb-1"
            >
              Retype Password:
            </Label>
            <Input
              type="password"
              {...register("retypePassword", {
                required: "Retype Password is required",
                validate: (value) =>
                  value === watch("password") || "Password does not match",
              })}
              className="p-2 text-sm border border-solid border-[#707070] rounded"
            />
            {errors.retypePassword && (
              <span className="text-red-500 text-sm">
                {errors.retypePassword.message}
              </span>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="bg-[#EF4869] hover:bg-[#ff4d6d]/90 text-[#FFFFFF] border rounded-full text-sm px-8 py-2"
            >
              Submit
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-[#ff4d6d] text-[#EF4869] hover:bg-[#ff4d6d]/10 rounded-full text-sm px-8 py-2"
              onClick={() => reset()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
      {/* Illustration Section */}
      <div className="w-[400px] h-[470px] items-center pt-16">
        <img
          src={regisernow}
          alt="Registration Illustration"
          className="max-w-full h-auto"
        />
      </div>
    </div>
  );
}
