
const testTitle = document.getElementById("testTitle");

let detailsEl = document.createElement("details");
let successTests = 0;
let failedTests = 0;

function testStart(name) {
  detailsEl = document.createElement("details");

  const summary = document.createElement("summary");
  summary.innerText = name;

  detailsEl.appendChild(summary);
}

function testEnd() {
  document.body.appendChild(detailsEl);

  const summary = detailsEl.firstElementChild;
  const testName = summary.innerHTML;
  detailsEl.firstElementChild.textContent = `${testName} ${successTests}/${successTests + failedTests}`;

  summary.style.color = `#${failedTests === 0 ? "4caf50" : "f44336"}`;

  if (failedTests !== 0) detailsEl.open = true;

  const totalTestSize = document.querySelectorAll("details:not(.inline)").length;
  const completedTestSize = document.querySelectorAll("details:not(.inline):not([open])").length;

  testTitle.textContent = `Tests (${completedTestSize}/${totalTestSize})`

  failedTests = successTests = 0;
}

function log(msg) {
  const p = document.createElement("p");
  p.innerHTML = msg;

  detailsEl.appendChild(p);
}

function assert(input, output) {
  let result;

  try {
    result = jsToGd.transpileString(input).trim(); // trim Line Feed
  } catch (err) {
    result = err.message;
  }

  if (output === result) {
    successTests++;
    log(`<p><font color=4caf50>[PASSED]:</font> ${input}</p>`);

    return;
  }

  failedTests++;

  log(`<details class="inline">
    <summary><font color=f44336>[FAILED]:</font> ${input}</summary>
    <table>
      <tr>
        <td>JavaScript</td>
        <td>GDScript</td>
        <td>Output</td>
      </tr>
      <tr>
        <td><pre><code>${input}</code></pre></td>
        <td><pre><code>${output}</code></pre></td>
        <td><pre><code>${result}</code></pre></td>
      </tr>
    </table>
  </details>`);
}

export {
  testStart,
  testEnd,
  assert
};