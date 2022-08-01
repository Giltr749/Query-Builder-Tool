import sqlite3 as sq
import pandas as pd

connection = sq.connect('files/databases/db.sqlite3')

curs = connection.cursor()

wifiEvents = pd.read_csv('files/parsed/wifi.csv')
btEvents = pd.read_csv('files/parsed/ble.csv')

wifiEvents.to_sql('wifiEvents', connection, if_exists='replace', index=False)
btEvents.to_sql('btEvents', connection, if_exists='replace', index=False)
