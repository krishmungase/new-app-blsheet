import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AlertMSG = () => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Access Denied to Settings Page</AlertTitle>
      <AlertDescription>
        You do not have permission to access the settings page.
      </AlertDescription>
    </Alert>
  );
};

export default AlertMSG;
