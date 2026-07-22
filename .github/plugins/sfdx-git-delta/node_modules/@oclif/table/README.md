<img src="https://user-images.githubusercontent.com/449385/38243295-e0a47d58-372e-11e8-9bc0-8c02a6f4d2ac.png" width="260" height="73">

[![Version](https://img.shields.io/npm/v/@oclif/table.svg)](https://npmjs.org/package/@oclif/table)
[![Downloads/week](https://img.shields.io/npm/dw/@oclif/table.svg)](https://npmjs.org/package/@oclif/table)
[![License](https://img.shields.io/npm/l/@oclif/table.svg)](https://github.com/oclif/table/blob/main/LICENSE)

### Description

Print beautiful, flexible tables to the terminal using [Ink](https://www.npmjs.com/package/ink). This library powers many oclif/Salesforce CLIs and is built for real-world, production output: wide columns, multi-line cells, smart wrapping/truncation, theming, and great CI behavior.

### Features

- Rich rendering via Ink with graceful fallback to plain text in CI
- Automatic column sizing with max/explicit width support (including percentages)
- Per-column alignment, padding, and overflow control (wrap, truncate, middle/start/end)
- Header formatting with `change-case` presets or custom function
- Multiple border styles (outline, headers-only, vertical/horizontal, none, and more)
- Sort and filter data, optionally per-column
- Print multiple tables side-by-side or stacked with layout controls
- Return a string (`makeTable`) or print directly (`printTable`/`printTables`)
- TypeScript-first API with excellent types

---

### Requirements

- Node.js >= 18
- ESM only (this package has `"type": "module"`). Use `import`, not `require`.

### Installation

```bash
npm install @oclif/table
# or
yarn add @oclif/table
# or
pnpm add @oclif/table
# or
bun add @oclif/table
```

### Quick start

```js
import {printTable} from '@oclif/table'

const data = [
  {name: 'Alice', role: 'Engineer', notes: 'Loves distributed systems'},
  {name: 'Bob', role: 'Designer', notes: 'Enjoys typography and UI'},
]

printTable({
  title: 'Team',
  data,
  columns: [
    {key: 'name', width: 16},
    {key: 'role', width: 14, horizontalAlignment: 'center'},
    {key: 'notes', overflow: 'wrap'},
  ],
})
```

To generate a string instead of printing to stdout:

```js
import {makeTable} from '@oclif/table'

const output = makeTable({data, columns: ['name', 'role', 'notes']})
// do something with `output`
```

To print multiple tables in one layout:

```js
import {printTables} from '@oclif/table'

printTables(
  [
    {title: 'Developers', data, columns: ['name', 'role']},
    {title: 'Notes', data, columns: ['notes']},
  ],
  {direction: 'row', columnGap: 4, margin: 1},
)
```

---

### API

- `printTable(options)` — renders a single table to stdout.
- `makeTable(options): string` — renders a single table and returns the output string.
- `printTables(tables, options?)` — renders multiple tables with layout controls.

All three accept the same `TableOptions<T>` (documented below). `printTables` accepts an array of `TableOptions` plus optional container layout props.

#### TypeScript

```ts
import type {TableOptions} from '@oclif/table'

type Row = {name: string; age: number}
const opts: TableOptions<Row> = {
  data: [{name: 'Ada', age: 36}],
  columns: [
    {key: 'name', name: 'Full Name'},
    {key: 'age', horizontalAlignment: 'right'},
  ],
}
```

---

### Options reference

Below are the most important options with defaults and behavior. See examples in `./examples` for more patterns.

- `data` (required): array of rows, each a plain object.
- `columns`: list of keys or objects describing each column.
  - String form: `'name'` (uses key as header)
  - Object form: `{ key, name?, width?, padding?, overflow?, horizontalAlignment?, verticalAlignment? }`
    - `name`: header label (defaults to key or formatted with `headerOptions.formatter`)
    - `width`: number of characters or percentage string like `'50%'`
    - `padding`: spaces added on both sides (default: table `padding`)
    - `overflow`: `'wrap' | 'truncate' | 'truncate-start' | 'truncate-middle' | 'truncate-end'`
    - `horizontalAlignment`: `'left' | 'center' | 'right'`
    - `verticalAlignment`: `'top' | 'center' | 'bottom'`

- `padding` (number): cell padding for all columns. Default: `1`.

- `maxWidth` (number | percentage | 'none'): maximum table width. Defaults to terminal width.
  - When the natural table width exceeds `maxWidth`, columns shrink and content wraps/truncates based on `overflow`.
  - Use `'none'` to allow unlimited width (useful for very wide outputs; users can resize their terminals).

- `width` (number | percentage): exact table width. Overrides `maxWidth`. If wider than the natural width, columns expand evenly.

- `overflow`: cell overflow behavior. Default: `'truncate'`.
  - `'wrap'` wraps long content
  - `'truncate'` truncates the end
  - `'truncate-start' | 'truncate-middle' | 'truncate-end'` choose truncation position

- `headerOptions`: style options for headers.
  - `formatter`: either a function `(header: string) => string` or a `change-case` preset name:
    `'camelCase' | 'capitalCase' | 'constantCase' | 'kebabCase' | 'pascalCase' | 'sentenceCase' | 'snakeCase'`
  - Styling keys (also supported by `titleOptions`):
    - `color`, `backgroundColor` (named color, hex `#rrggbb`, or `rgb(r,g,b)`)
    - `bold`, `dimColor`, `italic`, `underline`, `strikethrough`, `inverse`
  - Default header style is bold blue (unless `noStyle: true`).

- `borderStyle`: border preset. Default: `'all'`.
  - Available: `'all' | 'headers-only' | 'headers-only-with-outline' | 'headers-only-with-underline' | 'horizontal' | 'horizontal-with-outline' | 'none' | 'outline' | 'vertical' | 'vertical-rows-with-outline' | 'vertical-with-outline'`

- `borderColor`: optional border color. When unset, the terminal's default color is used.

- `horizontalAlignment`: default column alignment. Default: `'left'`.

- `verticalAlignment`: default vertical alignment within cells. Default: `'top'`.

- `filter(row)`: predicate to include/exclude rows.

- `sort`: object mapping keys to `'asc' | 'desc' | (a,b)=>number`. Keys order defines multi-column priority.

- `title`: optional string printed above the table.

- `titleOptions`: style options for the title (same keys as `headerOptions` except `formatter`).

- `trimWhitespace`: when wrapping text, trim whitespace at line boundaries. Default: `true`.

- `noStyle`: disable all styling. Also strips ANSI color codes from your cell content for accurate width calculation.

#### Container options (for `printTables`)

`printTables(tables, containerOptions)` accepts:

- `direction`: `'row' | 'column'` (default `'row'`)
- `columnGap`, `rowGap`: spacing between tables
- `alignItems`: `'flex-start' | 'center' | 'flex-end'`
- `margin`, `marginLeft`, `marginRight`, `marginTop`, `marginBottom`

---

### Behavior and environment variables

- Terminal width detection: by default we use your terminal width. Override with `OCLIF_TABLE_COLUMN_OVERRIDE`.
  - Example: `OCLIF_TABLE_COLUMN_OVERRIDE=120 node app.js`

- CI-safe output: in CI environments, we automatically fall back to a plain-text renderer (no Ink) for stability.
  - To force Ink rendering in CI, set `OCLIF_TABLE_SKIP_CI_CHECK=1`.

- Very large data: by default, datasets with 10,000+ rows use the plain-text renderer to avoid memory issues.
  - Override with `OCLIF_TABLE_LIMIT=<number>` (Salesforce CLIs may also honor `SF_TABLE_LIMIT`).

---

### Advanced examples

Header formatting with `change-case`:

```js
import {printTable} from '@oclif/table'

printTable({
  data: [{first_name: 'Ada', last_name: 'Lovelace'}],
  columns: ['first_name', 'last_name'],
  headerOptions: {formatter: 'capitalCase'},
})
```

Per-column sizing and overflow:

```js
printTable({
  data: [{name: 'A very very long name', notes: 'Multi-line\ncontent supported'}],
  maxWidth: '80%',
  columns: [
    {key: 'name', width: 20, overflow: 'truncate-middle'},
    {key: 'notes', overflow: 'wrap', horizontalAlignment: 'right'},
  ],
})
```

Switching borders and colors:

```js
printTable({
  title: 'Inventory',
  titleOptions: {bold: true, color: 'cyan'},
  data: [{item: 'Widget', qty: 10}],
  columns: ['item', {key: 'qty', horizontalAlignment: 'right'}],
  borderStyle: 'vertical-with-outline',
  borderColor: 'green',
})
```

---

### Examples directory

This repo contains many runnable examples in `./examples` (including edge cases like very wide/very tall tables). Run any with:

```bash
tsx examples/basic.ts
```

---

### Testing

This package includes snapshot tests for all examples to ensure consistent output across different environments.

#### Running tests

```bash
# Run all tests (including snapshot tests)
yarn test

# Run only snapshot tests
yarn test:examples

# Update snapshots after intentional changes
yarn test:examples:update
```

#### How snapshot testing works

Examples are executed in an isolated child process with:

- Fixed terminal width (`OCLIF_TABLE_COLUMN_OVERRIDE=120`)
- Disabled CI detection unless an example sets it
- ESM loader for TypeScript (`ts-node/esm`)

Snapshots live in `test/__snapshots__/examples/*.txt` and mirror the `examples` directory structure.

---

### Contributing

See the [contributing guide](./CONRTIBUTING.md).

### License

MIT © Salesforce
