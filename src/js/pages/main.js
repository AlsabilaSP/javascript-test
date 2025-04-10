import { getPosts } from "../core/api.js";

const tableBody = document.getElementById("table-body");
let postsData = [];
const paginationNumbers = document.getElementById("pagination-numbers");
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("prev-button");
const paginationLimit = 10;
let currentPage = 1;
let pageCount;

function renderPosts(posts) {
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

const renderTableRow = (post, innerHtml) => {
  const row = document.createElement("tr");
  row.classList.add("table-body-row");

  if (post.body && post.body.includes("rerum")) {
    row.classList.add("table-warning");
  }

  row.innerHTML = innerHtml;
  tableBody.appendChild(row);
}

const renderHighlight = () => {
    const regex = new RegExp(`rerum`, 'gi'); // Match whole word, case-insensitive
    Array.from(tableBody.children).forEach(listItem => {
        listItem.innerHTML = listItem.innerHTML.replace(regex, `<strong>rerum</strong>`);
    });
}
  
const handlePageButtonsStatus = () => {
    prevButton.setAttribute("disabled", currentPage === true);
    nextButton.setAttribute("disabled", currentPage === pageCount);
};
  
const handleActivePageNumber = () => {
    document.querySelectorAll(".pagination-number").forEach((button) => {
      button.classList.remove("active");
      const pageIndex = Number(button.getAttribute("page-index"));
      if (pageIndex == currentPage) {
        button.classList.add("active");
      }
    });
};
  
const getPaginationNumbers = () => {
    for (let i = 1; i <= pageCount; i++) {
      const pageNumber = document.createElement("button");
      pageNumber.className = "pagination-number";
      pageNumber.innerHTML = i;
      pageNumber.setAttribute("page-index", i);
      paginationNumbers.appendChild(pageNumber);
    }
};
  
const setCurrentPage = (pageNum, tableItems) => {
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

const renderPagination = () => {
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

(async () => {
    try {
      postsData = await getPosts();
      renderPosts(postsData);
    } catch (err) {
      console.error("Error loading posts:", err);
    }
})();

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  const filtered = postsData.filter(post =>
    post.title.toLowerCase().includes(term) ||
    post.body.toLowerCase().includes(term)
  );
  renderPosts(filtered);
});
