import json

def parse_json(json_file_name):
    with open(json_file_name, 'r') as json_file:
        dct = json.loads(json_file.read())

    return dct


def read_json(json_file_name):
    with open(json_file_name, 'r') as json_file:
        json = json_file.read()

    return json


# def sort_all(json_file_name):
#     with open(json_file_name, 'r') as json_file:
#         dct = json.loads(json_file.read()) 
    
#     for num in dct:
#         for pos in dct[num]:
#             dct[number][pos].sort()

#     with open(json_file_name, 'w') as json_file:
#         json_file.write(json.dumps(dct))


def add_entry(number, mnemonic, pos_sym, json_file_name):
    number_str = str(number)
    pos_mapping = {
        'n': 'noun/pronoun', 
        'ad': 'adjective/adverb', 
        'v': 'verb', 
        'oth': 'others'
    }
    
    assert pos_sym in pos_mapping
    pos = pos_mapping[pos_sym]

    dct = parse_json(json_file_name)
    
    if not (number_str in dct):
        dct[number_str] ={
            "noun/pronoun": [],
            "adjective/adverb": [],
            "verb": [],
            "others": []
        }
        
    if mnemonic in dct[number_str][pos]:
        print("Entry already exists.")
    else:
        dct[number_str][pos].append(mnemonic)
        dct[number_str][pos].sort()

        with open(json_file_name, 'w') as json_file:
            json_file.write(json.dumps(dct))
                

# Console stuffs
def print_entry(number, json_file_name):
    number_str = str(number)
    
    with open(json_file_name, 'r') as json_file:
        dct = json.loads(json_file.read())
        
        if number_str in dct:        
            print(number_str)
            print(len(number_str) * '=')

            for pos in dct[number_str]:
                mnemonic_list = dct[number_str][pos]
                
                if len(mnemonic_list) == 0:
                    continue
                else:
                    mnemonics = ", ".join(mnemonic_list)
                    
                    print("  %s" % pos)
                    print("  " + len(pos) * '-')
                    print("    %s\n" % mnemonics)
                    
        else:
            print("No entry for %s" % number_str)