function getCalculationResult(variablesMap, graphID) {
    const lines = document.getElementById(`formulaInput-${graphID}`).value.split('\n');  // 改行で分割して個別に処理
    let final_results = [];
    const minLength = getMinLength(variablesMap);
    let scopeMap = new Map(variablesMap);   // 元のデータが変更されるのを防ぐための浅いコピー
    let new_variable_name;

    try {
        lines.forEach(function (line, index) {
            if (line.trim() !== '') {  // 空行を無視
                let new_variable_data = []
                for (var i = 0; i < minLength; i++) {
                    let scope = {};
                    scopeMap.forEach(function (value, key) {
                        scope[key] = value[i];  // スコープを定義
                    });
                    const [variable_name, formula] = line.split('=').map(part => part.trim());
                    new_variable_name = variable_name;
                    let result;
                    if (isNumeric(formula)) {
                        // 変数を定数として扱う
                        result = formula;
                    } else {
                        if (formula.includes('?')) {
                            // 変換が必要な場合('?'が含まれている)(ex. Emotion = Positive?Neutral?Negative: r_i)
                            // console.log(scope[variable_name]);
                            // console.log(scope)
                            if (scope[variable_name] === null) {    // nullなら0にする
                                result = 0;
                            } else {
                                result = math.evaluate(scope[variable_name], scope);
                            }
                            console.log(result);
                            new_variable_name = getVariableName(formula);
                        } else {
                            // 式としてそのまま評価できる場合
                            result = math.evaluate(formula, scope);
                            if (result === -Infinity) {
                                result = 0;
                            }
                        }
                    }
                    new_variable_data.push(result);
                }
                scopeMap.set(new_variable_name, new_variable_data);   // 利用可能な変数に計算結果を追加

                console.log(new_variable_name);
            }
        });

        final_results = scopeMap.get(new_variable_name);    // 最後に追加した変数を計算結果として代入

    } catch (e) {
        console.error('Invalid expression:', e);
        document.getElementById('result').textContent = 'Invalid expression';
    }
    return [new_variable_name, final_results];
}

// 数値に変換できるか判定
function isNumeric(data) {
    const parsed = parseFloat(data);
    return !isNaN(parsed) && isFinite(parsed);
}

// 'Positive?Neutral?Negative : r_i'のような文字列から'r_i'を取得
function getVariableName(inputString) {
    const parts = inputString.split(':');
    if (parts.length > 1) {
        return parts[1].trim();  // ':'の後の部分を取得し、前後の空白を削除
    }
    return null;  // ':'が含まれていない場合はnullを返す
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
