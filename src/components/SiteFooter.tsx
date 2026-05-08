export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto w-full max-w-3xl px-6 py-8 text-sm text-zinc-500 dark:text-zinc-400 sm:px-10">
        <p>
          Built with{" "}
          <a
            className="underline underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-100"
            href="https://claude.com/claude-code"
          >
            Claude Code
          </a>
          . Source on{" "}
          <a
            className="underline underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-100"
            href="https://github.com/ridermcc/ridermccallum-com"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
