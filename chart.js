var svg = d3.select("body")
	.append("svg")
	.append("g")

svg.append("g")
	.attr("class", "slices");
svg.append("g")
	.attr("class", "labels");
svg.append("g")
	.attr("class", "lines");

var width = 960,
    height = 450,
	radius = Math.min(width, height) / 2;

var pie = d3.layout.pie()
	.sort(null)
	.value(function(d) {
		return d.value;
	});

var arc = d3.svg.arc()
	.outerRadius(radius * 0.8)
	.innerRadius(radius * 0.4);

var outerArc = d3.svg.arc()
	.innerRadius(radius * 0.9)
	.outerRadius(radius * 0.9);

svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var key = function(d){ return d.data.label; };
//NEW DATA ARRAY

var color = d3.scale.ordinal()
	.domain(["P4 - Normal" , "P3 - Medium", "P2 - High", "P1 - Very high"])
	.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);


  function randomData() {
  var labels = color.domain();
  var _obj = convertChart2();
  var _normalPerc = _obj.normalPerc;
  var _highPerc = _obj.highPerc;
  var _veryHighPerc = _obj.veryHighPerc;
  var _mediumPerc = _obj.mediumPerc;

  var _list = [];
  _list.push({
    label: labels[0],
    value: _normalPerc
  });
  _list.push({
    label: labels[1],
    value: _mediumPerc
  });
  _list.push({
    label: labels[2],
    value: _veryHighPerc
  });
  _list.push({
    label: labels[3],
    value: _highPerc
  });

  return _list;
}
/*
function randomData (){
	var labels = color.domain();
	return labels.map(function(label){
		return { label: label, value: Math.random()}
	});
}
*/
change(randomData());

d3.select(".randomize")
	.on("click", function(){
		change(randomData());
	});


function change(data) {

	/* ------- PIE SLICES -------*/
	var slice = svg.select(".slices").selectAll("path.slice")
		.data(pie(data), key);

	slice.enter()
		.insert("path")
		.style("fill", function(d) { return color(d.data.label); })
		.attr("class", "slice");

	slice
		.transition().duration(1000)
		.attrTween("d", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				return arc(interpolate(t));
			};
		})

	slice.exit()
		.remove();

	/* ------- TEXT LABELS -------*/

	var text = svg.select(".labels").selectAll("text")
		.data(pie(data), key);

	text.enter()
		.append("text")
		.attr("dy", ".35em")
		.text(function(d) {
			return d.data.label;
		});

	function midAngle(d){
		return d.startAngle + (d.endAngle - d.startAngle)/2;
	}

	text.transition().duration(1000)
		.attrTween("transform", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
				return "translate("+ pos +")";
			};
		})
		.styleTween("text-anchor", function(d){
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				return midAngle(d2) < Math.PI ? "start":"end";
			};
		});

	text.exit()
		.remove();

	/* ------- SLICE TO TEXT POLYLINES -------*/

	var polyline = svg.select(".lines").selectAll("polyline")
		.data(pie(data), key);

	polyline.enter()
		.append("polyline");

	polyline.transition().duration(1000)
		.attrTween("points", function(d){
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
				return [arc.centroid(d2), outerArc.centroid(d2), pos];
			};
		});

	polyline.exit()
		.remove();
};



areaChart('#chart1',convertChart().data);
areaChart1('#chart',convertChart().data);
areaChart2('#chart2',convertChart());

function areaChart2(div,data){
  var chart = c3.generate({
    data: {
        columns: data.data,
        type : 'donut',
        onclick: function (d, i) { console.log("onclick", d, i); },
        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
    },
    donut: {
        title: data.countData
    }
});

}

function areaChart1(div,data){
var chart = c3.generate({
  	bindto: div,
    data: {
        // iris data from R

        columns: data,
        type: 'pie',
        onclick: function (d, i) {
            console.log("onclick", d, i);
        },
        onmouseover: function (d, i) {
            console.log("onmouseover", d, i);
        },
        onmouseout: function (d, i) {
            console.log("onmouseout", d, i);
        }
    }
});
}

function areaChart(div,data){
var chart1 = c3.generate({
  	bindto: div,
    data:{
        columns: data
      }
});
}


function loadData() {
    var data = [{
        "Count": 11759,
        "ErrorID": 258
    }, {
        "Count": 2517,
        "ErrorID": 6300
    }, {
        "Count": 1205,
        "ErrorID": 6100
    }, {
        "Count": 448,
        "ErrorID": 6127
    }, {
        "Count": 418,
        "ErrorID": 2138
    }, {
        "Count": 270,
        "ErrorID": 1015
    }, {
        "Count": 249,
        "ErrorID": 8059
    }, {
        "Count": 86,
        "ErrorID": 33
    }, {
        "Count": 28,
        "ErrorID": 6398
    }, {
        "Count": 22,
        "ErrorID": 6327
    }, {
        "Count": 8,
        "ErrorID": 2137
    }, {
        "Count": 8,
        "ErrorID": 58
    }, {
        "Count": 4,
        "ErrorID": 32
    }, {
        "Count": 4,
        "ErrorID": 1008
    }, {
        "Count": 4,
        "ErrorID": 1002
    }, {
        "Count": 2,
        "ErrorID": 2003
    }, {
        "Count": 2,
        "ErrorID": 2004
    }, {
        "Count": 1,
        "ErrorID": 6328
    }, {
        "Count": 1,
        "ErrorID": 0
    }, {
        "Count": 1,
        "ErrorID": 6105
    }, {
        "Count": 1,
        "ErrorID": 2017
    }];



    var _pieColumns = [];
    for(var _i = 0; _i < data.length; _i++){
        _pieColumns.push([data[_i].ErrorID + '', data[_i].Count]);
    }
    return _pieColumns;
}


function loadData1(){
 var data =   [
    {
      "Number": "I-264491",
      "State": "Solved",
      "Primary Engineer": "",
      "Responsible": "CC Riffle",
      "Priority": "P4 - Normal",
      "Title": "Riffle: enable PHP intl extension",
      "Resubmission Date": "",
      "Response SLA State": 0,
      "Resolution SLA State": 0,
      "Last Change": "28/02/2017 12:30",
      "Creation Date": "28/02/2017 10:27",
      "Company Title": "IS4U - LeasePlan Belgium",
      "Company Class": "IS4U Customer",
      "Unread Emails": 0,
      "Actions": 1,
      "Last Action": "28/02/2017 10:28"
    },
    {
      "Number": "I-265219",
      "State": "Solved",
      "Primary Engineer": "Eestermans Dries",
      "Responsible": "CC IS4U",
      "Priority": "P4 - Normal",
      "Title": "ISIM Synchronisatie geblokkeerd?",
      "Resubmission Date": "",
      "Response SLA State": 0,
      "Resolution SLA State": 0,
      "Last Change": "10/03/2017 11:12",
      "Creation Date": "9/03/2017 14:12",
      "Company Title": "IS4U - Bekaert",
      "Company Class": "IS4U Customer",
      "Unread Emails": 0,
      "Actions": 3,
      "Last Action": "10/03/2017 8:15"
    },
    {
      "Number": "I-263380",
      "State": "Classification",
      "Primary Engineer": "Vereycken Christophe",
      "Responsible": "CC IS4U",
      "Priority": "P2 - High",
      "Title": "Verschillen in aantallen accounts Liferay en NeoZ ind. A",
      "Resubmission Date": "",
      "Response SLA State": 1,
      "Resolution SLA State": 0,
      "Last Change": "9/03/2017 11:52",
      "Creation Date": "13/02/2017 14:30",
      "Company Title": "ZLM verzekeringen",
      "Company Class": "Customer",
      "Unread Emails": 1,
      "Actions": 15,
      "Last Action": "9/03/2017 11:51"
    },
    {
      "Number": "I-263083",
      "State": "Solved",
      "Primary Engineer": "Eestermans Dries",
      "Responsible": "CC IS4U",
      "Priority": "P4 - Normal",
      "Title": "SSL prompt komt niet (B2B TAM)",
      "Resubmission Date": "",
      "Response SLA State": 0,
      "Resolution SLA State": 0,
      "Last Change": "13/02/2017 13:47",
      "Creation Date": "9/02/2017 7:55",
      "Company Title": "IS4U - De Lijn",
      "Company Class": "IS4U Customer",
      "Unread Emails": 0,
      "Actions": 10,
      "Last Action": "13/02/2017 13:43"
    },
    {
      "Number": "I-263351",
      "State": "Solved",
      "Primary Engineer": "Eestermans Dries",
      "Responsible": "CC IS4U",
      "Priority": "P4 - Normal",
      "Title": "ISAM: Manage SSL certificates",
      "Resubmission Date": "",
      "Response SLA State": 0,
      "Resolution SLA State": 0,
      "Last Change": "14/02/2017 9:40",
      "Creation Date": "13/02/2017 11:45",
      "Company Title": "IS4U - De Lijn",
      "Company Class": "IS4U Customer",
      "Unread Emails": 0,
      "Actions": 6,
      "Last Action": "14/02/2017 9:24"
    },
    {
      "Number": "I-264083",
      "State": "Solved",
      "Primary Engineer": "Eestermans Dries",
      "Responsible": "CC IS4U",
      "Priority": "P4 - Normal",
      "Title": "W2012 client SSL naar TDS6.0 (TIM)",
      "Resubmission Date": "",
      "Response SLA State": 2,
      "Resolution SLA State": 0,
      "Last Change": "28/02/2017 11:10",
      "Creation Date": "22/02/2017 12:18",
      "Company Title": "IS4U - De Lijn",
      "Company Class": "IS4U Customer",
      "Unread Emails": 0,
      "Actions": 4,
      "Last Action": "28/02/2017 11:08"
    },
    {
      "Number": "I-264249",
      "State": "Solved",
      "Primary Engineer": "Michel Peeters",
      "Responsible": "CC IS4U - IBM Identity Management",
      "Priority": "P3 - Medium",
      "Title": "Probleem Lotus Notes",
      "Resubmission Date": "",
      "Response SLA State": 1,
      "Resolution SLA State": 0,
      "Last Change": "24/02/2017 16:40",
      "Creation Date": "24/02/2017 8:47",
      "Company Title": "IS4U - OLVZ Aalst",
      "Company Class": "IS4U Customer",
      "Unread Emails": 0,
      "Actions": 2,
      "Last Action": "24/02/2017 14:12"
    },
    {
      "Number": "I-263732",
      "State": "Solved",
      "Primary Engineer": "Coban Tufan",
      "Responsible": "CC IS4U - Microsoft",
      "Priority": "P1 - Very high",
      "Title": "Website werkt nog niet hoe het moet",
      "Resubmission Date": "",
      "Response SLA State": 0,
      "Resolution SLA State": 0,
      "Last Change": "20/02/2017 12:16",
      "Creation Date": "17/02/2017 8:28",
      "Company Title": "IS4U - Infrax",
      "Company Class": "IS4U Customer",
      "Unread Emails": 0,
      "Actions": 5,
      "Last Action": "20/02/2017 12:11"
    },
    {
      "Number": "I-263583",
      "State": "Closed",
      "Primary Engineer": "Coban Tufan",
      "Responsible": "CC IS4U - Microsoft",
      "Priority": "P4 - Normal",
      "Title": "FIM aanpassing Kennisdocumenten",
      "Resubmission Date": "",
      "Response SLA State": 0,
      "Resolution SLA State": 0,
      "Last Change": "6/03/2017 10:29",
      "Creation Date": "15/02/2017 13:40",
      "Company Title": "IS4U - Infrax",
      "Company Class": "IS4U Customer",
      "Unread Emails": 0,
      "Actions": 5,
      "Last Action": "2/03/2017 10:31"
    },
    {
      "Number": "I-265078",
      "State": "Closed",
      "Primary Engineer": "Coban Tufan",
      "Responsible": "CC IS4U - Microsoft",
      "Priority": "P4 - Normal",
      "Title": "AD Infrax permissions issue testomgeving",
      "Resubmission Date": "",
      "Response SLA State": 0,
      "Resolution SLA State": 0,
      "Last Change": "10/03/2017 8:48",
      "Creation Date": "8/03/2017 8:53",
      "Company Title": "IS4U - Infrax",
      "Company Class": "IS4U Customer",
      "Unread Emails": 0,
      "Actions": 1,
      "Last Action": "8/03/2017 8:53"
    },
    {
      "Number": "I-264867",
      "State": "Closed",
      "Primary Engineer": "Coban Tufan",
      "Responsible": "CC IS4U - Microsoft",
      "Priority": "P4 - Normal",
      "Title": "Probleem SAP HR link lijst (een account blijft fout weergegeven)",
      "Resubmission Date": "",
      "Response SLA State": 0,
      "Resolution SLA State": 0,
      "Last Change": "10/03/2017 8:50",
      "Creation Date": "6/03/2017 9:22",
      "Company Title": "IS4U - Infrax",
      "Company Class": "IS4U Customer",
      "Unread Emails": 0,
      "Actions": 2,
      "Last Action": "6/03/2017 10:54"
    },
    {
      "Number": "I-264155",
      "State": "Waiting for Verification",
      "Primary Engineer": "Eestermans Dries",
      "Responsible": "CC IS4U",
      "Priority": "P4 - Normal",
      "Title": "ISAM UAT B2CABO eID authentication broken after upgrade",
      "Resubmission Date": "4/04/2017 10:00",
      "Response SLA State": 0,
      "Resolution SLA State": 0,
      "Last Change": "10/03/2017 11:28",
      "Creation Date": "23/02/2017 10:05",
      "Company Title": "IS4U - De Lijn",
      "Company Class": "IS4U Customer",
      "Unread Emails": 1,
      "Actions": 8,
      "Last Action": "10/03/2017 11:13"
    },
    {
      "Number": "I-264479",
      "State": "Waiting For Customer",
      "Primary Engineer": "Coban Tufan",
      "Responsible": "CC IS4U - Microsoft",
      "Priority": "P4 - Normal",
      "Title": "AD Infrax exported-change-not-reimported",
      "Resubmission Date": "13/03/2017 10:00",
      "Response SLA State": 0,
      "Resolution SLA State": 0,
      "Last Change": "7/03/2017 12:54",
      "Creation Date": "28/02/2017 9:53",
      "Company Title": "IS4U - Infrax",
      "Company Class": "IS4U Customer",
      "Unread Emails": 0,
      "Actions": 5,
      "Last Action": "1/03/2017 17:05"
    },
    {
      "Number": "I-263346",
      "State": "Solved",
      "Primary Engineer": "Jacobs Stefan",
      "Responsible": "CC IS4U - IBM Identity Management",
      "Priority": "P4 - Normal",
      "Title": "NPM xxxx Pasword issue - bpost bank",
      "Resubmission Date": "",
      "Response SLA State": 0,
      "Resolution SLA State": 0,
      "Last Change": "21/02/2017 14:04",
      "Creation Date": "13/02/2017 11:29",
      "Company Title": "IS4U - bpost",
      "Company Class": "IS4U Customer",
      "Unread Emails": 0,
      "Actions": 3,
      "Last Action": "15/02/2017 17:00"
    },
    {
      "Number": "I-263699",
      "State": "Solved",
      "Primary Engineer": "Verbraak Jelle",
      "Responsible": "CC IS4U - Microsoft",
      "Priority": "P3 - Medium",
      "Title": "[UAT][UAG] Belgian root CA4 is not accepted",
      "Resubmission Date": "",
      "Response SLA State": 0,
      "Resolution SLA State": 0,
      "Last Change": "17/02/2017 11:16",
      "Creation Date": "16/02/2017 15:15",
      "Company Title": "IS4U - FSMA",
      "Company Class": "IS4U Customer",
      "Unread Emails": 0,
      "Actions": 5,
      "Last Action": "17/02/2017 10:52"
    },
    {
      "Number": "I-235967",
      "State": "Waiting For Customer",
      "Primary Engineer": "Verbraak Jelle",
      "Responsible": "CC IS4U - Microsoft",
      "Priority": "P3 - Medium",
      "Title": "incident FSMA: UAG",
      "Resubmission Date": "23/02/2016 9:00",
      "Response SLA State": 0,
      "Resolution SLA State": 0,
      "Last Change": "8/03/2017 16:29",
      "Creation Date": "10/12/2015 13:29",
      "Company Title": "IS4U - FSMA",
      "Company Class": "IS4U Customer",
      "Unread Emails": 0,
      "Actions": 6,
      "Last Action": "7/02/2017 10:22"
    },
    {
      "Number": "I-263564",
      "State": "Waiting For Customer",
      "Primary Engineer": "Steveninck Michael",
      "Responsible": "CC IS4U",
      "Priority": "P2 - High",
      "Title": "Laptop zit volledig vast na uit slaapstand komen",
      "Resubmission Date": "16/03/2017 9:00",
      "Response SLA State": 1,
      "Resolution SLA State": 0,
      "Last Change": "24/02/2017 15:25",
      "Creation Date": "15/02/2017 11:27",
      "Company Title": "IS4U - AZ Sint-Lucas Brugge",
      "Company Class": "IS4U Customer",
      "Unread Emails": 0,
      "Actions": 4,
      "Last Action": "24/02/2017 15:23"
    },
    {
      "Number": "I-249104",
      "State": "Waiting for Verification",
      "Primary Engineer": "Steveninck Michael",
      "Responsible": "CC IS4U - IBM Identity Management",
      "Priority": "P4 - Normal",
      "Title": "Sync KWS Login & paswoord naar ACBAM",
      "Resubmission Date": "8/03/2017 9:00",
      "Response SLA State": 2,
      "Resolution SLA State": 0,
      "Last Change": "8/03/2017 9:00",
      "Creation Date": "8/07/2016 15:46",
      "Company Title": "IS4U - AZ Sint-Lucas Brugge",
      "Company Class": "IS4U Customer",
      "Unread Emails": 0,
      "Actions": 10,
      "Last Action": "20/01/2017 16:57"
    },
    {
      "Number": "I-263654",
      "State": "Waiting For Customer",
      "Primary Engineer": "Steveninck Michael",
      "Responsible": "CC IS4U",
      "Priority": "P4 - Normal",
      "Title": "Probleem citrix receiver op pc's met access agent",
      "Resubmission Date": "16/03/2017",
      "Response SLA State": 0,
      "Resolution SLA State": 0,
      "Last Change": "9/03/2017 16:19",
      "Creation Date": "16/02/2017 9:43",
      "Company Title": "IS4U - AZ Sint-Lucas Brugge",
      "Company Class": "IS4U Customer",
      "Unread Emails": 0,
      "Actions": 6,
      "Last Action": "9/03/2017 16:18"
    },
    {
      "Number": "I-265095",
      "State": "Waiting for Verification",
      "Primary Engineer": "Steveninck Michael",
      "Responsible": "CC IS4U",
      "Priority": "P4 - Normal",
      "Title": "slbtimweb hard disk usage at 100%",
      "Resubmission Date": "16/03/2017 9:00",
      "Response SLA State": 0,
      "Resolution SLA State": 0,
      "Last Change": "10/03/2017 11:14",
      "Creation Date": "8/03/2017 11:09",
      "Company Title": "IS4U - AZ Sint-Lucas Brugge",
      "Company Class": "IS4U Customer",
      "Unread Emails": 0,
      "Actions": 3,
      "Last Action": "10/03/2017 11:13"
    },
    {
      "Number": "I-264980",
      "State": "In progress",
      "Primary Engineer": "Steveninck Michael",
      "Responsible": "CC IS4U",
      "Priority": "P3 - Medium",
      "Title": "Tim - Acount inactive terwijl in dienst",
      "Resubmission Date": "",
      "Response SLA State": 0,
      "Resolution SLA State": 0,
      "Last Change": "9/03/2017 15:45",
      "Creation Date": "7/03/2017 8:55",
      "Company Title": "IS4U - AZ Sint-Lucas Brugge",
      "Company Class": "IS4U Customer",
      "Unread Emails": 0,
      "Actions": 2,
      "Last Action": "7/03/2017 15:58"
    },
    {
      "Number": "I-265201",
      "State": "Waiting For Customer",
      "Primary Engineer": "Steveninck Michael",
      "Responsible": "CC IS4U",
      "Priority": "P4 - Normal",
      "Title": "PC's komen dubbel in samesso",
      "Resubmission Date": "16/03/2017 9:00",
      "Response SLA State": 0,
      "Resolution SLA State": 0,
      "Last Change": "10/03/2017 11:12",
      "Creation Date": "9/03/2017 11:19",
      "Company Title": "IS4U - AZ Sint-Lucas Brugge",
      "Company Class": "IS4U Customer",
      "Unread Emails": 0,
      "Actions": 2,
      "Last Action": "9/03/2017 16:00"
    },
    {
      "Number": "I-260513",
      "State": "In progress",
      "Primary Engineer": "Beck Wim",
      "Responsible": "CC IS4U - Microsoft",
      "Priority": "P4 - Normal",
      "Title": "CS null melding",
      "Resubmission Date": "",
      "Response SLA State": 0,
      "Resolution SLA State": 0,
      "Last Change": "10/03/2017 9:54",
      "Creation Date": "10/01/2017 7:51",
      "Company Title": "IS4U - Infrax",
      "Company Class": "IS4U Customer",
      "Unread Emails": 0,
      "Actions": 6,
      "Last Action": "7/03/2017 13:43"
    },
    {
      "Number": "I-263058",
      "State": "Waiting For Customer",
      "Primary Engineer": "Peeters Yannick",
      "Responsible": "CC IS4U - CyberArk",
      "Priority": "P4 - Normal",
      "Title": "Bulk upload changes safe's Sharing properties",
      "Resubmission Date": "9/03/2017 15:00",
      "Response SLA State": 1,
      "Resolution SLA State": 0,
      "Last Change": "9/03/2017 15:00",
      "Creation Date": "8/02/2017 14:53",
      "Company Title": "IS4U - Materialise",
      "Company Class": "IS4U Customer",
      "Unread Emails": 0,
      "Actions": 7,
      "Last Action": "8/03/2017 11:45"
    },
    {
      "Number": "I-263063",
      "State": "Waiting For Customer",
      "Primary Engineer": "Peeters Yannick",
      "Responsible": "CC IS4U - CyberArk",
      "Priority": "P4 - Normal",
      "Title": "Not possible to move window between monitors",
      "Resubmission Date": "9/03/2017 15:00",
      "Response SLA State": 1,
      "Resolution SLA State": 0,
      "Last Change": "9/03/2017 15:00",
      "Creation Date": "8/02/2017 15:23",
      "Company Title": "IS4U - Materialise",
      "Company Class": "IS4U Customer",
      "Unread Emails": 0,
      "Actions": 8,
      "Last Action": "8/03/2017 11:49"
    },
    {
      "Number": "I-265102",
      "State": "Waiting For Customer",
      "Primary Engineer": "Verreth Jelle",
      "Responsible": "CC IS4U - CyberArk",
      "Priority": "P4 - Normal",
      "Title": "Crash of DR service",
      "Resubmission Date": "13/03/2017 11:00",
      "Response SLA State": 0,
      "Resolution SLA State": 0,
      "Last Change": "8/03/2017 12:09",
      "Creation Date": "8/03/2017 12:01",
      "Company Title": "IS4U - Materialise",
      "Company Class": "IS4U Customer",
      "Unread Emails": 0,
      "Actions": 1,
      "Last Action": "8/03/2017 12:04"
    }
  ];
  var _pieColumns = [];
  //var _elements = data.slice(0);
  var _elements = data;

  for(var _j = 0; _j < data.length; _j++){
      var cnt = 0;
      for(var _i = 0; _i < _elements.length; _i++){
        if(data[_j].Priority == _elements[_i].Priority){

                cnt++;

                var index = _elements.indexOf(_i);
                if(index > -1){
                  _elements.splice(index, 1);
                }
          }
    }
    if(cnt > 0){
      var newObject = new Object();
      console.log(cnt);
      newObject.Priority = data[_j].Priority;
      newObject.count = cnt;
      _pieColumns.push(newObject);
    }
  }
  return _pieColumns;
}



function convertChart(){
  var _Copy = loadData1();
  var _pieColumns = [];
  var _countChart = _Copy.length;

  for(var _i = 0; _i < _Copy.length; _i++){
    _pieColumns.push([ _Copy[_i].Priority + '', _Copy[_i].count]);
  }
  return {
  data: _pieColumns,
  countData: _countChart
  };
}


function convertChart2() {
 var _Copy = loadData1();
  var _pieColumns = [];
  var _countChart = _Copy.length;
  var _normal = [];
  var _high = [];
  var _medium = [];
  var _veryHigh = [];

  for (var _i = 0; _i < _Copy.length; _i++) {
    _pieColumns.push([_Copy[_i].Priority + '', _Copy[_i].count]);

    switch (_Copy[_i].Priority) {
      case 'P4 - Normal':
        _normal.push(_Copy[_i].count);
        break;
      case 'P2 - High':
        _high.push(_Copy[_i].count);
        break;
      case 'P3 - Medium':
        _medium.push(_Copy[_i].count);
        break;
      case 'P1 - Very high':
        _veryHigh.push(_Copy[_i].count);
        break;
    }

  }
  return {
    data: _pieColumns,
    countData: _countChart,
    normalPerc: (_normal.length / 26),
    highPerc: (_high.length / 26),
    mediumPerc: (_medium.length / 26),
    veryHighPerc: (_veryHigh.length / 26)

  };
}
