import { Board } from "@/typings";
import formatTodosForAI from "./formatTodosForAi";

const fetchSuggestion = async (board: Board) => {
  return await new Promise((resolve, reject) =>
    setTimeout(
      () =>
        resolve(
          "Welcome Mr Ali! In summary, you have 2 todos that are already done, 0 in progress, and 1 that still needs to be done. Have a productive day!"
        ),
      3000
    )
  ).catch((e) => console.log("fetchsuggestion>>error>", e));

  const todos = formatTodosForAI(board);
  const res = await fetch("/api/generateSummary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ todos }),
  });

  const GPTDat = await res.json();
  return GPTDat.content;
};

export default fetchSuggestion;
