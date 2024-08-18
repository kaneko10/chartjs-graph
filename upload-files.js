// ファイルのアップロード
document.getElementById("file").addEventListener("change", (ev) => {
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