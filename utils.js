export function getClassesByRating(rating) {
    if (rating >= 8) {
        return 'green';
    }
    else if (rating >= 5) {
        return 'orange';
    }
    else {
        return 'red';
    }
}

export function fixDecimals(num, decimals) {
    if (num) {
        return Number(num.toFixed(decimals));
    }
    else {
        return '-';
    }
}

export function getYearFromDate(fullDate) {
    if (fullDate) {
        const d = new Date(fullDate);
        return d.getFullYear();
    }
    else {
        return '-';
    }
}