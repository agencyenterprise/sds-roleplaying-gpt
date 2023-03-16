import RoundData from "@/models/RoundData";
import React from "react";

function Info({ label, value }) {
  return (
    <div className="flex flex-col items-center">
      <h1 className="font-light text-opacity-70 text-neutral-700 text-center">
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
  return (
    <div className="flex flex-col rounded-md border-opacity-30 border-orange-900 p-2 gap-4">
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
        <h1 className="text-center animate-pulse">Performing action</h1>
      ) : (
        <>
          <h1 className="text-center font-bold">Decide your path</h1>
          <div className="grid grid-cols-2 justify-between gap-4">
            {data["Possible Commands"].map((command, index) => (
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
