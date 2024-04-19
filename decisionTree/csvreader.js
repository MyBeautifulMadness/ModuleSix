//считываем значения в csv файле и прогоняем через processData
function processCSV() {
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function (event) {
            const csvData = event.target.result;
            processData(csvData,true);
        };
    } 
    else {
        alert('Please select a file');
    }
}

//то же самое но для принятия решения
function processDecision() {
    const fileGuess = document.getElementById('decisionFile');
    const order = fileGuess.files[0];
    
    if (order) {
        const reader = new FileReader();
        reader.readAsText(order);
        reader.onload = function (event) {
            const csvData = event.target.result;
            processData(csvData, false);
        };
    } 
    else {
        alert('Please select a file');
    }
}

//функция для занесения значений в контейнер
function processData(csvData, flag) {
    const rows = csvData.split('\n');
    rows.forEach(row => {
        var [age, weight, length, gender] = row.split(',');
        if(flag)
        {
        insertData(age, weight, length, gender);}
        else decision(age,weight, length);
    });
    
}