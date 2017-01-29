var num_val = function () {
    var number_val = $('#number').val();

    if (number_val == "") { number_val = "fillers" };

    return number_val;
}

var update_words = function (selector, wordList) {
    $(selector + " .word").remove();

    if (wordList.length === 0) {
        $(selector).parent().removeClass('panel-default');
        $(selector).parent().addClass('panel-info');
    }
    else {
        wordList.sort().forEach(function (word) {
            var number,
                pos,
                word_id;

            number = $('#number-heading').text();
            pos = selector.replace("#", "");
            pos = pos.replace("-list", "");
            word_id = number + "-" + pos + "-" + word;

            $(selector).parent().removeClass('panel-info');
            $(selector).parent().addClass('panel-default');

            $(selector).append(
                '<li class="list-group-item word" id="' + word_id + '">' + word +
                    '<button type="button" class="close delete-word" aria-label="Close">' +
                        '<span aria-hidden="true">&times;</span>' +
                    '</button>' +
                '</li>');
        });
    }
};

var update_list = function (data) {
    var nouns = data["noun/pronoun"];
    var adjectives = data["adjective/adverb"];
    var verbs = data["verb"];
    var others = data["others"];

    update_words('#n-list', nouns);
    update_words('#ad-list', adjectives);
    update_words('#v-list', verbs);
    update_words('#oth-list', others);
};

var update = function () {
    var number_val = num_val();
    $('.temp').remove();
    $('.add-word').show();
    $('#number-heading').text(number_val);

    $.getJSON('/ajax/' + number_val, function (data) {
        update_list(data);
        return data;
    });
};

var startup = function (callback) {
    update();
    callback();
}

$(document).ready(function () {
    update();

    $('#number').keyup(update);

    $('#empty-text').click(function () {
        $('#number').val("");
        update();
    });

    // "+ Add Entry" buttons
    var addButtonClickEvent = function (posSym, pos) {
        var addButtonId = '#add-' + posSym;

        $(addButtonId).click(function () {
            var placeHolderText,
                listId,
                inputIdValue,
                doneButtonIdValue,
                inputId,
                inputWord,
                wordIdVal,
                wordId,
                inputVal;

            $(addButtonId).hide();

            listId = '#' + posSym + '-list';
            inputIdValue = posSym + '-input';

            placeHolderText = "Enter " + pos + " for " + num_val();
            $(listId).append('<input type="text" class="form-control word-input temp" id="' + inputIdValue + '" placeholder="' + placeHolderText + '">');

            doneButtonIdValue = "add-" + posSym + "-done";
            $(listId).parent().append(
                '<a class="panel-footer text-center add-word-done temp" id="' + doneButtonIdValue + '" href="#">Done</a>');

            doneButtonId = "#" + doneButtonIdValue;

            $(doneButtonId).click(function () {
                inputId = "#" + inputIdValue;
                inputVal = $(inputId).val();

                if (inputVal === "") {
                    alert("Please enter a meaningful word");

                } else {
                    wordIdVal = num_val() + "-" + posSym + "-" + inputVal;
                    $.getJSON('/add/' + wordIdVal, function (data) {
                        //console.log(data);
                        if (data.status === "success") {
                            $(inputId).remove();
                            $(doneButtonId).remove();
                            $(addButtonId).show();
                            update();
                            wordId = "#" + wordIdVal;
                            console.log(wordId);
                            $(wordId).addClass("updated");
                            $(wordId).addClass("glow");
                        }
                        else {
                            if (data.status === "duplicate") { alert("Duplicate") }
                            else { alert("Adding Failed"); }
                        }
                    });
                }
                return false;
            });
            return false;
        });
        console.log(posSym + " created");
    };

    addButtonClickEvent('n', 'noun/pronoun');
    addButtonClickEvent('ad', 'adjective/adverb');
    addButtonClickEvent('v', 'verb');
    addButtonClickEvent('oth', 'other stuff');

    // Dynamic contents
    $(".words").on('click', '.delete-word', function () {
        var confirmed,
            word,
            word_id;

        word = $(this).parent().text();
        word_id = $(this).parent().attr("id");
        word = word.replace(word[word.length - 1], "");   // removes the ugly x sign
        confirmed = confirm('Are you sure you want to delete ' + '"' + word + '"?');

        if (confirmed) {
            $.getJSON('/remove/' + word_id, function (data) {
                //console.log(data);
                if (data.status === "success") { update(); }
                else { alert("Deletion Failed.") }
            });
        }
    });
});
