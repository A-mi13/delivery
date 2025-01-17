export default function FavoritesLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Здесь не будет Header, Banner, Popular и Footer */}
        <div>{children}</div>
      </body>
    </html>
  );
}
