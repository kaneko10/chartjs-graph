import pandas as pd
import json
import numpy as np
import torch
import torch.nn.functional as F
import math

# CSVファイルの読み込み
csv_file_path = 'input.csv'
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

# Softmax関数の定義
def softmax(x):
    e_x = np.exp(x - np.max(x))
    return e_x / e_x.sum(axis=0)

# logit列のみを選択してSoftmaxを適用
logit_columns = [col for col in df.columns if col.startswith('logit_')]
print(logit_columns, len(logit_columns))
df1 = pd.DataFrame(index=range(df.shape[0]), columns=logit_columns)
# df1[0] = [0, 1, 2, 3, 4, 5, 6]

for i in range(df.shape[0]):
    ps = df.iloc[i].loc["logit_Surprise":"logit_Neutral"]
    print(ps)
    if not pd.isna(ps[0]):
        ps = (F.softmax(torch.tensor(ps), dim=0)).numpy().tolist()
    else:
        ps = [0.0] * len(logit_columns)
    df2 = pd.DataFrame([ps], columns=logit_columns)
    df1.iloc[i] = df2.iloc[0]
    # for label, p in zip(logit_columns, ps):
    #     print(i, label, p)
    #     print("a " + str(df1.iloc[i].loc[label]))
    #     df1.iloc[i].loc[label] = p  # ロジットをソフトマックス関数で変換（0〜1の確率）
    #     print("b " + str(df.iloc[i].loc[label]))
 
print(df1)

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
# logit_ で始まるデータを含むJSONデータ作成
logit_data = {
    "labels": labels,
    "datasets": [
        {
            "label": col,
            "data": df1[col].tolist(),
            "borderColor": emotion_colors[col.split('_')[1]],
            "backgroundColor": emotion_colors[col.split('_')[1]].replace('0.4', '0.2'),
            "borderWidth": 2
        } for col in logit_columns
    ]
}

# JSONファイルに保存
pni_fi_json_path = 'pni_fi_output.json'
logit_json_path = 'logit_output.json'

with open(pni_fi_json_path, 'w') as json_file:
    json.dump(pni_fi_data, json_file, ensure_ascii=False, indent=4)

with open(logit_json_path, 'w') as json_file:
    json.dump(logit_data, json_file, ensure_ascii=False, indent=4)

print(f'Data has been successfully converted and saved to {pni_fi_json_path} and {logit_json_path}')
