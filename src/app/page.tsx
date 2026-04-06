export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex pt-32">
        <h1 className="text-4xl md:text-6xl font-serif text-primary">
          Welcome to AeroDrone.
        </h1>
      </div>
      
      {/* Spacer to demonstrate scroll */}
      <div className="h-[200vh] w-full" />
    </main>
  );
}
