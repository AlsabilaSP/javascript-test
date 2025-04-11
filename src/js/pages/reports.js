import { getPosts } from "../core/api.js";

const tableBody = document.getElementById("table-body");
let postsData = [];

export const renderPosts = (posts) => {
    tableBody.innerHTML = "";
  
    if (posts.length > 0) {
      posts.forEach(post => {
        renderTableRow(post, `
          <td class="p-[10px] mr-[5px] text-center">
              User ${post.userId}
          </td>
          <td class="p-[10px] mr-[5px] text-center">
              ${post.postCount} posts
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

export const countKeywords = (posts, keyword) => {
    return posts.filter(post => post.body.includes(keyword)).length;
}

export const renderPieChart = (postsData) => {
  const rerumCount = countKeywords(postsData, "rerum");
  const otherCount = postsData.length - rerumCount;

  const ctx = document.getElementById("rerumChart").getContext("2d");
  new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Rerum Posts', 'Other Posts'],
        datasets: [{
        label: 'Post Breakdown',
        data: [rerumCount, otherCount],
        backgroundColor: ['#f59e0b', '#3b82f6'],
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
        legend: {
            position: 'bottom'
          }
        }
    }
  });
}

export const main = async () => {
  try {
    postsData = await getPosts();

    const postCountsWithReduce = postsData.reduce((acc, current) => {
        const userId = current.userId;
        acc[userId] = (acc[userId] || 0) + 1;
        return acc;
    }, {});
    
    const resultWithReduce = Object.keys(postCountsWithReduce).map(userId => ({
        userId: parseInt(userId),
        postCount: postCountsWithReduce[userId]
    }));

    renderPosts(resultWithReduce);
    renderPieChart(postsData);

  } catch (err) {
    console.error("Error loading posts:", err);
  }
};

if (!window.location.href.includes("test")) {
  main();
}