import PlayerCard from "@/components/PlayerCard";
import RoundData from "@/models/RoundData";
import axios from "axios";
import classNames from "classnames";
import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RoundData>();
  const [messages, setMessages] = useState([]);
  const [infoTabOpened, setInfoTabOpened] = useState(false);

  const handleChooseCommand = async (command) => {
    setLoading(true);
    const res = await axios.post("/api/run", {
      text: command,
      messages,
      apiKey,
    });
    setData(res.data.result);
    setLoading(false);
  };

  const handleStart = async () => {
    setLoading(true);
    const res = await axios.post("/api/run", {
      text: "Start",
      messages,
      apiKey,
    });
    setMessages(res.data.messages);
    setData(res.data.result);
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col overflow-hidden items-center justify-center">
      <a
        href="https://github.com/agencyenterprise/sds-roleplaying-gpt"
        rel="noreferrer"
        target="_blank"
        className="absolute bottom-6 right-6 text-[#E5E5E5] text-lg text-right"
      >
        Want to make the adventure better?
        <br />
        Contribute on GitHub!
      </a>
      <div className="relative w-full my-6 max-w-2xl p-4">
        <div
          id="parchment"
          className="absolute top-0 right-0 bottom-0 left-0"
        />

        <button
          className="absolute top-6 right-6 z-10"
          onClick={() => setInfoTabOpened((prev) => !prev)}
        >
          <FaInfoCircle />
        </button>

        {infoTabOpened && (
          <div className="flex flex-col gap-4 p-8 pt-12">
            <h1 className="mb-6 text-center text-xl">
              Welcome adventurer!
              <br />
              You begin in a small town, and opportunity awaits!
            </h1>
            <h1 className="p-8 bg-[#CAAD8B]">
              {`Notice: This is an experimental project using GPT, your adventure
              might not work perfectly. If you run into issues, use the "other"
              command to perform more accurate commands. Adventure resets upon
              page refresh.`}
            </h1>
            <button
              className="opacity-50 hover:opacity-100 text-lg"
              onClick={() => setInfoTabOpened(false)}
            >
              Continue to Adventure
            </button>
          </div>
        )}
        {!infoTabOpened && (
          <div className="flex flex-col gap-4 p-8 pt-12">
            <h1 className="inkTitle">Roleplaying GPT</h1>
            {data ? (
              <PlayerCard
                data={data}
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
                  className="w-full rounded-md border border-[#CAAD8B] text-black placeholder:text-neutral-700 outline-none text-sm p-1"
                />
                <button
                  className={classNames(
                    "opacity-50 hover:opacity-100 text-lg",
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
