import { getPosts } from "../core/api.js";

const tableBody = document.getElementById("table-body");
let postsData = [];

function renderPosts(posts) {
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

const renderTableRow = (post, innerHtml) => {
    const row = document.createElement("tr");
    row.classList.add("table-body-row");

    if (post.body && post.body.includes("rerum")) {
        row.classList.add("table-warning");
    }

    row.innerHTML = innerHtml;
    tableBody.appendChild(row);
}

const countKeywords = (posts, keyword) => {
    return posts.filter(post => post.body.includes(keyword)).length;
}

(async () => {
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

        // Pie Chart
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

    } catch (err) {
      console.error("Error loading posts:", err);
    }
})();
