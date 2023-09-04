"use client";
import { useBoardStore } from "@/store/BoardStore";
import { useEffect } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Column from "./Column";
import { TypedColumn } from "@/typings";

function Board() {
  const [board, getBoard, setBoard, updateTodoInDB] = useBoardStore((state) => [
    state.board,
    state.getBoard,
    state.setBoard,
    state.updateTodoInDB,
  ]);

  useEffect(() => {
    getBoard();
  }, [getBoard]);

  function handleOnDragEnd(result: DropResult) {
    const { destination, source, type } = result;
    if (!destination) return;

    if (type === "column") {
      const entries = Array.from(board.columns.entries());
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);
      const rearrangedColumns = new Map(entries);

      setBoard({
        ...board,
        columns: rearrangedColumns,
      });
    }

    const columns = Array.from(board.columns);
    const [, startCol] = columns.find(([id]) => id === source.droppableId)!;
    const [, finishCol] = columns.find(
      ([id]) => id === destination.droppableId
    )!;

    if (!startCol || !finishCol) return;

    if (source.index === destination.index && startCol === finishCol) return;

    const newTodos = startCol.todos;
    const [movedTodo] = newTodos.splice(source.index, 1);

    if (startCol.id === finishCol.id) {
      // dragged in the same column
      newTodos.splice(destination.index, 0, movedTodo);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };
      const newCols = new Map(board.columns);
      newCols.set(startCol.id, newCol);

      setBoard({ ...board, columns: newCols });
    } else {
      // dragged in another column
      const finishTodos = Array.from(finishCol.todos);
      finishTodos.splice(destination.index, 0, movedTodo);
      console.log(board);
      const newCols = new Map(board.columns);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };

      newCols.set(startCol.id, newCol);
      newCols.set(finishCol.id, {
        id: finishCol.id,
        todos: finishTodos,
      });

      updateTodoInDB(movedTodo, finishCol.id);

      setBoard({
        ...board,
        columns: newCols,
      });
    }
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} id={id} todos={column.todos} index={index} />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Board;
