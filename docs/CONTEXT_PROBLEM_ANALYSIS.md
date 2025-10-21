# Critical Issue: Claude Has No Code Context

## 🚨 The Problem

**User says**: "use React instead"
**Claude does**: Generates vanilla HTML/CSS/JS
**Why**: Claude never sees the existing code or knows what framework you're using

---

## Root Cause Analysis

### What Claude Currently Receives

Looking at `backend/src/routes/prompts.ts` (lines 39-54) and `backend/src/services/claudeService.ts` (lines 117-127):

```typescript
// Claude gets:
{
  name: "Test Project",
  description: "My project",
  fileTree: `
    index.html
    styles.css
    script.js
  `
}
```

**That's it.** Just file names, no contents.

### What Claude Does NOT Receive

❌ Actual file contents
❌ Existing code to modify
❌ Framework/tech stack (React, Vue, etc.)
❌ package.json dependencies
❌ What the code currently does
❌ Project type or structure

### The Result

1. User has existing HTML/CSS/JS files
2. User says "convert this to React"
3. Claude has no idea what "this" is
4. Claude generates new HTML/CSS/JS (only thing it knows)
5. User frustrated - AI isn't "improving", just recreating

---

## How Other Tools Solve This

### 1. Cursor / Windsurf / Cline

**Strategy**: Codebase-aware AI

```
User: "Change the button color to blue"

Cursor:
1. Indexes entire codebase
2. Uses embeddings to find relevant files
3. Reads Button component code
4. Passes actual code to Claude
5. Claude modifies existing code
6. User sees improved code
```

**Key Features**:
- Embeddings-based file retrieval
- Loads relevant files automatically
- Understands project structure
- Reads package.json for dependencies

### 2. v0.dev / Bolt.new

**Strategy**: Framework-first approach

```
User: "Build a counter app"

v0:
1. Asks: "React, Vue, or Svelte?"
2. Sets project context
3. Every subsequent prompt knows framework
4. Generates appropriate code
```

**Key Features**:
- Explicit framework selection
- Maintains project context
- Uses framework-specific templates
- Consistent tech stack across iterations

### 3. Replit Agent

**Strategy**: Smart context loading

```
User: "Add authentication"

Replit:
1. Reads package.json
2. Detects Express + JWT in dependencies
3. Loads relevant auth files
4. Passes them to Claude
5. Claude extends existing code
```

**Key Features**:
- Automatic dependency detection
- Loads related files based on request
- Understands project structure
- Incremental improvements

---

## What's Missing in Our Implementation

### Current Flow (BROKEN)

```
User: "Use React for the tabs"
    ↓
Frontend sends: { message: "Use React for the tabs" }
    ↓
Backend reads: File tree only (index.html, styles.css)
    ↓
Claude receives:
  - User message
  - File tree (just names)
  - Generic system prompt
    ↓
Claude thinks: "They want tabs... I'll make HTML/CSS tabs"
    ↓
Generates: vanilla HTML/CSS/JS
    ↓
User sees: Same vanilla code, not React
```

### What Should Happen (FIXED)

```
User: "Use React for the tabs"
    ↓
Backend:
  1. Reads existing files (index.html, styles.css)
  2. Detects: "No React, this is vanilla JS"
  3. Loads package.json (if exists)
  4. Builds context with file contents
    ↓
Claude receives:
  - User message
  - Current file contents:
    ```
    FILE: index.html
    <!DOCTYPE html>
    <html>...</html>
    ```
  - Tech stack: "vanilla JS"
  - Instructions: "User wants React, migrate from vanilla"
    ↓
Claude thinks: "They have vanilla, want React. I need to:
  1. Create package.json with React
  2. Create React components
  3. Migrate HTML to JSX"
    ↓
Generates:
  - package.json with React
  - src/App.jsx with tabs
  - src/index.jsx
  - index.html (updated)
    ↓
User sees: Actual React conversion
```

---

## Solution Architecture

### Phase 1: Add File Contents to Context (CRITICAL)

**File**: `backend/src/routes/prompts.ts`

```typescript
// BEFORE (current)
const fileTree = await fileService.getFileTree(projectId);
const fileTreeString = generateFileTree(fileTree);

// AFTER (fixed)
const fileTree = await fileService.getFileTree(projectId);
const fileContents = await loadRelevantFiles(projectId, fileTree, message);
const projectType = await detectProjectType(projectId);

const context = {
  name: project.name,
  description: project.description,
  projectType: projectType, // 'react' | 'vue' | 'vanilla' | etc
  fileTree: generateFileTree(fileTree),
  files: fileContents // ACTUAL CODE!
};
```

**New Functions Needed**:
1. `loadRelevantFiles()` - Loads file contents
2. `detectProjectType()` - Reads package.json, detects framework
3. Enhanced system prompt with file contents

### Phase 2: Smart Context Loading

**Strategy**: Load different files based on request

```typescript
function loadRelevantFiles(
  projectId: string,
  allFiles: FileNode[],
  userMessage: string
): FileContents {

  // Always load these
  const alwaysLoad = ['package.json', 'index.html', 'index.jsx', 'App.tsx'];

  // If user mentions specific files, load them
  const mentionedFiles = extractFileNames(userMessage);

  // If project is small, load everything
  if (allFiles.length < 10) {
    return loadAllFiles(projectId, allFiles);
  }

  // Otherwise, load smart subset
  return loadFiles(projectId, [...alwaysLoad, ...mentionedFiles]);
}
```

### Phase 3: Framework Detection

**File**: `backend/src/services/projectAnalyzer.ts` (NEW)

```typescript
export class ProjectAnalyzer {
  async detectFramework(projectId: string): Promise<ProjectType> {
    // Read package.json
    const packageJson = await fileService.readFile(projectId, 'package.json');

    if (packageJson.includes('react')) return 'react';
    if (packageJson.includes('vue')) return 'vue';
    if (packageJson.includes('angular')) return 'angular';
    if (packageJson.includes('svelte')) return 'svelte';

    // Check for HTML files
    const hasHTML = await fileService.fileExists(projectId, 'index.html');
    if (hasHTML) return 'vanilla';

    return 'unknown';
  }

  async getProjectContext(projectId: string): Promise<ProjectContext> {
    const framework = await this.detectFramework(projectId);
    const entryPoint = this.getEntryPoint(framework);
    const mainFiles = await this.getMainFiles(projectId, framework);

    return {
      framework,
      entryPoint,
      mainFiles,
      dependencies: await this.getDependencies(projectId)
    };
  }
}
```

### Phase 4: Enhanced System Prompt

**File**: `backend/src/services/claudeService.ts`

```typescript
private buildSystemPrompt(context: EnhancedProjectContext): string {
  let prompt = `You are an AI coding assistant.

Current Project: ${context.name}
Framework: ${context.projectType.toUpperCase()}
Entry Point: ${context.entryPoint}

IMPORTANT: This project uses ${context.projectType}. When making changes:
- Maintain the existing framework (${context.projectType})
- Modify existing files when possible, don't recreate from scratch
- Keep consistent with the existing code style
- If user requests a different framework, help migrate the code

Current Files:
`;

  // Include actual file contents
  for (const file of context.files) {
    prompt += `\n--- FILE: ${file.path} ---\n`;
    prompt += file.content;
    prompt += `\n--- END FILE ---\n`;
  }

  return prompt;
}
```

---

## Implementation Priority

### 🔴 CRITICAL (Week 1)

1. **Load file contents into context**
   - Modify `prompts.ts` to load actual files
   - Pass file contents to Claude
   - Test: Claude should see existing code

2. **Detect project type**
   - Read package.json
   - Detect framework
   - Tell Claude what framework to use

3. **Enhanced system prompt**
   - Include file contents in prompt
   - Tell Claude the current framework
   - Instruct to modify, not recreate

### 🟡 HIGH (Week 2)

4. **Smart file loading**
   - Load only relevant files (don't overwhelm context)
   - Prioritize entry points and main files
   - Add file selection logic

5. **Framework migration support**
   - When user says "use React", detect current framework
   - Guide Claude through migration steps
   - Generate proper package.json

### 🟢 MEDIUM (Week 3)

6. **Embeddings-based retrieval** (Optional)
   - Index codebase with embeddings
   - Find relevant files based on user query
   - Load most relevant code automatically

---

## Testing Plan

### Test Case 1: Basic Modification

```
Setup: Project with index.html, styles.css
User: "Change the background to blue"
Expected: Claude modifies styles.css (background-color: blue)
Current: Claude generates new files
```

### Test Case 2: Framework Request

```
Setup: Vanilla HTML/CSS/JS project
User: "Convert this to React"
Expected:
  - Creates package.json with React
  - Converts HTML to JSX components
  - Creates proper React structure
Current: Claude generates more vanilla HTML
```

### Test Case 3: Iterative Improvement

```
Setup: React app with button
User: "Make the button larger"
Expected: Claude modifies existing Button component
Current: Claude generates new HTML button
```

---

## Success Metrics

✅ Claude knows what framework project uses
✅ Claude sees existing code before modifying
✅ Claude modifies files instead of recreating
✅ User requests are context-aware
✅ Framework changes are properly handled

---

## Comparison Table

| Feature | Current | Cursor | v0 | **After Fix** |
|---------|---------|--------|----|----|
| Sees file contents | ❌ | ✅ | ✅ | ✅ |
| Knows framework | ❌ | ✅ | ✅ | ✅ |
| Modifies existing code | ❌ | ✅ | ✅ | ✅ |
| Smart file loading | ❌ | ✅ | Partial | ✅ |
| Framework migration | ❌ | ✅ | ✅ | ✅ |
| Embeddings search | ❌ | ✅ | ❌ | Future |

---

## Conclusion

**The Problem**: Claude is blind - it doesn't see your code
**The Solution**: Pass file contents + detect framework + smart context
**The Impact**: AI will actually improve your code instead of ignoring it

**Next Steps**: Implement Critical fixes (Week 1) - this is THE blocker for Phase 2
