import { databases } from "@/appwrite";
import { getTodosGroupedByColumns } from "@/lib/getTodosGroupedByColumns";
import { Board, Column, Todo, TypedColumn } from "@/typings";
import { create } from "zustand";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoard: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
  searchString: string;
  setSearchString: (term: string) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  board: { columns: new Map<TypedColumn, Column>() },
  getBoard: async () => {
    const board = await getTodosGroupedByColumns();
    set({ board });
  },
  setBoard: (board) => set({ board }),
  updateTodoInDB: async (todo, columnId) => {
    databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
      }
    );
  },
  searchString: "",
  setSearchString: (searchString) => set({ searchString }),
}));
