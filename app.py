from flask import Flask, render_template
import mnemonics as mn
import json

app = Flask(__name__)
json_file_name = 'mnemonics.json'

@app.route('/')
def demo_ajax():
    return render_template('demo.html')


@app.route('/ajax/<number>')
def ajax(number):
    num_dct = mn.parse_json('mnemonics.json').get(number, {
            "noun/pronoun": [],
            "adjective/adverb": [],
            "verb": [],
            "others": []
        })
    return json.dumps(num_dct)


@app.route('/add/<number>-<pos_sym>-<mnemonic>')
def add(number, pos_sym, mnemonic):
    return mn.add_entry(number, mnemonic, pos_sym, json_file_name)


@app.route('/remove/<number>-<pos_sym>-<mnemonic>')
def remove(number, pos_sym, mnemonic):
    return mn.remove_entry(number, mnemonic, pos_sym, json_file_name)


@app.route('/view/<number>')
def view(number):
    num_dct = mn.parse_json('mnemonics.json').get(number, {})
    return render_template('view.html', number=number, dct=num_dct)
