// ファイルのアップロード
document.getElementById("json-file-input").addEventListener("change", (ev) => {
    var filenames = [];
    let directoryName = "";

    for (let i = 0; i < ev.target.files.length; i++) {
        let file = ev.target.files[i];
        let relativePath = file.webkitRelativePath; // ディレクトリの相対パス
        if (!directoryName) {
            let pathParts = relativePath.split('/');
            directoryName = pathParts.length > 1 ? pathParts[0] : "";
        }

        // 拡張子が.jsonでないファイルは無視する
        if (file.name.endsWith('.json')) {
            filenames.push(file.name);
        }
    }

    orderGraphItems(filenames, directoryName);
});

document.getElementById("csv-file-input").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const csvData = e.target.result;
            orderManagerLoadVariables(csvData);
        };
        reader.readAsText(file);
    }
});
