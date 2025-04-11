const navbarHTML = `
<nav class="bg-gray-800">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="flex flex-1 items-center justify-start">
          <div class="ml-6 block">
            <div class="flex space-x-4">
              <a href="posts.html" id="posts-link" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Posts</a>
              <a href="reports.html" id="reports-link" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Reports</a>
              <a href="posts-test.html" id="posts-test-link" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Posts Test</a>
            </div>
          </div>
        </div>
      </div>
    </div>
</nav>
`;

// Inject the navbar HTML
const body = document.querySelector('body');
body.insertAdjacentHTML('afterbegin', navbarHTML);