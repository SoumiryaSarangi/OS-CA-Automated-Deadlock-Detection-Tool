# Deadlock Detective – Initial Project Plan

## 1. Problem Statement
Develop an automated tool that detects potential deadlocks in operating system process resource interactions. The tool must:
- Analyze process dependencies and resource allocation state.
- Identify circular wait conditions (deadlocks) reliably for both single-instance and multi-instance resources.
- Suggest practical resolution / recovery strategies.

### Plain English
We want a desktop application where a user enters (or loads) the current state of processes and resources. The tool tells them whether the system is deadlocked, shows why, and suggests what to do next.

## 2. Goals & Success Criteria
| Goal | Success Criteria |
|------|------------------|
| Accurate Detection | Correctly classify provided scenarios (deadlock vs safe) including classic cycles & multi-instance cases. |
| Educational Transparency | Produce a readable step-by-step trace for learning. |
| Recovery Guidance | Provide at least two strategy types (process termination & resource preemption). |
| Usable Interface | Non-programmers can input data via tables and run detection in one click. |
| Sample Scenarios | Ship with 3–5 curated examples (deadlock / no deadlock / multi-instance). |
| Test Coverage | Unit tests for algorithms, validation, and edge cases (≥20 tests). |

Scope Exclusions (Not required initially):
- Deadlock avoidance (e.g., full Banker’s safety check for future allocations).
- Persistence of execution logs beyond simple file save/load.
- Networked / real OS process introspection (we simulate only).

## 3. High-Level Approach
1. Represent system state using matrices/vectors (Available, Allocation, Request) plus metadata for processes and resource types.
2. Choose algorithm dynamically:
   - Single-instance: Wait-For Graph cycle detection.
   - Multi-instance: Work/Finish matrix-based detection (textbook deadlock detection; similar foundation to Banker’s safety sequence logic, but for detection not avoidance).
3. Generate a trace during execution for educational output.
4. If deadlock detected, compute minimal termination sets and preemption suggestions.
5. Provide GUI with three main tabs: Input, Graph (WFG visualization), Results (trace + recovery guidance).
6. Include JSON-based sample loader and serializer.
7. Comprehensive tests verify correctness and regressions.

## 4. Module Breakdown
| Module | Purpose | Key Responsibilities |
|--------|---------|----------------------|
| Data Modeling (`models`) | Core representation of processes/resources/state | Validation (dimensions, conservation), helper utilities. |
| Detection Algorithms (`detectors`) | Core logic for deadlock determination | WFG construction + DFS cycles; Matrix Work/Finish procedure. |
| Recovery Strategies (`strategies`) | Suggest how to resolve detected deadlocks | Minimal process termination sets and resource preemption what-if simulation. |
| I/O & Samples (`io_utils`) | Serialization & curated examples | JSON schema, load/save, sample factory functions. |
| GUI (`ui`) | User interaction, visualization | Input editing, graph drawing, results formatting, warnings. |
| Tests (`tests`) | Quality assurance | Unit & edge-case test suite for algorithms, I/O, validation. |

## 5. Data Structures
- Process: `{ pid: int, name: str }`
- ResourceType: `{ rid: int, name: str, instances: int }`
- SystemState:
  - `processes: List[Process]`
  - `resource_types: List[ResourceType]`
  - `available: List[int]` (length m)
  - `allocation: List[List[int]]` (n × m)
  - `request: List[List[int]]` (n × m)
  - Invariant: For each resource j, `available[j] + Σ allocation[i][j] == resource_types[j].instances`.

## 6. Algorithms (Planned)
### Wait-For Graph (Single-Instance)
Steps:
1. For each process Pi and each resource Rj it requests (`request[i][j] > 0`), find processes Pk holding Rj (`allocation[k][j] > 0`).
2. Add directed edge Pi → Pk.
3. Detect cycles using DFS; any cycle ⇒ deadlock.

### Matrix-Based Detection (Multi-Instance)
Steps:
1. `Work = Available`; `Finish[i] = False` initially.
2. Find Pi with `Finish[i] == False` and `Request[i] <= Work` (component-wise).
3. Mark `Finish[i] = True`; `Work += Allocation[i]`; repeat.
4. Remaining `Finish[i] == False` processes ⇒ deadlocked set.

### Recovery Strategies
1. Minimal Termination Set: Try subsets of deadlocked processes (small first) and simulate resource release; first successful sets returned.
2. Preemption Simulation: For each deadlocked process, simulate reclaiming its allocated resources and re-run detection; produce success/partial outcomes.

## 7. Technology Stack
| Layer | Choice | Rationale |
|-------|--------|-----------|
| Language | Python 3.10+ | Rapid development & educational clarity. |
| GUI | PySide6 (Qt) | Mature cross-platform widgets & graphics. |
| Testing | pytest | Simple fixtures, readable assertions. |
| Data Format | JSON | Human-readable scenario files. |

Potential Future Additions:
- Type hints enforcement via mypy.
- Linting via flake8/ruff.
- Packaging as standalone executable (PyInstaller).

## 8. Execution Plan & Milestones
| Phase | Tasks | Deliverable |
|-------|-------|------------|
| 1. Foundations | Implement data model & validation | `models.py` stable |
| 2. Algorithms | WFG + Matrix detection with traces | `detectors/` complete |
| 3. Recovery | Termination + preemption simulation | Strategy API ready |
| 4. Samples & I/O | JSON schema, sample scenarios | `io_utils/schema.py` + sample files |
| 5. GUI Core | Tabs, load/run, basic display | App skeleton runs |
| 6. Visualization | WFG drawing & warning states | Graph tab functional |
| 7. Results Enhancements | Trace formatting & highlighting | Educational output |
| 8. Testing | Unit/edge tests (≥20) | Passing suite |
| 9. Polish | UX improvements, warnings, docs | Release-ready |

## 9. Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|-----------|
| Incorrect handling of multi-instance deadlocks | False negatives | Comprehensive test cases & step traces. |
| Performance cost of termination set search | Slow on large sets | Limit practical scenario size (educational scope). |
| User input errors (invalid matrices) | Crashes / confusion | Strict validation + clear error messages. |
| Misuse of WFG on multi-instance | Misleading results | Explicit UI warning & forced matrix fallback suggestion. |

## 10. Deliverables (Initial Version)
- Core code (models, detectors, strategies, io_utils, ui)
- 5 sample JSON scenarios (deadlock / safe / template)
- Test suite (deadlock, no-deadlock, edge cases, I/O)
- User documentation (Getting Started + Theory summary)

## 11. Acceptance Checklist
- [ ] Deadlock correctly detected for classic cycle.
- [ ] Multi-instance scenario with mutual blocking flagged.
- [ ] Safe sequence produced in non-deadlock multi-instance example.
- [ ] Recovery suggestions show at least one minimal termination set.
- [ ] Preemption simulation outputs success or partial messages.
- [ ] GUI loads samples and runs detection without exceptions.
- [ ] All tests pass locally.
- [ ] Documentation explains both algorithms simply.

## 12. Future Enhancements (Post v1)
- Banker's avoidance algorithm (safe state prediction).
- Export report (PDF/Markdown) with trace + graph snapshot.
- Dark mode & accessibility improvements.
- Scenario editor with validation tips & inline resource conservation indicators.
- Real-time auto-detection on cell edit.

---
**Status:** Planning document prepared as project starting point.
**Next Step:** Begin Phase 1 (Data Modeling).
