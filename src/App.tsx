import React, { useCallback, useContext, useState } from "react";
import "./App.css";
import "./bootstrapTheme.css";

const filters = ["All", "Todo", "Done"] as const;
type Filter = (typeof filters)[number];

interface TodoItem {
  id: number;
  title: string;
  done: boolean;
}

type Theme = "Dark" | "Light";

const ThemeContex = React.createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({
  theme: "Light",
  toggleTheme: () => {
    throw new Error("You Should Use It Inside A Theme");
  },
});

function MyButton({
  onClick,
  children,
  className,
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const { theme } = useContext(ThemeContex);
  return (
    <button
      onClick={onClick}
      className={"btn " + className}
      data-bs-theme={theme === "Dark" ? "dark" : "light"}
    >
      {children}
    </button>
  );
}

function TodoView() {
  const [todos, setTodos] = React.useState<TodoItem[]>([]);
  const [selectedFilter, setSelectedFilter_] = React.useState<Filter>("All");

  const setSelectedFilter = useCallback(
    (filter: Filter) => setSelectedFilter_(() => filter),
    []
  );

  const addTodo = React.useCallback((todo: string) => {
    setTodos((todos) => [
      ...todos,
      { id: todos.length + 1, title: todo, done: false },
    ]);
  }, []);

  const toggleTodo = React.useCallback((id: number) => {
    setTodos((todos) =>
      todos.map((x) => (x.id === id ? { ...x, done: !x.done } : x))
    );
  }, []);

  const selectedTodos = React.useMemo(() => {
    return todos.filter((todoItem) => {
      switch (selectedFilter) {
        case "All":
          return true;
        case "Todo":
          return !todoItem.done;
        case "Done":
          return todoItem.done;
      }
    });
  }, [selectedFilter, todos]);

  const [theme, setTheme] = useState<Theme>("Light");

  const toggleTheme = useCallback(() => {
    setTheme((theme) => (theme === "Dark" ? "Light" : "Dark"));
  }, []);

  return (
    <ThemeContex.Provider value={{ theme, toggleTheme }}>
      <div className="d-flex m-4 p-4 justify-content-center flex-column align-items-center">
        {/* <ThemeChanger /> */}
        <h1 className="pacifico-regular">Todo List</h1>

        <InputSubmit
          onSubmit={addTodo}
          placeholder="Please Enter Your Task"
          buttonText="Add Todo"
        />

        <FilterContainer
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />

        <ul className="w-100 list-unstyled px-2">
          {selectedTodos.map((todoItem) => (
            <TodoItems
              key={todoItem.id}
              todoItem={todoItem}
              toggleTodo={toggleTodo}
            >
              {<b>{todoItem.title}</b>}
            </TodoItems>
          ))}
        </ul>
      </div>
    </ThemeContex.Provider>
  );
}

const FilterContainer = React.memo(function ({
  selectedFilter,
  setSelectedFilter,
}: {
  selectedFilter: Filter;
  setSelectedFilter: (filter: Filter) => void;
}) {
  return (
    <div className="w-100 d-flex justify-content-between">
      {filters.map((x) => (
        <MyButton
          key={x}
          onClick={() => setSelectedFilter(x)}
          className={
            "btn btn-outline-info flex-fill mx-2 " +
            (x === selectedFilter ? ".selectedFilter" : "")
          }
        >
          {x}
        </MyButton>
      ))}
    </div>
  );
});

function TodoItems({
  todoItem,
  children,
  toggleTodo,
}: {
  todoItem: TodoItem;
  toggleTodo: (id: number) => void;
  children: JSX.Element;
}) {
  return (
    <li
      onClick={() => toggleTodo(todoItem.id)}
      className={
        "alert alert-dismissible py-0 my-2 " +
        (todoItem.done ? "alert-danger " : "alert-success ") +
        (todoItem.done ? "selected" : "")
      }
    >
      {children}
    </li>
  );
}

function InputSubmit({
  onSubmit,
  placeholder,
  buttonText,
}: 
{
  onSubmit: (str: string) => void;
  placeholder: string;
  buttonText: string;
}) {
  const [inputText, setInputText] = React.useState("");
  return (
    <form
      className="w-100 d-flex justify-content-between p-2"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(inputText);
        setInputText(() => "");
      }}
    >
      <input
        className="form-control me-2"
        placeholder={placeholder}
        value={inputText}
        onChange={(event) => {
          setInputText(() => event.target.value);
        }}
      />
      <MyButton className="btn btn-info" onClick={() => {}}>
        {buttonText}
      </MyButton>
    </form>
  );
}

export default TodoView;
