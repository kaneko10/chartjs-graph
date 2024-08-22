function saveVariablesToCSV(variavlesMap) {
    var keysToSave = [];
    // 保存する変数名を取得
    var variablesDiv = document.getElementById('variables');
    var checkboxes = variablesDiv.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            var label = document.querySelector(`label[for="${checkbox.id}"]`);
            if (label) {
                keysToSave.push(label.textContent);
            }
        }
    });

    // 保存するデータをフィルタリング
    const filteredMap = new Map();
    keysToSave.forEach(key => {
        if (variavlesMap.has(key)) {
            filteredMap.set(key, variavlesMap.get(key));
        }
    });

    // 最大の配列長を取得
    const maxArrayLength = Math.max(...Array.from(filteredMap.values()).map(arr => arr.length));

    // ヘッダー行を作成
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += Array.from(filteredMap.keys()).join(",") + "\n";

    // 各配列の値をCSV形式に変換
    for (let i = 0; i < maxArrayLength; i++) {
        let row = [];
        filteredMap.forEach((valueArray) => {
            row.push(valueArray[i] || "");  // 配列が短い場合は空文字を挿入
        });
        csvContent += row.join(",") + "\n";
    }

    // CSVデータをユーザーにダウンロードさせる
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "selected_data.csv");
    document.body.appendChild(link);

    // クリックしてダウンロードを開始
    link.click();

    // ダウンロードリンクを削除
    document.body.removeChild(link);
}