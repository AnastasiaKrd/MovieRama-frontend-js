import { getClassesByRating, fixDecimals, getYearFromDate } from "./utils.js";

test('should output class-color', () => {
    const color = getClassesByRating(5.7);
    expect(color).toBe('orange');
});

test('should output red', () => {
    const color = getClassesByRating(null);
    expect(color).toBe('red');
});

test('should output number with 2 decimals', () => {
    const num = fixDecimals(7.3589645);
    expect(num).toBe(7.35);
});

test('should output "-"', () => {
    const num = fixDecimals(null);
    expect(num).toBe('-');
});

test('should output year', () => {
    const year = getYearFromDate("2022-02-11");
    expect(year).toBe(2022);
});

test('should output "-"', () => {
    const year = getYearFromDate(null);
    expect(year).toBe('-');
});