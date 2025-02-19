$(function() { 
    $("table tr:nth-child(odd)") .addClass("zebrastripe"); 
    $("#myTable").tablesorter();
}); 

$(function() {
    $("#myTable").tablesorter({ sortList: [[0,0], [1,0]] });
});