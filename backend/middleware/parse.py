import csv
import os
import sys
import json

maxInt = sys.maxsize

while True:
    try:
        csv.field_size_limit(maxInt)
        break
    except OverflowError:
        maxInt = int(maxInt/10)

# get all file names for csvs
csv_files = [f for f in os.listdir('./files/unzipped') if f.endswith('.csv')]
wifi_list = []
ble_list = []

for csv_file in csv_files:
    # open csv file
    with open(f'./files/unzipped/{csv_file}', 'r') as csv_file:
        # create csv reader
        csv_reader = csv.reader(csv_file)
        # create list of rows
        rows = list(csv_reader)
        for row in rows:
            if json.loads(row[2].lower()):
                wifi_list.append(row)
            else:
                ble_list.append(row)
    print('Parsed ', csv_file)

# write to new csv file
with open('./files/parsed/wifi.csv', 'w') as wifi_file:
    writer = csv.writer(wifi_file)
    writer.writerows(wifi_list)
with open('./files/parsed/ble.csv', 'w') as ble_file:
    writer = csv.writer(ble_file)
    writer.writerows(ble_list)
