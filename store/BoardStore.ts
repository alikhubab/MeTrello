import { getTodosGroupedByColumns } from "@/lib/getTodosGroupedByColumns";
import { Board, Column, TypedColumn } from "@/typings";
import { create } from "zustand";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoard: (board: Board) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  board: { columns: new Map<TypedColumn, Column>() },
  getBoard: async () => {
    const board = await getTodosGroupedByColumns();
    set({ board });
  },
  setBoard: (board) => set({ board }),
}));
