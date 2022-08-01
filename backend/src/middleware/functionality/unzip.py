#unzip all files from directory
import os
import zipfile
import shutil


def unzip_files(directory):
    for file in os.listdir(directory):
        if file.endswith(".zip"):
            zip_ref = zipfile.ZipFile(directory + file, 'r')
            zip_ref.extractall('files/unzipped/')
            zip_ref.close()
            print(f'Unzipped {file}')


def move_files(directory):
    for file in os.listdir(directory):
        if file.endswith(".csv"):
            shutil.move(directory + file, 'files/unzipped/')
            print(f'Moved {file}')


def main():
    unzip_files('files/downloads/')
    # move_files('files/downloads/')


if __name__ == '__main__':
    main()
    print('Done')