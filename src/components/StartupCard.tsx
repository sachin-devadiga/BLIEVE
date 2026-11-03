import type { Startup } from "@/data/types";

const stageColors: Record<string, string> = {
  Idea: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
  MVP: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
  Launched: "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300",
  Funded: "bg-orange/20 text-orange-dark dark:text-orange",
};

export default function StartupCard({ startup }: { startup: Startup }) {
  return (
    <div className="group bg-white dark:bg-[#1A1A2E] rounded-2xl border border-gray-100 dark:border-white/10 p-6 hover:shadow-xl hover:shadow-orange/5 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="w-14 h-14 bg-navy dark:bg-white/10 rounded-xl flex items-center justify-center font-serif text-orange font-bold text-lg">
          {startup.logo}
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${stageColors[startup.stage]}`}
        >
          {startup.stage}
        </span>
      </div>
      <h3 className="font-serif text-xl font-semibold text-navy dark:text-white mb-2">
        {startup.name}
      </h3>
      <p className="text-text-grey dark:text-gray-400 text-sm leading-relaxed mb-4">
        {startup.pitch}
      </p>
      <div className="pt-4 border-t border-gray-100 dark:border-white/10">
        <p className="text-xs text-text-light">
          <span className="font-semibold text-navy dark:text-white">Founders:</span>{" "}
          {startup.founders.join(", ")}
        </p>
      </div>
    </div>
  );
}
