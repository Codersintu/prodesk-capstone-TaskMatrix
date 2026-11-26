"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginUserInput, loginUserSchema } from "../../lib/CreateSchema";
import { toast } from "react-toastify";

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const methods=useForm<LoginUserInput>({
    resolver: zodResolver(loginUserSchema)
  })
  
  const {register, handleSubmit, formState:{errors, isSubmitting}}=methods;

  const  onSubmitHandler: SubmitHandler<LoginUserInput>=async (values) =>{

    try {
      if (mode === "signup") {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: values.email, password: values.password }),
        });
        const result = await response.json();
        
        if (!response.ok) {
          const message =
            result?.message ?? "Unable to create your account.";
          toast.error(message);
          return;
        }

        toast.success("Account created successfully.");
      }

      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl: "/",
      });

      if (!result || result.error) {

        toast.error(
          mode === "signup"
            ? "Your account was created, but sign-in failed. Please sign in."
            : "Invalid email or password."
        );

        return;
      }

      toast.success(
        mode === "signup" ? "Signed in successfully." : "Welcome back!",
      );
      router.push("/");
      router.refresh();
    } catch(error:any) {
      toast.error(error?.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080610] px-5 py-12 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-120 w-120 -translate-x-1/2 rounded-full bg-violet-700/25 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -right-32 h-120 w-120 rounded-full bg-indigo-700/20 blur-[120px]"
      />

      <section className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/4 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight transition hover:text-violet-200"
        >
          TaskMatrix
        </Link>

        <div className="mt-10">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-300">
            {mode === "signin" ? "Welcome back" : "Get started"}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            {mode === "signin" ? "Sign in to your account" : "Create your account"}2
          </h1>
          <p className="mt-3 leading-6 text-white/60">
            {mode === "signin"
              ? "Pick up where you left off and keep your team moving."
              : "Create an account to start organizing your team's work."}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmitHandler)} className="mt-8 space-y-4">
          <label className="block text-sm text-white/75">
            Email
            <input
              type="email"
              {...register("email", { required: true })}
              autoComplete="email"
              className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-violet-400"
              placeholder="you@example.com"
            />
            {errors['email'] && (
          <span className='text-red-500 text-xs pt-1 block'>
            {errors['email']?.message as string}
          </span>
        )}
          </label>
          <label className="block text-sm text-white/75">
            Password
            <input
              type="password"
              {...register("password", { required: true, minLength:6, maxLength: 32 })}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-violet-400"
              placeholder="At least 8 characters"
            />
            {errors['password'] && (
          <span className='text-red-500 text-xs pt-1 block'>
            {errors['password']?.message as string}
          </span>
        )}
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl cursor-pointer bg-violet-600 px-5 py-3.5 font-medium transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Please wait..."
              : mode === "signin"
                ? "Sign in with email"
                : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-white/55">
          {mode === "signin" ? "New to TaskMatrix?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
            }}
            className="font-medium text-violet-300 transition hover:text-violet-200"
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>

        <div className="my-7 flex items-center gap-4 text-xs uppercase tracking-widest text-white/35">
          <span className="h-px flex-1 bg-white/10" />
          or
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-3.5 font-medium text-[#17151d] transition hover:bg-violet-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.75 3.27-8.1Z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.15v2.84A11 11 0 0 0 12 23Z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.15a11 11 0 0 0 0 9.9l3.69-2.84Z"
            />
            <path
              fill="#EA4335"
              d="M12 4.36c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0A11 11 0 0 0 2.15 7.05l3.69 2.84C6.71 7.29 9.14 4.36 12 4.36Z"
            />
          </svg>
          Continue with Google
        </button>

        <p className="mt-5 text-center text-sm text-white/45">
          Secure sign-in powered by Google
        </p>
        <Link
          href="/"
          className="mt-8 block text-center text-sm text-white/60 transition hover:text-white"
        >
          Back to home
        </Link>
      </section>
    </main>
  );
}
