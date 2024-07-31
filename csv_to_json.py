import pandas as pd
import json
import numpy as np
import torch
import torch.nn.functional as F
import math
import glob
import os

# CSVファイルの読み込み
csv_files = glob.glob(os.path.join('csv/', '*.csv'))
csv_files = [os.path.basename(file) for file in csv_files]

for csv_file in csv_files:
    print(csv_file)
    base_name = os.path.splitext(csv_file)[0]
    csv_file_path = f'csv/{csv_file}'
    df = pd.read_csv(csv_file_path)

    # 欠損データを"NaN"で埋める
    df = df.fillna(math.nan)

    # フレーム番号を抽出して整数に変換して"labels"に設定
    labels = df['Image'].apply(lambda x: int(x.split('_')[1].split('.')[0])).tolist()

    # 色と透明度の設定
    emotion_colors = {
        "Surprise": "rgba(173, 216, 230, 0.4)",       # ライトブルー
        "Fear": "rgba(128, 0, 128, 0.4)",           # 紫色
        "Disgust": "rgba(85, 107, 47, 0.4)",        # ダークオリーブグリーン
        "Happiness": "rgba(255, 165, 0, 0.4)",      # オレンジ
        "Sadness": "rgba(0, 0, 255, 0.4)",          # 青
        "Anger": "rgba(255, 0, 0, 0.4)",            # 赤
        "Neutral": "rgba(128, 128, 128, 0.4)"       # グレー
    }

    # logit列のみを選択してSoftmaxを適用
    logit_columns = [col for col in df.columns if col.startswith('logit_')]
    df1 = pd.DataFrame(index=range(df.shape[0]), columns=logit_columns)

    for i in range(df.shape[0]):
        ps = df.iloc[i].loc["logit_Surprise":"logit_Neutral"]
        if not pd.isna(ps[0]):
            ps = (F.softmax(torch.tensor(ps), dim=0)).numpy().tolist()
        else:
            ps = [0.0] * len(logit_columns)
        df2 = pd.DataFrame([ps], columns=logit_columns)
        df1.iloc[i] = df2.iloc[0]

    # P_i, N_i, F_i のデータを含むJSONデータ作成
    pni_fi_data = {
        "labels": labels,
        "datasets": [
            {
                "label": col,
                "data": df[col].tolist(),
                "borderWidth": 2
            } for col in ['P_i', 'N_i', 'F_i'] if col in df.columns
        ]
    }

    # logit_ で始まるデータを含むJSONデータ作成
    logit_data = {
        "labels": labels,
        "datasets": [
            {
                "label": col,
                "data": df1[col].tolist(),
                "borderColor": emotion_colors[col.split('_')[1]],
                "backgroundColor": emotion_colors[col.split('_')[1]].replace('0.4', '0.2'),
                "borderWidth": 2,
                "pointRadius": 1,
            } for col in logit_columns
        ]
    }

    # JSONファイルに保存
    pni_fi_json_path = f'json/pni_fi_{base_name}.json'
    logit_json_path = f'json/logit_{base_name}.json'

    with open(pni_fi_json_path, 'w') as json_file:
        json.dump(pni_fi_data, json_file, ensure_ascii=False, indent=4)

    with open(logit_json_path, 'w') as json_file:
        json.dump(logit_data, json_file, ensure_ascii=False, indent=4)

    print(f'Data has been successfully converted and saved to {pni_fi_json_path} and {logit_json_path}')
