export const metricTonToKg = (pricePerMetricTon) => {
    return Number((pricePerMetricTon / 1000).toFixed(2));
};