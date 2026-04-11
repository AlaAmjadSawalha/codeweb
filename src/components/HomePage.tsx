import { siteConfig } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";

export default function HomePage() {
  return (
    <section className="container d-grid align-items-center gap-5 pb-8 pt-6 md:py-10">
      <div className="d-flex max-w-[980px] flex-column align-items-start gap-2">
        <h1 className="fs-2 font-extrabold leading-tight tracking-tighter md:text-4xl">
          Beautifully designed components <br className="d-none sm:inline" />
          built with Radix UI and Tailwind CSS.
        </h1>
        <p className="max-w-[700px] fs-5 text-muted">
          Accessible and customizable components that you can copy and paste
          into your apps. Free. Open Source. And Next.js 13 Ready.
        </p>
      </div>
      <div className="d-flex gap-4">
        <a href={siteConfig.links.docs} className={buttonVariants()}>
          Documentation
        </a>
        <a
          href={siteConfig.links.github}
          className={buttonVariants({ variant: "outline" })}
        >
          GitHub
        </a>
      </div>
    </section>
  );
}
