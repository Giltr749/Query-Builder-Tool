import json

def read_json(file_name):
    with open(file_name) as json_file:
        data = json.load(json_file)
        keys = []
        for key in data:
            keys.append(key)
        # print(type(keys))
        print(keys)
        keys_2 = {}
        for key in keys:
            print(type(data[key]))
            for key2 in data[key]:
                value = data[key][key2]
                keys_2[key2] = value
        print(keys_2)
            

read_json('backend/event_indexes.json')

