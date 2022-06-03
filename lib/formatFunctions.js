/* formatFunctions.js */

export function formatDate(str) {
    let date = new Date(str);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString("en-US", options);
}