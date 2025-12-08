# Plan Feature Implementation

Create a comprehensive implementation plan for a new feature or task.

## Planning Process

### Phase 1: Understanding
1. **Clarify Requirements**
   - What exactly needs to be built?
   - What problem does this solve?
   - Who is the user/beneficiary?

2. **Research Existing Code**
   - Find similar patterns in the codebase
   - Identify integration points
   - Note dependencies

3. **Define Scope**
   - What's in scope?
   - What's explicitly out of scope?
   - What are the edge cases?

### Phase 2: Design
1. **Architecture Decisions**
   - Where does this fit in the system?
   - What new files/components are needed?
   - What existing code needs modification?

2. **Data Flow**
   - How does data flow through the feature?
   - What APIs are needed?
   - What database changes (if any)?

3. **UI/UX Considerations**
   - User workflow
   - Component structure
   - State management approach

### Phase 3: Planning
1. **Break Down Tasks**
   - List all implementation tasks
   - Order by dependencies
   - Estimate complexity (simple/medium/complex)

2. **Identify Risks**
   - What could go wrong?
   - What are the unknowns?
   - What are the mitigations?

3. **Define Success Criteria**
   - How do we know it's done?
   - What needs to be tested?
   - What documentation is needed?

## Output Format

```markdown
# [Feature Name] Implementation Plan

## Summary
[2-3 sentence description]

## Objectives
- Primary: ...
- Secondary: ...

## Technical Approach
[Architecture overview]

## Implementation Tasks

### Phase 1: Setup
- [ ] Task 1 (simple)
- [ ] Task 2 (medium)

### Phase 2: Core
- [ ] Task 3 (complex)
- [ ] Task 4 (medium)

### Phase 3: Polish
- [ ] Task 5 (simple)
- [ ] Task 6 (simple)

## Risks
| Risk | Mitigation |
|------|------------|

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] All tests pass
- [ ] No TS errors

## Ready to implement?
```

After approval, use `/dev-docs` to create the task documentation.
