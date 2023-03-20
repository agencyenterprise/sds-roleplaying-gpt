import PlayerCard from "@/components/PlayerCard";
import RoundData from "@/models/RoundData";
import axios from "axios";
import classNames from "classnames";
import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [parentId, setParentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RoundData[]>([]);

  const handleChooseCommand = async (command) => {
    setLoading(true);
    const res = await axios.post("/api/run", {
      text: command,
      parentId,
      apiKey,
    });
    setData((prev) => [...prev, res.data.result]);
    setLoading(false);
  };

  const handleStart = async () => {
    setLoading(true);
    const res = await axios.post("/api/run", {
      text: "",
      parentId,
      apiKey,
    });
    setParentId(res.data.parentId);
    setData((prev) => [...prev, res.data.result]);
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col overflow-hidden items-center justify-center">
      <div className="relative w-full my-6 max-w-2xl p-4">
        <div
          id="parchment"
          className="absolute top-0 right-0 bottom-0 left-0"
        />

        <h1 className="inkTitle mb-6">Roleplaying GPT</h1>
        {data?.length > 0 ? (
          <PlayerCard
            data={data[data.length - 1]}
            onChooseCommand={handleChooseCommand}
            loading={loading}
          />
        ) : (
          <div className="flex flex-col gap-2">
            <span className="text-neutral-600">
              Input your OpenAI API Key before start
            </span>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Key"
              className="w-full rounded-md border border-orange-400 saturate-50 text-black placeholder:text-neutral-700 outline-none text-sm p-1"
            />
            <button
              className={classNames(
                "opacity-50 hover:opacity-100",
                loading && "animate-pulse"
              )}
              onClick={handleStart}
              disabled={apiKey.length <= 0 || loading}
            >
              {loading ? "Starting..." : "Start your adventure"}
            </button>
          </div>
        )}
      </div>
      <svg className="hidden">
        <filter id="wavy2">
          <feTurbulence
            x="0"
            y="0"
            baseFrequency="0.02"
            numOctaves="5"
            seed="1"
          />
          <feDisplacementMap in="SourceGraphic" scale="20" />
        </filter>
      </svg>
    </main>
  );
}
