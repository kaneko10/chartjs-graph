function getCalculationResult(variablesMap, graphID) {
    const formula = document.getElementById(`formulaInput-${graphID}`).value;
    let results = [];
    const minLength = getMinLength(variablesMap)
    for (var i = 0; i < minLength; i++) {
        let data = {};
        variablesMap.forEach(function (value, key) {
            data[key] = value[i];
        });
        const f_i = math.evaluate(formula, data);
        if (f_i === -Infinity) {
            results.push(0);
        } else {
            results.push(f_i);
        }
    }
    return results;
}

// 最小の長さを求める関数
function getMinLength(map) {
    let minLength = Infinity;

    map.forEach(function (value) {
        if (Array.isArray(value)) {  // 値が配列かどうかを確認
            const length = value.length;
            if (length < minLength) {
                minLength = length;  // 最小の長さを更新
            }
        }
    });
    console.log(`minLength: ${minLength}`);

    return minLength;
}
