# 🧠 chartmind

[![Code Style: Google][gts-badge-image]][gts-github-url]

**chartmind** is a minimalist workflow engine that loads flowcharts from [draw.io (diagrams.net)][drawio-url] and executes the underlying classes sequentially.

---

## Features
- Custom draw.io symbol library tailored for use with chartmind
- Interpret flowcharts as executable workflows
- Support for start, end, connection, decision, custom and predefined action symbols
- Built-in validator for flowchart development

---

## Getting Started

### Installation
```bash
npm install --save chartmind
```

---

### Import the Provided Symbol Library

Download the [symbol library][symbol-library] provided in the project and import it into draw.io.

File 🠊 Open Library... 🠊 Select the downloaded `flow-chart.xml` file

---

### Draw Your Flowchart

Start by creating your flowchart diagram.

**⚠️ Make sure to use only the symbols from the provided symbol library (including the connection symbol), as they already contain the necessary properties to be executable.**

The image below shows a minimalist example:

![Minimalist flowchart][docs-flow-chart]

Once your diagram is complete, right-click on the process symbol `Increment counter` and choose `Edit Data...`.
Add a key for your class in the executable field — this will be used to register your class later in the registry.
Here’s how the configuration window looks:

![Process symbol configuration window][docs-process-symbol-settings]

Also, give your flowchart a name so you can reference it later for execution.
Right-click the toolbar at the bottom of draw.io and select `Rename...`.
This is what the rename dialog looks like:

![Rename flowchart dialog][docs-rename-flowchart]

Save the diagram somewhere in your project, for example under a folder called `charts`.

**⚠️ Make sure to save the file with the `.drawio` extension.** 

---

### Run the Flowchart

Now, implement your classes and register them in the registry. Then you can start the flowchart by its name. The following example demonstrates how:

📄**increment-counter.ts**
```ts
import { ChartContext, Executable } from 'chartmind';

export class IncrementCounter implements Executable {
  async execute(chartContext: ChartContext): Promise<void> {
    const counter = chartContext.getVariable('counter') as number;
    chartContext.setVariable('counter', counter + 1);
  }
}
```

📄**main.ts**
```ts
import { ChartManager, ExecutableRegistry } from 'chartmind';
import { IncrementCounter } from './increment-counter';

const chartManager = new ChartManager()
    .loadCharts('./charts')
    .validateCharts(); // Optional chart validation

ExecutableRegistry.instance
    .addExecutable('increment-counter', IncrementCounter);

start();

async function start() {
  try {
      const chartName = 'Test Chart';
      const chartContext = new Map<string, unknown>([
          ['counter', 1]
      ]);

      await chartManager.startProcess(chartName, chartContext);

      console.log(chartContext.get('counter')); // Output: 2
  } catch(error: unknown) {
      console.log(error);
  }
}
```

> 🧪 **Tip:** You can validate your charts before runtime to catch misconfigured symbols early.

The complete example can be viewed and run [here][example]. Additionally, the `test` folder contains several E2E tests. Specifically, for validating charts, you can refer to [this][example-test-validate] test, and for executing charts, [this][example-test-start] one may be helpful.

---

## Symbol Properties

The following table describes the available symbol properties, on which symbols these can be used, valid values, and descriptions:

Name     | Symbol(s)                | Possible Values         | Description           | Required 
---------|------------------------|-------------------------|-----------------------|:----------:
type     | Start, End, Connection, Decision, Process, Predefined process | start, end, connection, decision, process, predefined  | Defines how the symbol will be interpreted by the engine. | Always
condition | Connection | e.g. counter % 2 === 0 or text === 'foo' | Controls the flow from a decision symbol. Every connection must have a condition except the one marked as default. | All outgoing connections from a decision symbol must have a condition, except the one marked as default.
default | Connection | 1 | Marks a connection as the default path. If all other conditions evaluate to false, this path is taken. Only one default should exist. | At least one outgoing connection from a decision symbol must be marked as the default.
executable | Process | e.g. increment-counter | Key for the class registered in the registry. | Always
name | Predefined process | e.g. Test Chart | Name of the flowchart to execute (as defined in draw.io).	 | Always

All of these properties are pre-configured in the provided symbol library.
Only the `type` field is already filled — the rest must be completed manually for each symbol.

## License

This project is licensed under the [MIT License][license].

[license]: LICENSE
[symbol-library]: flow-chart.xml
[drawio-url]: https://draw.io
[example-test-start]: test/e2e/start-chart.test.ts
[example-test-validate]: test/e2e/validate-chart.test.ts
[example]: examples/getting-started
[docs-flow-chart]: docs/images/flow-chart.png
[docs-process-symbol-settings]: docs/images/process-symbol-settings.png
[docs-rename-flowchart]: docs/images/rename-flow-chart.png
[gts-badge-image]: https://img.shields.io/badge/code%20style-google-blueviolet.svg
[gts-github-url]: https://github.com/google/gts