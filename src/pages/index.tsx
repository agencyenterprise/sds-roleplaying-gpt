import PlayerCard from "@/components/PlayerCard";
import RoundData from "@/models/RoundData";
import axios from "axios";
import classNames from "classnames";
import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import logo from "@/assets/logo.svg";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import animationData from "../assets/lottie-sword.json";
import Lottie from "react-lottie";

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RoundData>();
  const [messages, setMessages] = useState([]);
  const [infoTabOpened, setInfoTabOpened] = useState(false);
  const [turnsLeft, setTurnsLeft] = useState(10);
  const [useApiKey, setUseApiKey] = useState(false);
  const [auxApiKey, setAuxApiKey] = useState("");
  const userSession = useSession();
  const router = useRouter();
  const [subscription, setSubscription] = useState<any>(null);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const hasFullAccess = apiKey?.length > 0 || subscription;
  const modalOpened = turnsLeft <= 0 && !hasFullAccess;

  useEffect(() => {
    getSubscription();
  }, [userSession.status]);

  const handleChooseCommand = async (command) => {
    if (!hasFullAccess && turnsLeft <= 0) {
      return;
    }
    !hasFullAccess && setTurnsLeft((prev) => prev - 1);
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
    !hasFullAccess && setTurnsLeft((prev) => prev - 1);
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

  const handleSubscribe = async () => {
    const { data } = await axios.post("/api/checkout_session");
    router.push(data.payment_url);
  };

  const getSubscription = async () => {
    if (userSession.status === "authenticated") {
      const { data } = await axios.get("/api/checkout_session/subscription");
      setSubscription(data);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen overflow-hidden">
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
      <div className="flex flex-row items-center gap-4 mt-4 ml-auto mr-4">
        {userSession.status === "unauthenticated" && (
          <button
            className="bg-[#A68A69] px-4 py-2 text-lg"
            onClick={() => signIn("google")}
          >
            Login
          </button>
        )}
        {userSession.status === "authenticated" && (
          <>
            <h1 className="text-lg text-white">
              {userSession.data.user?.email}
            </h1>
            <button
              className="bg-[#A68A69] px-4 py-2 text-lg"
              onClick={() => signOut()}
            >
              Logout
            </button>
          </>
        )}
      </div>
      <div className="flex-grow" />
      {!modalOpened && (
        <div className="relative w-full max-w-2xl p-4 my-6">
          <div
            id="parchment"
            className="absolute top-0 bottom-0 left-0 right-0"
          />

          <button
            className="absolute z-10 top-6 right-6"
            onClick={() => setInfoTabOpened((prev) => !prev)}
          >
            <FaInfoCircle />
          </button>

          {infoTabOpened && (
            <div className="flex flex-col gap-4 p-8 pt-12">
              <h1 className="mb-6 text-xl text-center">
                Welcome adventurer!
                <br />
                {`You’re beginning an adventure in fantasy world. Opportunity
              awaits!`}
              </h1>
              <h1 className="p-8">
                Notice: This is an experimental project using GPT, your
                adventure might not work perfectly. If you run into issues, use
                the &quot;other&quot; command to perform more accurate commands.
                <br />
                <br />
                Adventure resets upon page refresh.
              </h1>
              <button
                className="text-lg opacity-50 hover:opacity-100"
                onClick={() => setInfoTabOpened(false)}
              >
                Continue to Adventure
              </button>
            </div>
          )}
          {!infoTabOpened && (
            <div className="flex flex-col gap-4 p-8 pt-12">
              <Image
                alt="wizard hat logo"
                src={logo.src}
                height={48}
                width={48}
                className="mx-auto"
              />
              <h1 className="inkTitle">Roleplaying GPT</h1>
              {data ? (
                <PlayerCard
                  data={data}
                  onChooseCommand={handleChooseCommand}
                  loading={loading}
                />
              ) : (
                <>
                  {!loading && (
                    <div className="flex flex-col gap-2">
                      {/* <span className="text-neutral-600">
                      Input your OpenAI API Key to unlimited turns or just hit
                      Start
                    </span>
                    <span className="text-sm text-neutral-600">
                      We don't store any kind of data, everything is saved in
                      your local browser session
                    </span>
                    <input
                      type="text"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Key"
                      className="w-full rounded-md border border-[#CAAD8B] text-black placeholder:text-neutral-700 outline-none text-sm p-1"
                    /> */}
                      <button
                        className={classNames(
                          "opacity-50 hover:opacity-100 text-lg"
                        )}
                        onClick={handleStart}
                      >
                        Start your adventure
                      </button>
                    </div>
                  )}
                  {loading && (
                    <>
                      <div className="relative h-[140px] flex flex-row justify-center">
                        <div className="absolute h-[250px] -bottom-4">
                          <Lottie options={defaultOptions} />
                          <h1 className="text-center">Loading</h1>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
      {modalOpened && (
        <div className="relative flex flex-col w-full max-w-2xl p-4 gap-6 bg-[#D3CDBF] my-6">
          <h1 className="text-center">
            {`Want to keep playing?`}
            <br />
            {`Add your OpenAI GPT4 API key or subscribe.`}
            <br />
            {`We don’t store your key, it’s only used for your current browsing
            session.`}
          </h1>
          <div className="flex flex-row justify-center w-full gap-4">
            <button
              className="bg-[#A68A69] p-2"
              onClick={() => setUseApiKey(true)}
            >
              Add API Key
            </button>
            <button
              className="flex flex-col p-2 bg-gray-500"
              disabled={userSession.status !== "authenticated"}
              onClick={handleSubscribe}
            >
              <h1>Subscribe $5 a month</h1>
              {userSession.status !== "authenticated" && (
                <h1 className="mx-auto text-sm font-light text-center">
                  Login first
                </h1>
              )}
            </button>
          </div>
          {useApiKey && (
            <div className="flex flex-row gap-4">
              <input
                type="text"
                value={auxApiKey}
                onChange={(e) => setAuxApiKey(e.target.value)}
                placeholder="Key"
                className="w-full rounded-md border border-[#CAAD8B] text-black placeholder:text-neutral-700 outline-none text-sm p-1"
              />
              <button
                className="bg-[#A68A69] p-2"
                onClick={() => setApiKey(auxApiKey)}
              >
                Confirm
              </button>
            </div>
          )}
          <h1 className="text-center">
            {`This version of RoleplayingGPT is an example of a more complex game powered by GPT4.`}
            <br />
            {`We only require subscriptions in order to meet operating costs. Feel free to add your own API key to play for free.`}
            <br />
            {`This project is open source, and you can contribute on`}
            <a
              href="https://github.com/agencyenterprise/sds-roleplaying-gpt"
              rel="noreferrer"
              target="_blank"
              className="text-[#A68A69]"
            >
              {` Github`}
            </a>
          </h1>
        </div>
      )}
      {hasFullAccess <= 0 && (
        <div className="relative flex flex-row justify-end w-full max-w-2xl">
          <div className="bg-[#D3CDBF] px-4 p-2">
            {turnsLeft} turns remaining
          </div>
        </div>
      )}
      <div className="flex-grow" />
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
