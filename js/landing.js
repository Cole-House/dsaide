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
        const response = await fetch(`${category}.json`);
        if (!response.ok) {
          throw new Error("Failed to fetch data for category: " + category);
        }
        const problems = await response.json();
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
      problemsContainer.innerHTML = ""; // Clear existing content
  
      problems.forEach((problem) => {
        // One row for each problem
        const row = document.createElement("div");
        row.classList.add("problem-row");
  
        // Text info: name, difficulty, patterns
        const infoDiv = document.createElement("div");
        infoDiv.classList.add("problem-info");
        const patternList = problem["patterns involved"]?.join(", ") || "No patterns";
        infoDiv.textContent = `${problem.name} (${problem.difficulty}) (${patternList})`;
  
        // "Start" or "re-solve" button
        const startBtn = document.createElement("button");
        startBtn.classList.add("start-btn");
        startBtn.textContent = problem.solved ? "re-solve" : "start";
  
        // When user clicks, open IDE page with problem data in the URL
        startBtn.addEventListener("click", () => {
          // Convert problem object to a string and pass it via query param
          const serializedProblem = encodeURIComponent(JSON.stringify(problem));
          window.open(`ide.html?data=${serializedProblem}`, "_blank");
        });
  
        row.appendChild(infoDiv);
        row.appendChild(startBtn);
        problemsContainer.appendChild(row);
      });
    }
  });