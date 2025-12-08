# Create Dev Docs for Current Task

When starting a large task or exiting plan mode with an approved plan, create comprehensive dev docs.

## Instructions

1. **Create Task Directory**
   ```bash
   mkdir -p ~/git/pgclosets-store/dev/active/[task-name]/
   ```

2. **Create Three Documents:**

### [task-name]-plan.md
Using template from `.claude/templates/plan-template.md`:
- Executive summary of the approved plan
- Clear objectives and scope
- Technical approach and architecture
- Implementation phases with specific tasks
- Dependencies and risks
- Success criteria

### [task-name]-context.md
Using template from `.claude/templates/context-template.md`:
- Key files that will be modified
- Important decisions made during planning
- Patterns and conventions to follow
- Current state (update throughout implementation)
- Integration points
- Next steps for resuming

### [task-name]-tasks.md
Using template from `.claude/templates/tasks-template.md`:
- Break down the plan into checkboxes
- Group by phase/category
- Include testing and documentation tasks
- Track blocked/deferred items

3. **Best Practices:**
   - Use kebab-case for task names (e.g., `quote-approval-flow`)
   - Update "Last Updated" timestamp on every modification
   - Mark tasks complete IMMEDIATELY when done
   - Add session history entries when resuming after compaction

4. **After Creation:**
   - Confirm all three files created
   - Begin implementation with first task
   - Update context.md as decisions are made

## Output

Create the three files and confirm with:
- File paths created
- Summary of tasks identified
- First task to begin
