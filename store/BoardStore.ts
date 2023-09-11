import { ID, databases, storage } from "@/appwrite";
import { getTodosGroupedByColumns } from "@/lib/getTodosGroupedByColumns";
import uploadImage from "@/lib/uploadImage";
import { Board, Column, Image, Todo, TypedColumn } from "@/typings";
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
  addTodo: async (todo, columnId, image) => {
    let file: Image | undefined;

    if (image) {
      const fileUpload = await uploadImage(image);
      if (fileUpload) {
        file = {
          bucketId: fileUpload.bucketId,
          fileId: fileUpload.$id,
        };
      }
    }

    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        ...(file && { image: JSON.stringify(file) }),
      }
    );
    set({ newTaskInput: "" });

    set((state) => {
      const newColumns = new Map(state.board.columns);

      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toDateString(),
        title: todo,
        status: columnId,
        ...(file && { image: file }),
      };

      const column = newColumns.get(columnId);
      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }

      return {
        board: {
          columns: newColumns,
        },
      };
    });
  },

  deleteTodo: async (todoIndex, todo, id) => {
    const newCols = new Map(get().board.columns);

    newCols.get(id)?.todos.splice(todoIndex, 1);

    set({ board: { columns: newCols } });

    if (todo.image)
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);

    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
    );
  },
  searchString: "",
  setSearchString: (searchString) => set({ searchString }),
}));
