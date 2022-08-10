import gspread
import json
import csv
from oauth2client.service_account import ServiceAccountCredentials

h_yosiok_ans_pair_dict = dict()
h_watanb_ans_pair_dict = dict()
r_takaic_ans_pair_dict = dict()

def print_in_gsheet():
    row = 1
    global h_yosiok_ans_pair_dict
    h_yosiok_ans_pair_dict = get_ans_pair_dict("h-yosiok")
    global h_watanb_ans_pair_dict 
    h_watanb_ans_pair_dict = get_ans_pair_dict("h-watanb")
    global r_takaic_ans_pair_dict 
    r_takaic_ans_pair_dict = get_ans_pair_dict("r-takaic")
    with open("./result/ans20220804.csv",'w') as f:
        writer = csv.writer(f)
        for i in get_pairId_everyone_answered():
            writer.writerow([i,h_yosiok_ans_pair_dict[i],h_watanb_ans_pair_dict[i],r_takaic_ans_pair_dict[i]])
            row += 1
        
def get_pairId_someone_answered(user):
    json_open = open(f'./result/{user}20220804.json','r')
    json_load = json.load(json_open)
    ret = list()
    for data in json_load:
        ret.append((data['pairId']))
    return ret

def get_pairId_everyone_answered():
    h_yosiok = get_pairId_someone_answered("h-yosiok")
    h_watanb = get_pairId_someone_answered("h-watanb")
    r_takaic = get_pairId_someone_answered("r-takaic")
    return sorted(list(set(h_yosiok) & set(h_watanb) & set(r_takaic)))
    

def get_ans_does_not_match():
    ret = list()
    global h_yosiok_ans_pair_dict
    h_yosiok_ans_pair_dict = get_ans_pair_dict("h-yosiok")
    global h_watanb_ans_pair_dict 
    h_watanb_ans_pair_dict = get_ans_pair_dict("h-watanb")
    global r_takaic_ans_pair_dict 
    r_takaic_ans_pair_dict = get_ans_pair_dict("r-takaic")
    # print(h_yosiok_ans_pair_dict)
    for pairId in get_pairId_everyone_answered():
        if(h_yosiok_ans_pair_dict[pairId] == h_watanb_ans_pair_dict[pairId] == r_takaic_ans_pair_dict[pairId]):
            continue
        ret.append(pairId)
    ret.sort()
    # print(ret)
    return ret
        
        
def get_ans_pair_dict(user):
    json_open = open(f'./result/{user}20220804.json','r')
    json_load = json.load(json_open)
    ret = {}
    for data in json_load:
        ret[data['pairId']] = data['judge']
    return ret

def connect_gspread(jsonf,key):
    scope = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/drive']
    credentials = ServiceAccountCredentials.from_json_keyfile_name(jsonf, scope)
    gc = gspread.authorize(credentials)
    SPREADSHEET_KEY = key
    worksheet = gc.open_by_key(SPREADSHEET_KEY).sheet1
    return worksheet

# jsonf = "infinityvariable-8406b6a6e81e.json"
# spread_sheet_key = "1N-CrjxUpEHv1gNiF7TBk0Ae8YPkZYMKg7g3CShtSotA"
# ws = connect_gspread(jsonf,spread_sheet_key)

print_in_gsheet()

# #(2) Google Spread Sheets上の値を更新
# #(２−１)あるセルの値を更新（行と列を指定）
# ws.update_cell(1,1,"test1")
# ws.update_cell(2,1,1)
# ws.update_cell(3,1,2)

# #(２−２)あるセルの値を更新（ラベルを指定）
# ws.update_acell('C1','test2')
# ws.update_acell('C2',1)
# ws.update_acell('C3',2)

# #(2-3)ある範囲のセルの値を更新
# ds= ws.range('E1:G3')
# ds[0].value = 1
# ds[1].value = 2
# ds[2].value = 3
# ds[3].value = 4
# ds[4].value = 5
# ds[5].value = 6
# ds[6].value = 7
# ds[7].value = 8
# ds[8].value = 9
# ws.update_cells(ds)
