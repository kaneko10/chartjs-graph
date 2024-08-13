// ファイルのアップロード
document.getElementById("file").addEventListener("change", (ev) => {
    var filenames = [];
    for (let i = 0; i < ev.target.files.length; i++) {
        let file = ev.target.files[i];
        // let relativePath = file.webkitRelativePath; // ディレクトリの相対パス
        // 拡張子が.jsonでないファイルは無視する
        if (file.name.endsWith('.json')) {
            filenames.push(file.name);
        }
    }

    orderGraphItems(filenames);
});