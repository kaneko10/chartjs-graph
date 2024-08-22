function csvToMap(csv) {
    const lines = csv.trim().split("\n");
    const keys = lines[0].split(","); // 最初の行がキー
    const map = new Map();

    // キーに対応する空の配列を作成
    keys.forEach(key => map.set(key, []));

    // 残りの行を読み込んで配列に追加
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",");
        keys.forEach((key, index) => {
            if (values[index]) {
                map.get(key).push(values[index]);
            }
        });
    }

    return map;
}