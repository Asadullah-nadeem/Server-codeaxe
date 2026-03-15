import Link from "next/link";

const Footer = () => (
  <footer className="border-t border-border">
    <div className="container py-16 md:py-24">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        <div>
          <h4 className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground mb-4">Company</h4>
          <div className="flex flex-col gap-3">
            {[["Home","/"],["Work","/work"],["Services","/services"],["About","/about"]].map(([l,p])=>(
              <Link key={p} href={p} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">{l}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground mb-4">Portfolio</h4>
          <div className="flex flex-col gap-3">
            {[["Chrome Extensions","/portfolio/chrome-extensions"],["Web Tools","/portfolio/web-tools"],["Mobile Apps","/portfolio/app-store"],["Client Projects","/portfolio/client-projects"]].map(([l,p])=>(
              <Link key={p} href={p} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">{l}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground mb-4">Legal</h4>
          <div className="flex flex-col gap-3">
            {[["Privacy Policy","/privacy"],["Terms of Service","/terms"],["Refund Policy","/refund-policy"]].map(([l,p])=>(
              <Link key={p} href={p} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">{l}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground mb-4">Contact</h4>
          <div className="flex flex-col gap-3">
            <a href="mailto:hello@codeaxe.co.in" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">hello@codeaxe.co.in</a>
            <a href="https://github.com/codeaxe" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">GitHub</a>
            <a href="https://linkedin.com/company/codeaxe" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">LinkedIn</a>
          </div>
        </div>
      </div>
      <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="font-display text-lg tracking-tighter">Code<span className="text-accent">Axe</span></span>
        <span className="font-mono-label text-xs text-muted-foreground">© {new Date().getFullYear()} CodeAxe Technologies.<br /> All rights reserved. <br /><b>Version 1.0.0</b></span>
      </div>
    </div>
  </footer>
);

export default Footer;
