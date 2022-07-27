import sqlite3 as sq
import pandas as pd
import sys
import csv

#get data from database
def getData(query, headers):
    connection = sq.connect('files/databases/db.sqlite3')
    curs = connection.cursor()
    curs.execute(query)
    rows = curs.fetchall()
    rows.insert(0, headers.split(','))
    return rows


#create csv from array of strings
def createCsv(array, filename):
    with open(filename, 'w') as out:
        csv_out = csv.writer(out)
        for row in array :
            csv_out.writerow(row)


if __name__ == '__main__':
    
    results = getData(sys.argv[1], sys.argv[2])
    createCsv(results, 'files/toSend/report.csv')