import "./globals.css";
import NavRail from "@/components/NavRail";

export const metadata = {
  title: "StudyPilot - AI Academic Companion",
  description: "Your intelligent academic companion for course management, study planning, and academic success.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          <NavRail />
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
