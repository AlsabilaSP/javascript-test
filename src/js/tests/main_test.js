import { renderPosts, renderSearch, renderTableRow } from "../pages/main.js";
import { assertElement } from "./core/utils.js";

// Test Results
const testResultsContainer = document.getElementById("test-results");
const tableBody = document.getElementById("table-body");
const paginationNumbers = document.getElementById("pagination-numbers");
const searchInput = document.getElementById("searchInput");
let pageCount = 1;

// Setup test data
const testData = [
    { id: 1, userId: 1, title: "Hello", body: "Something about rerum" },
    { id: 2, userId: 1, title: "World", body: "No match here" },
    { id: 3, userId: 1, title: "Hello", body: "New rerum" },
    { id: 4, userId: 1, title: "World", body: "No match here" },
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

const test_renderHighlight = () => {
    // renderHighlight is already called inside renderPost() in test_renderPosts()
    const getRerums = tableBody.querySelectorAll("strong");
    assertElement(
        testResultsContainer, 
        getRerums.length === 2, 
        "renderHighlight: Correct total 'rerum' highlight"
    );
}

test_renderPosts();
test_renderTableRow();
test_renderHighlight();

// Test Cases for Pagination
const test_renderPagination = () => {
    // renderPagination is already called inside renderPost() in test_renderPosts()
    const pagingNumbers = paginationNumbers.querySelectorAll(".pagination-number");
    assertElement(
        testResultsContainer, 
        pagingNumbers.length === pageCount, 
        "renderPagination: Should show pagination with the correct total page"
    );
}

test_renderPagination();

// Test Cases for Search
const test_renderSearch = () => {
    renderSearch(testData);
    searchInput.value = "rerum";
    searchInput.dispatchEvent(new Event("input"));
    const tableItems = tableBody.querySelectorAll(".table-body-row");

    const term = searchInput.value.toLowerCase();
    const filtered = testData.filter(post =>
      post.title.toLowerCase().includes(term) ||
      post.body.toLowerCase().includes(term)
    );
    
    assertElement(
        testResultsContainer, 
        tableItems.length === filtered.length, 
        "renderSearch: Should show search input and able to filter data"
    );
}

test_renderSearch();
