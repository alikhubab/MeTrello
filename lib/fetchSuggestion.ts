import { Board } from "@/typings";
import formatTodosForAI from "./formatTodosForAi";

const fetchSuggestion = async (board: Board) => {
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
