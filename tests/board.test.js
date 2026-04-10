// Tests for Board._formatToGrid and MessageRotator index wrapping

import { describe, it, expect } from 'vitest';

// Re-implement the pure logic from Board._formatToGrid for testing
// (Board class requires DOM, so we test the algorithm directly)
const GRID_COLS = 22;
const GRID_ROWS = 5;

function formatToGrid(lines) {
  const grid = [];
  for (let r = 0; r < GRID_ROWS; r++) {
    const line = (lines[r] || '').toUpperCase();
    const padTotal = GRID_COLS - line.length;
    const padLeft = Math.max(0, Math.floor(padTotal / 2));
    const padded = ' '.repeat(padLeft) + line + ' '.repeat(Math.max(0, GRID_COLS - padLeft - line.length));
    grid.push(padded.split(''));
  }
  return grid;
}

// Re-implement MessageRotator index logic
function nextIndex(current, length) {
  return (current + 1) % length;
}

function prevIndex(current, length) {
  return (current - 1 + length) % length;
}

describe('formatToGrid', () => {
  it('produces correct grid dimensions', () => {
    const grid = formatToGrid(['HELLO']);
    expect(grid.length).toBe(GRID_ROWS);
    grid.forEach(row => expect(row.length).toBe(GRID_COLS));
  });

  it('centers text horizontally', () => {
    const grid = formatToGrid(['AB']);
    const row = grid[0].join('');
    // 'AB' is 2 chars, 22 cols → 10 spaces left, 10 spaces right
    expect(row.indexOf('A')).toBe(10);
    expect(row.indexOf('B')).toBe(11);
  });

  it('fills empty rows with spaces', () => {
    const grid = formatToGrid([]);
    grid.forEach(row => {
      expect(row.every(ch => ch === ' ')).toBe(true);
    });
  });

  it('handles lines longer than grid width', () => {
    const longLine = 'A'.repeat(30);
    const grid = formatToGrid([longLine]);
    // Long lines overflow — padLeft is 0, no right padding added
    expect(grid[0].length).toBe(30);
    expect(grid[0][0]).toBe('A');
  });

  it('uppercases all text', () => {
    const grid = formatToGrid(['hello']);
    const row = grid[0].join('');
    expect(row).toContain('HELLO');
    expect(row).not.toContain('hello');
  });

  it('handles all 5 rows', () => {
    const lines = ['LINE 1', 'LINE 2', 'LINE 3', 'LINE 4', 'LINE 5'];
    const grid = formatToGrid(lines);
    for (let i = 0; i < 5; i++) {
      expect(grid[i].join('')).toContain(`LINE ${i + 1}`);
    }
  });

  it('centers single character', () => {
    const grid = formatToGrid(['X']);
    const idx = grid[0].indexOf('X');
    // 22-1=21, padLeft=10
    expect(idx).toBe(10);
  });
});

describe('MessageRotator index logic', () => {
  it('wraps forward from last to first', () => {
    expect(nextIndex(5, 6)).toBe(0);
  });

  it('increments normally', () => {
    expect(nextIndex(0, 6)).toBe(1);
    expect(nextIndex(2, 6)).toBe(3);
  });

  it('wraps backward from first to last', () => {
    expect(prevIndex(0, 6)).toBe(5);
  });

  it('decrements normally', () => {
    expect(prevIndex(3, 6)).toBe(2);
    expect(prevIndex(5, 6)).toBe(4);
  });

  it('handles single message', () => {
    expect(nextIndex(0, 1)).toBe(0);
    expect(prevIndex(0, 1)).toBe(0);
  });
});
