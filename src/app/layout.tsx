import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Wise",
  description: "Montior and browse your collection of books!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
