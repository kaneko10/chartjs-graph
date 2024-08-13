import json
import glob
import os
import pandas as pd

def extract_name(file_name):
    # ファイル名から拡張子を取り除く
    base_name = file_name.split('.')[0]
    # 最後のアンダースコアの位置を見つける
    last_underscore_index = base_name.rfind('_')
    # 最後のアンダースコアの後の部分を取得する
    name = base_name[last_underscore_index + 1:]
    return name

# 範囲内の判定を行う関数
def check_range(value, data):
    for index, row in data.iterrows():
        start = row['start']
        end = row['end']
        if start <= value <= end:
            return row['action']
    return None

# json_files = glob.glob(os.path.join('json/', '*.json'))
# json_files = [os.path.basename(file) for file in json_files]

file_name = 'logit_seq_OpenCV_rec_expt1_XXX.json'
json_file_path = f'json/{file_name}'
name = extract_name(file_name)

# CSVファイルの読み込み
csv_file_path = f'./annotations/annotation_{name}.csv'
df = pd.read_csv(csv_file_path)

try:
    # JSONファイルを読み込む
    with open(json_file_path, 'r') as file:
        data = json.load(file)

    annotaion_data = []

    filtered_data = None
    if 'expt1' in file_name:
        print('expt1')
        filtered_data = df[df['type'] == 'expt1']
    elif 'expt2' in file_name:
        print('expt2')
        filtered_data = df[df['type'] == 'expt2']

    for label in data['labels']:
        # 判定する数値を指定
        value_to_check = label
        action = check_range(value_to_check, filtered_data)
        annotaion_data.append(action)
    
    data['annotations'] = annotaion_data

    with open(json_file_path, 'w') as file:
        json.dump(data, file, indent=4)
    print("New item added to JSON file.")
except FileNotFoundError:
    print(f"Error: The file {json_file_path} was not found.")
except json.JSONDecodeError:
    print(f"Error: The file {json_file_path} is not valid JSON.")
except Exception as e:
    print(f"An unexpected error occurred: {e}")