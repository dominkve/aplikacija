/**
 * A simple logger utility for console output with formatting capabilities.
 * @namespace logger
 */
const logger = {
    /**
     * Draws a horizontal line in the console using repeated characters.
     * @param {string} [char='-']   - The character to repeat to form the line.
     * @param {number} [length=50]  - The length of the line (number of characters).
     */
    line: (char = '-', length = 50) => {
        console.log(char.repeat(length));
    }
}

export default logger;