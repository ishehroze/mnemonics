var update_words = function (selector, wordList) {
    $(selector + " .words").remove();
    $(selector).append('<ul class="list-group words"></ul>');

    wordList.forEach(function (word) {
        $(selector + " ul.list-group").append('<li class="list-group-item">' + word + "</li>");
    });
    
    $(selector + " ul.list-group").append('<li class="list-group-item active">' + "+ Add Entry" + "</li>");
};

var update_list = function (data) {
    var nouns = data["noun/pronoun"];
    var adjectives = data["adjective/adverb"];
    var verbs = data["verb"];
    var others = data["others"];

    update_words('#n', nouns);
    update_words('#ad', adjectives);
    update_words('#v', verbs);
    update_words('#oth', others);
};

var update = function () {
    var number_val = $('#number').val();

    if (number_val == "") { number_val = "Filler" };
    $('#number-heading').text(number_val);

    $.getJSON('http://localhost:5000/ajax/' + number_val, function (data) {
        update_list(data);
        return data;
    });
};

$(document).ready(function () {
    $('#number').on('keyup', update);
});
