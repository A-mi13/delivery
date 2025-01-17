export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Здесь не будет Header, Banner, Popular и Footer */}
        <div>{children}</div>
      </body>
    </html>
  );
}
