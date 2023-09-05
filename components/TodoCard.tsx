"use client";
import { useBoardStore } from "@/store/BoardStore";
import { Todo, TypedColumn } from "@/typings";
import { XCircleIcon } from "@heroicons/react/24/solid";
import React from "react";
import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from "react-beautiful-dnd";

type Props = {
  todo: Todo;
  index: number;
  id: TypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

function TodoCard({
  dragHandleProps,
  draggableProps,
  id,
  index,
  innerRef,
  todo,
}: Props) {
  const [deleteTodo] = useBoardStore((state) => [state.deleteTodo]);
  return (
    <div
      className="bg-white 
      rounded-md 
      space-y-2 
      drop-shadow-md"
      {...dragHandleProps}
      {...draggableProps}
      ref={innerRef}
    >
      <div className="flex justify-between items-center p-5">
        <p>{todo.title}</p>
        <button
          onClick={() => deleteTodo(index, todo, todo.status)}
          className="text-red-500 hover:text-red-600"
        >
          <XCircleIcon className="ml-5 h-8 w-8" />
        </button>
      </div>
      {/* TODO: Image here */}
    </div>
  );
}

export default TodoCard;
