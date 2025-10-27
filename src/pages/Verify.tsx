import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Verify() {
  const [status, setStatus] = useState<string>("verifying");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (!token) return setStatus("missing");

    fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`)
      .then((res) => {
        if (res.ok) return res.text();
        throw new Error("Verification failed");
      })
      .then(() => setStatus("success"))
      .catch(() => setStatus("failed"));
  }, [location.search]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-card rounded-lg">
        {status === "verifying" && <p>Verifying your email...</p>}
        {status === "missing" && (
          <>
            <p className="mb-4">Missing verification token.</p>
            <Button onClick={() => navigate("/auth")}>Go to Sign In</Button>
          </>
        )}
        {status === "success" && (
          <>
            <h2 className="text-xl font-bold mb-4">Email verified</h2>
            <p className="mb-4">Your email has been verified — you can now sign in.</p>
            <Button onClick={() => navigate("/auth")}>Sign In</Button>
          </>
        )}
        {status === "failed" && (
          <>
            <h2 className="text-xl font-bold mb-4">Verification failed</h2>
            <p className="mb-4">The verification link may be invalid or expired.</p>
            <Button onClick={() => navigate("/auth")}>Back</Button>
          </>
        )}
      </div>
    </div>
  );
}
