/*
  Fridge Chores - Step 8 App Logic

  This version hardens the app before deployment.

  The app now:
  1. Uses a real CHORES configuration array.
  2. Saves chore progress in localStorage.
  3. Lets chore buttons increment progress.
  4. Prevents chores from incrementing beyond their required count.
  5. Automatically resets expired daily, weekly, and monthly chores.
  6. Shows an undo button when a chore has progress.
  7. Lets the undo button decrement progress by one.
  8. Can display either emoji icons or custom PNG icons.
  9. Includes reset, export, import, download, and debug tools.
  10. Validates chore configuration.
  11. Handles corrupted or unavailable localStorage more safely.
  12. Escapes rendered text to avoid broken HTML from special characters.
*/

// Start Framework7.
// This gives us a mobile/tablet app shell without needing React, npm, or a build tool.
const app = new Framework7({
  el: "#app",
  name: "Fridge Chores",
  theme: "ios"
});

// This is the localStorage key used to save progress in the browser.
// Changing this key would make the app start with fresh saved data.
const STORAGE_KEY = "fridgeChoresStateV1";

// Allowed reset frequencies.
const VALID_FREQUENCIES = ["daily", "weekly", "monthly"];

/*
  This is the main chore configuration list.

  To edit your chores later, this is the first place you will go.

  Each chore has:
  - id: a unique machine-friendly name
  - label: the human-readable name shown on the button
  - icon: the emoji shown if no PNG is provided
  - iconPath: optional path to a custom PNG icon
  - frequency: daily, weekly, or monthly
  - requiredCount: how many taps are needed before the chore is complete

  Example PNG icon usage:

  {
    id: "dog-food",
    label: "Dog Food",
    icon: "🐶",
    iconPath: "assets/icons/dog.png",
    frequency: "daily",
    requiredCount: 1
  }

  If iconPath exists, the app uses the PNG.
  If iconPath is missing, the app uses the emoji.
*/
const CHORES = [
     // Daily chores
     {
       id: "dishes",
       label: "Dishwasher",
       icon: "🍽️",
       iconPath: "assets/dishwasher.png",
       frequency: "daily",
       requiredCount: 1
     },
     {
       id: "counters",
       label: "Kitchen",
       icon: "🧽",
       iconPath: "assets/kitchen.png", 
       frequency: "daily",
       requiredCount: 1
     },
     {
       id: "trash-check",
       label: "Trash",
       icon: "🗑️",
       iconPath: "assets/recycle-bin.png",
       frequency: "daily",
       requiredCount: 1
     },
     {
       id: "floors",
       label: "Floors",
       icon: "🧹",
       iconPath: "assets/dust.png",
       frequency: "daily",
       requiredCount: 1
     },
   {
     id: "living-room",
     label: "Living Room",
     iconPath: "assets/sofa.png",
     frequency: "daily",
     requiredCount: 1
   },
   {
     id: "entryway",
     label: "Entryway",
     iconPath: "assets/corridor.png",
     frequency: "daily",
     requiredCount: 1
   },
   {
     id: "bedroom",
     label: "Bedroom",
     iconPath: "assets/bed.png",
     frequency: "daily",
     requiredCount: 1
   },
   {
     id: "bathroom",
     label: "Bathroom",
     iconPath: "assets/bath.png",
     frequency: "daily",
     requiredCount: 1
   },
   {
     id: "office",
     label: "Office",
     iconPath: "assets/workspace.png",
     frequency: "daily",
     requiredCount: 1
   },
     {
       id: "dog-dental",
       label: "Beau",
       iconPath: "assets/grooming.png",
       frequency: "daily",
       requiredCount: 1
     },
   
     // Weekly chores
     {
       id: "laundry",
       label: "Laundry",
       iconPath: "assets/basket.png",
       frequency: "weekly",
       requiredCount: 3
     },
     {
       id: "plants",
       label: "Plants",
       iconPath: "assets/watering-can.png",
       frequency: "weekly",
       requiredCount: 2
     },
     {
       id: "aquarium",
       label: "Aquarium",
       iconPath: "assets/fishbowl.png",
       frequency: "weekly",
       requiredCount: 3
     },
     {
       id: "mail",
       label: "Mail",
       iconPath: "assets/mail-box.png",
       frequency: "weekly",
       requiredCount: 2
     },
     {
       id: "dust",
       label: "Dust",
       iconPath: "assets/duster.png",
       frequency: "weekly",
       requiredCount: 1
     },
   
     {
       id: "mirrors",
       label: "Mirrors",
       iconPath: "assets/mirror.png",
       frequency: "weekly",
       requiredCount: 1
     },
     {
       id: "rug-vacuum",
       label: "Vacuum Rugs",
       iconPath: "assets/vacuum-cleaner.png",
       frequency: "weekly",
       requiredCount: 2
     },
     {
       id: "mop",
       label: "Mop",
       iconPath: "assets/mop.png",
       frequency: "weekly",
       requiredCount: 1
     },
   {
     id: "toilet",
     label: "Toilet",
     iconPath: "assets/toilet.png",
     frequency: "weekly",
     requiredCount: 1
   },
   
   {
     id: "linens",
     label: "Linens",
     iconPath: "assets/blanket.png",
     frequency: "weekly",
     requiredCount: 1
   },
   
   // Monthly chores
   {
     id: "dog-bowls",
     label: "Dog Bowls",
     iconPath: "assets/pet-bowl.png",
     frequency: "monthly",
     requiredCount: 1
   },
   {
     id: "shower",
     label: "Shower",
     iconPath: "assets/shower.png",
     frequency: "monthly",
     requiredCount: 1
   },
   {
     id: "fridge",
     label: "Fridge",
     iconPath: "assets/fridge.png",
     frequency: "monthly",
     requiredCount: 1
   },
   {
     id: "stove",
     label: "Stove",
     iconPath: "assets/gas-stove.png",
     frequency: "monthly",
     requiredCount: 1
   },
   {
     id: "baseboards",
     label: "Baseboards",
     iconPath: "assets/wall.png",
     frequency: "monthly",
     requiredCount: 1
   },
   {
     id: "windows",
     label: "Windows",
     iconPath: "assets/window.png",
     frequency: "monthly",
     requiredCount: 1
   },
   {
     id: "air-filters",
     label: "Air Filters",
     iconPath: "assets/filter.png",
     frequency: "monthly",
     requiredCount: 1
   },
   {
     id: "Coffee Machine",
     label: "Coffee Machine",
     iconPath: "assets/coffee-machine.png",
     frequency: "monthly",
     requiredCount: 1
   }
   
   ];

// These sections control how chores are grouped visually on the dashboard.
const SECTIONS = [
  {
    title: "Today",
    frequency: "daily"
  },
  {
    title: "This Week",
    frequency: "weekly"
  },
  {
    title: "This Month",
    frequency: "monthly"
  }
];

// This variable holds the current saved progress while the app is running.
let choreState = {};

// These flags help us avoid repeatedly warning about the same storage problem.
let hasStorageAccess = true;
let hasShownStorageWarning = false;

// Runs when the page is ready.
document.addEventListener("DOMContentLoaded", function () {
  const configIssues = getChoreConfigIssues();

  if (configIssues.length > 0) {
    renderConfigError(configIssues);
    showConfigErrorDialog(configIssues);
    return;
  }

  choreState = loadState();

  // Make sure every chore in CHORES has a matching saved state object.
  ensureStateForAllChores();

  // Reset any chores whose saved period is no longer current.
  resetExpiredChores();

  // Save immediately so localStorage has a clean complete structure.
  saveState();

  renderDateTime();
  renderApp();
  setupInteractions();
  setupSettingsInteractions();
  updateSettingsPanelData();

  // Update the displayed time once per minute.
  // Also check for resets once per minute in case the iPad stays open overnight.
  setInterval(function () {
    renderDateTime();
    checkForAutomaticReset();
  }, 60000);
});

/**
 * Returns the current period key for a chore frequency.
 *
 * The period key is the app's way of labeling the current reset window.
 *
 * Daily example:
 * 2026-07-05
 *
 * Weekly example:
 * 2026-07-05
 * This represents the Sunday starting that week.
 *
 * Monthly example:
 * 2026-07
 */
function getCurrentPeriodKey(frequency) {
  const now = new Date();

  if (frequency === "daily") {
    return formatLocalDate(now);
  }

  if (frequency === "weekly") {
    const weekStart = getStartOfWeek(now);
    return formatLocalDate(weekStart);
  }

  if (frequency === "monthly") {
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  }

  // Fallback for unexpected frequency values.
  return formatLocalDate(now);
}

/**
 * Formats a JavaScript Date as YYYY-MM-DD using local device time.
 */
function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Returns the Sunday that starts the current week.
 *
 * For example, if today is Wednesday, July 8, 2026,
 * this returns Sunday, July 5, 2026.
 *
 * Later, if you prefer weeks to start on Monday, we can adjust this function.
 */
function getStartOfWeek(date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayOfWeek = start.getDay(); // Sunday = 0, Monday = 1, Tuesday = 2, etc.

  start.setDate(start.getDate() - dayOfWeek);

  return start;
}

/**
 * Checks the CHORES configuration for common mistakes.
 *
 * This helps catch beginner-friendly errors such as:
 * - duplicate ids
 * - missing ids
 * - invalid frequencies
 * - non-numeric required counts
 */
function getChoreConfigIssues() {
  const issues = [];
  const seenIds = new Set();

  if (!Array.isArray(CHORES) || CHORES.length === 0) {
    issues.push("CHORES must be a non-empty array.");
    return issues;
  }

  CHORES.forEach(function (chore, index) {
    const location = `CHORES item #${index + 1}`;

    if (!chore || typeof chore !== "object" || Array.isArray(chore)) {
      issues.push(`${location} must be an object.`);
      return;
    }

    if (typeof chore.id !== "string" || chore.id.trim() === "") {
      issues.push(`${location} is missing a valid id.`);
    } else if (seenIds.has(chore.id)) {
      issues.push(`Duplicate chore id found: "${chore.id}". Each chore id must be unique.`);
    } else {
      seenIds.add(chore.id);
    }

    if (typeof chore.label !== "string" || chore.label.trim() === "") {
      issues.push(`${location} is missing a valid label.`);
    }

    if (!VALID_FREQUENCIES.includes(chore.frequency)) {
      issues.push(
        `${location} has invalid frequency "${chore.frequency}". Use daily, weekly, or monthly.`
      );
    }

    if (!Number.isInteger(chore.requiredCount) || chore.requiredCount < 1) {
      issues.push(`${location} must have requiredCount as an integer of 1 or higher.`);
    }

    if (
      typeof chore.iconPath !== "string" &&
      (typeof chore.icon !== "string" || chore.icon.trim() === "")
    ) {
      issues.push(`${location} should have either an icon emoji or an iconPath.`);
    }
  });

  return issues;
}

/**
 * Shows configuration issues directly on the dashboard.
 */
function renderConfigError(issues) {
  const dashboard = document.getElementById("dashboard");

  if (!dashboard) {
    return;
  }

  const issueItems = issues
    .map(function (issue) {
      return `<li>${escapeHtml(issue)}</li>`;
    })
    .join("");

  dashboard.innerHTML = `
    <section class="config-error-card">
      <h2>Configuration Needs Attention</h2>
      <p>
        The app found a problem in your CHORES array. Fix the issue in app.js,
        save the file, and refresh the browser.
      </p>
      <ul>
        ${issueItems}
      </ul>
    </section>
  `;
}

/**
 * Also shows a Framework7 dialog for configuration errors.
 */
function showConfigErrorDialog(issues) {
  const message = issues.slice(0, 4).join("\n");

  app.dialog.alert(
    `Please fix app.js and refresh the browser.\n\n${message}`,
    "Chore Configuration Error"
  );
}

/**
 * Loads saved chore progress from localStorage.
 *
 * If nothing has been saved yet, this returns an empty object.
 * If saved data is corrupted, this safely starts fresh.
 * If localStorage is unavailable, the app still works for the current session.
 */
function loadState() {
  let savedState;

  try {
    savedState = localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    hasStorageAccess = false;
    console.warn("localStorage is unavailable. Progress will not persist after refresh.", error);
    notifyStorageUnavailable();
    return {};
  }

  if (!savedState) {
    return {};
  }

  try {
    const parsedState = JSON.parse(savedState);

    if (
      parsedState &&
      typeof parsedState === "object" &&
      !Array.isArray(parsedState)
    ) {
      return parsedState;
    }

    return {};
  } catch (error) {
    console.warn("Saved chore state could not be read. Starting fresh.", error);

    app.dialog.alert(
      "The saved chore data was corrupted or unreadable, so the app started with fresh progress.",
      "Saved Data Reset"
    );

    return {};
  }
}

/**
 * Saves the current choreState object to localStorage.
 */
function saveState() {
  if (!hasStorageAccess) {
    notifyStorageUnavailable();
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(choreState));
  } catch (error) {
    hasStorageAccess = false;
    console.error("Chore progress could not be saved.", error);
    notifyStorageUnavailable();
  }
}

/**
 * Warns the user once if browser storage is unavailable.
 */
function notifyStorageUnavailable() {
  if (hasShownStorageWarning) {
    return;
  }

  hasShownStorageWarning = true;

  app.dialog.alert(
    "The app can still run, but this browser is blocking localStorage. Progress may not be remembered after refresh.",
    "Storage Unavailable"
  );
}

/**
 * Creates a blank state object for a chore.
 */
function createEmptyChoreState(chore) {
  return {
    count: 0,
    periodKey: getCurrentPeriodKey(chore.frequency),
    lastUpdated: null
  };
}

/**
 * Ensures that every chore has a valid state object.
 *
 * This protects the app if:
 * - You add a new chore later.
 * - You rename or remove a chore.
 * - Saved data becomes incomplete.
 * - requiredCount changes later.
 */
function ensureStateForAllChores() {
  const validChoreIds = new Set(
    CHORES.map(function (chore) {
      return chore.id;
    })
  );

  CHORES.forEach(function (chore) {
    const savedChoreState = choreState[chore.id];

    if (
      !savedChoreState ||
      typeof savedChoreState !== "object" ||
      Array.isArray(savedChoreState)
    ) {
      choreState[chore.id] = createEmptyChoreState(chore);
      return;
    }

    const numericCount = Number(savedChoreState.count);

    savedChoreState.count = Number.isFinite(numericCount)
      ? Math.min(Math.max(Math.floor(numericCount), 0), chore.requiredCount)
      : 0;

    if (
      typeof savedChoreState.periodKey !== "string" ||
      savedChoreState.periodKey.length === 0
    ) {
      savedChoreState.periodKey = getCurrentPeriodKey(chore.frequency);
    }

    if (!Object.prototype.hasOwnProperty.call(savedChoreState, "lastUpdated")) {
      savedChoreState.lastUpdated = null;
    }
  });

  // Remove saved state for chores that no longer exist in the CHORES array.
  Object.keys(choreState).forEach(function (choreId) {
    if (!validChoreIds.has(choreId)) {
      delete choreState[choreId];
    }
  });
}

/**
 * Resets chores whose saved periodKey no longer matches the current periodKey.
 *
 * This is the main automatic reset function.
 *
 * Example:
 * If Dishes was completed yesterday, its saved daily periodKey might be:
 * 2026-07-05
 *
 * If today is:
 * 2026-07-06
 *
 * The keys do not match, so Dishes resets to 0.
 */
function resetExpiredChores() {
  let didResetAnyChores = false;

  CHORES.forEach(function (chore) {
    const state = getStateForChore(chore);
    const currentPeriodKey = getCurrentPeriodKey(chore.frequency);

    if (state.periodKey !== currentPeriodKey) {
      state.count = 0;
      state.periodKey = currentPeriodKey;
      state.lastUpdated = null;

      didResetAnyChores = true;
    }
  });

  return didResetAnyChores;
}

/**
 * Checks for automatic resets while the app is already open.
 *
 * This is helpful for an iPad that stays mounted and awake overnight.
 */
function checkForAutomaticReset() {
  const didResetAnyChores = resetExpiredChores();

  if (!didResetAnyChores) {
    return;
  }

  saveState();
  renderApp();
  updateSettingsPanelData();

  showToast("Chores updated for the new day, week, or month.");
}

/**
 * Finds a chore by id.
 */
function getChoreById(id) {
  return CHORES.find(function (chore) {
    return chore.id === id;
  });
}

/**
 * Returns the saved state for a chore.
 * If the state does not exist yet, this creates it.
 */
function getStateForChore(chore) {
  if (!choreState[chore.id]) {
    choreState[chore.id] = createEmptyChoreState(chore);
  }

  return choreState[chore.id];
}

/**
 * Displays the current local day, date, and time.
 * This uses the iPad/Mac/browser's local time.
 */
function renderDateTime() {
  const now = new Date();

  const currentDay = document.getElementById("currentDay");
  const currentDate = document.getElementById("currentDate");
  const currentTime = document.getElementById("currentTime");

  if (!currentDay || !currentDate || !currentTime) {
    return;
  }

  currentDay.textContent = new Intl.DateTimeFormat("en-US", {
    weekday: "long"
  }).format(now);

  currentDate.textContent = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(now);

  currentTime.textContent = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  }).format(now);
}

/**
 * Renders the full chore dashboard.
 */
function renderApp() {
  const dashboard = document.getElementById("dashboard");

  if (!dashboard) {
    return;
  }

  dashboard.innerHTML = SECTIONS.map(function (section) {
    return renderSection(section);
  }).join("");
}

/**
 * Renders one frequency section: Today, This Week, or This Month.
 */
function renderSection(section) {
  const sectionChores = CHORES.filter(function (chore) {
    return chore.frequency === section.frequency;
  });

  const totalChores = sectionChores.length;

  const completedChores = sectionChores.filter(function (chore) {
    return isChoreComplete(chore);
  }).length;

  return `
    <section class="frequency-section">
      <div class="section-heading">
        <h2 class="section-title">${escapeHtml(section.title)}</h2>
        <div class="section-count">${completedChores} / ${totalChores} complete</div>
      </div>

      <div class="chore-grid">
        ${sectionChores.map(renderChoreButton).join("")}
      </div>
    </section>
  `;
}

/**
 * Creates one chore tile.
 *
 * The tile contains:
 * 1. The main chore button.
 * 2. A separate undo button, shown only when count is greater than 0.
 *
 * Important:
 * We do not put the undo button inside the chore button.
 * Nesting a button inside another button is invalid HTML.
 */
function renderChoreButton(chore) {
  const state = getStateForChore(chore);
  const statusClass = getChoreStatusClass(chore);
  const progressText = getProgressText(chore);
  const progressPercent = getProgressPercent(chore);
  const iconHtml = getIconHtml(chore);
  const undoButtonHtml = getUndoButtonHtml(chore, state);

  const safeId = escapeAttribute(chore.id);
  const safeLabel = escapeHtml(chore.label);
  const safeAriaLabel = escapeAttribute(`${chore.label}, ${progressText}`);

  return `
    <div class="chore-tile" data-chore-id="${safeId}">
      <button
        type="button"
        class="chore-button ${statusClass}"
        style="--progress: ${progressPercent};"
        data-chore-id="${safeId}"
        aria-label="${safeAriaLabel}"
      >
        <span class="chore-content">
          ${iconHtml}
          <span class="chore-label">${safeLabel}</span>
          <span class="chore-progress">${escapeHtml(progressText)}</span>
        </span>
      </button>

      ${undoButtonHtml}
    </div>
  `;
}

/**
 * Returns either a custom PNG image icon or the fallback emoji icon.
 *
 * To use a PNG:
 * 1. Put the image file inside assets/icons.
 * 2. Add iconPath to the chore object.
 *
 * Example:
 * iconPath: "assets/icons/dog.png"
 */
function getIconHtml(chore) {
  if (chore.iconPath) {
    return `
      <img
        class="chore-icon-img"
        src="${escapeAttribute(chore.iconPath)}"
        alt=""
        aria-hidden="true"
      />
    `;
  }

  return `<span class="chore-icon">${escapeHtml(chore.icon)}</span>`;
}

/**
 * Returns the undo button HTML for a chore.
 *
 * The undo button only appears when the chore has progress.
 */
function getUndoButtonHtml(chore, state) {
  if (state.count <= 0) {
    return "";
  }

  const safeId = escapeAttribute(chore.id);
  const safeLabel = escapeAttribute(chore.label);

  return `
    <button
      type="button"
      class="chore-undo-button"
      data-chore-id="${safeId}"
      aria-label="Undo ${safeLabel}"
      title="Undo ${safeLabel}"
    >
      ↶
    </button>
  `;
}

/**
 * Determines whether a chore is complete.
 */
function isChoreComplete(chore) {
  const state = getStateForChore(chore);
  return state.count >= chore.requiredCount;
}

/**
 * Returns the visual status class for a chore.
 *
 * Due:
 * count is 0
 *
 * Partial:
 * count is greater than 0 but less than requiredCount
 *
 * Complete:
 * count is equal to or greater than requiredCount
 */
function getChoreStatusClass(chore) {
  const state = getStateForChore(chore);

  if (state.count >= chore.requiredCount) {
    return "status-complete";
  }

  if (state.count > 0) {
    return "status-partial";
  }

  return "status-due";
}

/**
 * Returns the progress text shown on each chore.
 */
function getProgressText(chore) {
  const state = getStateForChore(chore);

  if (chore.requiredCount === 1) {
    return state.count >= 1 ? "Complete" : "Due";
  }

  if (state.count >= chore.requiredCount) {
    return "Complete";
  }

  return `${state.count} / ${chore.requiredCount}`;
}

/**
 * Returns the percentage used by the orange circular progress ring.
 */
function getProgressPercent(chore) {
  const state = getStateForChore(chore);

  if (chore.requiredCount <= 1) {
    return "0%";
  }

  const percent = Math.round((state.count / chore.requiredCount) * 100);
  const safePercent = Math.min(Math.max(percent, 0), 100);

  return `${safePercent}%`;
}

/**
 * Sets up user interactions for:
 * 1. Main chore button taps.
 * 2. Undo button taps.
 * 3. Settings button taps.
 */
function setupInteractions() {
  const dashboard = document.getElementById("dashboard");
  const settingsButton = document.getElementById("settingsButton");

  if (dashboard) {
    dashboard.addEventListener("click", function (event) {
      const undoButton = event.target.closest(".chore-undo-button");

      if (undoButton) {
        event.preventDefault();
        event.stopPropagation();

        const choreId = undoButton.dataset.choreId;
        decrementChore(choreId);
        return;
      }

      const choreButton = event.target.closest(".chore-button");

      if (!choreButton) {
        return;
      }

      const choreId = choreButton.dataset.choreId;
      incrementChore(choreId);
    });
  }

  if (settingsButton) {
    settingsButton.addEventListener("click", function (event) {
      event.preventDefault();

      updateSettingsPanelData();
      app.popup.open("#settingsPopup");
    });
  }
}

/**
 * Sets up all settings/data tool interactions.
 */
function setupSettingsInteractions() {
  const resetAllButton = document.getElementById("resetAllButton");
  const refreshExportButton = document.getElementById("refreshExportButton");
  const downloadExportButton = document.getElementById("downloadExportButton");
  const importButton = document.getElementById("importButton");
  const toggleDebugButton = document.getElementById("toggleDebugButton");

  if (resetAllButton) {
    resetAllButton.addEventListener("click", function () {
      app.dialog.confirm(
        "This will clear all saved chore progress and return every chore to due. This cannot be undone.",
        "Reset All Progress?",
        function () {
          resetAllProgress();
        }
      );
    });
  }

  if (refreshExportButton) {
    refreshExportButton.addEventListener("click", function () {
      updateSettingsPanelData();
      showToast("Export JSON refreshed.");
    });
  }

  if (downloadExportButton) {
    downloadExportButton.addEventListener("click", function () {
      downloadExportJson();
    });
  }

  if (importButton) {
    importButton.addEventListener("click", function () {
      handleImportProgress();
    });
  }

  if (toggleDebugButton) {
    toggleDebugButton.addEventListener("click", function () {
      toggleDebugState();
    });
  }
}

/**
 * Increments a chore by one tap.
 *
 * A chore cannot increment beyond its requiredCount.
 */
function incrementChore(id) {
  const chore = getChoreById(id);

  if (!chore) {
    showToast("That chore could not be found.");
    return;
  }

  // Before changing the chore, make sure its saved period is still current.
  resetExpiredChores();

  const state = getStateForChore(chore);

  if (state.count >= chore.requiredCount) {
    showToast(`${chore.label} is already complete.`);
    saveState();
    renderApp();
    updateSettingsPanelData();
    return;
  }

  state.count = Math.min(state.count + 1, chore.requiredCount);
  state.periodKey = getCurrentPeriodKey(chore.frequency);
  state.lastUpdated = new Date().toISOString();

  saveState();
  renderApp();
  updateSettingsPanelData();

  showToast(getTapFeedbackText(chore, state));
}

/**
 * Decrements a chore by one tap.
 *
 * This is connected to the visible undo button.
 */
function decrementChore(id) {
  const chore = getChoreById(id);

  if (!chore) {
    showToast("That chore could not be found.");
    return;
  }

  // Before changing the chore, make sure its saved period is still current.
  resetExpiredChores();

  const state = getStateForChore(chore);

  if (state.count <= 0) {
    state.count = 0;
    saveState();
    renderApp();
    updateSettingsPanelData();
    showToast(`${chore.label} is already due.`);
    return;
  }

  state.count = Math.max(state.count - 1, 0);
  state.periodKey = getCurrentPeriodKey(chore.frequency);
  state.lastUpdated = new Date().toISOString();

  saveState();
  renderApp();
  updateSettingsPanelData();

  showToast(getUndoFeedbackText(chore, state));
}

/**
 * Resets every chore to zero for the current period.
 */
function resetAllProgress() {
  choreState = {};

  CHORES.forEach(function (chore) {
    choreState[chore.id] = createEmptyChoreState(chore);
  });

  saveState();
  renderApp();
  updateSettingsPanelData();

  showToast("All chore progress reset.");
}

/**
 * Returns a full export object.
 *
 * This includes both:
 * - chores: the current chore configuration
 * - state: the current progress state
 */
function getExportData() {
  return {
    appName: "Fridge Chores",
    exportVersion: 1,
    exportedAt: new Date().toISOString(),
    localDate: formatLocalDate(new Date()),
    chores: CHORES,
    state: choreState
  };
}

/**
 * Returns the export object as formatted JSON text.
 */
function getExportJsonText() {
  return JSON.stringify(getExportData(), null, 2);
}

/**
 * Updates the export text area and debug output.
 */
function updateSettingsPanelData() {
  const exportTextArea = document.getElementById("exportTextArea");
  const debugStateOutput = document.getElementById("debugStateOutput");

  if (exportTextArea) {
    exportTextArea.value = getExportJsonText();
  }

  if (debugStateOutput && !debugStateOutput.classList.contains("is-hidden")) {
    debugStateOutput.textContent = JSON.stringify(choreState, null, 2);
  }
}

/**
 * Downloads the current export JSON as a file.
 */
function downloadExportJson() {
  const jsonText = getExportJsonText();
  const fileName = `fridge-chores-progress-${formatLocalDate(new Date())}.json`;

  const blob = new Blob([jsonText], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const temporaryLink = document.createElement("a");

  temporaryLink.href = url;
  temporaryLink.download = fileName;
  temporaryLink.style.display = "none";

  document.body.appendChild(temporaryLink);
  temporaryLink.click();
  document.body.removeChild(temporaryLink);

  URL.revokeObjectURL(url);

  showToast("Export file created.");
}

/**
 * Handles pasted JSON import.
 */
function handleImportProgress() {
  const importTextArea = document.getElementById("importTextArea");

  if (!importTextArea) {
    app.dialog.alert(
      "The import box could not be found in the page.",
      "Import Error"
    );
    return;
  }

  const importText = importTextArea.value.trim();

  if (!importText) {
    app.dialog.alert(
      "Paste exported JSON into the import box first.",
      "Nothing to Import"
    );
    return;
  }

  let parsedJson;

  try {
    parsedJson = JSON.parse(importText);
  } catch (error) {
    app.dialog.alert(
      "The text you pasted is not valid JSON. Check that you copied the entire export.",
      "Invalid JSON"
    );
    return;
  }

  const importedState = extractImportedState(parsedJson);

  if (!importedState) {
    app.dialog.alert(
      "The JSON was readable, but it did not contain a valid chore state object.",
      "Import Failed"
    );
    return;
  }

  app.dialog.confirm(
    "Importing will replace the current saved progress. Chores from old periods will still reset automatically after import.",
    "Import Progress?",
    function () {
      choreState = normalizeImportedState(importedState);

      ensureStateForAllChores();
      resetExpiredChores();
      saveState();
      renderApp();
      updateSettingsPanelData();

      importTextArea.value = "";

      showToast("Progress imported.");
    }
  );
}

/**
 * Accepts either:
 * 1. The full export object with a .state property.
 * 2. A raw choreState object.
 */
function extractImportedState(parsedJson) {
  if (
    parsedJson &&
    typeof parsedJson === "object" &&
    !Array.isArray(parsedJson) &&
    parsedJson.state &&
    typeof parsedJson.state === "object" &&
    !Array.isArray(parsedJson.state)
  ) {
    return parsedJson.state;
  }

  if (
    parsedJson &&
    typeof parsedJson === "object" &&
    !Array.isArray(parsedJson)
  ) {
    return parsedJson;
  }

  return null;
}

/**
 * Cleans imported data so bad values cannot break the app.
 *
 * This function:
 * - Keeps only chore ids that exist in CHORES.
 * - Clamps count between 0 and requiredCount.
 * - Preserves valid periodKey values.
 * - Preserves lastUpdated if it exists.
 */
function normalizeImportedState(importedState) {
  const nextState = {};

  CHORES.forEach(function (chore) {
    const importedChoreState = importedState[chore.id];

    if (
      !importedChoreState ||
      typeof importedChoreState !== "object" ||
      Array.isArray(importedChoreState)
    ) {
      nextState[chore.id] = createEmptyChoreState(chore);
      return;
    }

    const numericCount = Number(importedChoreState.count);
    const safeCount = Number.isFinite(numericCount)
      ? Math.min(Math.max(Math.floor(numericCount), 0), chore.requiredCount)
      : 0;

    const safePeriodKey =
      typeof importedChoreState.periodKey === "string" &&
      importedChoreState.periodKey.length > 0
        ? importedChoreState.periodKey
        : getCurrentPeriodKey(chore.frequency);

    const safeLastUpdated =
      typeof importedChoreState.lastUpdated === "string"
        ? importedChoreState.lastUpdated
        : null;

    nextState[chore.id] = {
      count: safeCount,
      periodKey: safePeriodKey,
      lastUpdated: safeLastUpdated
    };
  });

  return nextState;
}

/**
 * Shows or hides the raw chore state.
 */
function toggleDebugState() {
  const debugStateOutput = document.getElementById("debugStateOutput");
  const toggleDebugButton = document.getElementById("toggleDebugButton");

  if (!debugStateOutput || !toggleDebugButton) {
    return;
  }

  const isCurrentlyHidden = debugStateOutput.classList.contains("is-hidden");

  if (isCurrentlyHidden) {
    debugStateOutput.classList.remove("is-hidden");
    debugStateOutput.textContent = JSON.stringify(choreState, null, 2);
    toggleDebugButton.textContent = "Hide Raw State";
    return;
  }

  debugStateOutput.classList.add("is-hidden");
  toggleDebugButton.textContent = "Show Raw State";
}

/**
 * Creates a short feedback message after tapping a chore.
 */
function getTapFeedbackText(chore, state) {
  if (state.count >= chore.requiredCount) {
    return `${chore.label} complete.`;
  }

  if (chore.requiredCount > 1) {
    return `${chore.label}: ${state.count} of ${chore.requiredCount}.`;
  }

  return `${chore.label} updated.`;
}

/**
 * Creates a short feedback message after undoing a chore.
 */
function getUndoFeedbackText(chore, state) {
  if (state.count === 0) {
    return `${chore.label} is due again.`;
  }

  if (chore.requiredCount > 1) {
    return `${chore.label}: back to ${state.count} of ${chore.requiredCount}.`;
  }

  return `${chore.label} undone.`;
}

/**
 * Shows a small Framework7 toast message at the bottom of the screen.
 */
function showToast(message) {
  app.toast.create({
    text: message,
    closeTimeout: 1300,
    position: "bottom"
  }).open();
}

/**
 * Escapes text before inserting it into HTML.
 *
 * This prevents special characters like <, >, &, and quotes
 * from breaking the dashboard markup.
 */
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, function (character) {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return entities[character];
  });
}

/**
 * Escapes text used inside HTML attributes.
 */
function escapeAttribute(value) {
  return escapeHtml(value);
}