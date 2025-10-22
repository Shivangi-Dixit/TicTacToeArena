import { Button, Card, CardContent } from "@mui/material";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Did you forget to add the page to the router?
          </p>
          <div className="mt-6 flex justify-center">
            <Button variant="contained" color="primary" onClick={() => navigate("/")}>Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
