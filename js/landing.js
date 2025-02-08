document.addEventListener("DOMContentLoaded", () => {
  const categoryButtons = document.querySelectorAll(".category-btn");
  const problemsContainer = document.getElementById("problems-container");

  // Attach click handlers to each category (master) button
  categoryButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const category = btn.dataset.category; // e.g. "python_basics"
      await loadProblems(category);
    });
  });

  /**
   * Fetches the problems for the given category (JSON file)
   * and calls renderProblems() to display them.
   */
  async function loadProblems(category) {
    try {
      // Each category’s JSON is expected to be in the same folder: "<category>.json"
      // e.g., "python_basics.json", "arrays_hashing.json", etc.
      const response = await fetch(`../${category}.json`);
      if (!response.ok) {
        throw new Error("Failed to fetch data for category: " + category);
      }
      const problems = await response.json();
      console.log("Problems loaded:", problems);
      renderProblems(problems);
    } catch (error) {
      console.error("Error loading problems:", error);
      problemsContainer.innerHTML = `<p style="color:red;">Could not load ${category} problems.</p>`;
    }
  }

  /**
   * Dynamically creates rows of problems in the detail area.
   */
  function renderProblems(problems) {
    // Clear the existing content inside the problems container
    problemsContainer.innerHTML = "";

    // Loop through each problem in the given list
    problems.forEach((problem) => {
      // Create a new div element for the problem row
      const row = document.createElement("div");
      row.classList.add("problem-row"); // Add CSS class for styling

      // Create a div to display problem name, difficulty, and patterns involved
      const infoDiv = document.createElement("div");
      infoDiv.classList.add("problem-info"); // Add CSS class for styling

      // Get the patterns involved in the problem (join them as a comma-separated string)
      // If patterns are missing, default to "No patterns"
      const patternList =
        problem["patterns involved"]?.join(", ") || "No patterns";

      // Set the text content to display problem details
      infoDiv.textContent = `${problem.name} (${problem.difficulty})       Patterns:${patternList}`;

      // Create a button for starting or re-solving the problem
      const startBtn = document.createElement("button");
      startBtn.classList.add("start-btn"); // Add CSS class for styling

      // Change button text based on whether the problem has been solved or not
      startBtn.textContent = problem.solved ? "re-solve" : "start";

      // Add an event listener to the button to open the problem in the IDE page
      startBtn.addEventListener("click", () => {
        // Convert the problem object to a string and encode it for passing via URL
        const serializedProblem = encodeURIComponent(JSON.stringify(problem));

        // Open `ide.html` in a new tab and pass the problem data as a query parameter
        window.open(`ide.html?data=${serializedProblem}`, "_blank");
      });

      // Append the problem details and the button to the problem row
      row.appendChild(infoDiv);
      row.appendChild(startBtn);

      // Append the newly created row to the problems container
      problemsContainer.appendChild(row);
    });
  }
});
