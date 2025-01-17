import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { Banner } from "@/components/shared/banner";
import { Popular } from "@/components/shared/popular";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        <Header />
          <Banner />
          <Popular />
        <Footer />
      </body>
    </html>
  );
}