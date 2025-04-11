import { renderPieChart, renderPosts, renderTableRow } from "../pages/reports.js";
import { assertElement } from "./core/utils.js";

// Test Results
const testResultsContainer = document.getElementById("test-results");
const tableBody = document.getElementById("table-body");

// Setup test data
const testData = [
    { id: 1, userId: 1, title: "Hello", body: "Something about rerum" },
    { id: 2, userId: 2, title: "World", body: "No match here" },
    { id: 3, userId: 1, title: "Hello", body: "New rerum" },
    { id: 4, userId: 3, title: "World", body: "No match here" },
    { id: 5, userId: 4, title: "World", body: "Give rerum again" },
];

// Test Cases for Table
const test_renderPosts = () => {
    renderPosts(testData);
    assertElement(
        testResultsContainer, 
        tableBody.children.length === testData.length, 
        `renderPosts: Should render ${testData.length} rows`
    );
}

const test_renderTableRow = () => {
    renderTableRow({ id: 11, body: "test" }, "<td>Test</td>");
    assertElement(testResultsContainer, tableBody.innerHTML.includes("Test"), "renderTableRow: Should render new row");
}

const test_renderPieChart = () => {
    renderPieChart(testData);

    setTimeout(() => {
        const canvas = document.getElementById("rerumChart");
        const chart = Chart.getChart(canvas);

        const dataset = chart.data.datasets[0];
        const data = dataset.data;

        const rerumCount = testData.filter(p =>
          (p.title + p.body).toLowerCase().includes("rerum")
        ).length;

        assertElement(testResultsContainer, chart !== undefined, "Chart should be initialized");
        assertElement(testResultsContainer, data[0] === rerumCount, `'Rerum' count should be ${rerumCount}`);
        assertElement(testResultsContainer, data[1] === testData.length - rerumCount, `'Other' count should be ${testData.length - rerumCount}`);
      }, 500);
}

test_renderPosts();
test_renderTableRow();
test_renderPieChart();