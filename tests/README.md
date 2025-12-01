# Test Suite

This directory contains the complete test suite for the Automated Deadlock Detection Tool.

## Quick Start

### Run All Tests
```bash
# Run comprehensive algorithm tests (40 tests)
node tests/test-suite.mjs

# Run sample validation (135 tests)
node tests/test-samples.mjs

# Run JSON import/export tests (105 tests)
node tests/test-json-import.mjs

# Run visualization tests (48 tests)
node tests/test-visualization.mjs
```

### Run Everything
```bash
node tests/test-suite.mjs && node tests/test-samples.mjs && node tests/test-json-import.mjs && node tests/test-visualization.mjs
```

## Test Files

| File | Tests | Purpose |
|------|-------|---------|
| `test-suite.mjs` | 40 | Core algorithm validation (WFG, Matrix, Recovery) |
| `test-samples.mjs` | 135 | Built-in sample dataset verification |
| `test-json-import.mjs` | 105 | JSON import/export functionality |
| `test-visualization.mjs` | 48 | UI data structure compatibility |
| `comprehensive-test.js` | 855 | Backup comprehensive suite |
| `debug-partial.mjs` | N/A | Partial deadlock debugging |

## Test Coverage

### Total: 328 Tests ✅
- **Passed:** 328
- **Failed:** 0
- **Success Rate:** 100%

### Breakdown
- Algorithm Correctness: 40 tests
- Sample Dataset Validation: 135 tests
- JSON I/O: 105 tests
- Visualization: 48 tests

## Test Data

The `test-data/` directory contains 7 JSON files for testing import functionality:
- `circular-deadlock.json` - Classic 3-process circular wait
- `safe-state-multi.json` - Safe multi-instance state
- `banking-deadlock.json` - Two-process banking deadlock
- `bankers-algorithm-safe.json` - Classic Banker's safe state
- `mixed-instance-deadlock.json` - Reader-writer conflict
- `single-process-safe.json` - Single process edge case
- `empty-system.json` - Empty system edge case

See `test-data/README.md` for detailed information about each test file.

## Test Report

For a comprehensive test report, see **[TEST_REPORT.md](./TEST_REPORT.md)**

The report includes:
- Detailed test results for each suite
- Algorithm coverage analysis
- Edge case validation
- Performance metrics
- Data integrity verification
- Quality assurance checklist

## What's Tested

### Algorithms
- ✅ Wait-For Graph (WFG) for single-instance resources
- ✅ Matrix-Based algorithm for multi-instance resources
- ✅ Recovery suggestion generation
- ✅ Cycle detection
- ✅ Safe sequence generation

### Scenarios
- ✅ Simple deadlocks (2 processes)
- ✅ Complex deadlocks (5+ processes)
- ✅ Safe states
- ✅ Partial deadlocks
- ✅ Dining philosophers
- ✅ Banker's algorithm
- ✅ Database locks
- ✅ Reader-writer conflicts

### Edge Cases
- ✅ Empty systems
- ✅ Single process
- ✅ No requests
- ✅ Zero available resources
- ✅ Large datasets (20 processes)
- ✅ Invalid inputs
- ✅ Negative values
- ✅ Missing JSON fields

### Data Integrity
- ✅ Resource conservation
- ✅ Request feasibility
- ✅ Matrix dimensions
- ✅ JSON round-trip integrity
- ✅ Algorithm selection logic

## Status

🎉 **ALL TESTS PASSING** - System is production-ready!

Last run: December 1, 2025  
Status: ✅ 328/328 tests passing
