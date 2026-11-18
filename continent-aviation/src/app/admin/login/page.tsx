import { LoginForm } from "./LoginForm";
import { authConfigured } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <div className="mx-auto max-w-md py-12">
      <p className="eyebrow">Admin</p>
      <h1 className="h2 mt-3 !text-4xl">Sign in</h1>
      <span className="rule mt-6" />
      {error && <p role="alert" className="mt-6 border border-[#e58b82]/60 p-4 text-sm">That sign-in link is invalid or has expired. Please request a new one.</p>}
      {authConfigured() ? (
        <LoginForm />
      ) : (
        <p className="mt-6 border border-gold/60 p-4 text-sm text-gold" role="note">
          Admin sign-in is not configured. Set <code>ADMIN_EMAIL</code>, <code>SESSION_SECRET</code> (at least 24 characters) and a database. See the README.
        </p>
      )}
    </div>
  );
}
