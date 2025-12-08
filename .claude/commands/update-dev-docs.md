# Update Dev Docs Before Compaction

When context is running low or before starting a new session, update the dev docs to preserve progress.

## Instructions

1. **Check for Active Task**
   - Look in `dev/active/` for the current task directory
   - Read all three doc files to understand current state

2. **Update [task-name]-tasks.md**
   - Mark all completed tasks with [x]
   - Add any new tasks discovered during implementation
   - Move blocked items to blocked section with reason
   - Update progress summary counts

3. **Update [task-name]-context.md**
   - Update "Last Updated" timestamp
   - Add/update "Current State" section:
     - What's working
     - What's in progress
     - What's blocked/pending
   - Add important decisions made this session
   - Update "Next Steps" with specific actions for resuming
   - Add session history entry with:
     - Date
     - What was completed
     - Issues encountered
     - What's next

4. **Verify Plan Alignment**
   - Check if implementation matches the plan
   - Note any deviations or scope changes in context.md
   - Update plan.md if major changes occurred

## Output Format

```
📝 Dev Docs Updated: [task-name]

Tasks:
- Completed: X tasks
- Remaining: X tasks
- Blocked: X tasks

Context Updated:
- Current state documented
- Session [N] history added
- Next steps: [brief list]

Ready for compaction/new session.
```

## Important

- Be thorough - future you will thank present you
- Include specific file paths and line numbers when relevant
- Note any gotchas or tricky parts discovered
- If a task is partially complete, note exactly where you left off
