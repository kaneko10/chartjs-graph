// ファイルのアップロード
document.getElementById("file").addEventListener("change", (ev) => {
    // for (let i = 0; i < ev.target.files.length; i++) {
        let file = ev.target.files[3];
        let relativePath = file.webkitRelativePath; // ディレクトリの相対パス
        console.log(file);
        drawGraph(relativePath)
    // }
});