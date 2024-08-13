function getCalculationResult() {
    const formula = 'log(2 * P_i_XXX + N_i_XXX)';
    let data = {};

    variables.forEach(function (value, key) {
        data[key] = value[0];
    });
    const f_i = math.evaluate(formula, data);
    console.log(f_i);
}