// Initialize the editor with a JSON schema
var editor = new JSONEditor(document.getElementById('editor_holder'), {
    ajax: true, disable_properties: true,
    schema: { $ref: "./schema/parser.json" }, startval: null
});

var indicator = document.getElementById('valid_indicator');

function submit() {
    var errors = editor.validate();
    if (errors.length) {
        indicator.style.color = 'red';
        var err = errors[0].path + ": " + errors[0].message;
        indicator.textContent = err;
        return
    }
    $.ajax({
        type: "POST",
        url: "/upload",
        dataType: "json",
        data: JSON.stringify(editor.getValue()),
        success: function(data) {
            indicator.style.color = 'green';
            indicator.textContent = JSON.stringify(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            indicator.style.color = 'red';
            indicator.textContent = XMLHttpRequest.responseText;
        }
    });
}

document.getElementById('submit').addEventListener('click', submit);

editor.on('change',function() {
    var errors = editor.validate();
    if (errors.length) {
        indicator.style.color = 'red';
        indicator.textContent = "invalid";
    } else {
        indicator.style.color = 'green';
        indicator.textContent = "valid";
    }
});

function fillEditor(url) {
    $.getJSON(url, function(result) {
        editor.setValue(result);
        //console.log(JSON.stringify(result));
    });
}

document.getElementById('restore').addEventListener('click',function() {
    fillEditor("example.json");
});

editor.on('ready', function(){
    var name = GetQueryString("name");
    if (name != null) {
        fillEditor("./parsers/" + name);
    }
});
