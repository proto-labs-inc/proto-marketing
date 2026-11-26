import DownloadPage from "@/components/marketing/download-page";

// Public for signed-in and signed-out visitors; no session gate on this route.
export default function DownloadRoute() {
  return <DownloadPage />;
}
