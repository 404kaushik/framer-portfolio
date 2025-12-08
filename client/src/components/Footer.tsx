export function Footer() {
  return (
    <footer className="py-12">
      <div className="container mx-auto px-6">
        <div className="flex justify-center">
          <a
            href="https://www.framer.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors"
          >
            <span role="img" aria-label="Made in Framer">💙</span>
            Made in Framer
          </a>
        </div>
      </div>
    </footer>
  );
}