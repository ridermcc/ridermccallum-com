function FooterLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="30 75 155 140"
      className="h-4 w-auto opacity-60"
      aria-hidden="true"
    >
      <path
        className="fill-foreground"
        d="m 120.72711,199.61888 -28.910002,-0.0665 0.08185,-64.31262 28.978722,-26.18818 z"
      />
      <path
        className="fill-foreground"
        d="M 178.16974,207.67981 H 149.57026 V 109.62496 H 120.86751 L 92.674627,79.942255 h 45.854423 l 29.47545,0.0626 10.16537,27.207095 z"
      />
      <path
        fill="#a900a9"
        d="M 34.755226,206.88622 H 64.902464 V 108.83135 H 91.88892 v 6.51657 20.05077 L 120.87739,109.63128 92.717324,79.849644 H 76.015582 L 57.545493,104.48412 V 79.912292 H 34.755226 Z"
      />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-6 font-mono text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2">
          <FooterLogo />
          <span>rider mccallum · 2026</span>
        </div>
        <p>
          built with{" "}
          <a
            className="underline underline-offset-4 transition-colors hover:text-accent"
            href="https://claude.com/claude-code"
          >
            claude code
          </a>
          {" · "}
          <a
            className="underline underline-offset-4 transition-colors hover:text-accent"
            href="https://github.com/ridermcc/ridermccallum-com"
          >
            source
          </a>
        </p>
      </div>
    </footer>
  );
}
