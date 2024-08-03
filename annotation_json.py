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

# 特定のnameに基づいてデータをフィルタリングする関数
def filter_data_by_name(name, df):
    return df[df['name'] == name]

# 範囲内の判定を行う関数
def check_range(value, data):
    for index, row in data.iterrows():
        start = row['start']
        end = row['end']
        if start <= value <= end:
            return row['action']
    return None

# CSVファイルの読み込み
file_path = './annotations/annotation.csv'
df = pd.read_csv(file_path)

json_files = glob.glob(os.path.join('json/', '*.json'))
json_files = [os.path.basename(file) for file in json_files]

for file_name in json_files:
    print(file_name)
    file_path = f'json/{file_name}'
    try:
        # JSONファイルを読み込む
        with open(file_path, 'r') as file:
            data = json.load(file)

        annotaion_data = []

        for label in data['labels']:
            # 判定する数値を指定
            value_to_check = label
            # 範囲をチェック
            name_to_check = extract_name(file_name)
            filtered_data = filter_data_by_name(name_to_check, df)
            action = check_range(value_to_check, filtered_data)
            annotaion_data.append(action)
        
        data['annotations'] = annotaion_data

        with open(file_path, 'w') as file:
            json.dump(data, file, indent=4)
        print("New item added to JSON file.")
    except FileNotFoundError:
        print(f"Error: The file {file_path} was not found.")
    except json.JSONDecodeError:
        print(f"Error: The file {file_path} is not valid JSON.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")