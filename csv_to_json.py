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

    # 欠損データをNoneで埋める
    df = df.where(pd.notnull(df), None)

    # フレーム番号を抽出して整数に変換して"labels"に設定
    labels = df['Image'].apply(lambda x: int(x.split('_')[1].split('.')[0])).tolist()

    # 色と透明度の設定
    emotion_colors = {
        "Surprise": "rgba(173, 216, 230, 0.4)",     # ライトブルー
        "Fear": "rgba(128, 0, 128, 0.4)",           # 紫色
        "Disgust": "rgba(85, 107, 47, 0.4)",        # ダークオリーブグリーン
        "Happiness": "rgba(255, 165, 0, 0.4)",      # オレンジ
        "Sadness": "rgba(0, 0, 255, 0.4)",          # 青
        "Anger": "rgba(255, 0, 0, 0.4)",            # 赤
        "Neutral": "rgba(128, 128, 128, 0.4)",      # グレー
        "P_i": "rgba(0, 255, 0, 0.4)",              # 緑
        "N_i": "rgba(255, 0, 0, 0.4)",              # 赤
        "F_i": "rgba(255, 255, 0, 0.4)",            # 黄色
    }

    logit_columns = [col for col in df.columns if col.startswith('logit_')]

    # logit列のみを選択してSoftmaxを適用
    df_logit = pd.DataFrame(index=range(df.shape[0]), columns=logit_columns)
    for i in range(df.shape[0]):
        ps = df.iloc[i].loc["logit_Surprise":"logit_Neutral"]
        if not pd.isna(ps[0]):
            ps = (F.softmax(torch.tensor(ps), dim=0)).numpy().tolist()
        else:
            ps = [0.0] * len(logit_columns)
        df1 = pd.DataFrame([ps], columns=logit_columns)
        df_logit.iloc[i] = df1.iloc[0]

    # logit以外の列
    other_columns = [col for col in df.columns if col in ['P_i', 'N_i', 'F_i']]
    df_other = pd.DataFrame(index=range(df.shape[0]), columns=other_columns)
    for i in range(df.shape[0]):
        ps = df.iloc[i].loc["P_i":"F_i"]
        if pd.isna(ps[0]):
            ps = [0] * len(other_columns)   # Noneの部分は0で埋める
        df1 = pd.DataFrame([ps], columns=other_columns)
        df_other.iloc[i] = df1.iloc[0]

    # P_i, N_i のデータを含むJSONデータ作成
    pi_ni_data = {
        "labels": labels,
        "datasets": [
            {
                "label": col,
                "data": df_other[col].tolist(),
                "borderColor": emotion_colors[col],
                "backgroundColor": emotion_colors[col].replace('0.4', '0.2'),
                "borderWidth": 2,
                "pointRadius": 1,
            } for col in other_columns if col in ['P_i', 'N_i']
        ]
    }

    # F_i のデータを含むJSONデータ作成
    fi_data = {
        "labels": labels,
        "datasets": [
            {
                "label": col,
                "data": df_other[col].tolist(),
                "borderColor": emotion_colors[col],
                "backgroundColor": emotion_colors[col].replace('0.4', '0.2'),
                "borderWidth": 2,
                "pointRadius": 1,
            } for col in other_columns if col in ['F_i']
        ]
    }

    # logit_ で始まるデータを含むJSONデータ作成
    logit_data = {
        "labels": labels,
        "datasets": [
            {
                "label": col,
                "data": df_logit[col].tolist(),
                "borderColor": emotion_colors[col.split('_')[1]],
                "backgroundColor": emotion_colors[col.split('_')[1]].replace('0.4', '0.2'),
                "borderWidth": 2,
                "pointRadius": 1,
            } for col in logit_columns
        ]
    }

    # スムージング
    window_size = 10    # fps: 30
    logit_smooth_data = {
        "labels": labels,
        "datasets": [
            {
                "label": f'{col}_smooth',
                "data": pd.Series(df_logit[col]).rolling(window=window_size).mean().fillna(0).tolist(), # NaNは0で置き換える
                "borderColor": emotion_colors[col.split('_')[1]],
                "backgroundColor": emotion_colors[col.split('_')[1]].replace('0.4', '0.2'),
                "borderWidth": 2,
                "pointRadius": 1,
            } for col in logit_columns
        ]
    }

    # JSONファイルに保存
    pi_ni_json_path = f'json/pi_ni_{base_name}.json'
    fi_json_path = f'json/fi_{base_name}.json'
    logit_json_path = f'json/logit_{base_name}.json'
    logit_json_smooth_path = f'json/logit_smooth_{base_name}.json'

    with open(pi_ni_json_path, 'w') as json_file:
        json.dump(pi_ni_data, json_file, ensure_ascii=False, indent=4)

    with open(fi_json_path, 'w') as json_file:
        json.dump(fi_data, json_file, ensure_ascii=False, indent=4)

    with open(logit_json_path, 'w') as json_file:
        json.dump(logit_data, json_file, ensure_ascii=False, indent=4)

    with open(logit_json_smooth_path, 'w') as json_file:
        json.dump(logit_smooth_data, json_file, ensure_ascii=False, indent=4)

    print(f'Data has been successfully converted and saved to {pi_ni_json_path} and {logit_json_path}')
