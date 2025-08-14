import DateCalculator from "./components/DateCalculator";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 py-2">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <DateCalculator />
      </main>
    </div>
  );
}
