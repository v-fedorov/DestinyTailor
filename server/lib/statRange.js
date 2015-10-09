/**
 * Constructs a new range for a statistic.
 * @param {number} min The minimum value.
 * @param {max} max The maximum value.
 * @param {current} current The current value.
 */
function StatRange(min, max, current) {
    this.min = min;
    this.max = max;
    
    this.current = current;
}

module.exports = StatRange;
