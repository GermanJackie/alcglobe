function loadMap(){
     //NEW FUNCTION
     Plotly.setPlotConfig({
        mapboxAccessToken: 'pk.eyJ1IjoiZ2VybWFuamFja2llIiwiYSI6ImNqbjllZDl4NDA0Y2gzcXA5azlyaWU5bXkifQ.mKJ1VJSBDzs1FuZk86FNcQ'}); 
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState === 4 && this.status === 200){
            var mapParams = getMapParams(this.response);
            var tableParams = getTableParams(this.response);
            Plotly.plot('map', mapParams.data, mapParams.layout);
            Plotly.plot('table', tableParams);
        }
    };
    xhttp.open("GET", "/get_countries");
    xhttp.send();
}

   
function setupMapData(all){
    //all = [{code: "AFG", liters: "0.01", location: "Afghanistan"},
    var dict = all;
    var mapDataArr = [];
    var values = [];
    var countries = [];
    var hoverText = [];
    var mapDataObj = {};
    var markerDict = {};
    var colors = [];
    var color = 10;
    var map1 = 0;

    for(var obj of dict){
        var currentText = obj["location"] + "\n Liters per head: " + obj["liters"];
        hoverText.push(currentText);
        values.push(obj["liters"]);
        countries.push(obj["code"]);
        color = color + 10;
        colors.push(color);
        //map values to bubble size
        map1 = values.map(x => x * 2);
    }
    
    //markerDict["symbol"] = "star-triangle-up";
    markerDict["size"] = map1;
    markerDict["sizemin"] = 2;
    markerDict["color"] = colors;
    //markerDict["cmin"] = 0;
    //markerDict["cmax"] = Math.max(...values); 
    markerDict["colorscale"] = "Portland";
    markerDict["line"] = {'color': 'black'}, {'width': 10};
    markerDict["selected"] = {"marker": {"opacity": 100}};
    markerDict["name"] = 'europe data';
    
    mapDataObj["type"] = "scattergeo";
    mapDataObj["hoverinfo"] = 'text';
    mapDataObj["hoverlabel"] = {'bgcolor': 'grey', 'font': {'color': "white"}};
    
    mapDataObj["text"] = hoverText;
    mapDataObj["mode"] = "markers";
    mapDataObj["locations"] = countries;
    mapDataObj["marker"] = markerDict;
    mapDataObj["name"] = "alcohol data";
    mapDataArr.push(mapDataObj);
    return mapDataArr;
} 

function setupMapLayout(){
    var layout = {
        title: 'How much do your folks drink?',
        font: {'size': 30},
        showlegend: false,
        modebar: {"orientation": "v"},
        geo: {
            scope: "world",
            projection: {type: 'orthographic'},
            showland: true,
            landcolor: 'rgb(239, 224, 194)',
            showocean: true,
            oceancolor: 'rgb(235,245,255)',
            showcountries: true,
            countrywidth: 1.5,
            countrycolor: 'rgb(255,255,255)',
            showframe: true,
            framecolor: '#9b9998',
            framewidth: 1.8
        },
    };
    return layout;
}

//TABLE DATA
function setupTableData(all){
    var objall = all;
    var alc = [];
    var boozehound = "";
    var rolemodel = "";
    var sum = 0;
    for(var a of objall){
        alc.push(Number(a["liters"]));
    }
    const maxValue = Math.max(...alc);
    const minValue = Math.min(...alc);
    for(var s of alc){
        sum = sum + s;
    }
    var ave = sum / alc.length;
    for(var b of objall){
        if(Number(b["liters"]) === maxValue){
            boozehound = b["location"];
        } else if(Number(b["liters"]) === minValue){
            rolemodel = b["location"];
        }
    }
    var values = [
    //coloumn 1 titles
    [boozehound, maxValue + " liters / capita"],
    [rolemodel, minValue  + " liters / capita"],
    ["Worldwide", ave.toFixed(2)  + " liters / capita"], //row at title 2
  ];
 
 var tData = [{
  type: 'table',
  header: {
    values: [['Boozehound Country (Highest Value)'], ['Role Model (Lowest Value)'],
				 ['Average']],
    align: ["center"], height: 40,
    line: {width: 1, color: 'black'},
    fill: {color: '#003366'},
    font: {family: "Arial", size: 16, color: "white"}
  },
  cells: {
    values: values,
    align: ["center"], height: 30,
    line: {color: "#506784", width: 1},
	 fill: {color: ['#CCE5FF']},
    font: {family: "Arial", size: 14, color: ["#506784"]}
  }
}];
return tData;
}

    
function getMapParams(jsonData){
    var all = JSON.parse(jsonData);
    var objectAll = {};
    objectAll["data"] = setupMapData(all);
    objectAll["layout"] = setupMapLayout();
    return objectAll;
    }

function getTableParams(jsonData){
    var all = JSON.parse(jsonData);
    var tableData = setupTableData(all);
    return tableData;
}
