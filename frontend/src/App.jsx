function App() {
  return (
    <main className="min-h-screen bg-surface flex items-center justify-center p-margin">
      <section className="rounded-xl bg-surface-container-lowest p-space-xl shadow-lg">
        <p className="mb-space-sm text-label-sm font-label-md uppercase tracking-wider text-secondary">
          AssetGuard design system
        </p>

        <h1 className="text-display-lg font-display-lg text-on-surface">
          Tailwind is working
        </h1>

        <p className="mt-space-sm text-body-lg text-on-surface-variant">
          The Stitch palette is now available in React.
        </p>

        <button className="mt-space-lg rounded-lg bg-secondary px-space-lg py-space-sm text-label-md font-label-md text-on-secondary transition-colors hover:bg-secondary-container">
          Test primary action
        </button>
      </section>
    </main>
  );
}

export default App;