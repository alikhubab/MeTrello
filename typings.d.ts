import { Models } from "appwrite";

interface Board {
  columns: Map<typedColumn, Column>;
}

type TypedColumn = "todo" | "inProgress" | "done";

interface Column {
  id: TypedColumn;
  todos: Todo[];
}

export interface Todo extends Partial<Models.Document> {
  $id: string;
  title: string;
  status: TypedColumn;
  $createdAt: string;
  image?: Image;
}

interface Image {
  bucketId: string;
  fileId: string;
}
