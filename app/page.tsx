import io from 'socket.io-client'
import { checkEnvironment } from "./utils/base_url";


async function getTime(): Promise<{ time: string }> {
  // fetch data from server
  const time = await fetch(checkEnvironment() + "/api/time", {
    cache: "no-cache",
  });
  return time.json();
}

export default async function Home() {
  const time = await getTime();

  const socket = io(checkEnvironment());
  
  socket.on('connect', ()=>{
    socket.emit("my_event", { data: "I'm connected!" });
  })

  socket.on("my_response", function (msg, cb) {
    console.log(msg)
    if (cb) cb();
  });
  
  return (
    <main className="flex-grow flex-col items-center flex justify-center">
      <p className="text-xs sm:text-sm md:text-base">Time is {time.time}</p>
    </main>
  );
}
