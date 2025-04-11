import { getPosts } from "../core/api.js";

const tableBody = document.getElementById("table-body");
let postsData = [];
const paginationNumbers = document.getElementById("pagination-numbers");
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("prev-button");
const searchInput = document.getElementById("searchInput");
const paginationLimit = 10;
let currentPage = 1;
let pageCount;

export const renderPosts = (posts) => {
    tableBody.innerHTML = "";
  
    if (posts.length > 0) {
      posts.forEach(post => {
        renderTableRow(post, `
          <td class="flex p-[10px] mr-[5px]">
              ${post.id}
          </td>
          <td>
              <span class="card">
                  <span class="card-header">User ${post.userId} - Title: "${post.title}"</span>
                  <span class="card-body">${post.body}</span>
              </span>
          </td>
        `);
      });  
    } else {
      renderTableRow({}, `
        <td colspan="2" class="p-[10px] mr-[5px] text-center">
            <span class="card">
              No Data
            </span>
        </td>
      `);
    }

    renderPagination();
    renderHighlight();
}

export const renderTableRow = (post, innerHtml) => {
  const row = document.createElement("tr");
  row.classList.add("table-body-row");

  if (post.body && post.body.includes("rerum")) {
    row.classList.add("table-warning");
  }

  row.innerHTML = innerHtml;
  tableBody.appendChild(row);
}

export const renderHighlight = () => {
    const regex = new RegExp(`rerum`, 'gi'); // Match whole word, case-insensitive
    Array.from(tableBody.children).forEach(listItem => {
        listItem.innerHTML = listItem.innerHTML.replace(regex, `<strong>rerum</strong>`);
    });
}
  
export const handlePageButtonsStatus = () => {
    prevButton.setAttribute("disabled", currentPage === true);
    nextButton.setAttribute("disabled", currentPage === pageCount);
};
  
export const handleActivePageNumber = () => {
    document.querySelectorAll(".pagination-number").forEach((button) => {
      button.classList.remove("active");
      const pageIndex = Number(button.getAttribute("page-index"));
      if (pageIndex == currentPage) {
        button.classList.add("active");
      }
    });
};
  
export const getPaginationNumbers = () => {
    for (let i = 1; i <= pageCount; i++) {
      const pageNumber = document.createElement("button");
      pageNumber.className = "pagination-number";
      pageNumber.innerHTML = i;
      pageNumber.setAttribute("page-index", i);
      paginationNumbers.appendChild(pageNumber);
    }
};
  
export const setCurrentPage = (pageNum, tableItems) => {
    currentPage = pageNum;
    handleActivePageNumber();
    handlePageButtonsStatus();
    const prevRange = (pageNum - 1) * paginationLimit;
    const currRange = pageNum * paginationLimit;
  
    tableItems.forEach((item, index) => {
      item.classList.add("hidden");
      if (index >= prevRange && index < currRange) {
        item.classList.remove("hidden");
      }
    });
};

export const renderPagination = () => {
    const paginatedTable = document.getElementById("paginated-table");
    const tableItems = paginatedTable.querySelectorAll(".table-body-row");
    
    paginationNumbers.innerHTML = "";
    pageCount = Math.ceil(tableItems.length / paginationLimit);

    getPaginationNumbers();
    setCurrentPage(1, tableItems);
  
    prevButton.addEventListener("click", () => {
      setCurrentPage(currentPage - 1, tableItems);
    });
  
    nextButton.addEventListener("click", () => {
      setCurrentPage(currentPage + 1, tableItems);
    });
  
    document.querySelectorAll(".pagination-number").forEach((button) => {
      const pageIndex = Number(button.getAttribute("page-index"));
  
      if (pageIndex) {
        button.addEventListener("click", () => {
          setCurrentPage(pageIndex, tableItems);
        });
      }
    });
  }

export const renderSearch = (postsData) => {
    searchInput.addEventListener("input", () => {
      const term = searchInput.value.toLowerCase();
      const filtered = postsData.filter(post =>
        post.title.toLowerCase().includes(term) ||
        post.body.toLowerCase().includes(term)
      );
      renderPosts(filtered);
    });
};

export const main = async () => {
  try {
    postsData = await getPosts();
    renderPosts(postsData);
    renderSearch(postsData);
  } catch (err) {
    console.error("Error loading posts:", err);
  }
};

if (!window.location.href.includes("test")) {
  main();
}