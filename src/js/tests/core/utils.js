export const assertElement = (testResultsContainer, condition, message) => {
    const result = document.createElement("div");
    result.className = `test-result ${condition ? 'pass' : 'fail'}`;
    result.textContent = condition ? `✔️ ${message}` : `❌ ${message}`;
    testResultsContainer.appendChild(result);
}