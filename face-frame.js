function faceFrame(jsonFilePath, frameNum, value, graphID, time) {
    var tooltipEl = document.getElementById('face-frame-' + graphID);
    var baseDiv = document.getElementById('canvas-container-' + graphID);
    var baseRect = baseDiv.getBoundingClientRect();

    var innerHtml = '';

    filename = jsonFilePath.split('/').pop();
    // 最後の"_"以降の部分を取り出し、拡張子を除く
    const groupKey = filename.split('_').slice(-1)[0].replace('.json', '');

    // x軸の値に基づいて画像ファイル名を決定
    const imageName = `frame_${frameNum}.jpg`;
    var imageDirPath;
    if (filename.includes('expt1')) {
        if (filename.includes('OpenFace')) {
            imageDirPath = `images/expt1/${groupKey}/OpenFace`;
        } else if (filename.includes('OpenCV')) {
            imageDirPath = `images/expt1/${groupKey}/OpenCV`;
        }
    } else if (filename.includes('expt2')) {
        if (filename.includes('OpenFace')) {
            imageDirPath = `images/expt2/${groupKey}/OpenFace`;
        } else if (filename.includes('OpenCV')) {
            imageDirPath = `images/expt2/${groupKey}/OpenCV`;
        }
    }
    const imagePath = `${imageDirPath}/${imageName}`;

    innerHtml += '<p>time: ' + time.toFixed(3) + '</p>';
    innerHtml += '<p>frame: ' + frameNum + '</p>';
    innerHtml += '<p>' + value + '</p>';
    innerHtml += '<br><img src="' + imagePath + '" width="200" height="200">';
 
    tooltipEl.innerHTML = innerHtml;

    // tooltipEl.style.opacity = 1;
    // tooltipEl.style.position = 'absolute';
    // tooltipEl.style.left = '50px';
    // tooltipEl.style.top = (baseRect.top + document.documentElement.scrollTop) + 'px';
    // tooltipEl.style.pointerEvents = 'none';
}