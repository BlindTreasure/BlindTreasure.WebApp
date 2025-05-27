import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface VerifyEmailStepProps {
  onVerified: (email: string) => void;
}

export function VerifyEmailStep({ onVerified }: VerifyEmailStepProps) {
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");

  const handleSendCode = () => {
    // Giả lập gửi mã
    setCodeSent(true);
  };

  const handleVerify = () => {
    // Giả lập xác thực thành công
    onVerified(email);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Nhập email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {codeSent && (
        <div>
          <Label htmlFor="code">Mã xác thực</Label>
          <Input
            id="code"
            placeholder="Nhập mã xác thực"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
      )}
      <div className="flex gap-4">
        {!codeSent ? (
          <Button onClick={handleSendCode} disabled={!email}>
            Gửi mã
          </Button>
        ) : (
          <Button onClick={handleVerify} disabled={!code}>
            Xác thực
          </Button>
        )}
      </div>
    </div>
  );
}
