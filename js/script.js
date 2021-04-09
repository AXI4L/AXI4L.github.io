var data = new Array();;
( async() => {
    await $.ajax({
        url:"/axial/projects/rez/data/ARM_Instruction.json",
        method:"GET",
        dataType: 'JSON',
    }).then(function(result){
        $.each(result,(i)=>{
            data.push(result[i]['Mnemonic'])
        });
    });
})();

$("#rez_search").autocomplete({
    source: data,
    delay: 0,
    minLength: 0,
    autoFocus: true
})