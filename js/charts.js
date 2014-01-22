/**
 * @copyright: Coccoc search engine
 * @author: Nguyen Tuan Anh
 * @date: 6/7/13
 * @time: 9:51 AM
 */

var CocChart = CocChart || {};
(function($){
	CocChart.drawStackedChart = function(chartname, container, categories, series, title, yTitle, step, hasFormat){
	var chart = container.find('div.chart[data-chart='+chartname+']').first();
	if(chart.length<1)
		chart = $('<div class="chart">').attr('data-chart',chartname).appendTo(container);
	chart.highcharts({
		credits: {
			enabled: false
		},
		chart: {
			type: 'column'
		},
		title: {
			text: title
		},
		xAxis: {
			categories:categories,
			labels: {
				step: step?step:2
			}
		},
		yAxis: {
			min: 0,
			title: {
				text: yTitle
			},
			stackLabels: {
				enabled: false,
				style: {
					fontWeight: 'bold',
					color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
				}
			}
		},
		legend: {
			align: 'right',
			x: -100,
			verticalAlign: 'top',
			y: 20,
			floating: true,
			backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColorSolid) || 'white',
			borderColor: '#CCC',
			borderWidth: 1,
			shadow: true
		},
		tooltip: {
			formatter: function() {
				return  (this.x?'<b>'+ this.x+'</b><br/>':'')+
					this.series.name +': '+ (hasFormat?Highcharts.numberFormat(this.y,2):this.y) +'<br/>'+
					'Total: '+ (hasFormat?Highcharts.numberFormat(this.point.stackTotal,2):this.point.stackTotal);
			}
		},
		plotOptions: {
			column: {
				stacking: 'normal',
				dataLabels: {
					enabled: false,
					color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
				}
			}
		},
		series:series
	});
};

CocChart.drawColumnChart = function(chartname, container, categories, series, title, yTitle, format, step, tooltipUnit){
	var chart = container.find('.chart[data-chart='+chartname+']').first();
	if(chart.length<1)
		chart = $('<div class="chart">').attr('data-chart',chartname).appendTo(container);
	chart.highcharts({
		credits: {
			enabled: false
		},
		chart: {
			type: 'column'
		},
		title: {
			text: title
		},
		subtitle: {
			text: ''
		},
		xAxis: {
			categories:categories,
			labels: {
				step: step?step:2
			}
		},
		yAxis: {
			min: 0,
			title: {
				text: yTitle
			}
		},
		tooltip: {
			headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
			pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
				'<td style="padding-left:5px"><b>'+format+tooltipUnit+'</b></td></tr>',
			footerFormat: '</table>',
			shared: true,
			useHTML: true
		},
		plotOptions: {
			column: {
				pointPadding: 0.2,
				borderWidth: 0
			}
		},
		series: series
	});

};

CocChart.drawLineChart = function(chartname, container, categories, series, title, yTitle, format, step){
	var chart = container.find('.chart[data-chart='+chartname+']').first();
	if(chart.length<1)
		chart = $('<div class="chart">').attr('data-chart',chartname).appendTo(container);
	chart.highcharts({
		credits: {
			enabled: false
		},
		chart: {
			type: 'line',
			marginBottom: 100
		},
		title: {
			text: title,
			x: -20 //center
		},
		subtitle: {
			text: '',
			x: -20
		},
		xAxis: {
			categories: categories,
			labels: {
				step:  step?step:2
			}
		},
		yAxis: {
			title: {
				text: yTitle
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}]
		},
		tooltip: {
			headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
			pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
				'<td style="padding-left:5px"><b>'+format+'</b></td></tr>',
			footerFormat: '</table>',
			shared: true,
			useHTML: true
		},
		legend: {
			layout: 'horizontal',
			align: 'top',
			verticalAlign: 'top',
			x: 0,
			y: 100,
			borderWidth: 0
		},
		series: series
	});
};

CocChart.drawStackedAreaChart = function(chartname, container, categories, series, title, yTitle,format, step, callback){
	var chart = container.find('.chart[data-chart='+chartname+']').first();
	if(chart.length<1)
		chart = $('<div class="chart">').attr('data-chart',chartname).appendTo(container);
	chart.highcharts({
		credits: {
			enabled: false
		},
		chart: {
			type: 'area'
		},
		title: {
			text: title
		},
		subtitle: {
			text: ''
		},
		xAxis: {
			categories: categories,
			tickmarkPlacement: 'on',
			title: {
				enabled: false
			},
			labels: {
				step: step?step:2
			}
		},
		yAxis: {
			title: {
				text: yTitle
			}
		},
		tooltip: {
			shared: true,
			pointFormat: '{series.name}: <b>'+format+'</b><br/>'
		},
		plotOptions: {
			area: {
				stacking: 'normal',
				lineColor: '#666666',
				lineWidth: 1,
				marker: {
					lineWidth: 1,
					lineColor: '#666666'
				}
			}
		},
		series:series
	}, callback);
};

CocChart.sumArrays = function(twoDimensionArr, start, end){
	var arr = twoDimensionArr.slice(0);
	if(arr.length<2)
		return arr[0];
	var temp;
	if(!start){
		temp = arr[0].slice(0);
		start = 1;
	}else{
		temp = arr[start].slice(0);
		start++;
	}
	if(!end)
		end = arr.length;
	for(var i=start; i< end; i++){
		for(var j=0; j< temp.length; j++){
			temp[j] = temp[j] + arr[i][j];
		}
	}
	return temp;
};

CocChart.getRange = function(start, end, step){
	var range={shortDate:[], longDate:[],date:[], timeStamp:[]}, itr;
	itr = moment(start).twix(end).iterate('days');

	while(itr.hasNext()){
		var mnt = itr.next();
		range.longDate.push(mnt.format('YYYY-MM-DD'));
		range.shortDate.push(mnt.format('MM/DD/YY'));
		range.date.push(mnt.format('MM/DD/YY')+' 00:00');
	}
	if(step<24){
		var period = 24/step;
		for(var i = 0; i< range.date.length; i++){
			for(var j =0; j< period; j++){
				range.timeStamp.push(moment(range.date[i]).add('hours',step*j).format('MM/DD/YY HH:mm'));
			}
		}
	}
	return range;
};
}(window.jQuery));