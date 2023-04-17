import RoundData from "@/models/RoundData";
import React from "react";
import Lottie from "react-lottie";
import animationData from "../assets/lottie-sword.json";

function Info({ label, value }) {
  return (
    <div className="flex flex-col items-center">
      <h1 className="font-light text-center text-opacity-70 text-neutral-700">
        {label}
      </h1>
      <h1 className="font-extrabold text-center">{value}</h1>
    </div>
  );
}

export default function PlayerCard({
  data,
  onChooseCommand,
  loading,
}: {
  data: RoundData;
  onChooseCommand: (command: string) => any;
  loading: boolean;
}) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex flex-col gap-4 p-2 border-orange-900 rounded-md border-opacity-30">
      <div className="flex flex-row justify-between gap-4">
        <Info label="Health" value={data.Health} />
        <Info label="XP" value={data.XP} />
        <Info label="Level" value={data.Level} />
        <Info label="Gold" value={data.Gold} />
      </div>
      <div className="flex flex-row justify-between gap-4">
        <Info label="Day" value={data["Current day number"]} />
        <Info label="Location" value={data.Location} />
      </div>
      <h1 className="text-left">{data.Quest}</h1>
      <h1 className="text-left">{data.Description}</h1>
      {loading ? (
        <>
          <div className="relative h-[140px] flex flex-row justify-center">
            <div className="absolute h-[250px] -bottom-4">
              <Lottie options={defaultOptions} />
              <h1 className="text-center">Loading</h1>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 className="font-bold text-center">{data.Prompt}</h1>
          <div className="grid justify-between grid-cols-2 gap-4">
            {data.Commands.map((command, index) => (
              <button
                className="opacity-50 hover:opacity-100"
                key={index}
                onClick={() => onChooseCommand(command)}
              >
                {command}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
