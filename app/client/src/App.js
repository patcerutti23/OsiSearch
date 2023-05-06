import "./App.css";
import { useState } from "react";
import * as React from "react";
import { Autocomplete } from "@mantine/core";
import { createStyles, Table, Checkbox, ScrollArea, rem } from "@mantine/core";

export default function App() {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);
  const [searchHistory, setSearchHistory] = useState(
    JSON.parse(localStorage.getItem("search-hx")) || []
  );

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/search?terms=${search}`);
      const data = await response.json();
      setResult(data[3]);
    } catch (e) {
      console.error(e);
    }
    const newSearchHistory = [
      ...new Set([
        ...searchHistory,
        JSON.stringify({ search, timeStamp: Date.now() }),
      ]),
    ];
    setSearchHistory(newSearchHistory);
    localStorage.setItem("search-hx", JSON.stringify(newSearchHistory));
    console.log(newSearchHistory);

    setSearch("");
  };

  const suggestions = searchHistory
    .map((item) => JSON.parse(item))
    .sort((a, b) => b.timeStamp - a.timeStamp);
  return (
    <div className="App">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Autocomplete
          onChange={setSearch}
          value={search}
          placeholder="search"
          data={suggestions.map(({ search }) => search)}
        />
      </form>
      <button
        onClick={() => {
          handleSubmit();
        }}
      >
        Click
      </button>
      <TableSelection data={result} />
    </div>
  );
}

const useStyles = createStyles((theme) => ({
  rowSelected: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
        : theme.colors[theme.primaryColor][0],
  },
}));

export function TableSelection({ data }) {
  const { classes, cx } = useStyles();
  const [selection, setSelection] = useState([]);
  const toggleRow = (id) =>
    setSelection((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  const toggleAll = () =>
    setSelection((current) =>
      current.length === data.length ? [] : data.map((item) => item)
    );

  const rows = data.map(([icdCode, description]) => {
    const selected = selection.includes(icdCode);
    return (
      <tr key={icdCode} className={cx({ [classes.rowSelected]: selected })}>
        <td>
          <Checkbox
            checked={selection.includes(icdCode)}
            onChange={() => toggleRow(icdCode)}
            transitionDuration={0}
          />
        </td>
        <td>{icdCode}</td>
        <td>{description}</td>
      </tr>
    );
  });

  return (
    <ScrollArea>
      <Table miw={800} verticalSpacing="sm">
        <thead>
          <tr>
            <th style={{ width: rem(40) }}>
              <Checkbox
                onChange={toggleAll}
                checked={selection.length === data.length}
                indeterminate={
                  selection.length > 0 && selection.length !== data.length
                }
                transitionDuration={0}
              />
            </th>
            <th>ICD Code</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}
