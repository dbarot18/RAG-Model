import { RxLightningBolt, RxStopwatch } from "react-icons/rx";
import { PiShieldCheck } from "react-icons/pi";
import { LuSwords } from "react-icons/lu";

const games = [
  {
    name: "Flashcard Rush",
    description: "Test your memory with timed flashcard challenges",
    players: "2.3k players",
    icon: <RxLightningBolt className="text-white h-5 w-5" />
  },
  {
    name: "Knowledge Quest",
    description: "Embark on a learning adventure with quests",
    players: "1.8k players",
    icon: <PiShieldCheck className="text-white h-5 w-5" />
  },
  {
    name: "Time Challenge",
    description: "Race against the clock to answer questions",
    players: "3.1k players",
    icon: <RxStopwatch className="text-white h-5 w-5" />
  },
  {
    name: "Study Battle",
    description: "Compete with friends in educational challenges",
    players: "2.7k players",
    icon: <LuSwords className="text-white h-5 w-5" />
  },
];

export default function Games() {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="pt-16 pb-80 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48">
        <div className="flex flex-col lg:flex-row items-center gap-10 relative mx-auto max-w-7xl px-8 sm:static sm:px-6 md:px-16 lg:px-8">
          <div className="">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-16">
              Learn with games
            </h1>
            <p className="my-8 text-xl text-gray-500">
              Make studying fun with interactive educational games! Challenge
              yourself, earn points, and master concepts while playing.
            </p>
            <div className="flex gap-4">
              <button className="btn ">Explore Games</button>
              <button className="btn ghost">View leaderboards</button>
            </div>
          </div>
          <div className="gamesContainer grow w-full lg:-mr-40 rounded-3xl lg:rounded-r-none p-6 gap-4 grid grid-cols-1 md:grid-cols-2">
            {games.map((game, idx) => (
              <div
                key={idx}
                className="flex flex-col transition-colors bg-white/15 hover:bg-white/20 rounded-xl h-48 p-4"
              >
                <div className="flex gap-2 items-center mb-2">
                  <div className="p-2 rounded-full bg-white/20 aspect-square">{game.icon}</div>
                  <h3 className="font-medium text-2xl text-white">{game.name}</h3>
                </div>
                <p className="text-white/85">{game.description}</p>
                <div className="flex gap-4 items-center mt-auto">
                  <div className="flex">
                    <div className="-mr-2 w-5 h-5 border border-white bg-teal-400 rounded-full"></div>
                    <div className="-mr-2 w-5 h-5 border border-white bg-blue-400 rounded-full"></div>
                    <div className="-mr-2 w-5 h-5 border border-white bg-indigo-300 rounded-full"></div>
                  </div>
                  <span className="text-sm/6 text-white/75">
                    {game.players}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
