/**
 * Constructs a new range for a statistic.
 * @param {Number} min The minimum value.
 * @param {Number} max The maximum value.
 * @param {Number} current The current value.
 */
function StatRange(min, max, current) {
    this.min = min;
    this.max = max;

    this.current = current;
}

module.exports = StatRange;
