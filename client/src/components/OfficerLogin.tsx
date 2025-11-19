import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import sealImage from "/WhatsApp Image 2025-11-19 at 14.42.21_ed23e0f8.jpg";
interface OfficerLoginProps {
  onLogin: (officerId: string, password: string) => void;
}

export default function OfficerLogin({ onLogin }: OfficerLoginProps) {
  const [officerId, setOfficerId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      onLogin(officerId, password);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 items-center text-center">
          <img src={sealImage} alt="Government Seal" className="w-20 h-20" />
          <div>
            <CardTitle className="text-3xl font-bold">SmartVote Verify</CardTitle>
            <CardDescription className="text-base mt-2">Officer Authentication Portal</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="officerId">Officer ID</Label>
              <Input
                id="officerId"
                placeholder="Enter your Officer ID"
                value={officerId}
                onChange={(e) => setOfficerId(e.target.value)}
                required
                data-testid="input-officer-id"
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-testid="input-password"
                className="h-12"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-lg"
              disabled={isLoading}
              data-testid="button-login"
            >
              <Shield className="w-5 h-5 mr-2" />
              {isLoading ? "Verifying..." : "Secure Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
