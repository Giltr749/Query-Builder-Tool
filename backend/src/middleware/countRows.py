import pandas as pd
import os
import sys

#get file names from directory
def getFileNames():
    fileNames = []
    for file in os.listdir(sys.argv[1]):
        if file.endswith(".csv"):
            fileNames.append(file)
    return fileNames


def getRows(files):
    length = 0
    for file in files:
        length = length + len(pd.read_csv(f'{sys.argv[1]}/{file}'))
    return length


if __name__ == '__main__':
    print (getRows(getFileNames()))