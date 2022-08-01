import csv
import os
import sys
import json
import logging

maxInt = sys.maxsize

# read json file
def read_json(file_name):
    with open(file_name) as json_file:
        data = json.load(json_file)
        # logging.debug(data)
        l1 = []
        l2 = []
        for k, v in data.items():
            if k == 'wifi':
                for k2, v2 in v.items():
                    l1.append(v2)
            elif k == 'bluetooth':
                for k2, v2 in v.items():
                    l2.append(v2)
                    
        return l1, l2


if __name__ == '__main__':

    while True:
        try:
            csv.field_size_limit(maxInt)
            break
        except OverflowError:
            maxInt = int(maxInt/10)

    # get all file names for csvs
    csv_files = [f for f in os.listdir('files/unzipped') if f.endswith('.csv')]
    wifi_list = []
    ble_list = []

    for csv_file in csv_files:
        # open csv file
        with open(f'files/unzipped/{csv_file}', 'r') as csv_file:
            # create csv reader
            csv_reader = csv.reader(csv_file)
            # create list of rows
            rows = list(csv_reader)
            for row in rows:
                if json.loads(row[2].lower()):
                    wifi_list.append(row)
                else:
                    ble_list.append(row)
        l1, l2 = read_json('event_indexes.json')
        print('Parsed ', csv_file)

    # write to new csv file
    with open('files/parsed/wifi.csv', 'w') as wifi_file:
        writer = csv.DictWriter(wifi_file, fieldnames=l1)
        writer.writeheader()
    with open('files/parsed/ble.csv', 'w') as wifi_file:
        writer = csv.DictWriter(wifi_file, fieldnames=l2)
        writer.writeheader()
    with open('files/parsed/wifi.csv', 'a') as wifi_file:
        writer = csv.writer(wifi_file)
        writer.writerows(wifi_list)
    with open('files/parsed/ble.csv', 'a') as ble_file:
        writer = csv.writer(ble_file)
        writer.writerows(ble_list)
