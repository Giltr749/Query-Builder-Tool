import sys
import csv

#create csv from array of strings
def createCsv(array, filename):
    with open(filename, 'w') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(array)
    csvfile.close()
    return filename

#create csv from array of dictionaries
def createCsvFromDict(array, filename):
    with open(filename, 'w') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=array[0].keys())
        writer.writeheader()
        writer.writerows(array)
    csvfile.close()
    return filename


if __name__ == '__main__':
    createCsvFromDict(sys.argv[1], 'files/toSend/report.csv')