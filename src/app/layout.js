import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "StudyPilot - AI Academic Companion",
  description: "Your intelligent academic companion for course management, study planning, and academic success.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
