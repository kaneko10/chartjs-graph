// ファイルのアップロード
document.getElementById("file").addEventListener("change", (ev) => {
    var filenames = [];
    for (let i = 0; i < ev.target.files.length; i++) {
        let file = ev.target.files[i];
        // let relativePath = file.webkitRelativePath; // ディレクトリの相対パス
        filenames.push(file.name);
    }

    // グループを格納するオブジェクト
    var groupedFiles = {};

    filenames.forEach(function (filename, index) {
        // 拡張子が.jsonでないファイルは無視する
        if (!filename.endsWith('.json')) return;

        // 最後の"_"以降の部分を取り出し、拡張子を除く
        const groupKey = filename.split('_').slice(-1)[0].replace('.json', '');

        // グループが存在しなければ作成する
        if (!groupedFiles[groupKey]) {
            groupedFiles[groupKey] = [];
        }

        // グループにファイル名を追加する
        groupedFiles[groupKey].push(filename);
    });

    makeGraphItems(groupedFiles);
});