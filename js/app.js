const STORAGE_KEY = "academic_ecosystem_v6";
const LEGACY_STORAGE_KEY = "academic_ecosystem_v5";

const defaultState = {
  profile: { name: "Ryan", program: "Computer Science Student", initials: "R" },
  tasks: [
    { id: 1, title: "Review Infinite Limits", subject: "Calculus", due: "Today", minutes: 25, priority: "High", completed: false },
    { id: 2, title: "Complete Java Arrays Exercise", subject: "Programming", due: "Today", minutes: 30, priority: "High", completed: false },
    { id: 3, title: "Submit Programming Activity", subject: "Programming", due: "Today", minutes: 15, priority: "High", completed: false },
    { id: 4, title: "Review Set Theory", subject: "Discrete Mathematics", due: "Tomorrow", minutes: 25, priority: "Medium", completed: false }
  ],
  subjects: [
    { id: 1, name: "Programming", code: "CS 01", progress: 82, topics: ["Java", "Arrays", "Loops"] },
    { id: 2, name: "Mathematics", code: "MATH 01", progress: 65, topics: ["Limits", "Functions", "Continuity"] },
    { id: 3, name: "Discrete Mathematics", code: "DM 01", progress: 74, topics: ["Sets", "Logic", "Propositions"] },
    { id: 4, name: "Web Development", code: "WEB 01", progress: 58, topics: ["HTML", "CSS", "JavaScript"] }
  ],
  goals: [
    { id: 1, title: "Master Java Fundamentals", progress: 72, deadline: "Oct 20" },
    { id: 2, title: "Improve Calculus", progress: 48, deadline: "Nov 05" },
    { id: 3, title: "Build Portfolio", progress: 35, deadline: "Dec 01" }
  ],
  sessions: [
    { id: 1, subject: "Programming", topic: "Java Fundamentals", minutes: 45, date: "2026-09-29", startedAt: "09:00", type: "Study" },
    { id: 2, subject: "Mathematics", topic: "Functions", minutes: 35, date: "2026-09-28", startedAt: "19:00", type: "Review" },
    { id: 3, subject: "Discrete Mathematics", topic: "Sets", minutes: 40, date: "2026-09-27", startedAt: "14:00", type: "Study" }
  ],
  schedule: [
    { id: 1, title: "Programming Class", subject: "Programming", date: "2026-09-29", time: "08:00", duration: 90, type: "Class" },
    { id: 2, title: "Review Infinite Limits", subject: "Mathematics", date: "2026-09-29", time: "19:00", duration: 45, type: "Study" },
    { id: 3, title: "Java Arrays Exercise", subject: "Programming", date: "2026-09-30", time: "16:00", duration: 60, type: "Task" },
    { id: 4, title: "Set Theory Review", subject: "Discrete Mathematics", date: "2026-10-01", time: "18:30", duration: 45, type: "Review" },
    { id: 5, title: "Web Development Lab", subject: "Web Development", date: "2026-10-02", time: "14:00", duration: 90, type: "Class" }
  ],
  resources: [
    { id: 1, title: "Java Fundamentals Notes", type: "Notes", subject: "Programming", topic: "Java", tags: ["java","fundamentals"], updated: "Today", favorite: true },
    { id: 2, title: "Limits & Continuity Reviewer", type: "Reviewers", subject: "Mathematics", topic: "Limits", tags: ["limits","continuity"], updated: "Yesterday", favorite: false },
    { id: 3, title: "Discrete Math Formula Sheet", type: "Formula Sheets", subject: "Discrete Mathematics", topic: "Sets", tags: ["sets","logic"], updated: "Sep 27", favorite: true },
    { id: 4, title: "Java Array Practice Code", type: "Code", subject: "Programming", topic: "Arrays", tags: ["java","arrays"], updated: "Sep 26", favorite: false },
    { id: 5, title: "HTML Portfolio Checklist", type: "Notes", subject: "Web Development", topic: "HTML", tags: ["html","portfolio"], updated: "Sep 25", favorite: false },
    { id: 6, title: "Functions Quick Review", type: "Reviewers", subject: "Mathematics", topic: "Functions", tags: ["functions"], updated: "Sep 24", favorite: false }
  ],
  activity: [
    { initials: "R", text: "completed a Java Fundamentals session", time: "Today" },
    { initials: "A", text: "answered a Calculus question", time: "Yesterday" },
    { initials: "M", text: "joined Calculus Survivors", time: "Yesterday" }
  ],
  streaks: { study: 8, tasks: 5, review: 4, challenge: 3, community: 6 },
  xp: 1420,
  reputation: 286,
  flashcards: [
    { id: 1, subject: "Programming", topic: "Java", front: "What is a Java variable?", back: "A named memory location used to store a value of a specific type.", confidence: 2, due: "2026-09-29", reviews: 2 },
    { id: 2, subject: "Discrete Mathematics", topic: "Sets", front: "What is the union of two sets?", back: "The set containing every element that belongs to either set.", confidence: 3, due: "2026-09-30", reviews: 1 },
    { id: 3, subject: "Mathematics", topic: "Limits", front: "What does a limit describe?", back: "The value a function approaches as the input approaches a specified value.", confidence: 1, due: "2026-09-29", reviews: 3 }
  ],
  practice: [
    { id: 1, subject: "Programming", topic: "Java", question: "Which keyword declares a class in Java?", options: ["object", "class", "define", "new"], answer: 1, explanation: "The class keyword begins a class declaration." },
    { id: 2, subject: "Discrete Mathematics", topic: "Sets", question: "Which symbol represents set intersection?", options: ["∪", "∈", "∩", "⊂"], answer: 2, explanation: "The symbol ∩ represents the intersection of sets." },
    { id: 3, subject: "Mathematics", topic: "Functions", question: "A function assigns each input exactly how many outputs?", options: ["Zero", "One", "Two", "Any number"], answer: 1, explanation: "By definition, each input in the domain has exactly one output." }
  ],
  mistakes: [
    { id: 1, subject: "Mathematics", topic: "Limits", prompt: "Confused a limit at infinity with an infinite limit.", cause: "Concept distinction", correction: "A limit at infinity studies what happens as x grows without bound; an infinite limit describes a function growing without bound near an input.", status: "Review" }
  ],
  reviewHistory: [],
  communityQuestions: [
    { id: 1, author: "Alex", initials: "A", subject: "Programming", topic: "Java", title: "Why does Java require public static void main?", body: "I understand that main is the entry point, but I want to understand why each part is written this way.", answers: 4, votes: 12, solved: true, created: "2h ago" },
    { id: 2, author: "Maria", initials: "M", subject: "Mathematics", topic: "Limits", title: "How do I identify an infinite limit?", body: "What clues tell me that a limit becomes infinite instead of being a finite value?", answers: 7, votes: 18, solved: false, created: "5h ago" },
    { id: 3, author: "John", initials: "J", subject: "Discrete Mathematics", topic: "Sets", title: "What is the difference between union and intersection?", body: "I keep mixing up the symbols and what elements belong in each result.", answers: 3, votes: 9, solved: true, created: "Yesterday" }
  ],
  communityAnswers: [
    { id: 1, questionId: 1, author: "Mia", initials: "M", body: "The main method is the conventional starting point the JVM uses when launching a Java application.", votes: 8, created: "1h ago" },
    { id: 2, questionId: 2, author: "Noah", initials: "N", body: "Check whether the function grows without bound as x approaches the target value from one or both sides.", votes: 5, created: "3h ago" }
  ],
  circles: [
    { id: 1, name: "Calculus Survivors", subject: "Mathematics", description: "Limits, derivatives, and problem-solving practice.", members: 128, joined: true, activity: "Active today" },
    { id: 2, name: "Java Beginners", subject: "Programming", description: "A beginner-friendly place for Java and OOP practice.", members: 93, joined: false, activity: "Active 12 min ago" },
    { id: 3, name: "Discrete Mathematics Hub", subject: "Discrete Mathematics", description: "Logic, sets, relations, and proof discussions.", members: 71, joined: false, activity: "Active today" }
  ],
  rooms: [
    { id: 1, name: "Calculus Study Room", type: "Silent Study", subject: "Mathematics", topic: "Limits", members: 3, capacity: 8, focusSeconds: 2535, joined: false, status: "Open" },
    { id: 2, name: "Java Coding Room", type: "Coding", subject: "Programming", topic: "Arrays", members: 5, capacity: 8, focusSeconds: 1660, joined: true, status: "Open" },
    { id: 3, name: "Exam Preparation", type: "Group Study", subject: "General", topic: "Review", members: 8, capacity: 12, focusSeconds: 1086, joined: false, status: "Open" }
  ],
  communityPosts: [
    { id: 1, author: "Alex", initials: "A", type: "shared", text: "Shared a Java arrays reviewer with Java Beginners.", time: "10 min ago", likes: 4 },
    { id: 2, author: "Mia", initials: "M", type: "discussion", text: "Started a discussion about distinguishing limits at infinity from infinite limits.", time: "32 min ago", likes: 7 }
  ],
  workspaces: [
    { id: 1, name: "Java Arrays Study Project", subject: "Programming", description: "Collaborative practice space for arrays, loops, and problem solving.", status: "Active", progress: 68, members: ["Ryan", "Alex", "Mia"], tasks: 6, completed: 4, updated: "Today" },
    { id: 2, name: "Calculus Exam Prep", subject: "Mathematics", description: "Shared preparation workspace for limits and continuity.", status: "Planning", progress: 35, members: ["Ryan", "Noah"], tasks: 8, completed: 3, updated: "Yesterday" }
  ],
  peerReviews: [
    { id: 1, title: "Java Array Exercise Explanation", subject: "Programming", author: "Alex", status: "Open", requested: "Today", feedback: [] },
    { id: 2, title: "Limits Practice Solution", subject: "Mathematics", author: "Ryan", status: "Reviewed", requested: "Sep 28", feedback: [{ author: "Mia", score: 4, comment: "The reasoning is clear; explain the one-sided behavior more explicitly." }] }
  ],
  sharedResources: [
    { id: 1, title: "Java Arrays Reviewer", subject: "Programming", type: "Reviewer", owner: "Alex", downloads: 18, likes: 7, description: "Short reviewer covering declaration, indexing, traversal, and common errors.", shared: "Today" },
    { id: 2, title: "Set Theory Visual Notes", subject: "Discrete Mathematics", type: "Notes", owner: "Mia", downloads: 11, likes: 5, description: "Visual examples for union, intersection, complement, and subsets.", shared: "Yesterday" }
  ],
  recommendations: [],
  studyMethods: [
    { id: 1, name: "Active Recall", description: "Retrieve an answer from memory before checking your notes.", steps: ["Hide the answer", "Recall it", "Check accuracy", "Record uncertainty"], bestFor: "Definitions, concepts, formulas" },
    { id: 2, name: "Spaced Review", description: "Review material at increasing intervals instead of cramming.", steps: ["Learn", "Review soon", "Review later", "Extend the interval"], bestFor: "Long-term retention" },
    { id: 3, name: "Practice Testing", description: "Use questions to expose what you can actually solve without notes.", steps: ["Attempt", "Check", "Analyze errors", "Retry"], bestFor: "Problem solving and exam preparation" },
    { id: 4, name: "Explain-It", description: "Explain a concept in your own words and identify gaps.", steps: ["Choose a concept", "Explain simply", "Find gaps", "Refine the explanation"], bestFor: "Deep conceptual understanding" }
  ]
};

let state = loadState();
let currentView = "dashboard";

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const legacy = !saved ? localStorage.getItem(LEGACY_STORAGE_KEY) : null;
    const parsed = saved ? JSON.parse(saved) : (legacy ? JSON.parse(legacy) : {});
    const merged = { ...structuredClone(defaultState), ...parsed };
    if (!Array.isArray(merged.schedule)) merged.schedule = structuredClone(defaultState.schedule);
    if (!Array.isArray(merged.resources)) merged.resources = structuredClone(defaultState.resources);
    if (!Array.isArray(merged.sessions)) merged.sessions = structuredClone(defaultState.sessions);
    if (!Array.isArray(merged.flashcards)) merged.flashcards = structuredClone(defaultState.flashcards);
    if (!Array.isArray(merged.practice)) merged.practice = structuredClone(defaultState.practice);
    if (!Array.isArray(merged.mistakes)) merged.mistakes = structuredClone(defaultState.mistakes);
    if (!Array.isArray(merged.reviewHistory)) merged.reviewHistory = [];
    if (!Array.isArray(merged.studyMethods)) merged.studyMethods = structuredClone(defaultState.studyMethods);
    if (!Array.isArray(merged.communityQuestions)) merged.communityQuestions = structuredClone(defaultState.communityQuestions);
    if (!Array.isArray(merged.communityAnswers)) merged.communityAnswers = structuredClone(defaultState.communityAnswers);
    if (!Array.isArray(merged.circles)) merged.circles = structuredClone(defaultState.circles);
    if (!Array.isArray(merged.rooms)) merged.rooms = structuredClone(defaultState.rooms);
    if (!Array.isArray(merged.communityPosts)) merged.communityPosts = structuredClone(defaultState.communityPosts);
    if (!Array.isArray(merged.workspaces)) merged.workspaces = structuredClone(defaultState.workspaces);
    if (!Array.isArray(merged.peerReviews)) merged.peerReviews = structuredClone(defaultState.peerReviews);
    if (!Array.isArray(merged.sharedResources)) merged.sharedResources = structuredClone(defaultState.sharedResources);
    if (!Array.isArray(merged.recommendations)) merged.recommendations = [];
    return merged;
  } catch {
    return structuredClone(defaultState);
  }
}
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (window.syncAcademicState) window.syncAcademicState(state);
}
window.__getAcademicState = () => structuredClone(state);
window.__replaceAcademicState = (remoteState) => {
  if (!remoteState || typeof remoteState !== "object") return;
  state = { ...structuredClone(defaultState), ...remoteState };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  updateShell();
  navigate(currentView);
};
function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[ch]));
}
function toast(message) {
  const old = document.querySelector(".toast");
  if (old) old.remove();
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2400);
}
function initials(name) {
  return name.trim().split(/\s+/).map(x => x[0]).join("").slice(0,2).toUpperCase() || "S";
}
function completedTasks() { return state.tasks.filter(t => t.completed).length; }
function pendingTasks() { return state.tasks.filter(t => !t.completed); }
function totalStudyMinutes() { return state.sessions.reduce((sum, s) => sum + Number(s.minutes || 0), 0); }

const views = {
  dashboard: renderDashboard,
  tasks: renderTasks,
  subjects: renderSubjects,
  goals: renderGoals,
  learn: renderLearn,
  schedule: renderSchedule,
  library: renderLibrary,
  community: renderCommunity,
  collaboration: renderCollaboration,
  rooms: renderRooms,
  analytics: renderAnalytics,
  progress: renderProgress,
  story: renderStory,
  explore: renderExplore,
  activity: renderActivity,
  profile: renderProfile,
  notifications: renderNotifications,
  settings: renderSettings
};

function navigate(view) {
  currentView = view;
  document.querySelectorAll("[data-view]").forEach(btn => btn.classList.toggle("active", btn.dataset.view === view));
  const renderer = views[view] || renderDashboard;
  document.getElementById("viewRoot").innerHTML = renderer();
  bindViewActions();
  document.getElementById("sidebar").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderDashboard() {
  const pending = pendingTasks().slice(0,3);
  const overdue = state.tasks.filter(t => !t.completed && t.due === "Overdue").length;
  const today = state.tasks.filter(t => !t.completed && t.due === "Today").length;
  const avgProgress = Math.round(state.subjects.reduce((a,s) => a+s.progress,0) / state.subjects.length);
  return `
    <div class="page-heading">
      <div>
        <div class="eyebrow">Personal Academic Hub</div>
        <h1>Good Day! ${escapeHtml(state.profile.name)}.</h1>
        <p class="subtitle">Your academic command center. See what matters, learn, and keep moving forward.</p>
      </div>
      <button class="primary-button" data-action="what-now">What Should I Do Now?</button>
    </div>

    <div class="grid grid-4" style="margin-bottom:16px">
      ${statCard("Tasks today", today, "pending", "✓", `${completedTasks()} completed overall`)}
      ${statCard("Average subject progress", avgProgress + "%", "progress", "↗", "Across active subjects")}
      ${statCard("Study time", Math.round(totalStudyMinutes()/60*10)/10 + "h", "study", "◷", "Recorded sessions")}
      ${statCard("XP", state.xp.toLocaleString(), "xp", "✦", "Level " + Math.max(1, Math.floor(state.xp/120)+1))}
    </div>

    <div class="dashboard-grid">
      <div class="stack">
        <section class="card focus-card">
          <div class="card-header">
            <div><h2>Today's Focus</h2><div class="small muted">Your three highest-priority actions.</div></div>
            <span class="small-link" data-view="tasks">View all</span>
          </div>
          ${pending.length ? pending.map((t,i) => focusItem(t,i)).join("") : emptyState("✓","Everything is caught up.","Add a task when something new needs your attention.")}
        </section>

        <section class="card">
          <div class="card-header">
            <div><h2>Quick Capture</h2><div class="small muted">Save something without leaving the dashboard.</div></div>
          </div>
          <div class="quick-capture">
            <input id="quickText" placeholder="Capture a task, note, question, or idea...">
            <select id="quickType"><option>Task</option><option>Note</option><option>Question</option><option>Idea</option><option>Reminder</option></select>
            <button class="primary-button" data-action="quick-capture">Save</button>
          </div>
        </section>

        <section class="card">
          <div class="card-header"><div><h2>Subjects</h2><div class="small muted">Your current learning areas.</div></div><span class="small-link" data-view="subjects">Manage</span></div>
          ${state.subjects.map(s => `
            <div class="list-row">
              <div class="subject-color"></div>
              <div class="list-main"><strong>${escapeHtml(s.name)}</strong><span>${escapeHtml(s.code)} · ${s.topics.slice(0,3).join(" · ")}</span></div>
              <div style="width:100px"><div class="progress-bar"><div class="progress-fill" style="width:${s.progress}%"></div></div><div class="tiny muted" style="margin-top:4px;text-align:right">${s.progress}%</div></div>
            </div>`).join("")}
        </section>
      </div>

      <div class="stack">
        <section class="card briefing">
          <div class="eyebrow">Daily Briefing</div>
          <h2>Here is what needs your attention.</h2>
          <ul class="brief-list">
            <li>${today} task${today===1?"":"s"} due today</li>
            <li>1 assessment approaching</li>
            <li>${Math.max(0, 60 - (totalStudyMinutes()%60))} minutes available in your suggested study window</li>
            <li>${overdue} overdue task${overdue===1?"":"s"}</li>
          </ul>
          <div class="brief-recommendation"><strong>Recommended:</strong><br>Review Infinite Limits for 25 minutes.</div>
          <button class="ghost-button" style="margin-top:12px;background:#fff;color:#172347;border:0" data-action="start-recommended">Start recommended session</button>
        </section>

        <section class="card">
          <div class="card-header"><div><h2>Academic Streaks</h2><div class="small muted">Consistency matters.</div></div></div>
          <div class="streak-row">
            ${streak("Study",state.streaks.study)}${streak("Tasks",state.streaks.tasks)}${streak("Review",state.streaks.review)}${streak("Community",state.streaks.community)}
          </div>
        </section>

        <section class="card">
          <div class="card-header"><div><h2>Smart Review</h2><div class="small muted">Topics that need reinforcement.</div></div><span class="small-link" data-view="learn">Open</span></div>
          ${reviewRow("Infinite Limits","58%","6 days ago")}${reviewRow("Java Arrays","64%","4 days ago")}${reviewRow("Set Theory","71%","3 days ago")}
        </section>

        <section class="card">
          <div class="card-header"><div><h2>Recent Activity</h2><div class="small muted">Your academic ecosystem is moving.</div></div><span class="small-link" data-view="activity">See all</span></div>
          ${state.activity.slice(0,3).map(activityItem).join("")}
        </section>
      </div>
    </div>`;
}

function statCard(label,value,key,icon,sub) {
  return `<div class="card stat-card"><div class="stat-top"><div class="stat-icon">${icon}</div><span class="trend">${key==="tasks" ? "Today" : ""}</span></div><div class="stat-value">${value}</div><div class="stat-label">${label}</div><div class="tiny muted" style="margin-top:8px">${sub}</div></div>`;
}
function focusItem(t,i) {
  return `<div class="focus-item">
    <div class="focus-index">${String(i+1).padStart(2,"0")}</div>
    <div class="focus-main"><strong>${escapeHtml(t.title)}</strong><span>${escapeHtml(t.subject)} · ${t.minutes} minutes · Due ${escapeHtml(t.due)}</span></div>
    <div class="focus-actions"><button class="ghost-button" data-action="complete-task" data-id="${t.id}">Complete</button><button class="ghost-button" data-action="reschedule-task" data-id="${t.id}">Reschedule</button></div>
  </div>`;
}
function streak(label,num) { return `<div class="streak"><div class="number">${num}</div><div class="label">${label} days</div></div>`; }
function reviewRow(topic,accuracy,last) { return `<div class="list-row"><div class="list-main"><strong>${topic}</strong><span>Accuracy ${accuracy} · Last reviewed ${last}</span></div><button class="ghost-button" data-action="review" data-topic="${topic}">Review</button></div>`; }
function activityItem(a) { return `<div class="activity-item"><div class="activity-avatar">${escapeHtml(a.initials)}</div><div class="activity-text">${escapeHtml(a.text)}<span>${escapeHtml(a.time)}</span></div></div>`; }
function emptyState(icon,title,text) { return `<div class="empty"><div class="empty-icon">${icon}</div><strong>${title}</strong><p>${text}</p></div>`; }

function renderTasks() {
  return page("Tasks","Plan, prioritize, complete, and reschedule your academic work.", `<button class="primary-button" data-action="add-task">+ Add Task</button>`, `
    <div class="grid grid-4" style="margin-bottom:16px">
      ${statCard("All tasks",state.tasks.length,"tasks","✓","")}
      ${statCard("Completed",completedTasks(),"done","✓","")}
      ${statCard("Remaining",pendingTasks().length,"pending","◷","")}
      ${statCard("Today",state.tasks.filter(t=>t.due==="Today"&&!t.completed).length,"today","!","")}
    </div>
    <section class="card">
      <div class="card-header"><div><h2>Task list</h2><div class="small muted">Changes are saved automatically in this browser.</div></div></div>
      ${state.tasks.length ? state.tasks.map(taskRow).join("") : emptyState("✓","No tasks yet.","Add your first academic task.")}
    </section>`);
}
function taskRow(t) {
  return `<div class="list-row">
    <button class="icon-button" style="width:28px;height:28px;border-radius:50%" data-action="complete-task" data-id="${t.id}">${t.completed?"✓":""}</button>
    <div class="list-main"><strong style="${t.completed?"text-decoration:line-through;color:#8b95a5":""}">${escapeHtml(t.title)}</strong><span>${escapeHtml(t.subject)} · ${t.minutes} min · Due ${escapeHtml(t.due)}</span></div>
    <span class="status ${t.completed?"done":t.due==="Overdue"?"overdue":"pending"}">${t.completed?"Completed":t.due}</span>
    <button class="ghost-button" data-action="delete-task" data-id="${t.id}">Delete</button>
  </div>`;
}

function renderSubjects() {
  return page("Subjects","Organize the areas you are actively learning.", `<button class="primary-button" data-action="add-subject">+ Add Subject</button>`, `
    <div class="grid grid-2">${state.subjects.map(s => `
      <section class="card">
        <div class="card-header">
          <div class="subject-row"><div class="subject-color"></div><div><h2>${escapeHtml(s.name)}</h2><div class="small muted">${escapeHtml(s.code)}</div></div></div>
          <button class="ghost-button" data-action="delete-subject" data-id="${s.id}">Remove</button>
        </div>
        <div class="small muted" style="margin-bottom:7px">Progress</div>
        <div class="progress-bar"><div class="progress-fill" style="width:${s.progress}%"></div></div>
        <div class="tiny muted" style="text-align:right;margin-top:4px">${s.progress}%</div>
        <div style="margin-top:12px">${s.topics.map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>
      </section>`).join("")}</div>`);
}

function renderGoals() {
  return page("Goals","Turn larger academic ambitions into visible progress.", `<button class="primary-button" data-action="add-goal">+ Add Goal</button>`, `
    <div class="grid grid-3">${state.goals.map(g=>`
      <section class="card">
        <div class="eyebrow">Goal</div><h2 style="margin-top:6px">${escapeHtml(g.title)}</h2>
        <div class="small muted">Target: ${escapeHtml(g.deadline)}</div>
        <div style="margin:17px 0 6px" class="progress-bar"><div class="progress-fill" style="width:${g.progress}%"></div></div>
        <div style="display:flex;justify-content:space-between"><span class="tiny muted">Progress</span><strong class="small">${g.progress}%</strong></div>
        <button class="ghost-button" style="margin-top:14px" data-action="advance-goal" data-id="${g.id}">Log progress +10%</button>
      </section>`).join("")}</div>`);
}

function renderLearn() {
  const dueCards = state.flashcards.filter(c => !c.due || c.due <= isoDate(new Date()));
  const openMistakes = state.mistakes.filter(m => m.status !== "Mastered").length;
  const accuracy = state.reviewHistory.length ? Math.round(state.reviewHistory.filter(r => r.correct).length / state.reviewHistory.length * 100) : 0;
  return page("Learning Engine","Practice, retrieve, make mistakes, review intelligently, and turn weak areas into progress.", `<button class="primary-button" data-action="study-session">Start Study Session</button>`, `
    <div class="grid grid-4" style="margin-bottom:16px">
      ${statCard("Flashcards",state.flashcards.length,"cards","▤",`${dueCards.length} due today`)}
      ${statCard("Practice questions",state.practice.length,"practice","?",`${state.reviewHistory.length} attempts`)}
      ${statCard("Mistakes to revisit",openMistakes,"mistakes","!","Feed the review loop")}
      ${statCard("Review accuracy",accuracy+"%","accuracy","↗","Across logged attempts")}
    </div>
    <div class="grid grid-2">
      <section class="card learning-feature">
        <div class="eyebrow">01 · Flashcards</div><h2>Active Recall</h2>
        <p class="subtitle">Hide the answer, retrieve it from memory, then rate how confident you were.</p>
        <div class="feature-meta"><span>${dueCards.length} cards ready</span><span>${state.flashcards.filter(c=>c.confidence<=1).length} low-confidence</span></div>
        <div class="section-actions"><button class="ghost-button" data-action="flashcards">Open Flashcards</button><button class="ghost-button" data-action="add-flashcard">+ Add Card</button></div>
      </section>
      <section class="card learning-feature">
        <div class="eyebrow">02 · Practice</div><h2>Practice Testing</h2>
        <p class="subtitle">Answer questions without notes. Every incorrect answer can become a mistake-bank item.</p>
        <div class="feature-meta"><span>${state.practice.length} questions</span><span>${accuracy}% logged accuracy</span></div>
        <div class="section-actions"><button class="ghost-button" data-action="practice">Start Practice</button><button class="ghost-button" data-action="add-practice">+ Add Question</button></div>
      </section>
      <section class="card learning-feature">
        <div class="eyebrow">03 · Mistake Bank</div><h2>Turn Errors Into Review</h2>
        <p class="subtitle">Capture the misconception, why it happened, and the corrected understanding.</p>
        <div class="feature-meta"><span>${openMistakes} open mistakes</span><span>${state.mistakes.filter(m=>m.status==="Mastered").length} mastered</span></div>
        <div class="section-actions"><button class="ghost-button" data-action="mistake-bank">Open Mistake Bank</button><button class="ghost-button" data-action="mistake">+ Record Mistake</button></div>
      </section>
      <section class="card learning-feature">
        <div class="eyebrow">04 · Smart Review</div><h2>Review What Needs Attention</h2>
        <p class="subtitle">Prioritize due cards, low-confidence concepts, unresolved mistakes, and missed practice questions.</p>
        <div class="feature-meta"><span>${dueCards.length} due</span><span>${openMistakes} unresolved</span></div>
        <div class="section-actions"><button class="primary-button" data-action="smart-review">Start Smart Review</button></div>
      </section>
    </div>
    <section class="card" style="margin-top:16px">
      <div class="card-header"><div><div class="eyebrow">Study Methods</div><h2>Choose the method that fits the task</h2><div class="small muted">A method is a repeatable learning process, not just a timer.</div></div></div>
      <div class="method-grid">${state.studyMethods.map(m=>`<article class="method-card"><div class="method-icon">${m.name[0]}</div><h3>${escapeHtml(m.name)}</h3><p>${escapeHtml(m.description)}</p><div class="tiny muted"><strong>Best for:</strong> ${escapeHtml(m.bestFor)}</div><button class="ghost-button" data-action="study-method" data-id="${m.id}">View Steps</button></article>`).join("")}</div>
    </section>
    <section class="card" style="margin-top:16px"><div class="card-header"><div><h2>Recent Learning Activity</h2><div class="small muted">Your practice and review loop.</div></div></div>
      ${state.reviewHistory.length ? state.reviewHistory.slice(0,8).map(r=>`<div class="list-row"><div class="stat-icon">${r.correct?"✓":"!"}</div><div class="list-main"><strong>${escapeHtml(r.topic)}</strong><span>${escapeHtml(r.subject)} · ${r.mode} · ${r.correct?"Correct":"Needs review"} · ${escapeHtml(r.date)}</span></div><span class="status ${r.correct?"done":"pending"}">${r.correct?"Correct":"Review"}</span></div>`).join("") : emptyState("No learning attempts yet","Start flashcards or practice questions to build your learning history.")}
    </section>`);
}

function isoDate(d) { return d.toISOString().slice(0,10); }
function prettyDate(iso) { const d=new Date(iso+"T00:00:00"); return d.toLocaleDateString(undefined,{month:"short",day:"numeric"}); }
function startOfWeek(d) { const x=new Date(d); const day=(x.getDay()+6)%7; x.setDate(x.getDate()-day); x.setHours(0,0,0,0); return x; }
function renderSchedule() {
  const now = new Date();
  const weekStart = startOfWeek(now);
  const week = Array.from({length:7},(_,i)=>{ const d=new Date(weekStart); d.setDate(d.getDate()+i); return d; });
  const month = now.getMonth(); const year = now.getFullYear();
  const first = new Date(year,month,1); const offset=(first.getDay()+6)%7;
  const daysInMonth=new Date(year,month+1,0).getDate();
  const cells=[];
  for(let i=0;i<offset;i++) cells.push(`<div class="calendar-day muted-day"></div>`);
  for(let day=1;day<=daysInMonth;day++){ const d=new Date(year,month,day); const key=isoDate(d); const items=state.schedule.filter(x=>x.date===key); cells.push(`<button class="calendar-day ${key===isoDate(now)?"today":""}" data-calendar-date="${key}"><span class="calendar-number">${day}</span>${items.slice(0,2).map(x=>`<span class="calendar-event ${String(x.type).toLowerCase()}">${escapeHtml(x.time)} · ${escapeHtml(x.title)}</span>`).join("")}${items.length>2?`<span class="calendar-more">+${items.length-2} more</span>`:""}</button>`); }
  const upcoming=[...state.schedule].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)).filter(x=>x.date>=isoDate(now)).slice(0,8);
  return page("Schedule & Calendar","Plan classes, tasks, reviews, and study sessions in one academic timeline.", `<button class="primary-button" data-action="schedule">+ Schedule Activity</button>`, `
    <div class="grid grid-2">
      <section class="card"><div class="card-header"><div><h2>${now.toLocaleDateString(undefined,{month:"long",year:"numeric"})}</h2><div class="small muted">Click a day to schedule an activity.</div></div></div><div class="calendar-weekheads">${["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(x=>`<span>${x}</span>`).join("")}</div><div class="calendar-grid">${cells.join("")}</div></section>
      <section class="card"><div class="card-header"><div><h2>Upcoming</h2><div class="small muted">Your next scheduled academic activities.</div></div></div>${upcoming.length?upcoming.map(x=>`<div class="list-row"><div class="stat-icon">${x.type==="Class"?"▦":x.type==="Task"?"✓":x.type==="Review"?"◈":"◷"}</div><div class="list-main"><strong>${escapeHtml(x.title)}</strong><span>${prettyDate(x.date)} · ${escapeHtml(x.time)} · ${x.duration} min · ${escapeHtml(x.subject)}</span></div><button class="icon-button" data-action="delete-schedule" data-id="${x.id}">×</button></div>`).join(""):emptyState("No upcoming activities","Add an event to begin building your academic calendar.")}</section>
    </div>
    <section class="card" style="margin-top:16px"><div class="card-header"><div><h2>This Week</h2><div class="small muted">A compact planning view for the next seven days.</div></div></div><div class="week-strip">${week.map(d=>{const key=isoDate(d),items=state.schedule.filter(x=>x.date===key);return `<div class="week-card ${key===isoDate(now)?"selected":""}"><div class="eyebrow">${d.toLocaleDateString(undefined,{weekday:"short"})}</div><strong>${d.getDate()}</strong><span>${items.length} planned</span>${items.slice(0,2).map(x=>`<small>${escapeHtml(x.time)} · ${escapeHtml(x.title)}</small>`).join("")}</div>`}).join("")}</div></section>`);
}

function renderLibrary() {
  const q=(window.libraryQuery||"").toLowerCase();
  const resources=state.resources.filter(r=>!q || [r.title,r.type,r.subject,r.topic,...r.tags].join(" ").toLowerCase().includes(q));
  const counts={}; state.resources.forEach(r=>counts[r.type]=(counts[r.type]||0)+1);
  const types=["All","Notes","Reviewers","Formula Sheets","Code","Videos","Flashcards"];
  const active=window.libraryType||"All";
  const filtered=resources.filter(r=>active==="All"||r.type===active);
  return page("Library","A personal knowledge base for notes, reviewers, formulas, code, and study resources.", `<button class="primary-button" data-action="add-resource">+ Add Resource</button>`, `
    <section class="card" style="margin-bottom:16px"><div class="library-search"><input id="librarySearch" value="${escapeHtml(window.libraryQuery||"")}" placeholder="Search your academic library..."><button class="primary-button" data-action="library-search">Search</button></div><div class="chip-row">${types.map(t=>`<button class="chip ${active===t?"active":""}" data-action="library-filter" data-type="${escapeHtml(t)}">${t}${t!=="All"?` · ${counts[t]||0}`:""}</button>`).join("")}</div></section>
    <div class="grid grid-3" id="libraryGrid">${filtered.length?filtered.map(r=>`<article class="card resource-card"><div class="resource-top"><span class="resource-type">${escapeHtml(r.type)}</span><button class="icon-button" data-action="toggle-resource-favorite" data-id="${r.id}">${r.favorite?"★":"☆"}</button></div><h2>${escapeHtml(r.title)}</h2><p class="subtitle">${escapeHtml(r.subject)} · ${escapeHtml(r.topic)}</p><div class="tag-row">${r.tags.map(t=>`<span>#${escapeHtml(t)}</span>`).join("")}</div><div class="resource-footer"><span>Updated ${escapeHtml(r.updated)}</span><button class="ghost-button" data-action="open-resource" data-id="${r.id}">Open</button></div></article>`).join(""):emptyState("No matching resources","Try another search or add a new resource.")}</div>`);
}

function renderCommunity() {
  const q = state.communityQuestions || [];
  const circles = state.circles || [];
  const posts = state.communityPosts || [];
  return page("Community", "A social academic layer for questions, study circles, shared knowledge, and peer collaboration.", `<button class="primary-button" data-action="ask">+ Ask the Community</button>`, `
    <div class="community-hero card">
      <div><div class="eyebrow">Academic Community</div><h2>Learn with people, not just pages.</h2><p class="subtitle">Ask focused questions, share resources, join study circles, and build useful academic discussions.</p></div>
      <div class="community-stats"><div><strong>${q.length}</strong><span>Questions</span></div><div><strong>${circles.filter(c=>c.joined).length}</strong><span>Circles joined</span></div><div><strong>${posts.length}</strong><span>Recent posts</span></div></div>
    </div>
    <div class="community-tabs">
      <button class="chip active" data-action="community-tab" data-tab="questions">Question Hub</button>
      <button class="chip" data-action="community-tab" data-tab="circles">Study Circles</button>
      <button class="chip" data-action="community-tab" data-tab="feed">Community Feed</button>
    </div>
    <div id="communityPanel">${renderCommunityPanel("questions")}</div>`);
}

function renderCommunityPanel(tab) {
  if (tab === "circles") return `<div class="grid grid-3">${(state.circles||[]).map(c=>`<article class="card circle-card"><div class="circle-icon">${escapeHtml(c.name[0])}</div><div class="eyebrow">${escapeHtml(c.subject)}</div><h2>${escapeHtml(c.name)}</h2><p class="subtitle">${escapeHtml(c.description)}</p><div class="circle-meta"><span>${c.members} members</span><span>${escapeHtml(c.activity)}</span></div><button class="${c.joined?"ghost-button":"primary-button"}" data-action="toggle-circle" data-id="${c.id}">${c.joined?"Leave Circle":"Join Circle"}</button></article>`).join("")}</div>`;
  if (tab === "feed") return `<section class="card"><div class="card-header"><div><h2>Community Feed</h2><div class="small muted">Useful academic activity from the community.</div></div><button class="ghost-button" data-action="create-post">+ Post</button></div>${(state.communityPosts||[]).map(p=>`<article class="feed-post"><div class="avatar">${escapeHtml(p.initials)}</div><div class="feed-body"><strong>${escapeHtml(p.author)}</strong><span class="tiny muted">${escapeHtml(p.time)}</span><p>${escapeHtml(p.text)}</p><button class="chip" data-action="like-post" data-id="${p.id}">♡ ${p.likes}</button></div></article>`).join("")}</section>`;
  return `<section class="card"><div class="card-header"><div><h2>Question Hub</h2><div class="small muted">Find answers, explain concepts, and learn from peer reasoning.</div></div><button class="ghost-button" data-action="ask">+ Ask</button></div>${(state.communityQuestions||[]).map(q=>`<article class="question-card"><div class="question-vote"><strong>${q.votes}</strong><span>votes</span></div><div class="question-body"><div class="eyebrow">${escapeHtml(q.subject)} · ${escapeHtml(q.topic)} ${q.solved?"· Solved":""}</div><h3>${escapeHtml(q.title)}</h3><p>${escapeHtml(q.body)}</p><div class="question-meta"><span>${escapeHtml(q.author)} · ${escapeHtml(q.created)}</span><span>${q.answers} answers</span></div></div><button class="ghost-button" data-action="open-question" data-id="${q.id}">View</button></article>`).join("")}</section>`;
}

function collaborationMetrics() {
  const workspaces = state.workspaces || [];
  const reviews = state.peerReviews || [];
  const shared = state.sharedResources || [];
  return {
    activeProjects: workspaces.filter(w => w.status === "Active").length,
    openReviews: reviews.filter(r => r.status === "Open").length,
    sharedCount: shared.length,
    contributions: shared.reduce((n,r) => n + Number(r.likes || 0), 0) + (state.communityAnswers || []).length
  };
}

function buildRecommendations() {
  const recs = [];
  const due = state.flashcards.filter(c => !c.due || c.due <= isoDate(new Date())).length;
  const mistakes = state.mistakes.filter(m => m.status !== "Mastered").length;
  const openReviews = (state.peerReviews || []).filter(r => r.status === "Open").length;
  const pending = pendingTasks().length;
  if (mistakes) recs.push({type:"Learning", title:"Review your open mistakes", detail:`${mistakes} mistake${mistakes===1?"":"s"} still need reinforcement.`, action:"mistake-bank", label:"Open Mistake Bank"});
  if (due) recs.push({type:"Retention", title:"Complete due flashcards", detail:`${due} flashcard${due===1?" is":"s are"} due for review.`, action:"flashcards", label:"Start Review"});
  if (openReviews) recs.push({type:"Collaboration", title:"Give a peer some feedback", detail:`${openReviews} peer review request${openReviews===1?" is":"s are"} waiting.`, action:"peer-review", label:"Review Work"});
  if (pending >= 3) recs.push({type:"Planning", title:"Coordinate your next study block", detail:`You have ${pending} pending tasks. A shared workspace can break large work into smaller pieces.`, action:"create-workspace", label:"Create Workspace"});
  if (!recs.length) recs.push({type:"Momentum", title:"Keep your learning loop active", detail:"Your current academic data has no urgent signal. Continue studying, practicing, and contributing.", action:"study-session", label:"Start Session"});
  return recs.slice(0,4);
}

function renderCollaboration() {
  const m = collaborationMetrics();
  const recs = buildRecommendations();
  state.recommendations = recs;
  return page("Collaboration & Intelligence","Work with peers, exchange academic resources, review each other's work, and turn your activity into actionable next steps.", `<button class="primary-button" data-action="create-workspace">+ New Workspace</button>`, `
    <div class="grid grid-4" style="margin-bottom:16px">
      ${statCard("Active workspaces",m.activeProjects,"collab","◉",`${state.workspaces.length} total`)}
      ${statCard("Peer reviews",m.openReviews,"reviews","✓",`${state.peerReviews.length} requests`)}
      ${statCard("Shared resources",m.sharedCount,"resources","▤","Community knowledge exchange")}
      ${statCard("Contributions",m.contributions,"contrib","✦","Answers, likes, and shared knowledge")}
    </div>
    <section class="card collaboration-hero" style="margin-bottom:16px">
      <div><div class="eyebrow">Academic Intelligence</div><h2>Turn activity into your next useful action.</h2><p class="subtitle">These recommendations connect your tasks, learning activity, mistakes, peer work, and shared knowledge.</p></div>
      <div class="intelligence-list">${recs.map(r=>`<div class="intelligence-item"><div><span class="resource-type">${escapeHtml(r.type)}</span><strong>${escapeHtml(r.title)}</strong><p>${escapeHtml(r.detail)}</p></div><button class="ghost-button" data-action="intel-action" data-intel="${escapeHtml(r.action)}">${escapeHtml(r.label)}</button></div>`).join("")}</div>
    </section>
    <div class="community-tabs collaboration-tabs">
      <button class="chip active" data-action="collab-tab" data-tab="workspaces">Workspaces</button>
      <button class="chip" data-action="collab-tab" data-tab="reviews">Peer Review</button>
      <button class="chip" data-action="collab-tab" data-tab="resources">Resource Exchange</button>
    </div>
    <div id="collabPanel">${renderCollabPanel("workspaces")}</div>`);
}

function renderCollabPanel(tab) {
  if (tab === "reviews") return `<section class="card"><div class="card-header"><div><h2>Peer Review</h2><div class="small muted">Give and receive structured academic feedback.</div></div><button class="ghost-button" data-action="request-review">+ Request Review</button></div>${state.peerReviews.length ? state.peerReviews.map(r=>`<article class="review-card"><div><div class="eyebrow">${escapeHtml(r.subject)} · ${escapeHtml(r.status)}</div><h3>${escapeHtml(r.title)}</h3><p class="subtitle">Submitted by ${escapeHtml(r.author)} · Requested ${escapeHtml(r.requested)}</p>${r.feedback.length?`<div class="feedback-preview"><strong>Latest feedback</strong><p>${escapeHtml(r.feedback[r.feedback.length-1].comment)}</p></div>`:`<p class="tiny muted">No feedback yet. Add a clear, constructive review.</p>`}</div><button class="${r.status==="Open"?"primary-button":"ghost-button"}" data-action="open-peer-review" data-id="${r.id}">${r.status==="Open"?"Review Work":"View Feedback"}</button></article>`).join("") : emptyState("✓","No peer reviews yet.","Request feedback on a solution, explanation, or study resource.")}</section>`;
  if (tab === "resources") return `<section class="card"><div class="card-header"><div><h2>Resource Exchange</h2><div class="small muted">Share useful academic materials with your circles and peers.</div></div><button class="ghost-button" data-action="share-resource">+ Share Resource</button></div>${state.sharedResources.length ? state.sharedResources.map(r=>`<article class="shared-resource"><div class="resource-type">${escapeHtml(r.type)}</div><div class="list-main"><strong>${escapeHtml(r.title)}</strong><span>${escapeHtml(r.subject)} · Shared by ${escapeHtml(r.owner)} · ${escapeHtml(r.shared)}</span><p>${escapeHtml(r.description)}</p></div><div class="share-stats"><span>↓ ${r.downloads}</span><button class="chip" data-action="like-shared" data-id="${r.id}">♡ ${r.likes}</button></div></article>`).join("") : emptyState("▤","No shared resources yet.","Be the first to contribute a useful reviewer or study resource.")}</section>`;
  return `<div class="grid grid-2">${state.workspaces.map(w=>`<article class="card workspace-card"><div class="workspace-top"><span class="status ${w.status==="Active"?"done":"pending"}">${escapeHtml(w.status)}</span><span class="tiny muted">Updated ${escapeHtml(w.updated)}</span></div><div class="eyebrow">${escapeHtml(w.subject)}</div><h2>${escapeHtml(w.name)}</h2><p class="subtitle">${escapeHtml(w.description)}</p><div class="progress-bar"><div class="progress-fill" style="width:${w.progress}%"></div></div><div class="workspace-meta"><span>${w.progress}% complete</span><span>${w.completed}/${w.tasks} tasks</span><span>${w.members.length} members</span></div><div class="member-row">${w.members.map(x=>`<span class="member-pill">${escapeHtml(initials(x))}</span>`).join("")}<button class="ghost-button" data-action="open-workspace" data-id="${w.id}">Open Workspace</button></div></article>`).join("")}</div>`;
}

function createWorkspaceModal() {
  openModal("Create Collaborative Workspace", `<form id="workspaceForm" class="form-grid"><div class="form-group full"><label>Workspace name</label><input name="name" required placeholder="e.g. Discrete Math Exam Team"></div><div class="form-group"><label>Subject</label><select name="subject">${state.subjects.map(s=>`<option>${escapeHtml(s.name)}</option>`).join("")}</select></div><div class="form-group"><label>Status</label><select name="status"><option>Active</option><option>Planning</option></select></div><div class="form-group full"><label>Purpose</label><textarea name="description" required placeholder="What will this group accomplish?"></textarea></div><div class="form-group full"><label>Initial members</label><input name="members" placeholder="Alex, Mia"></div><div class="form-group full"><button class="primary-button" type="submit">Create Workspace</button></div></form>`);
  document.getElementById("workspaceForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);const members=[state.profile.name,...String(f.get("members")||"").split(",").map(x=>x.trim()).filter(Boolean)];state.workspaces.unshift({id:Date.now(),name:f.get("name"),subject:f.get("subject"),description:f.get("description"),status:f.get("status"),progress:0,members:[...new Set(members)],tasks:0,completed:0,updated:"Just now"});state.reputation+=5;state.activity.unshift({initials:state.profile.initials,text:`created a collaborative workspace for ${f.get("subject")}`,time:"Just now"});saveState();closeModal();navigate("collaboration");toast("Collaborative workspace created. +5 reputation");};
}

function openWorkspace(id){
  const w=state.workspaces.find(x=>x.id==id);if(!w)return;
  openModal(w.name,`<div class="eyebrow">${escapeHtml(w.subject)} · ${escapeHtml(w.status)}</div><h2 style="margin-top:7px">${escapeHtml(w.description)}</h2><div class="workspace-meta" style="margin:15px 0"><span>${w.progress}% complete</span><span>${w.completed}/${w.tasks} tasks</span><span>${w.members.length} members</span></div><h3>Workspace members</h3><div class="member-row" style="margin:10px 0 18px">${w.members.map(x=>`<span class="member-chip">${escapeHtml(x)}</span>`).join("")}</div><button class="primary-button" data-action="workspace-progress" data-id="${w.id}">Advance Progress</button><button class="ghost-button" data-action="close-modal">Close</button>`);
}

function requestReviewModal(){
  openModal("Request Peer Review",`<form id="reviewRequestForm" class="form-grid"><div class="form-group full"><label>Work title</label><input name="title" required placeholder="e.g. My solution to Exercise 4"></div><div class="form-group"><label>Subject</label><select name="subject">${state.subjects.map(s=>`<option>${escapeHtml(s.name)}</option>`).join("")}</select></div><div class="form-group"><label>Reviewer note</label><input name="note" placeholder="What should they focus on?"></div><div class="form-group full"><button class="primary-button" type="submit">Request Feedback</button></div></form>`);
  document.getElementById("reviewRequestForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);state.peerReviews.unshift({id:Date.now(),title:f.get("title"),subject:f.get("subject"),author:state.profile.name,status:"Open",requested:"Just now",feedback:[]});state.reputation+=2;saveState();closeModal();navigate("collaboration");toast("Peer review request created.");};
}

function openPeerReview(id){
  const r=state.peerReviews.find(x=>x.id==id);if(!r)return;
  openModal("Peer Review",`<div class="eyebrow">${escapeHtml(r.subject)} · ${escapeHtml(r.status)}</div><h2 style="margin-top:7px">${escapeHtml(r.title)}</h2><p class="subtitle">Submitted by ${escapeHtml(r.author)}. Review the work constructively: identify what is clear, what needs improvement, and one actionable next step.</p><form id="feedbackForm" class="form-grid"><div class="form-group"><label>Clarity score</label><select name="score"><option value="5">5 — Excellent</option><option value="4">4 — Strong</option><option value="3">3 — Developing</option><option value="2">2 — Needs work</option><option value="1">1 — Major revision</option></select></div><div class="form-group full"><label>Feedback</label><textarea name="comment" required placeholder="Give specific, respectful feedback..."></textarea></div><div class="form-group full"><button class="primary-button" type="submit">Submit Feedback</button></div></form>`);
  document.getElementById("feedbackForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);r.feedback.push({author:state.profile.name,score:Number(f.get("score")),comment:f.get("comment")});r.status="Reviewed";state.reputation+=5;state.xp+=5;state.activity.unshift({initials:state.profile.initials,text:`completed a peer review for ${r.subject}`,time:"Just now"});saveState();closeModal();navigate("collaboration");toast("Peer feedback submitted. +5 XP");};
}

function shareResourceModal(){
  openModal("Share Academic Resource",`<form id="shareForm" class="form-grid"><div class="form-group full"><label>Resource title</label><input name="title" required placeholder="e.g. Java Loops Reviewer"></div><div class="form-group"><label>Subject</label><select name="subject">${state.subjects.map(s=>`<option>${escapeHtml(s.name)}</option>`).join("")}</select></div><div class="form-group"><label>Type</label><select name="type"><option>Reviewer</option><option>Notes</option><option>Formula Sheet</option><option>Code</option><option>Study Guide</option></select></div><div class="form-group full"><label>Description</label><textarea name="description" required placeholder="What will students learn from this resource?"></textarea></div><div class="form-group full"><button class="primary-button" type="submit">Share Resource</button></div></form>`);
  document.getElementById("shareForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);state.sharedResources.unshift({id:Date.now(),title:f.get("title"),subject:f.get("subject"),type:f.get("type"),owner:state.profile.name,downloads:0,likes:0,description:f.get("description"),shared:"Just now"});state.reputation+=4;state.communityPosts.unshift({id:Date.now()+1,author:state.profile.name,initials:state.profile.initials,type:"shared",text:`shared ${f.get("title")} with the academic community`,time:"Just now",likes:0});saveState();closeModal();navigate("collaboration");toast("Resource shared with the community. +4 reputation");};
}

function renderRooms() {
  return page("Study Rooms", "Focused collaborative spaces for silent study, coding, and group review.", `<button class="primary-button" data-action="create-room">+ Create Room</button>`, `
    <section class="card room-toolbar"><div><h2>Live Study Rooms</h2><div class="small muted">Enter a room to collaborate with other students.</div></div><span class="status done">${(state.rooms||[]).filter(r=>r.status==="Open").length} open</span></section>
    <div class="grid grid-3">${(state.rooms||[]).map(r=>`<article class="card room-card"><div class="room-top"><span class="eyebrow">${escapeHtml(r.type)}</span><span class="live-dot">● Live</span></div><h2>${escapeHtml(r.name)}</h2><p class="subtitle">${escapeHtml(r.subject)} · ${escapeHtml(r.topic)}</p><div class="room-progress"><div class="list-row"><div class="stat-icon">◉</div><div class="list-main"><strong>${formatRoomTime(r.focusSeconds)}</strong><span>Current focus timer</span></div></div><div class="progress-track"><div class="progress-fill" style="width:${Math.min(100,Math.round(r.members/r.capacity*100))}%"></div></div><div class="tiny muted">${r.members}/${r.capacity} seats occupied</div></div><button class="${r.joined?"ghost-button":"primary-button"}" data-action="toggle-room" data-id="${r.id}">${r.joined?"Leave Room":"Enter Room"}</button></article>`).join("")}</div>`);
}
function formatRoomTime(seconds){const s=Number(seconds)||0;return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;}

function analyticsDateKey(daysAgo) {
  const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()-daysAgo); return isoDate(d);
}
function analyticsMetrics() {
  const sessions = state.sessions || [];
  const history = state.reviewHistory || [];
  const totalPractice = history.length;
  const correct = history.filter(x => x.correct).length;
  const accuracy = totalPractice ? Math.round(correct / totalPractice * 100) : 0;
  const last7 = sessions.filter(s => s.date && s.date >= analyticsDateKey(6));
  const last30 = sessions.filter(s => s.date && s.date >= analyticsDateKey(29));
  const weeklyMinutes = last7.reduce((a,s)=>a+Number(s.minutes||0),0);
  const monthlyMinutes = last30.reduce((a,s)=>a+Number(s.minutes||0),0);
  const avgSession = sessions.length ? Math.round(sessions.reduce((a,s)=>a+Number(s.minutes||0),0)/sessions.length) : 0;
  const openMistakes = (state.mistakes||[]).filter(m=>m.status!=='Mastered');
  const dueCards = (state.flashcards||[]).filter(c=>!c.due || c.due<=isoDate(new Date()));
  const completed = completedTasks();
  const taskTotal = state.tasks.length;
  const taskRate = taskTotal ? Math.round(completed/taskTotal*100) : 0;
  const avgSubject = state.subjects.length ? Math.round(state.subjects.reduce((a,s)=>a+s.progress,0)/state.subjects.length) : 0;
  return {sessions,history,totalPractice,correct,accuracy,last7,last30,weeklyMinutes,monthlyMinutes,avgSession,openMistakes,dueCards,completed,taskTotal,taskRate,avgSubject};
}
function renderAnalytics() {
  const m = analyticsMetrics();
  const days = Array.from({length:7},(_,i)=>{
    const key=analyticsDateKey(6-i), d=new Date(key+'T00:00:00');
    const minutes=m.sessions.filter(s=>s.date===key).reduce((a,s)=>a+Number(s.minutes||0),0);
    return {key,label:d.toLocaleDateString(undefined,{weekday:'short'}),minutes};
  });
  const maxMinutes=Math.max(60,...days.map(d=>d.minutes));
  const subjectAnalytics=state.subjects.map(s=>{
    const sessions=m.sessions.filter(x=>x.subject===s.name);
    const mins=sessions.reduce((a,x)=>a+Number(x.minutes||0),0);
    const attempts=m.history.filter(x=>x.subject===s.name);
    const acc=attempts.length?Math.round(attempts.filter(x=>x.correct).length/attempts.length*100):null;
    const mistakes=m.openMistakes.filter(x=>x.subject===s.name).length;
    return {...s,mins,acc,mistakes};
  });
  const weakest=[...subjectAnalytics].sort((a,b)=>((a.acc??a.progress)-(b.acc??b.progress))).slice(0,2);
  const recommendations=[];
  if(m.openMistakes.length) recommendations.push({title:'Review your mistake bank',text:`${m.openMistakes.length} unresolved mistake${m.openMistakes.length===1?'':'s'} can become targeted review.`});
  if(m.dueCards.length) recommendations.push({title:'Clear due flashcards',text:`${m.dueCards.length} card${m.dueCards.length===1?' is':'s are'} due for review.`});
  if(m.weeklyMinutes<180) recommendations.push({title:'Increase focused study time',text:`You have recorded ${m.weeklyMinutes} minutes in the last 7 days. Consider scheduling a short focused block.`});
  if(!recommendations.length) recommendations.push({title:'Maintain your current learning loop',text:'Your tracked review queue is clear. Keep alternating practice, review, and focused study.'});
  return page('Analytics & Intelligence','Turn your academic activity into understandable patterns, weak-area signals, and next actions.', `<button class="primary-button" data-action="refresh-insights">Refresh Insights</button>`, `
    <div class="grid grid-4" style="margin-bottom:16px">
      ${statCard('Study consistency',Math.min(100,Math.round((m.last7.length/7)*100))+'%','study','◷',`${m.last7.length} active day${m.last7.length===1?'':'s'} in 7 days`)}
      ${statCard('Practice accuracy',m.accuracy+'%','accuracy','✓',`${m.correct}/${m.totalPractice} recorded attempts`)}
      ${statCard('Weekly study',Math.floor(m.weeklyMinutes/60)+'h '+(m.weeklyMinutes%60)+'m','session','◉','Last 7 days')}
      ${statCard('Task completion',m.taskRate+'%','progress','✓',`${m.completed}/${m.taskTotal} tasks completed`)}
    </div>

    <div class="grid grid-2" style="margin-bottom:16px">
      <section class="card">
        <div class="card-header"><div><h2>Study Activity — Last 7 Days</h2><div class="small muted">Recorded minutes by day.</div></div><span class="badge">${m.weeklyMinutes} min</span></div>
        <div class="chart" style="height:220px;align-items:end">${days.map(d=>`<div class="bar-wrap" title="${d.minutes} minutes"><div class="bar" style="height:${Math.max(4,Math.round(d.minutes/maxMinutes*100))}%"></div><div class="bar-label">${d.label}<br><span class="tiny">${d.minutes}m</span></div></div>`).join('')}</div>
      </section>
      <section class="card">
        <div class="card-header"><div><h2>Learning Signals</h2><div class="small muted">What the current data suggests.</div></div></div>
        ${recommendations.map(r=>`<div class="insight-card"><div class="stat-icon">↗</div><div><strong>${escapeHtml(r.title)}</strong><p>${escapeHtml(r.text)}</p></div></div>`).join('')}
      </section>
    </div>

    <section class="card" style="margin-bottom:16px">
      <div class="card-header"><div><h2>Subject Intelligence</h2><div class="small muted">Progress, study time, practice accuracy, and unresolved mistakes in one view.</div></div></div>
      ${subjectAnalytics.map(s=>`<div class="subject-analytics-row">
        <div class="list-main"><strong>${escapeHtml(s.name)}</strong><span>${escapeHtml(s.code)} · ${s.mins} min studied · ${s.mistakes} open mistake${s.mistakes===1?'':'s'}</span></div>
        <div class="analytics-metric"><span>Progress</span><strong>${s.progress}%</strong></div>
        <div class="analytics-metric"><span>Accuracy</span><strong>${s.acc===null?'—':s.acc+'%'}</strong></div>
        <div style="width:120px"><div class="progress-bar"><div class="progress-fill" style="width:${s.progress}%"></div></div></div>
      </div>`).join('')}
    </section>

    <div class="grid grid-3">
      <section class="card"><h2>Attention Areas</h2>${weakest.map(s=>`<div class="list-row"><div class="stat-icon">!</div><div class="list-main"><strong>${escapeHtml(s.name)}</strong><span>${s.acc===null?'No practice data':s.acc+'% practice accuracy'} · ${s.progress}% progress</span></div></div>`).join('')||'<p class="subtitle">No weak areas detected from current data.</p>'}</section>
      <section class="card"><h2>Learning Loop</h2>
        <div class="list-row"><div class="list-main"><strong>Flashcards</strong><span>${state.flashcards.length} total · ${m.dueCards.length} due</span></div></div>
        <div class="list-row"><div class="list-main"><strong>Practice</strong><span>${state.practice.length} questions · ${m.totalPractice} attempts</span></div></div>
        <div class="list-row"><div class="list-main"><strong>Mistakes</strong><span>${state.mistakes.length} recorded · ${m.openMistakes.length} open</span></div></div>
      </section>
      <section class="card"><h2>Study Pattern</h2>
        <div class="list-row"><div class="list-main"><strong>Average session</strong><span>${m.avgSession} minutes</span></div></div>
        <div class="list-row"><div class="list-main"><strong>30-day study time</strong><span>${Math.floor(m.monthlyMinutes/60)}h ${m.monthlyMinutes%60}m</span></div></div>
        <div class="list-row"><div class="list-main"><strong>Subject average</strong><span>${m.avgSubject}% progress</span></div></div>
      </section>
    </div>

    <section class="card" style="margin-top:16px">
      <div class="card-header"><div><h2>How to Read These Insights</h2><div class="small muted">Analytics describe tracked activity; they are not automatic judgments about your ability.</div></div></div>
      <div class="grid grid-3">
        <div class="method-mini"><strong>Progress</strong><p>Uses the subject progress values you record.</p></div>
        <div class="method-mini"><strong>Accuracy</strong><p>Uses recorded practice and review attempts.</p></div>
        <div class="method-mini"><strong>Attention</strong><p>Highlights due cards, open mistakes, and lower tracked performance.</p></div>
      </div>
    </section>`);
}

function renderProgress() {
  const totalMinutes=totalStudyMinutes();
  const completed=completedTasks();
  const subjectCards=state.subjects.map(s=>`<div class="progress-subject"><div class="list-row"><div class="list-main"><strong>${escapeHtml(s.name)}</strong><span>${escapeHtml(s.code)} · ${s.topics.length} topics</span></div><strong>${s.progress}%</strong></div><div class="progress-bar"><div class="progress-fill" style="width:${s.progress}%"></div></div></div>`).join("");
  const recent=[...state.sessions].slice(0,7);
  return page("Progress Tracker","See your academic progress through completed work, study time, and subject development.", `<button class="primary-button" data-action="study-session">+ Record Study Session</button>`, `
    <div class="grid grid-4" style="margin-bottom:16px">${statCard("Tasks completed",completed,"progress","✓","Across your task list")}${statCard("Study time",Math.floor(totalMinutes/60)+"h "+(totalMinutes%60)+"m","study","◷","All recorded sessions")}${statCard("Subjects",state.subjects.length,"subjects","▦","Active learning areas")}${statCard("Goals",state.goals.filter(g=>g.progress>=100).length+" / "+state.goals.length,"goals","◎","Completed goals")}</div>
    <div class="grid grid-2"><section class="card"><div class="card-header"><div><h2>Subject Progress</h2><div class="small muted">Update progress from your own learning milestones.</div></div></div>${subjectCards}</section>
    <section class="card"><div class="card-header"><div><h2>Study Activity</h2><div class="small muted">Your recent recorded sessions.</div></div></div>${recent.length?recent.map(s=>`<div class="list-row"><div class="stat-icon">◷</div><div class="list-main"><strong>${escapeHtml(s.topic)}</strong><span>${escapeHtml(s.subject)} · ${s.minutes} min · ${prettyDate(s.date)}</span></div></div>`).join(""):emptyState("No study sessions","Record your first session to start tracking progress.")}</section></div>
    <section class="card" style="margin-top:16px"><div class="card-header"><div><h2>Goal Progress</h2><div class="small muted">Longer-term targets connected to your daily work.</div></div></div>${state.goals.map(g=>`<div class="progress-goal"><div class="list-row"><div class="list-main"><strong>${escapeHtml(g.title)}</strong><span>Target: ${escapeHtml(g.deadline)}</span></div><strong>${g.progress}%</strong></div><div class="progress-bar"><div class="progress-fill" style="width:${g.progress}%"></div></div></div>`).join("")}</section>`);
}

function renderStory() {
  return page("Academic Story","A chronological record of your learning journey.", `<button class="primary-button" data-action="add-milestone">+ Add Milestone</button>`, `
    <section class="card"><div class="eyebrow">2026</div><h2 style="margin:7px 0 18px">Your Journey</h2>
      ${[
        ["Started Computer Science","Beginning of your academic journey."],
        ["First Java Program","Entered structured programming and OOP learning."],
        ["First Programming Project","Turned fundamentals into a working console application."],
        ["Improved Mathematics","Built deeper understanding through practice and review."],
        ["Built First Website","Connected programming knowledge to web development."]
      ].map(x=>`<div class="milestone"><strong>${x[0]}</strong><p>${x[1]}</p></div>`).join("")}
    </section>`);
}

function renderExplore() {
  return page("Explore","Discover academic communities, questions, notes, challenges, and resources.", "", `
    <div class="grid grid-3">${["🔥 Trending","📚 Subjects","👥 Study Circles","❓ Questions","📝 Community Notes","🏆 Challenges","📈 Community Trends","🧑‍🎓 Students","📖 Resources"].map(x=>`<section class="card"><h2>${x}</h2><p class="subtitle">Discover relevant academic activity and knowledge.</p><button class="ghost-button" data-action="explore-item">Explore</button></section>`).join("")}</div>`);
}
function renderActivity() {
  return page("Activity","A focused feed of meaningful academic activity.", "", `<section class="card">${state.activity.concat([{initials:"R",text:"recorded a study session for Java Arrays",time:"Sep 28"}]).map(activityItem).join("")}</section>`);
}
function renderProfile() {
  return page("Profile","Your academic identity and contribution overview.", `<button class="primary-button" data-action="edit-profile">Edit Profile</button>`, `
    <section class="card">
      <div style="display:flex;gap:14px;align-items:center"><div class="avatar" style="width:62px;height:62px;font-size:20px">${escapeHtml(state.profile.initials)}</div><div><h1 style="margin:0;font-size:24px">${escapeHtml(state.profile.name)}</h1><div class="subtitle">${escapeHtml(state.profile.program)}</div></div></div>
      <div class="grid grid-4" style="margin-top:20px">
        ${statCard("XP",state.xp.toLocaleString(),"xp","✦","Level "+Math.max(1,Math.floor(state.xp/120)+1))}
        ${statCard("Reputation",state.reputation,"rep","♧","Community")}
        ${statCard("Study streak",state.streaks.study+" days","streak","◷","Consistency")}
        ${statCard("Contributions",24,"contrib","✎","Academic")}
      </div>
    </section>`);
}
function renderNotifications() {
  return page("Notifications","Only meaningful updates should reach you.", "", `<section class="card">${["Your Calculus task is due tomorrow.","Your answer helped Alex.","Your Smart Review has 8 cards ready.","You completed a 7-day study streak.","Your Study Circle has a new discussion."].map((x,i)=>`<div class="list-row"><div class="stat-icon">${["!","✓","◈","✦","♧"][i]}</div><div class="list-main"><strong>${x}</strong><span>${i+1} hour${i===0?"":"s"} ago</span></div></div>`).join("")}</section>`);
}
function renderSettings() {
  return page("Settings","Control your profile, privacy, and application preferences.", "", `
    <section class="card">
      <div class="card-header"><div><h2>Profile & Privacy</h2><div class="small muted">Your private academic data stays private by default.</div></div></div>
      ${["Profile visibility","Academic Story visibility","Study activity visibility","Study Buddy discoverability","Community activity"].map((x,i)=>`<div class="list-row"><div class="list-main"><strong>${x}</strong><span>${i<2?"Visible to people you allow":"Controlled by you"}</span></div><button class="ghost-button" data-action="toggle-setting">Change</button></div>`).join("")}
      <div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap"><button class="secondary-button" data-action="send-feedback">Send Feedback</button><button class="ghost-button" data-action="reset-data">Reset demo data</button></div>
    </section>`);
}

function page(title, subtitle, action, body) {
  return `<div class="page-heading"><div><div class="eyebrow">Academic Ecosystem</div><h1>${title}</h1><p class="subtitle">${subtitle}</p></div><div class="section-actions">${action || ""}</div></div>${body}`;
}

function emptyState(title, text) { return `<div class="empty"><div class="empty-icon">○</div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></div>`; }

function openModal(title, content) {
  document.getElementById("modal").innerHTML = `<div class="modal-header"><h2>${title}</h2><button class="icon-button" data-action="close-modal">×</button></div>${content}`;
  document.getElementById("modalBackdrop").classList.add("open");
}
function closeModal() { document.getElementById("modalBackdrop").classList.remove("open"); }

function addTaskModal() {
  openModal("Add Academic Task", `<form id="taskForm" class="form-grid">
    <div class="form-group full"><label>Task title</label><input name="title" required placeholder="e.g. Review Java arrays"></div>
    <div class="form-group"><label>Subject</label><select name="subject">${state.subjects.map(s=>`<option>${escapeHtml(s.name)}</option>`).join("")}</select></div>
    <div class="form-group"><label>Due</label><select name="due"><option>Today</option><option>Tomorrow</option><option>This Week</option><option>Overdue</option></select></div>
    <div class="form-group"><label>Estimated minutes</label><input name="minutes" type="number" min="5" value="25"></div>
    <div class="form-group"><label>Priority</label><select name="priority"><option>High</option><option>Medium</option><option>Low</option></select></div>
    <div class="form-group full"><button class="primary-button" type="submit">Create Task</button></div>
  </form>`);
  document.getElementById("taskForm").addEventListener("submit", e => {
    e.preventDefault();
    const f = new FormData(e.target);
    state.tasks.unshift({ id:Date.now(), title:f.get("title"), subject:f.get("subject"), due:f.get("due"), minutes:Number(f.get("minutes")), priority:f.get("priority"), completed:false });
    saveState(); closeModal(); navigate("tasks"); toast("Task created.");
  });
}

function addSubjectModal() {
  openModal("Add Subject", `<form id="subjectForm" class="form-grid">
    <div class="form-group"><label>Subject name</label><input name="name" required placeholder="e.g. Physics"></div>
    <div class="form-group"><label>Course code</label><input name="code" placeholder="e.g. PHY 01"></div>
    <div class="form-group full"><label>Topics</label><input name="topics" placeholder="e.g. Motion, Forces, Energy"></div>
    <div class="form-group full"><button class="primary-button" type="submit">Add Subject</button></div>
  </form>`);
  document.getElementById("subjectForm").addEventListener("submit", e => {
    e.preventDefault(); const f=new FormData(e.target);
    state.subjects.push({id:Date.now(),name:f.get("name"),code:f.get("code")||"NEW",progress:0,topics:String(f.get("topics")).split(",").map(x=>x.trim()).filter(Boolean)});
    saveState(); closeModal(); navigate("subjects"); toast("Subject added.");
  });
}

function addGoalModal() {
  openModal("Create Goal", `<form id="goalForm" class="form-grid">
    <div class="form-group full"><label>Goal</label><input name="title" required placeholder="e.g. Master calculus limits"></div>
    <div class="form-group"><label>Target date</label><input name="deadline" type="date"></div>
    <div class="form-group full"><button class="primary-button" type="submit">Create Goal</button></div>
  </form>`);
  document.getElementById("goalForm").addEventListener("submit", e => {
    e.preventDefault(); const f=new FormData(e.target);
    state.goals.push({id:Date.now(),title:f.get("title"),progress:0,deadline:f.get("deadline")||"No deadline"});
    saveState(); closeModal(); navigate("goals"); toast("Goal created.");
  });
}

function askModal() {
  openModal("Ask the Community", `<form id="questionForm" class="form-grid">
    <div class="form-group"><label>Subject</label><select name="subject">${state.subjects.map(s=>`<option>${escapeHtml(s.name)}</option>`).join("")}</select></div>
    <div class="form-group"><label>Topic</label><input name="topic" placeholder="e.g. Arrays"></div>
    <div class="form-group full"><label>Your question</label><textarea name="question" required placeholder="Explain what you are trying to understand..."></textarea></div>
    <div class="form-group full"><button class="primary-button" type="submit">Publish Question</button></div>
  </form>`);
  document.getElementById("questionForm").addEventListener("submit", e => {
    e.preventDefault(); const f=new FormData(e.target);
    const question={id:Date.now(),author:state.profile.name,initials:state.profile.initials,subject:f.get("subject"),topic:f.get("topic")||"General",title:f.get("question"),body:f.get("question"),answers:0,votes:0,solved:false,created:"Just now"};
    state.communityQuestions.unshift(question);
    state.activity.unshift({initials:state.profile.initials,text:"asked a new community question in "+f.get("subject"),time:"Just now"});
    state.reputation += 2; state.streaks.community++;
    saveState(); closeModal(); navigate("community"); toast("Question published.");
  });
}

function openQuestion(id){
  const q=state.communityQuestions.find(x=>x.id==id); if(!q)return;
  const answers=(state.communityAnswers||[]).filter(a=>a.questionId==id);
  openModal("Question", `<div class="eyebrow">${escapeHtml(q.subject)} · ${escapeHtml(q.topic)}</div><h2 style="margin-top:7px">${escapeHtml(q.title)}</h2><p class="question-detail">${escapeHtml(q.body)}</p><div class="question-meta"><span>${escapeHtml(q.author)} · ${escapeHtml(q.created)}</span><span>${q.votes} votes · ${answers.length} answers</span></div><div class="answer-list">${answers.length?answers.map(a=>`<div class="answer-card"><div class="avatar">${escapeHtml(a.initials)}</div><div><strong>${escapeHtml(a.author)}</strong><p>${escapeHtml(a.body)}</p><span class="tiny muted">${a.votes} votes · ${escapeHtml(a.created)}</span></div></div>`).join(""):emptyState("No answers yet","Be the first to contribute a useful explanation.")}</div><form id="answerForm" class="form-grid" style="margin-top:15px"><div class="form-group full"><label>Your answer</label><textarea name="body" required placeholder="Explain the concept or show your reasoning..."></textarea></div><div class="form-group full"><button class="primary-button" type="submit">Post Answer</button></div></form>`);
  document.getElementById("answerForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);state.communityAnswers.unshift({id:Date.now(),questionId:q.id,author:state.profile.name,initials:state.profile.initials,body:f.get("body"),votes:0,created:"Just now"});q.answers++;state.reputation+=5;state.xp+=5;state.activity.unshift({initials:state.profile.initials,text:`answered a ${q.subject} community question`,time:"Just now"});saveState();closeModal();navigate("community");toast("Answer posted. +5 XP");};
}
function createPostModal(){
  openModal("Create Community Post", `<form id="postForm" class="form-grid"><div class="form-group full"><label>Post</label><textarea name="text" required placeholder="Share a useful explanation, study tip, or academic resource..."></textarea></div><div class="form-group full"><button class="primary-button" type="submit">Publish Post</button></div></form>`);
  document.getElementById("postForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);state.communityPosts.unshift({id:Date.now(),author:state.profile.name,initials:state.profile.initials,type:"discussion",text:f.get("text"),time:"Just now",likes:0});state.reputation+=2;saveState();closeModal();navigate("community");toast("Post published.");};
}
function createRoomModal(){
  openModal("Create Study Room", `<form id="roomForm" class="form-grid"><div class="form-group full"><label>Room name</label><input name="name" required placeholder="e.g. Calculus Problem Solving"></div><div class="form-group"><label>Room type</label><select name="type"><option>Silent Study</option><option>Coding</option><option>Group Study</option></select></div><div class="form-group"><label>Subject</label><select name="subject">${state.subjects.map(s=>`<option>${escapeHtml(s.name)}</option>`).join("")}</select></div><div class="form-group"><label>Topic</label><input name="topic" value="General"></div><div class="form-group"><label>Capacity</label><input name="capacity" type="number" min="2" max="20" value="8"></div><div class="form-group full"><button class="primary-button" type="submit">Create Room</button></div></form>`);
  document.getElementById("roomForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);state.rooms.unshift({id:Date.now(),name:f.get("name"),type:f.get("type"),subject:f.get("subject"),topic:f.get("topic"),members:1,capacity:Number(f.get("capacity")),focusSeconds:0,joined:true,status:"Open"});state.reputation+=4;saveState();closeModal();navigate("rooms");toast("Study Room created.");};
}

function studySessionModal() {
  openModal("Study Session", `<div class="session-mode"><button class="chip active" data-session-mode="timer">Focus Timer</button><button class="chip" data-session-mode="record">Quick Record</button></div><form id="sessionForm" class="form-grid">
    <div class="form-group"><label>Subject</label><select name="subject">${state.subjects.map(s=>`<option>${escapeHtml(s.name)}</option>`).join("")}</select></div>
    <div class="form-group"><label>Topic</label><input name="topic" required placeholder="e.g. Java Arrays"></div>
    <div class="form-group"><label>Planned minutes</label><input name="minutes" id="sessionMinutes" type="number" min="5" max="180" value="25"></div>
    <div class="form-group"><label>Session type</label><select name="type"><option>Study</option><option>Review</option><option>Practice</option><option>Reading</option></select></div>
    <div class="form-group full"><div class="timer-display" id="timerDisplay">25:00</div><div class="timer-controls"><button class="primary-button" type="button" data-action="timer-start">Start Focus</button><button class="ghost-button" type="button" data-action="timer-reset">Reset</button></div></div>
    <div class="form-group full"><button class="primary-button" type="submit">Save Session</button></div>
  </form>`);
  let remaining=1500, timer=null;
  const display=()=>{const m=Math.floor(remaining/60),sec=remaining%60;document.getElementById("timerDisplay").textContent=`${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`};
  const minutesInput=document.getElementById("sessionMinutes");
  minutesInput.addEventListener("input",()=>{if(!timer){remaining=Math.max(300,Number(minutesInput.value||25)*60);display();}});
  document.querySelector('[data-action="timer-start"]').onclick=()=>{if(timer){clearInterval(timer);timer=null;return;} timer=setInterval(()=>{remaining--;display();if(remaining<=0){clearInterval(timer);timer=null;toast("Focus session complete. Save it to your study history.");}},1000);};
  document.querySelector('[data-action="timer-reset"]').onclick=()=>{if(timer)clearInterval(timer);timer=null;remaining=Math.max(300,Number(minutesInput.value||25)*60);display();};
  document.getElementById("sessionForm").addEventListener("submit", e => {
    e.preventDefault(); if(timer)clearInterval(timer); const f=new FormData(e.target); const mins=Number(f.get("minutes")); const today=isoDate(new Date());
    state.sessions.unshift({id:Date.now(),subject:f.get("subject"),topic:f.get("topic"),minutes:mins,date:today,startedAt:new Date().toTimeString().slice(0,5),type:f.get("type")});
    state.xp += Math.min(50, Math.max(5, Math.round(mins/2))); state.streaks.study=Math.max(state.streaks.study,1);
    state.activity.unshift({initials:state.profile.initials,text:`recorded a ${mins}-minute ${f.get("type").toLowerCase()} session for ${f.get("topic")}`,time:"Just now"});
    saveState(); closeModal(); navigate(currentView); toast("Study session recorded and XP updated.");
  });
}

function addScheduleModal(prefillDate="") {
  const defaultDate=prefillDate||isoDate(new Date());
  openModal("Schedule Academic Activity", `<form id="scheduleForm" class="form-grid">
    <div class="form-group full"><label>Activity title</label><input name="title" required placeholder="e.g. Calculus review"></div>
    <div class="form-group"><label>Subject</label><select name="subject">${state.subjects.map(s=>`<option>${escapeHtml(s.name)}</option>`).join("")}</select></div>
    <div class="form-group"><label>Type</label><select name="type"><option>Study</option><option>Class</option><option>Task</option><option>Review</option><option>Exam</option></select></div>
    <div class="form-group"><label>Date</label><input name="date" type="date" value="${defaultDate}" required></div>
    <div class="form-group"><label>Time</label><input name="time" type="time" value="19:00" required></div>
    <div class="form-group"><label>Duration (minutes)</label><input name="duration" type="number" min="5" value="45"></div>
    <div class="form-group full"><button class="primary-button" type="submit">Add to Calendar</button></div>
  </form>`);
  document.getElementById("scheduleForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);state.schedule.push({id:Date.now(),title:f.get("title"),subject:f.get("subject"),type:f.get("type"),date:f.get("date"),time:f.get("time"),duration:Number(f.get("duration"))});saveState();closeModal();navigate("schedule");toast("Activity added to your calendar.");};
}

function addResourceModal() {
  openModal("Add Library Resource", `<form id="resourceForm" class="form-grid">
    <div class="form-group full"><label>Resource title</label><input name="title" required placeholder="e.g. Java Arrays Reviewer"></div>
    <div class="form-group"><label>Type</label><select name="type"><option>Notes</option><option>Reviewers</option><option>Formula Sheets</option><option>Code</option><option>Videos</option><option>Flashcards</option></select></div>
    <div class="form-group"><label>Subject</label><select name="subject">${state.subjects.map(s=>`<option>${escapeHtml(s.name)}</option>`).join("")}</select></div>
    <div class="form-group"><label>Topic</label><input name="topic" placeholder="e.g. Arrays"></div>
    <div class="form-group"><label>Tags</label><input name="tags" placeholder="java, arrays, practice"></div>
    <div class="form-group full"><button class="primary-button" type="submit">Save Resource</button></div>
  </form>`);
  document.getElementById("resourceForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);state.resources.unshift({id:Date.now(),title:f.get("title"),type:f.get("type"),subject:f.get("subject"),topic:f.get("topic")||"General",tags:String(f.get("tags")).split(",").map(x=>x.trim()).filter(Boolean),updated:"Just now",favorite:false});saveState();closeModal();navigate("library");toast("Resource saved to your library.");};
}

function feedbackModal() {
  openModal("Send Feedback", `<p class="subtitle">Help improve the Academic Ecosystem. Your feedback is linked to your account so it can be followed up later.</p><form id="feedbackForm" class="form-grid">
    <div class="form-group full"><label>Category</label><select name="category"><option value="bug">Bug</option><option value="idea">Feature idea</option><option value="usability">Usability</option><option value="content">Content</option><option value="other">Other</option></select></div>
    <div class="form-group full"><label>Message</label><textarea name="message" required minlength="3" maxlength="1000" style="width:100%;min-height:130px;box-sizing:border-box" placeholder="What happened, or what would you like improved?"></textarea></div>
    <div class="form-group full"><button class="primary-button" type="submit">Submit Feedback</button></div>
  </form>`);
  document.getElementById("feedbackForm").addEventListener("submit", async e => {
    e.preventDefault(); const f=new FormData(e.target);
    if(!window.academicApi){toast("Sign in to send feedback.");return;}
    try { await window.academicApi('/api/feedback',{method:'POST',body:JSON.stringify({category:f.get('category'),message:f.get('message'),page:currentView})}); closeModal(); toast("Feedback submitted. Thank you."); }
    catch(error){toast(error.message||"Feedback could not be submitted.");}
  });
}

function editProfileModal() {
  openModal("Edit Profile", `<form id="profileForm" class="form-grid">
    <div class="form-group full"><label>Name</label><input name="name" required value="${escapeHtml(state.profile.name)}"></div>
    <div class="form-group full"><label>Program</label><input name="program" value="${escapeHtml(state.profile.program)}"></div>
    <div class="form-group full"><button class="primary-button" type="submit">Save Profile</button></div>
  </form>`);
  document.getElementById("profileForm").addEventListener("submit", e => {
    e.preventDefault(); const f=new FormData(e.target);
    state.profile.name=f.get("name"); state.profile.program=f.get("program"); state.profile.initials=initials(state.profile.name);
    saveState(); closeModal(); updateShell(); navigate(currentView); toast("Profile updated.");
  });
}

function updateShell() {
  document.getElementById("sidebarName").textContent = state.profile.name;
  document.querySelectorAll(".avatar").forEach((el,i) => { if (el.classList.contains("top-avatar") || el.closest(".mini-profile")) el.textContent=state.profile.initials; });
  document.getElementById("taskBadge").textContent = pendingTasks().length;
}

function bindViewActions() {
  document.querySelectorAll("[data-view]").forEach(el => el.onclick = () => navigate(el.dataset.view));
  document.querySelectorAll("[data-calendar-date]").forEach(el => el.onclick = () => addScheduleModal(el.dataset.calendarDate));
  document.querySelectorAll("[data-action]").forEach(el => el.onclick = () => handleAction(el.dataset.action, el.dataset.id, el));
}

function handleAction(action,id,el) {
  switch(action) {
    case "what-now": recommendNow(); break;
    case "complete-task": {
      const t=state.tasks.find(x=>x.id==id); if(t){t.completed=!t.completed; if(t.completed){state.xp+=10;state.streaks.tasks++;} saveState(); updateShell(); navigate(currentView); toast(t.completed?"Task completed — +10 XP":"Task reopened.");} break;
    }
    case "reschedule-task": { const t=state.tasks.find(x=>x.id==id); if(t){t.due=t.due==="Today"?"Tomorrow":"This Week";saveState();navigate(currentView);toast("Task rescheduled.");} break; }
    case "delete-task": { state.tasks=state.tasks.filter(x=>x.id!=id);saveState();updateShell();navigate(currentView);toast("Task deleted.");break; }
    case "add-task": addTaskModal(); break;
    case "add-subject": addSubjectModal(); break;
    case "delete-subject": {state.subjects=state.subjects.filter(x=>x.id!=id);saveState();navigate(currentView);toast("Subject removed.");break;}
    case "add-goal": addGoalModal(); break;
    case "advance-goal": {const g=state.goals.find(x=>x.id==id);if(g){g.progress=Math.min(100,g.progress+10);state.xp+=15;saveState();navigate(currentView);toast("Goal progress updated.");}break;}
    case "quick-capture": {
      const input=document.getElementById("quickText"); const type=document.getElementById("quickType");
      if(!input.value.trim()){toast("Write something first.");return;}
      if(type.value==="Task"){state.tasks.unshift({id:Date.now(),title:input.value.trim(),subject:state.subjects[0]?.name||"General",due:"Today",minutes:25,priority:"Medium",completed:false});updateShell();}
      else state.activity.unshift({initials:state.profile.initials,text:`captured a ${type.value.toLowerCase()}: "${input.value.trim()}"`,time:"Just now"});
      saveState(); navigate("dashboard"); toast(`${type.value} captured.`);
      break;
    }
    case "start-recommended": state.sessions.unshift({id:Date.now(),subject:"Mathematics",topic:"Infinite Limits",minutes:25,date:"Today"});state.xp+=12;saveState();navigate("learn");toast("Recommended session started and recorded.");break;
    case "flashcards": openFlashcards(); break;
    case "add-flashcard": addFlashcardModal(); break;
    case "practice": openPractice(); break;
    case "add-practice": addPracticeModal(); break;
    case "mistake-bank": openMistakeBank(); break;
    case "smart-review": openSmartReview(); break;
    case "study-method": showStudyMethod(id); break;
    case "review": openSmartReview(el.dataset.topic); break;
    case "study-session": studySessionModal(); break;
    case "mistake": addMistakeModal(); break;
    case "master-mistake": { const m=state.mistakes.find(x=>x.id==id); if(m){m.status=m.status==="Mastered"?"Review":"Mastered";saveState();openMistakeBank();toast(m.status==="Mastered"?"Mistake marked mastered.":"Mistake returned to review.");} break; }
    case "explain": openModal("Explain-It Mode",`<div class="eyebrow">Check your understanding</div><h2 style="margin-top:6px">What is a Java loop?</h2><textarea id="explainText" style="width:100%;min-height:130px;border:1px solid var(--line);border-radius:9px;padding:10px" placeholder="Explain it in your own words..."></textarea><button class="primary-button" style="margin-top:12px" data-action="check-explanation">Check My Understanding</button>`);break;
    case "check-explanation": toast("Explanation recorded for learning analysis.");closeModal();break;
    case "ask": askModal(); break;
    case "collab-tab": { const panel=document.getElementById("collabPanel"); if(panel){ document.querySelectorAll("[data-action=collab-tab]").forEach(b=>b.classList.toggle("active",b.dataset.tab===el.dataset.tab)); panel.innerHTML=renderCollabPanel(el.dataset.tab); bindViewActions(); } break; }
    case "create-workspace": createWorkspaceModal(); break;
    case "open-workspace": openWorkspace(id); break;
    case "workspace-progress": { const w=state.workspaces.find(x=>x.id==id); if(w){w.progress=Math.min(100,w.progress+10);w.completed=Math.min(w.tasks||0,w.completed+1);w.updated="Just now";state.xp+=8;saveState();closeModal();navigate("collaboration");toast("Workspace progress updated. +8 XP");} break; }
    case "request-review": requestReviewModal(); break;
    case "open-peer-review": openPeerReview(id); break;
    case "share-resource": shareResourceModal(); break;
    case "like-shared": { const r=state.sharedResources.find(x=>x.id==id); if(r){r.likes++;state.reputation+=1;saveState();navigate("collaboration");toast("Resource appreciated. +1 reputation");} break; }
    case "intel-action": { const target=el.dataset.intel; if(target==="mistake-bank")openMistakeBank(); else if(target==="flashcards")openFlashcards(); else if(target==="peer-review"){navigate("collaboration");setTimeout(()=>{document.querySelector('[data-action="collab-tab"][data-tab="reviews"]')?.click();},0);} else if(target==="create-workspace")createWorkspaceModal(); else studySessionModal(); break; }
    case "community-tab": { const panel=document.getElementById("communityPanel"); if(panel){ document.querySelectorAll("[data-action=community-tab]").forEach(b=>b.classList.toggle("active",b.dataset.tab===el.dataset.tab)); panel.innerHTML=renderCommunityPanel(el.dataset.tab); bindViewActions(); } break; }
    case "open-question": openQuestion(id); break;
    case "toggle-circle": { const c=state.circles.find(x=>x.id==id); if(c){c.joined=!c.joined;c.members=Math.max(0,c.members+(c.joined?1:-1));state.reputation+=c.joined?3:0;state.streaks.community=Math.max(1,state.streaks.community+(c.joined?1:0));saveState();navigate("community");toast(c.joined?`Joined ${c.name}.`:`Left ${c.name}.`);} break; }
    case "create-post": createPostModal(); break;
    case "like-post": {const p=state.communityPosts.find(x=>x.id==id);if(p){p.likes++;saveState();navigate("community");}} break;
    case "create-room": createRoomModal(); break;
    case "toggle-room": {const r=state.rooms.find(x=>x.id==id);if(r){r.joined=!r.joined;r.members=Math.max(0,r.members+(r.joined?1:-1));saveState();navigate("rooms");toast(r.joined?`Entered ${r.name}.`:`Left ${r.name}.`);}} break;
    case "join-room": {const r=state.rooms.find(x=>x.id==id);if(r){r.joined=true;r.members=Math.min(r.capacity,r.members+1);saveState();navigate("rooms");toast(`Entered ${r.name}.`);}} break;
    case "schedule": addScheduleModal(); break;
    case "calendar-date": addScheduleModal(el.dataset.date); break;
    case "delete-schedule": state.schedule=state.schedule.filter(x=>x.id!=id);saveState();navigate("schedule");toast("Calendar activity removed.");break;
    case "add-resource": addResourceModal(); break;
    case "library-search": window.libraryQuery=document.getElementById("librarySearch")?.value.trim()||""; navigate("library"); break;
    case "library-filter": window.libraryType=el.dataset.type; navigate("library"); break;
    case "toggle-resource-favorite": {const r=state.resources.find(x=>x.id==id);if(r){r.favorite=!r.favorite;saveState();navigate("library");}} break;
    case "open-resource": {const r=state.resources.find(x=>x.id==id);if(r)openModal(r.title,`<div class="eyebrow">${escapeHtml(r.type)}</div><h2 style="margin-top:7px">${escapeHtml(r.subject)} · ${escapeHtml(r.topic)}</h2><p class="subtitle">This resource is saved in your personal academic library. Tags: ${r.tags.map(t=>`#${escapeHtml(t)}`).join(" ")}</p><button class="primary-button" data-action="close-modal">Done</button>`);}break;
    case "explore-item": toast("Explore discovery opened.");break;
    case "edit-profile": editProfileModal();break;
    case "toggle-setting": toast("Privacy setting updated.");break;
    case "send-feedback": feedbackModal();break;
    case "add-milestone": toast("Milestone editor opened.");break;
    case "reset-data": if(confirm("Reset all local demo data?")){localStorage.removeItem(STORAGE_KEY);state=loadState();updateShell();navigate("dashboard");toast("Demo data reset.");}break;
    case "close-modal": closeModal();break;
  }
}


function addFlashcardModal() {
  openModal("Add Flashcard", `<form id="flashcardForm" class="form-grid">
    <div class="form-group"><label>Subject</label><select name="subject">${state.subjects.map(s=>`<option>${escapeHtml(s.name)}</option>`).join("")}</select></div>
    <div class="form-group"><label>Topic</label><input name="topic" required placeholder="e.g. Java Arrays"></div>
    <div class="form-group full"><label>Front / Question</label><textarea name="front" required placeholder="What do you want to recall?"></textarea></div>
    <div class="form-group full"><label>Back / Answer</label><textarea name="back" required placeholder="The correct answer..."></textarea></div>
    <div class="form-group"><label>First review date</label><input name="due" type="date" value="${isoDate(new Date())}"></div>
    <div class="form-group full"><button class="primary-button" type="submit">Create Flashcard</button></div>
  </form>`);
  document.getElementById("flashcardForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);state.flashcards.unshift({id:Date.now(),subject:f.get("subject"),topic:f.get("topic"),front:f.get("front"),back:f.get("back"),confidence:0,due:f.get("due")||isoDate(new Date()),reviews:0});saveState();closeModal();navigate("learn");toast("Flashcard added.");};
}

function openFlashcards() {
  let queue=[...state.flashcards].sort((a,b)=>(a.confidence-b.confidence)||String(a.due).localeCompare(String(b.due)));
  let index=0, revealed=false;
  const draw=()=>{
    const c=queue[index];
    if(!c){closeModal();navigate("learn");toast("Flashcard review complete.");return;}
    openModal("Flashcard Review", `<div class="review-progress">Card ${index+1} of ${queue.length} · ${escapeHtml(c.subject)} · ${escapeHtml(c.topic)}</div><div class="flashcard-face"><div class="eyebrow">Question</div><h2>${escapeHtml(c.front)}</h2>${revealed?`<div class="flashcard-answer"><div class="eyebrow">Answer</div><p>${escapeHtml(c.back)}</p></div>`:`<button class="primary-button" data-action="reveal-flashcard">Reveal Answer</button>`}</div>${revealed?`<div class="confidence-row"><span>How confident were you?</span><button class="chip" data-confidence="1">Low</button><button class="chip" data-confidence="2">Okay</button><button class="chip" data-confidence="3">High</button></div>`:""}<button class="ghost-button" data-action="close-modal">Exit Review</button>`);
    if(revealed){document.querySelectorAll("[data-confidence]").forEach(b=>b.onclick=()=>{const rating=Number(b.dataset.confidence);c.confidence=rating;c.reviews=(c.reviews||0)+1;c.due=nextReviewDate(rating);state.reviewHistory.unshift({id:Date.now(),subject:c.subject,topic:c.topic,mode:"Flashcard",correct:rating>=2,date:isoDate(new Date())});if(rating===1)state.xp+=2;else state.xp+=5;saveState();index++;revealed=false;draw();});}
    const reveal=document.querySelector('[data-action="reveal-flashcard"]');if(reveal)reveal.onclick=()=>{revealed=true;draw();};
  }; draw();
}
function nextReviewDate(confidence){const d=new Date();d.setDate(d.getDate()+(confidence===1?1:confidence===2?3:7));return isoDate(d);}

function addPracticeModal() {
  openModal("Add Practice Question", `<form id="practiceForm" class="form-grid">
    <div class="form-group"><label>Subject</label><select name="subject">${state.subjects.map(s=>`<option>${escapeHtml(s.name)}</option>`).join("")}</select></div>
    <div class="form-group"><label>Topic</label><input name="topic" required></div>
    <div class="form-group full"><label>Question</label><textarea name="question" required></textarea></div>
    ${[0,1,2,3].map(i=>`<div class="form-group"><label>Option ${String.fromCharCode(65+i)}</label><input name="option${i}" required></div>`).join("")}
    <div class="form-group"><label>Correct option</label><select name="answer"><option value="0">A</option><option value="1">B</option><option value="2">C</option><option value="3">D</option></select></div>
    <div class="form-group full"><label>Explanation</label><textarea name="explanation" placeholder="Why is this answer correct?"></textarea></div>
    <div class="form-group full"><button class="primary-button" type="submit">Add Question</button></div>
  </form>`);
  document.getElementById("practiceForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);state.practice.unshift({id:Date.now(),subject:f.get("subject"),topic:f.get("topic"),question:f.get("question"),options:[0,1,2,3].map(i=>f.get("option"+i)),answer:Number(f.get("answer")),explanation:f.get("explanation")||"Review the concept and compare your reasoning with the correct answer."});saveState();closeModal();navigate("learn");toast("Practice question added.");};
}

function openPractice() {
  let index=0, correct=0;
  const questions=[...state.practice];
  const draw=()=>{
    if(index>=questions.length){closeModal();saveState();navigate("learn");toast(`Practice complete: ${correct}/${questions.length} correct.`);return;}
    const q=questions[index];
    openModal("Practice Testing", `<div class="review-progress">Question ${index+1} of ${questions.length} · ${escapeHtml(q.subject)} · ${escapeHtml(q.topic)}</div><h2 class="practice-question">${escapeHtml(q.question)}</h2><div class="practice-options">${q.options.map((o,i)=>`<button class="practice-option" data-option="${i}">${String.fromCharCode(65+i)}. ${escapeHtml(o)}</button>`).join("")}</div><button class="ghost-button" data-action="close-modal">Exit Practice</button>`);
    document.querySelectorAll("[data-option]").forEach(b=>b.onclick=()=>{const selected=Number(b.dataset.option), isCorrect=selected===q.answer;if(isCorrect)correct++;state.reviewHistory.unshift({id:Date.now(),subject:q.subject,topic:q.topic,mode:"Practice",correct:isCorrect,date:isoDate(new Date())});if(!isCorrect){state.mistakes.unshift({id:Date.now()+1,subject:q.subject,topic:q.topic,prompt:q.question,cause:"Practice error",correction:q.explanation,status:"Review"});}state.xp+=isCorrect?8:2;saveState();openModal("Answer Check", `<div class="answer-result ${isCorrect?"correct":"incorrect"}"><strong>${isCorrect?"Correct":"Needs Review"}</strong><p>${escapeHtml(q.explanation)}</p></div><button class="primary-button" data-action="next-practice">Continue</button>`);document.querySelector('[data-action="next-practice"]').onclick=()=>{index++;draw();};});
  };draw();
}

function addMistakeModal() {
  openModal("Record a Mistake", `<form id="mistakeForm" class="form-grid">
    <div class="form-group"><label>Subject</label><select name="subject">${state.subjects.map(s=>`<option>${escapeHtml(s.name)}</option>`).join("")}</select></div>
    <div class="form-group"><label>Topic</label><input name="topic" required placeholder="e.g. Infinite Limits"></div>
    <div class="form-group full"><label>Mistake / misconception</label><textarea name="prompt" required placeholder="What did you get wrong?"></textarea></div>
    <div class="form-group"><label>Cause</label><input name="cause" placeholder="Concept gap, calculation, recall..."></div>
    <div class="form-group"><label>Correct understanding</label><textarea name="correction" required></textarea></div>
    <div class="form-group full"><button class="primary-button" type="submit">Save to Mistake Bank</button></div>
  </form>`);
  document.getElementById("mistakeForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);state.mistakes.unshift({id:Date.now(),subject:f.get("subject"),topic:f.get("topic"),prompt:f.get("prompt"),cause:f.get("cause")||"Not specified",correction:f.get("correction"),status:"Review"});saveState();closeModal();navigate("learn");toast("Mistake added to your learning loop.");};
}

function openMistakeBank() {
  openModal("Mistake Bank", `<div class="mistake-list">${state.mistakes.length?state.mistakes.map(m=>`<article class="mistake-card"><div class="eyebrow">${escapeHtml(m.subject)} · ${escapeHtml(m.topic)}</div><h3>${escapeHtml(m.prompt)}</h3><p><strong>Cause:</strong> ${escapeHtml(m.cause)}</p><p><strong>Correction:</strong> ${escapeHtml(m.correction)}</p><div class="mistake-actions"><span class="status ${m.status==="Mastered"?"done":"pending"}">${m.status}</span><button class="ghost-button" data-action="master-mistake" data-id="${m.id}">${m.status==="Mastered"?"Reopen":"Mark Mastered"}</button></div></article>`).join(""):emptyState("Mistake bank is empty","Practice errors and manual mistakes will appear here.")}</div><button class="ghost-button" data-action="close-modal">Close</button>`);
}

function openSmartReview(topicFilter="") {
  const due=state.flashcards.filter(c=>(!c.due||c.due<=isoDate(new Date()))&&(!topicFilter||c.topic===topicFilter));
  const mistakes=state.mistakes.filter(m=>m.status!=="Mastered"&&(!topicFilter||m.topic===topicFilter));
  const low=state.flashcards.filter(c=>c.confidence<=1&&!due.includes(c)&&(!topicFilter||c.topic===topicFilter));
  openModal("Smart Review", `<div class="eyebrow">Priority queue</div><h2 style="margin-top:6px">Review what is most likely to need attention</h2><div class="smart-queue"><div><strong>${due.length}</strong><span>Due flashcards</span></div><div><strong>${low.length}</strong><span>Low confidence</span></div><div><strong>${mistakes.length}</strong><span>Open mistakes</span></div></div><p class="subtitle">The queue prioritizes due material, low-confidence cards, and unresolved mistakes. It is a rule-based review assistant in this phase.</p>${due[0]?`<button class="primary-button" data-action="start-smart-card">Review ${escapeHtml(due[0].topic)}</button>`:""}${mistakes[0]?`<button class="ghost-button" data-action="start-smart-mistake" data-id="${mistakes[0].id}">Review a Mistake</button>`:""}<button class="ghost-button" data-action="close-modal">Done</button>`);
  const b=document.querySelector('[data-action="start-smart-card"]');if(b)b.onclick=()=>{closeModal();openFlashcards();};
  const m=document.querySelector('[data-action="start-smart-mistake"]');if(m)m.onclick=()=>{const x=state.mistakes.find(v=>v.id==m.dataset.id);closeModal();if(x)openModal("Mistake Review",`<div class="eyebrow">${escapeHtml(x.subject)} · ${escapeHtml(x.topic)}</div><h2 style="margin-top:7px">${escapeHtml(x.prompt)}</h2><p class="subtitle">${escapeHtml(x.correction)}</p><button class="primary-button" data-action="master-mistake" data-id="${x.id}">Mark Mastered</button>`);};
}
function showStudyMethod(id){const m=state.studyMethods.find(x=>x.id==id);if(!m)return;openModal(m.name,`<p class="subtitle">${escapeHtml(m.description)}</p><div class="method-steps">${m.steps.map((x,i)=>`<div><b>${i+1}</b><span>${escapeHtml(x)}</span></div>`).join("")}</div><div class="tiny muted"><strong>Best for:</strong> ${escapeHtml(m.bestFor)}</div><button class="primary-button" data-action="close-modal">Got It</button>`);}
function recommendNow() {
  const t=pendingTasks()[0];
  openModal("What Should I Do Now?", `<div class="eyebrow">Recommended next action</div><h2 style="margin-top:7px">${t?escapeHtml(t.title):"Start a focused study session"}</h2><p class="subtitle">${t?`This is currently your highest-priority pending action in ${escapeHtml(t.subject)}.`:"You have no urgent tasks. Use the time to review a weak area."}</p><div class="card" style="box-shadow:none;background:#fafbfd;margin:15px 0"><strong>Why this?</strong><p class="tiny muted" style="margin:6px 0 0">${t?"Priority, due date, and remaining work were considered.":"Your dashboard shows no immediate deadline, so a review session is a useful next step."}</p></div><button class="primary-button" data-action="close-and-start">${t?"Start this task":"Start study session"}</button>`);
  const b=document.querySelector('[data-action="close-and-start"]'); if(b)b.onclick=()=>{closeModal();if(t){t.completed=true;state.xp+=10;saveState();navigate("dashboard");toast("Task marked complete for demo flow. +10 XP");}else studySessionModal();};
}

document.getElementById("menuButton").onclick=()=>document.getElementById("sidebar").classList.toggle("open");
document.getElementById("askButton").onclick=askModal;
document.getElementById("profileButton").onclick=()=>navigate("profile");
document.getElementById("notificationButton").onclick=()=>navigate("notifications");
document.getElementById("modalBackdrop").addEventListener("click",e=>{if(e.target.id==="modalBackdrop")closeModal();});
document.addEventListener("keydown",e=>{
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();document.getElementById("globalSearch").focus();}
  if(e.key==="Escape")closeModal();
});
document.getElementById("globalSearch").addEventListener("keydown",e=>{
  if(e.key==="Enter"){const q=e.target.value.trim();if(q){toast(`Searching your academic ecosystem for “${q}”`);navigate("library");}}
});

updateShell();
navigate("dashboard");
