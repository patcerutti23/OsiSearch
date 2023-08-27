import "./App.css";
import Header from "./Header.js";
import { useState } from "react";
import * as React from "react";
import { Autocomplete } from "@mantine/core";
import {
  createStyles,
  MantineProvider,
  Table,
  Checkbox,
  ScrollArea,
  rem,
  Button,
} from "@mantine/core";
// import {
//   AppShell,
//   Navbar,
//   Footer,
//   Aside,
//   Text,
//   MediaQuery,
//   Burger,
//   useMantineTheme,
// } from "@mantine/core";

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
      <Header />
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
      <Button
        onClick={() => {
          handleSubmit();
        }}
      >
        Click
      </Button>
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

// function Layout({ children }) {
//   const theme = useMantineTheme();
//   const [opened, setOpened] = useState(false);
//   return (
//     <MantineProvider
//       theme={{
//         ...theme,
//         colors: {
//           brand: [
//             "#F0BBDD",
//             "#ED9BCF",
//             "#EC7CC3",
//             "#ED5DB8",
//             "#F13EAF",
//             "#F71FA7",
//             "#FF00A1",
//             "#E00890",
//             "#C50E82",
//             "#AD1374",
//           ],
//         },
//         primaryColor: "brand",
//       }}
//     >
//       <AppShell
//         styles={{
//           main: {
//             background:
//               theme.colorScheme === "dark"
//                 ? theme.colors.dark[8]
//                 : theme.colors.gray[0],
//           },
//         }}
//         navbarOffsetBreakpoint="sm"
//         asideOffsetBreakpoint="sm"
//         // navbar={
//         //   <Navbar
//         //     p="md"
//         //     hiddenBreakpoint="sm"
//         //     hidden={!opened}
//         //     width={{ sm: 200, lg: 300 }}
//         //   >
//         //     <Text>Application navbar</Text>
//         //   </Navbar>
//         // }
//         aside={
//           <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
//             <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
//               <Text>Favorites</Text>
//             </Aside>
//           </MediaQuery>
//         }
//         footer={
//           <Footer height={60} p="md">
//             Made By Dr. Patrick and co.
//           </Footer>
//         }
//         header={
//           <Header height={{ base: 50, md: 70 }} p="md">
//             <div
//               style={{ display: "flex", alignItems: "center", height: "100%" }}
//             >
//               <MediaQuery largerThan="sm" styles={{ display: "none" }}>
//                 <Burger
//                   opened={opened}
//                   onClick={() => setOpened((o) => !o)}
//                   size="sm"
//                   color={theme.colors.gray[6]}
//                   mr="xl"
//                 />
//               </MediaQuery>

//               <Text>OsiSearch</Text>
//             </div>
//           </Header>
//         }
//       >
//         {children}
//       </AppShell>
//     </MantineProvider>
//   );
// }
