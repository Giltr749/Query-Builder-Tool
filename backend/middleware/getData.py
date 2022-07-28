import sqlite3 as sq
import pandas as pd
import sys
import csv

# get data from database


# def getData(query, headers):
#     connection = sq.connect('files/databases/db.sqlite3')
#     curs = connection.cursor()
#     curs.execute(query)
#     rows = curs.fetchall()
#     rows.insert(0, headers.split(','))
#     return rows


def getData(wifiQuery, bleQuery, wifiHeaders, bleHeaders):
    rows = []
    wifiRows = []
    bleRows = []
    connection = sq.connect('files/databases/db.sqlite3')
    wifiCurs = connection.cursor()
    bleCurs = connection.cursor()
    if (len(wifiQuery) > 0):
        wifiRows.append(wifiHeaders.split(','))
        wifiCurs.execute(wifiQuery)
        wifiRows = wifiCurs.fetchall()
        rows.extend(wifiRows)

    if (len(bleQuery) > 0):
        bleRows.append(bleHeaders.split(','))
        bleCurs.execute(bleQuery)
        bleRows = bleCurs.fetchall()
        rows.extend(bleRows)

    if (len(wifiQuery) == 0 and len(bleQuery) == 0):
        rows.append(wifiHeaders.split(','))
        wifiCurs.execute('SELECT * FROM wifi')
        rows.extend(wifiCurs.fetchall())
        rows.append(bleHeaders.split(','))
        bleCurs.execute('SELECT * FROM ble')
        rows.append(bleCurs.fetchall())
    return rows


# create csv from array of strings
def createCsv(array, filename):
    with open(filename, 'w') as out:
        csv_out = csv.writer(out)
        for row in array:
            csv_out.writerow(row)


if __name__ == '__main__':

    results = getData(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
    createCsv(results, 'files/toSend/report.csv')
