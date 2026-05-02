export const metadata = {
  title: 'Time Tracker',
  description: 'Minimalist time tracking app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="bg-[#0f172a] text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
