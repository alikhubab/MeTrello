import { databases, storage } from "@/appwrite";
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

  addTodo: (todo: string, columnId: TypedColumn, image?: File | null) => void;
  deleteTodo: (todoIndex: number, todo: Todo, id: TypedColumn) => void;
  newTaskInput: string;
  setNewTaskInput: (text: string) => void;
  newTaskType: TypedColumn;
  image: File | null;
  setImage: (image: File | null) => void;
  setNewTaskType: (newTaskType: TypedColumn) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: { columns: new Map<TypedColumn, Column>() },
  getBoard: async () => {
    const board = await getTodosGroupedByColumns();
    set({ board });
  },
  image: null,
  setImage: (image) => set({ image }),
  newTaskInput: "",
  newTaskType: "todo",
  setNewTaskType: (newTaskType) => set({ newTaskType }),
  setNewTaskInput: (newTaskInput) => set({ newTaskInput }),
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
  addTodo: async (todo, columnId, image) => {},
  deleteTodo: async (todoIndex, todo, id) => {
    const newCols = new Map(get().board.columns);

    newCols.get(id)?.todos.splice(todoIndex, 1);

    set({ board: { columns: newCols } });

    if (todo.image)
      await storage.deleteFile(todo.image.buckedId, todo.image.fileId);

    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
    );
  },
  searchString: "",
  setSearchString: (searchString) => set({ searchString }),
}));
