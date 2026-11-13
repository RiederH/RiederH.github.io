// Portfolio descriptions. capstone entries appear on the Capstone projects page.
const projects = [
  {
    "id": "atlas",
    "preview": "assets/atlas-knowledge-graph.png",
    "previewAlt": "Atlas knowledge graph connecting physics, mathematics, and computer science notes.",
    "previewCaption": "Atlas knowledge graph",
    "repository": "https://github.com/RiederH/Project-Atlas",
    "capstone": true,
    "title": "Atlas + Widgets",
    "category": "Hobby",
    "date": "Jan 2025–Present",
    "course": "Knowledge workspace",
    "tags": [
      "Python",
      "SQLite",
      "Windows"
    ],
    "description": "A Python/SQLite Windows workspace with searchable notes, a knowledge graph, system-tray capture, and handwritten-note import into linked Markdown notes.",
    "detail": "Atlas is my fork of Obsidian. It stores notes locally in SQLite and exports Markdown files. Companion Widgets capture notes from other apps.",
    "features": [
      "Searchable notes with tags, wiki links, backlinks, folders, and templates.",
      "A system-tray Quick Notes widget, opened with Ctrl+Shift+Y, saves directly to the Atlas vault.",
      "PDF import, review, and export retain links to source documents and their review status."
    ]
  },
  {
    "id": "workflow",
    "preview": "assets/workflow-task-board.png",
    "previewAlt": "Workflow desktop app showing To do, In progress, and Done columns with task cards and subtasks.",
    "previewCaption": "Workflow task board",
    "previewWidth": 1426,
    "previewHeight": 913,
    "repository": "https://github.com/RiederH/Project-Workflow",
    "capstone": true,
    "title": "Workflow",
    "category": "Hobby",
    "date": "Oct 2026",
    "course": "Desktop task board",
    "tags": [
      "WebView2",
      "JSON",
      "Windows"
    ],
    "description": "A Windows task board inspired by Trello and Jira. Supports draggable cards, priorities, nested subtasks, search, local save history, backup recovery, and JSON export/restore.",
    "detail": "Workflow runs in a Windows WebView2 desktop shell. Boards save locally as JSON, with previous versions retained for recovery.",
    "features": [
      "Custom boards and columns with draggable task cards, labels, priorities, due dates, and nested subtasks.",
      "Search includes nested subtasks. A global shortcut opens the running app from the system tray.",
      "Automatic backup recovery and JSON export/restore preserve the task workspace."
    ]
  },
  {
    "id": "puzzle",
    "title": "Sliding Puzzle Solver",
    "category": "Algorithms",
    "date": "Apr 2026",
    "course": "CS 225",
    "tags": [
      "C++",
      "BFS",
      "A*"
    ],
    "description": "A 4 × 4 sliding-puzzle solver using breadth-first search and A* with a Manhattan-distance heuristic.",
    "detail": "Finds a sequence of legal tile moves from a starting board to a target arrangement.",
    "approach": "Puzzle states use fixed-size arrays. Search tracks predecessor states to reconstruct the solution; A* uses Manhattan distance to prioritize states."
  },
  {
    "id": "mosaic",
    "title": "KD-Trees & Photo Mosaics",
    "category": "Image processing",
    "date": "Mar 2026",
    "course": "CS 225",
    "tags": [
      "C++",
      "KD-trees",
      "Nearest neighbor"
    ],
    "description": "Builds photo mosaics by matching each region of a source image to an image tile using a KD-tree.",
    "detail": "Represents average tile colors as points in three-dimensional LUV color space and searches for the nearest match.",
    "approach": "A KD-tree indexes tile colors. Each source region queries the tree, then the selected image tiles are assembled into a mosaic canvas."
  },
  {
    "id": "maze",
    "title": "Maze Generation & Solving",
    "category": "Algorithms",
    "date": "Apr 2026",
    "course": "CS 225",
    "tags": [
      "C++",
      "Disjoint sets",
      "BFS"
    ],
    "description": "Generates connected square mazes using disjoint sets, solves them with breadth-first search, and draws the maze and solution path.",
    "detail": "Removes walls between separate cell groups until the maze is connected without cycles.",
    "approach": "Disjoint sets track connected cells during generation. Breadth-first search finds paths through the maze; drawing routines render walls and the solution."
  },
  {
    "id": "nim",
    "title": "Nim Reinforcement Learner",
    "category": "Algorithms",
    "date": "May 2026",
    "course": "CS 225 lab",
    "tags": [
      "C++",
      "Graphs",
      "Reinforcement learning"
    ],
    "description": "Models Nim as a graph and updates move weights from simulated game outcomes.",
    "detail": "Each vertex represents a player and the number of tokens remaining. Edges represent moves that remove one or two tokens.",
    "approach": "Random games produce paths through the graph. Winning moves receive positive weight updates, while losing moves receive negative updates."
  },
  {
    "id": "flood",
    "title": "Image Traversal & Flood Fill",
    "category": "Image processing",
    "date": "Mar 2026",
    "course": "CS 225",
    "tags": [
      "C++",
      "BFS / DFS",
      "Animation"
    ],
    "description": "Applies image traversals and color pickers to flood-fill an image, recording animation frames as pixels are recolored.",
    "detail": "Supports breadth-first and depth-first image traversal, with flood-fill operations applied in sequence.",
    "approach": "Each operation pairs a traversal with a color picker. Frames are recorded at a specified pixel interval, including the initial and final image."
  }
];
