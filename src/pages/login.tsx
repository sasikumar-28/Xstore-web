"use client";

import { NavLink, useNavigate } from "react-router";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import loginPageRobot from "@/assets/login-page-image/login-page-robot.png";
import submitButtonIcon from "@/assets/login-page-image/submit-icon.png";
import leftQuote from "@/assets/login-page-image/quote-left.png";
import rightQuote from "@/assets/login-page-image/quote-right.png";

interface FormValues {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {

    const { email, password } = data;
    const payload = {
      emailId: email,
      password,
    };

    try {
      // const token = await fetchToken();
      // if (!token) {
      //   alert("Failed to fetch token. Please try again.");
      //   return;
      // }
      const token = localStorage.getItem("registrationToken");

      if (!token) {
        alert("Token not found. Please register again.");
        return;
      }

      const URL = "https://aspiresys-ai-server.vercel.app";
      const response = await axios.post(
        `${URL}/api/web-bff/customers/login`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Login successful!");
        navigate("/chats");
        reset();
      } else {
        console.error("Failed to login user:", response.data);
        alert(
          `Login failed: ${response.data.message || "Please try again later."}`
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "API Error during login:",
          error.response || error.message
        );
      } else {
        console.error("Unexpected error:", error);
      }
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="container w-full flex py-12 md:flex-row items-center justify-around z-10">
      {/* Left Column */}
      {/* <div className="flex  "> */}
      <div className="absolute top-24 left-24">
        <img src={leftQuote} alt="" width={100} className="" />
      </div>
      <div className="fixed -left-14 z-0">
        <img
          src={loginPageRobot}
          alt="Aspire AI Illustration"
          width={200}
          className="object-cover"
        />
      </div>

      <div className="flex gap-24 justify-center w-full mx-44">
        <div className="my-10">
          <h1 className="text-2xl font-bold mb-7">
            Welcome to Aspire AI, where innovation meets creativity!!!
          </h1>
          <p className="text-lg font-medium">
            Unleash your productivity with Aspire's GenAI. Say goodbye to
            repetitive tasks and hello to smarter workdays. Our AI-powered
            platform is here to handle the busy work, so you can focus on what
            truly matters. Let Aspire's GenAI automate your daily grind and
            elevate your efficiency. It's time to work smarter, not harder!
          </p>
        </div>
        {/* </div> */}

        {/* Right Column - Login Form */}
        <div className=" border border-dashed border-[#804C9E] rounded-lg p-3">
          <div className="w-80 border border-white-500 rounded p-7 drop-shadow-2xl">
            <h2 className="text-xl font-bold text-center mb-6">
              Login to Your Account
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
              <div>
                <Label
                  htmlFor="email"
                  className="block text-xs font-medium mb-1"
                >
                  Enter your Aspire Email ID*
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="p-2 text-sm border border-solid border-[#707070] rounded"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="password"
                  className="block text-xs font-medium mb-1"
                >
                  Enter your Password*
                </Label>
                <Input
                  id="password"
                  type="password"
                  className="p-2 text-sm border border-solid border-[#707070] rounded"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col justify-between items-center">
                <button className="w-12 h-12">
                  <img
                    src={submitButtonIcon}
                    alt="Aspire AI Illustration"
                    className="object-cover"
                  />
                </button>
                <div className="text-center items-center">
                  <NavLink
                    to="/register"
                    className="text-xs text-[#000000] hover:underline"
                  >
                    Don't have an account? Register here
                  </NavLink>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* <div className="flex  "> */}
      <div className="absolute bottom-24 left-56">
        <img src={rightQuote} alt="" width={100} className="" />
      </div>
    </div>
  );
}
