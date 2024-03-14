import { checkEnvironment } from "./utils/base_url";

async function getTime() {
  // fetch data from server
  const time = await fetch(checkEnvironment() + "/api/time");
  return time.json();
}

export default async function Home() {
  const time = await getTime();
  return (
    <main className="flex-grow flex-col items-center flex justify-center">
      <p className="text-xs sm:text-sm md:text-base">Time is {time.time}</p>
    </main>
  );
}
