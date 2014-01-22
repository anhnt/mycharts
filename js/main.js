/**
 * @copyright: Coccoc Search Engine
 * @author: anhnt
 * @date: 5/24/13
 * @time: 4:57 PM
 */
(function($){
	$(function(){
		var $tr = $('#tr');
		var $step = $('#step');
		var $frm  = $('#frm');
		//var $chart = $('#charts');
		var $analystics = $('#analystics');
		var $analysticsRetention = $('#analystics-retention');
		var $statLocations = $('#stat-locations');
		var $clicksMetrics = $('#clicks-metrics');
		var $poiMetrics = $('#poi-metrics');
		var $btnRedraw = $('#btn-redraw');
		var $navPills = $('.nav-pills');
		var $loading = $('div.loading');
		var $scrollTop = $('div.scroll-top');

		var range;
		var dataFromServer = {};
		var counterLocations = [];

		$tr.daterangepicker({
				format: 'YYYY-MM-DD'
			},
			function(start, end) {
				range = CocChart.getRange(start, end, $step.val().trim());
			}
		);
		$tr.attr('value', moment().subtract('days', 28).format('YYYY-MM-DD') + ' - ' + moment().subtract('days', 1).format('YYYY-MM-DD'));

		var stat_user_retention_url = 'stat-user-retention';
		var stat_linear_metrics_url = 'stat-linear-metrics';
		var stat_locations_url = 'stat-locations';
		var stat_serp_clicks = 'stat-serp-clicks';



		$scrollTop.find('a').click(function(e){
			e.preventDefault();
			$htmlbody = $('html,body');
			$htmlbody.animate({scrollTop: 0}, "slow");
		});

		$frm.submit(function(e){
			e.preventDefault();

			// Force first tab selected
			//$navPills.find('li.parent:first-child').addClass('active').siblings('li.parent').removeClass('active');

			var startEnd = $tr.val().split(' - ');
			range = CocChart.getRange(startEnd[0], startEnd[1], $step.val().trim());

			var stepValue = $step.val().trim();
			if(stepValue>12){
				// Reset array
				dataFromServer.statUserRetention = new Array(range.shortDate.length);
				dataFromServer.statUserRetention2 = new Array(range.shortDate.length);
				dataFromServer.statLinearMetrics = new Array(range.shortDate.length);
				dataFromServer.statSerpClicks = new Array(range.shortDate.length);
			}else{
				// Reset array
				dataFromServer.statUserRetention = new Array(range.timeStamp.length);
				dataFromServer.statUserRetention2 = new Array(range.timeStamp.length);
				dataFromServer.statLinearMetrics = new Array(range.timeStamp.length);
				dataFromServer.statSerpClicks = new Array(range.timeStamp.length);
			}

			dataFromServer.statLocations = [];
			counterLocations = [];

			//Loading data
			dataFromServer = window.dataFromServer;
			var step = '&step='+stepValue+'&_=1370864077041';
			var stepRetention2 = '&step='+stepValue+'&mode=useLogRequest&_=1370864077041';
			var param;
			var action = $navPills.find('li.parent.active a').attr('data-chart');
			getCurrentAction(action,range);
// 			$.each(range.longDate, function(index, item){

// 				param = 'callback=jsonDoc&tr='+item+'+-+'+item+step;
// 				getDataResponse(stat_user_retention_url,param,
// 					function(data){
// 						var l = data.length;
// 						for(var j = 0; j< l; j++){
// 							dataFromServer.statUserRetention[index*l+j]=data[j];
// 						}
// //						if(action==='analystics' || action==='analystics-retention')
// 							getCurrentAction(action,range);
// 					});

// 				getDataResponse(stat_linear_metrics_url,param,
// 					function(data){
// 						var l = data.length;
// 						for(var j = 0; j< data.length; j++){
// 							dataFromServer.statLinearMetrics[index*l+j]=data[j];
// 						}
// //						if(action==='analystics' || action==='analystics-retention')
// 							getCurrentAction(action,range);
// 					});

// 				param = 'callback=jsonDoc&tr='+item+'+-+'+item+'&_=1370864077041';
// 				getDataResponse(stat_locations_url,param,
// 					function(data){
// 						for(var i=0; i< data.length; i++){
// 							pushToLocationArray(dataFromServer.statLocations,data[i]);
// 						}
// 						counterLocations.push(index);
// 						if(action==='stat-locations')
// 							getCurrentAction(action,range);
// 					});


// 				param = 'callback=jsonDoc&tr='+item+'+-+'+item+step;
// 				getDataResponse(stat_serp_clicks,param,
// 					function(data){
// 						var l = data.length;
// 						for(var j = 0; j< data.length; j++){
// 							dataFromServer.statSerpClicks[index*l+j]=data[j];
// 						}
// 						if(action==='poi-metrics')
// 							getCurrentAction(action,range);
// 					});

// 				param = 'callback=jsonDoc&tr='+item+'+-+'+item+stepRetention2;
// 				getDataResponse(stat_user_retention_url,param,
// 				function(data){
// 					var l = data.length;
// 					for(var j = 0; j< l; j++){
// 						dataFromServer.statUserRetention2[index*l+j]=data[j];
// 					}
// 						if(action==='analystics-retention')
// 							getCurrentAction(action,range);
// 				});
// 			});

		});
		// Reqwest setup code
		$.ajax.compat && $.ender({ ajax: $.ajax.compat });

		var getDataResponse = function(url, param, callback){
			$loading.removeClass('hide');
			$btnRedraw.button('loading');
			reqwest.compat({
				url: 'http://logstore1v.dev.itim.vn/cgi-bin/'+url
				,data: param
				, dataType: 'jsonp'
				, success: callback
			});
		};

		$navPills.find('a.child').click(function(e){
			e.preventDefault();
			var $this = $(this);
			var cgi = $this.attr('data-cgi');

			if(cgi==='stat-locations'){
				var typeIndex = $this.attr('data-stat');
				if(dataFromServer.statLocations.length>0){
					CocMaps.createMap(document.getElementById('mapview'),dataFromServer.statLocations,typeIndex);
					switch (parseInt(typeIndex)){
						case 2: $statLocations.find('h6').html('Queries count map'); break;
						case 3: $statLocations.find('h6').html('Homepage requests count map'); break;
						case 4: $statLocations.find('h6').html('Clicks count map'); break;
						default: break;
					}
				}
			}

			if(cgi==='stat-users-retention'|| cgi==='stat-linear-metrics' || cgi=='stat-serp-clicks'){
				var action = $this.attr('data-chart');
				var id = $this.parents('li.parent').find('a.dropdown-toggle').attr('data-chart');
				$htmlbody = $('html,body');
				$htmlbody.animate({
					scrollTop: $('#'+id).find('.chart[data-chart='+action+']').offset().top
				}, "slow");
			}

			$this.parent('li').addClass('active').siblings('li').removeClass('active');
			$this.parents('li.parent').siblings('li').find('ul li.active').removeClass('active');
		});

		$navPills.find('li.parent a').click(function(e){
			e.preventDefault();
			var $this = $(this);
			if(!$this.parent('li').hasClass('active')){
				var action = $this.attr('data-chart');
				getCurrentAction(action,range);
				$this.parent('li').addClass('active').siblings('li.parent').removeClass('active');
			}
		});

		// Process data for charts

		var proccessDataForUserRetentionChart = function(data){
			var arr = data.slice(0);
			var series =[
				{name:'First visit', data:[]},
				{name:'Second visit', data:[]},
				{name:'Third visit', data:[]},
				{name:'Fourth visit', data:[]},
				{name:'Fifth visit', data:[]},
				{name:'Sixth visit', data:[]},
				{name:'Seventh visit', data:[]}
			] ;

			for(var i = 0; i< arr.length; i++){
				for(var j=0; j< series.length; j++){
					series[j].data.push(arr[i][j][0]);
				}
			}
			return series;
		};

		var processDataForShareOfReturningVisitors = function(data){
			var arr = data.slice(0);
			var series = [], nr, nt;
			for(var i = 0; i < arr.length; i++){
				nr = CocChart.sumArrays(arr[i],1);
				nt = CocChart.sumArrays(arr[i]);
				if(nt[0]!==0)
					series.push(nr[0]/nt[0]*100);
				else
					series.push(0);
			}
			return [{name: 'Share of returning visitors', data:series}];
		};

		var processDataForQueriesPerUsers = function(data){
			var arr = data.slice(0);
			var series = [{name:'Queries per new users',data:[]},{name:'Queries per return users',data:[]}], _new, _return ;
			for(var i = 0; i < arr.length; i++){
				_new = CocChart.sumArrays(arr[i],0,1);
				_return = CocChart.sumArrays(arr[i],1);
				if (_new[0]!==0)
					series[0].data.push(_new[1]/_new[0]);
				else
					series[0].data.push(0);
				if (_return[0]!==0)
					series[1].data.push(_return[1]/_return[0]);
				else
					series[1].data.push(0);
			}
			return series;
		};

		var processDataForReturningVisitors = function(data){
			var arr = data.slice(0);
			var series =[
				{name:'Second visit', data:[]},
				{name:'Third visit', data:[]},
				{name:'Fourth visit', data:[]},
				{name:'>4 visit', data:[]}
			];
			for(var i = 1; i< arr.length; i++){
				for(var j=0; j< 3; j++){
					series[j].data.push(arr[i][j][0]);
				}
				series[3].data.push(CocChart.sumArrays(arr[i],5)[0]);
			}
			return series;
		};

		var processDataForQueriesAndClicks = function(data){
			var series = [
				{name: 'Queries', data: []},
				{name: 'Clicks', data: []},
				{name: 'utm_Queries', data: []}
			];
			var arr = data.slice(0);
			for(var i = 0; i < arr.length; i++){
				series[0].data.push(arr[i].queries);
				series[1].data.push(arr[i].clicks);
				series[2].data.push(arr[i].utms);
			}
			return series;
		};

		var processDataForClickShare = function(data){
			var arr = data.slice(0);
			var series = [
				{name: 'Click Share', data:[]}
			];
			for(var i = 0; i < arr.length; i++){
				if(arr[i].queries!==0)
					series[0].data.push(arr[i].clicks/arr[i].queries);
				else
					series[0].data.push(0);
			}
			return series;
		};

		var processDataForPOIQueries = function(data){
			var arr = data.slice(0);
			var series = [
				{name: 'POI exist', data:[]}
			];
			for(var i = 0; i < arr.length; i++){
				series[0].data.push(arr[i].PoiExist);
			}
			return series;
		};

		var processDataForPOIClicks = function(data){
			var arr = data.slice(0);
			var series = [
				{name: 'POItitleClick', data:[]},
				{name: 'ViewMapOfPoi', data:[]},
				{name: 'View360', data:[]}
			];
			for(var i = 0; i < arr.length; i++){
				series[0].data.push(arr[i].clickOnPoi);
				series[1].data.push(arr[i].viewMapOfPoi);
				series[2].data.push(arr[i].view360);
			}
			return series;
		};

		var processDataForMathQueries = function(data){
			var arr = data.slice(0);
			var series = [
				{name: 'MathQueries', data:[]}
			];
			for(var i = 0; i < arr.length; i++){
				series[0].data.push(arr[i].mathQueries);
			}
			return series;
		};

		var processDataForMathErrors = function(data){
			var arr = data.slice(0);
			var series = [
				{name: 'haveNoMathResult', data:[]},
				{name: 'mathSearcherTimeout ', data:[]}
			];
			for(var i = 0; i < arr.length; i++){
				series[0].data.push(arr[i].haveNoMathResult );
				series[1].data.push(arr[i].mathSearcherTimeout );
			}
			return series;
		};

		var processDataForClicksByPages = function(data){
			var arr = data.slice(0);
			var series = [
				{name: '1st page', data:[]},
				{name: '2nd page', data:[]},
				{name: '3rd page', data:[]},
				{name: '4th page', data:[]},
				{name: '5th page', data:[]},
				{name: '6th page', data:[]},
				{name: '7th page', data:[]},
				{name: '8th page', data:[]},
				{name: '9th page', data:[]},
				{name: '10th page', data:[]},
				{name: '>10 page', data:[]}
			];
			for(var i = 0; i < arr.length; i++){
				for(var j =0; j< 11; j++){
					if(arr[i].total_queries!==0)
						series[j].data.push(arr[i].clicks_by_pages[j]/arr[i].total_queries);
					else
						series[j].data.push(0);
				}
			}
			return series;
		};

		var processDataForClicksByPositions = function(data){
			var arr = data.slice(0);
			var series = [
				{name: '1st result', data:[]},
				{name: '2nd result', data:[]},
				{name: '3rd result', data:[]},
				{name: '4th result', data:[]},
				{name: '5th result', data:[]},
				{name: '6th result', data:[]},
				{name: '7th result', data:[]},
				{name: '8th result', data:[]},
				{name: '9th result', data:[]},
				{name: '10th result', data:[]},
				{name: '11th result', data:[]},
				{name: '12th result', data:[]},
				{name: '13th result', data:[]},
				{name: '14th result', data:[]},
				{name: '15th result', data:[]},
				{name: '16th result', data:[]},
				{name: '17th result', data:[]},
				{name: '18th result', data:[]},
				{name: '19th result', data:[]},
				{name: '20th result', data:[]},
				{name: '>20th result', data:[]}
			];
			for(var i = 0; i < arr.length; i++){
				for(var j =0; j< 21; j++){
					if(arr[i].total_queries!==0)
						series[j].data.push(arr[i].clicks_by_positions[j]/arr[i].total_queries);
					else
						series[j].data.push(0);
				}
			}
			return series;
		};

		var processDataForUnclickedQueries = function(data){
			var arr = data.slice(0);
			var tmp = [];
			for(var i = 0; i < arr.length; i++){
				tmp.push(arr[i].unclicked_queries);
			}
			return [{name:'Unclicked_queries', data: tmp}];
		};

		var processDataForUnclickedQueriesShare = function(data){
			var arr = data.slice(0);
			var tmp = [];
			for(var i = 0; i < arr.length; i++){
				if(arr[i].total_queries!==0)
					tmp.push(arr[i].unclicked_queries/arr[i].total_queries);
				else
					tmp.push(0);
			}
			return [{name:'Unclicked_queries share', data: tmp}];
		};

		var processDataForUnclickedQueries2 = function(data){
			var arr = data.slice(0);
			var tmp = [];
			for(var i = 0; i < arr.length; i++){
				tmp.push(arr[i].unclicked_2more_pages_queries);
			}
			return [{name:'Unclicked_queries 2', data: tmp}];
		};

		var processDataForUnclickedQueriesShare2 = function(data){
			var arr = data.slice(0);
			var tmp = [];
			for(var i = 0; i < arr.length; i++){
				if(arr[i].total_queries!==0)
					tmp.push(arr[i].unclicked_2more_pages_queries/arr[i].total_queries);
				else
					tmp.push(0);
			}
			return [{name:'Unclicked_queries 2 share', data: tmp}];
		};

		var processDataForFirstClickPosition = function(data){
			var arr = data.slice(0);
			var tmp = [];
			for(var i = 0; i < arr.length; i++){
				tmp.push(arr[i].first_click_position);
			}
			return [{name:'First click position', data: tmp}];
		};

		var processDataForFirstClickPositionDelay = function(data){
			var arr = data.slice(0);
			var tmp = [];
			for(var i = 0; i < arr.length; i++){
				tmp.push(arr[i].first_click_delay);
			}
			return [{name:'First click position delay', data: tmp}];
		};

		var processDataForLastClickPositionDelay = function(data){
			var arr = data.slice(0);
			var tmp = [];
			for(var i = 0; i < arr.length; i++){
				tmp.push(arr[i].last_click_delay);
			}
			return [{name:'Last click position delay', data: tmp}];
		};


		var processDataForOneClickQueriesShare = function(data){
			var arr = data.slice(0);
			var tmp = [];
			for(var i = 0; i < arr.length; i++){
				if(arr[i].total_queries!==0)
					tmp.push(arr[i].one_click_queries/arr[i].total_queries);
				else
					tmp.push(0);
			}
			return [{name:'One click Queries Share', data: tmp}];
		};

		var processDataForFastClickQueriesShare = function(data){
			var arr = data.slice(0);
			var tmp = [];
			for(var i = 0; i < arr.length; i++){
				if(arr[i].total_queries!==0)
					tmp.push(arr[i].fast_click_queries/arr[i].total_queries);
				else
					tmp.push(0);
			}
			return [{name:'Fast click queries share', data: tmp}];
		};

		var processDataForSlowClickQueriesShare = function(data){
			var arr = data.slice(0);
			var tmp = [];
			for(var i = 0; i < arr.length; i++){
				if(arr[i].total_queries!==0)
					tmp.push(arr[i].slow_click_queries/arr[i].total_queries);
				else
					tmp.push(0);
			}
			return [{name:'Slow click queries share', data: tmp}];
		};

		var processDataForFirstClickPositionPage1 = function(data){
			var arr = data.slice(0);
			var tmp = [];
			for(var i = 0; i < arr.length; i++){
				tmp.push(arr[i].first_click_pos_page1);
			}
			return [{name:'First click position page 1', data: tmp}];
		};

		var processDataForFirstClickDelayPage1 = function(data){
			var arr = data.slice(0);
			var tmp = [];
			for(var i = 0; i < arr.length; i++){
				tmp.push(arr[i].first_click_delay_page1);
			}
			return [{name:'First click delay page 1', data: tmp}];
		};


		// POI clicks tab

		var processDataForPOIQueries1 = function(data){
			var arr = data.slice(0);
			var series = [
				{name: 'POI exist', data:[]}
			];
			for(var i = 0; i < arr.length; i++){
				series[0].data.push(arr[i].poi_exist_queries);
			}
			return series;
		};

		var processDataForTotalClicksOnPOIqueries = function(data){
			var arr = data.slice(0);
			var tmp = [];
			for(var i = 0; i < arr.length; i++){
				tmp.push(arr[i].poi_exist_any_poi_clicks_queries);
			}
			return [{name:'Total clicks on POI queries', data: tmp}];
		};

		var processDataForPOIclicksShare = function(data){
			var arr = data.slice(0);
			var tmp = [];
			for(var i = 0; i < arr.length; i++){
				var n1 = arr[i].poi_exist_any_poi_clicks_queries;
				var n2 = arr[i].poi_exist_queries;
				if(n2!==0)
					tmp.push(n1/n2*100);
				else
					tmp.push(0);
			}
			return [{name:'POI clicks share (CTR)', data: tmp}];
		};

		var processDataForElementsCTR = function(data){
			var arr = data.slice(0);
			var tmp = [];
			for(var i = 0; i < arr.length; i++){
				if(arr[i].TotalPoiClicks!==0)
					tmp.push(arr[i].view360 / arr[i].poi_exist_any_poi_clicks_queries);
				else
					tmp.push(0);
			}
			return [{name:'POI clicks share (CTR)', data: tmp}];
		};

		var proccessDataForUnclickedPOIshare = function(data){
			var arr = data.slice(0);
			var tmp = [
				{name:'NoClicks',data:[]},
				{name:'OnlyPicClicks',data:[]},
				{name:'OnlySerpClicks',data:[]},
				{name:'NoSerpClicks',data:[]}
			];
			for(var i = 0; i < arr.length; i++){
				if(arr[i].PoiExist!==0){
					tmp[0].data.push(arr[i].poi_exist_no_any_clicks_queries / arr[i].poi_exist_queries);
					tmp[1].data.push(arr[i].poi_exist_only_pic_zoom_in_clicks_queries / arr[i].poi_exist_queries);
					tmp[2].data.push(arr[i].poi_exist_only_search_result_clicks_queries / arr[i].poi_exist_queries);
					tmp[3].data.push(arr[i].poi_exist_only_poi_clicks_queries / arr[i].poi_exist_queries);
				}else{
					tmp[0].data.push(0);
					tmp[1].data.push(0);
					tmp[2].data.push(0);
					tmp[3].data.push(0);
				}
			}
			return tmp;
		};

		// Array manipulating

		var pushToLocationArray = function(array,item){
			var exist = false;
			for(var i=0; i < array.length; i++){
				if(array[i][0]===item[0] && array[i][1]===item[1]){
					array[i][2]+=item[2];
					array[i][3]+=item[3];
					array[i][4]+=item[4];
					exist = true;
					break;
				}
			}
			if(!exist)
				array.push(item);
		};

		var isArrayLoaded = function(arr){
			var myArr = arr.slice(0);
			var ret = true;
			for(var i =0; i< myArr.length; i++){
				if(myArr[i]===undefined){
					ret = false;
					break;
				}
			}
			return ret;
		};

		var addButton = function(chart){
			var container = $(chart.container).parent();
			var button = $('<a href="#" class="btn pull-right">Hide all series</a>');
			button.on('click', function(e){
				e.preventDefault();
				var $this = $(this);
				var series = chart.series;
				if($this.html()==='Hide all series'){
					for(var i = 0; i < series.length; i++){
						series[i].hide();
					}
					$this.html('Show all series');
				}else if($this.html()==='Show all series'){
					for(var i = 0; i < series.length; i++){
						series[i].show();
					}
					$this.html('Hide all series');
				}
			});
			container.append(button);
		};

		var getCurrentAction = function(action,range){
			var step = $step.val().trim();
			var skip = 24/step*2;
			var series;
			var isCurrent = $('a[data-chart='+action+']').parent().hasClass('active');
			switch (action){
				case 'analystics':
					// Draw all retention charts
					if (isArrayLoaded(dataFromServer.statUserRetention) && isArrayLoaded(dataFromServer.statLinearMetrics)) {
						$analystics.siblings().fadeOut();
						if(!isCurrent){
							$analystics.fadeIn();
						}
						if (step > 12) {
							series = proccessDataForUserRetentionChart(dataFromServer.statUserRetention);
							CocChart.drawStackedChart('user-retention-chart', $analystics, range.shortDate, series, 'User retention chart', 'Visitors');

							series = processDataForShareOfReturningVisitors(dataFromServer.statUserRetention);
							CocChart.drawColumnChart('share-of-return-users', $analystics, range.shortDate, series, 'Share of Returning Visitors', 'Percent','{point.y:.2f}',null,'%');

							series = processDataForQueriesPerUsers(dataFromServer.statUserRetention);
							CocChart.drawLineChart('queries-per-user', $analystics, range.shortDate, series, 'Queries per users chart', 'Queries', '{point.y:.2f}');

							series = processDataForQueriesAndClicks(dataFromServer.statLinearMetrics);
							CocChart.drawLineChart('queries-and-click', $analystics, range.shortDate, series, 'Queries and Clicks', '', '{point.y:.0f}');

							series = processDataForClickShare(dataFromServer.statLinearMetrics);
							CocChart.drawLineChart('clicks-share', $analystics, range.shortDate, series, 'Clicks share', '', '{point.y:.2f}');

							series = processDataForPOIQueries(dataFromServer.statLinearMetrics);
							CocChart.drawLineChart('poi-queries', $analystics, range.shortDate, series, 'POI Queries', '', '{point.y:.0f}');

							series = processDataForPOIClicks(dataFromServer.statLinearMetrics);
							CocChart.drawLineChart('poi-clicks', $analystics, range.shortDate, series, 'POI Clicks', '', '{point.y:.0f}');

							series = processDataForMathQueries(dataFromServer.statLinearMetrics);
							CocChart.drawLineChart('math-queries', $analystics, range.shortDate, series, 'Math Queries', '', '{point.y:.0f}');

							series = processDataForMathErrors(dataFromServer.statLinearMetrics);
							CocChart.drawLineChart('math-errors', $analystics, range.shortDate, series, 'Math Errors', '', '{point.y:.0f}');
						} else {
							series = proccessDataForUserRetentionChart(dataFromServer.statUserRetention);
							CocChart.drawStackedChart('user-retention-chart', $analystics, range.timeStamp, series, 'User retention chart', 'Visitors', skip);

							series = processDataForShareOfReturningVisitors(dataFromServer.statUserRetention);
							CocChart.drawColumnChart('share-of-return-users', $analystics, range.timeStamp, series, 'Share of Returning Visitors', 'Percent','{point.y:.2f}', skip, '%');

							series = processDataForQueriesPerUsers(dataFromServer.statUserRetention);
							CocChart.drawLineChart('queries-per-user', $analystics, range.timeStamp, series, 'Queries per users chart', 'Queries', '{point.y:.2f}', skip);

							series = processDataForQueriesAndClicks(dataFromServer.statLinearMetrics);
							CocChart.drawLineChart('queries-and-click', $analystics, range.timeStamp, series, 'Queries and Clicks', '', '{point.y:.0f}', skip);

							series = processDataForClickShare(dataFromServer.statLinearMetrics);
							CocChart.drawLineChart('clicks-share', $analystics, range.timeStamp, series, 'Clicks share', '', '{point.y:.2f}', skip);

							series = processDataForPOIQueries(dataFromServer.statLinearMetrics);
							CocChart.drawLineChart('poi-queries', $analystics, range.timeStamp, series, 'POI Queries', '', '{point.y:.0f}', skip);

							series = processDataForPOIClicks(dataFromServer.statLinearMetrics);
							CocChart.drawLineChart('poi-clicks', $analystics, range.timeStamp, series, 'POI Clicks', '', '{point.y:.0f}', skip);

							series = processDataForMathQueries(dataFromServer.statLinearMetrics);
							CocChart.drawLineChart('math-queries', $analystics, range.timeStamp, series, 'Math Queries', '', '{point.y:.0f}', skip);

							series = processDataForMathErrors(dataFromServer.statLinearMetrics);
							CocChart.drawLineChart('math-errors', $analystics, range.timeStamp, series, 'Math Errors', '', '{point.y:.0f}', skip);

						}
						// Reset loading
						$btnRedraw.button('reset');
						$loading.addClass('hide');
					}
					break;
				case 'analystics-retention':
					if (isArrayLoaded(dataFromServer.statUserRetention) && isArrayLoaded(dataFromServer.statLinearMetrics) && isArrayLoaded(dataFromServer.statUserRetention2)) {
						$analysticsRetention.siblings().fadeOut();
						if(!isCurrent){
							$analysticsRetention.fadeIn();
						}
						if (step > 12) {

							series = proccessDataForUserRetentionChart(dataFromServer.statUserRetention);
							CocChart.drawStackedChart('user-retention-chart',$analysticsRetention, range.shortDate, series,'User retention chart','Visitors');

							series = processDataForShareOfReturningVisitors(dataFromServer.statUserRetention);
							CocChart.drawColumnChart('share-of-return-users', $analysticsRetention, range.shortDate, series,'Share of Returning Visitors','Percent','{point.y:.2f}',null,'%');

							series = processDataForReturningVisitors(dataFromServer.statUserRetention);
							CocChart.drawLineChart('returning-visitor', $analysticsRetention, range.shortDate, series,'Returning visitors','Visitors','{point.y:.0f}');

							series = processDataForQueriesPerUsers(dataFromServer.statUserRetention);
							CocChart.drawLineChart('queries-per-user', $analysticsRetention, range.shortDate, series,'Queries per users chart','Queries','{point.y:.2f}');

							// For second chart
							series = proccessDataForUserRetentionChart(dataFromServer.statUserRetention2);
							CocChart.drawStackedChart('user-retention-chart2nd',$analysticsRetention, range.shortDate, series,'User retention chart 2','Visitors');

							series = processDataForShareOfReturningVisitors(dataFromServer.statUserRetention2);
							CocChart.drawColumnChart('share-of-return-users2nd', $analysticsRetention, range.shortDate, series,'Share of Returning Visitors 2','Percent','{point.y:.2f}',null,'%');

							series = processDataForReturningVisitors(dataFromServer.statUserRetention2);
							CocChart.drawLineChart('returning-visitor2nd', $analysticsRetention, range.shortDate, series,'Returning visitors 2','Visitors','{point.y:.0f}');

							series = processDataForQueriesPerUsers(dataFromServer.statUserRetention2);
							CocChart.drawLineChart('queries-per-user2nd', $analysticsRetention, range.shortDate, series,'Queries per users chart 2','Queries','{point.y:.2f}');

						} else {

							series = proccessDataForUserRetentionChart(dataFromServer.statUserRetention);
							CocChart.drawStackedChart('user-retention-chart',$analysticsRetention, range.timeStamp, series,'User retention chart','Visitors',skip);

							series = processDataForShareOfReturningVisitors(dataFromServer.statUserRetention);
							CocChart.drawColumnChart('share-of-return-users', $analysticsRetention, range.timeStamp, series,'Share of Returning Visitors','Percent','{point.y:.2f}',skip,'%');

							series = processDataForReturningVisitors(dataFromServer.statUserRetention);
							CocChart.drawLineChart('returning-visitor', $analysticsRetention, range.timeStamp, series,'Returning visitors','Visitors','{point.y:.0f}',skip);

							series = processDataForQueriesPerUsers(dataFromServer.statUserRetention);
							CocChart.drawLineChart('queries-per-user', $analysticsRetention, range.timeStamp, series,'Queries per users chart','Queries','{point.y:.2f}',skip);

							// For second chart
							series = proccessDataForUserRetentionChart(dataFromServer.statUserRetention2);
							CocChart.drawStackedChart('user-retention-chart2nd',$analysticsRetention, range.timeStamp, series,'User retention chart 2','Visitors',skip);

							series = processDataForShareOfReturningVisitors(dataFromServer.statUserRetention2);
							CocChart.drawColumnChart('share-of-return-users2nd', $analysticsRetention, range.timeStamp, series,'Share of Returning Visitors 2','Percent','{point.y:.2f}',skip,'%');

							series = processDataForReturningVisitors(dataFromServer.statUserRetention2);
							CocChart.drawLineChart('returning-visitor2nd', $analysticsRetention, range.timeStamp, series,'Returning visitors 2','Visitors','{point.y:.0f}',skip);

							series = processDataForQueriesPerUsers(dataFromServer.statUserRetention2);
							CocChart.drawLineChart('queries-per-user2nd', $analysticsRetention, range.timeStamp, series,'Queries per users chart 2','Queries','{point.y:.2f}',skip);
						}
						// Reset loading
						$btnRedraw.button('reset');
						$loading.addClass('hide');
					}
					break;
				case 'stat-locations':
					$statLocations.siblings().fadeOut();
					if(!isCurrent){
						$statLocations.fadeIn();
					}
					if(counterLocations.length===range.longDate.length){
						var li = $('a.child[data-cgi=stat-locations]').parent('li.active');
						var currentMap;
						if(li.length>0)
							currentMap = li.find('a').attr('data-stat');
						if(!currentMap)
							$statLocations.find('h6').html('Queries count map');
						CocMaps.createMap(document.getElementById('mapview'),dataFromServer.statLocations,currentMap?parseInt(currentMap):2);
						// Reset loading
						$btnRedraw.button('reset');
						$loading.addClass('hide');
					}
					break;
				case 'clicks-metrics':
					if(isArrayLoaded(dataFromServer.statSerpClicks) && isArrayLoaded(dataFromServer.statLinearMetrics) && isArrayLoaded(dataFromServer.statUserRetention)){
						$clicksMetrics.siblings().fadeOut();
						if(!isCurrent){
							$clicksMetrics.fadeIn();
						}
						if (step > 12) {
							series = processDataForQueriesAndClicks(dataFromServer.statLinearMetrics);
							CocChart.drawLineChart('queries-and-click', $clicksMetrics, range.shortDate, series, 'Queries and Clicks', '', '{point.y:.0f}');

							series = processDataForClickShare(dataFromServer.statLinearMetrics);
							CocChart.drawLineChart('clicks-share', $clicksMetrics, range.shortDate, series, 'Clicks share', '', '{point.y:.2f}');

							series = processDataForQueriesPerUsers(dataFromServer.statUserRetention);
							CocChart.drawLineChart('queries-per-user', $clicksMetrics, range.shortDate, series, 'Queries per users chart', 'Queries', '{point.y:.2f}');

							series = processDataForClicksByPages(dataFromServer.statSerpClicks);
							CocChart.drawStackedAreaChart('clicks-by-pages',$clicksMetrics,range.shortDate, series, 'Clicks by pages', '','{point.y:.4f}', null, addButton);

							series = processDataForClicksByPositions(dataFromServer.statSerpClicks);
							CocChart.drawStackedAreaChart('clicks-by-positions',$clicksMetrics,range.shortDate, series, 'Clicks by positions','','{point.y:.4f}',null,addButton);

							series = processDataForUnclickedQueries(dataFromServer.statSerpClicks);
							CocChart.drawLineChart('Unclicked_queries',$clicksMetrics, range.shortDate, series, 'Unclicked queries', 'queries','{point.y:.0f}');

							series = processDataForUnclickedQueriesShare(dataFromServer.statSerpClicks);
							CocChart.drawColumnChart('Unclicked_queries_share',$clicksMetrics, range.shortDate, series, 'Unclicked queries share', '','{point.y:.2f}',null,'');

							series = processDataForUnclickedQueries2(dataFromServer.statSerpClicks);
							CocChart.drawLineChart('Unclicked_queries2',$clicksMetrics, range.shortDate, series, 'Unclicked queries 2', 'queries','{point.y:.0f}');

							series = processDataForUnclickedQueriesShare2(dataFromServer.statSerpClicks);
							CocChart.drawColumnChart('Unclicked_queries_share2',$clicksMetrics, range.shortDate, series, 'Unclicked queries share 2', '','{point.y:.2f}',null, '');

							series = processDataForFirstClickPosition(dataFromServer.statSerpClicks);
							CocChart.drawLineChart('First-click-position',$clicksMetrics, range.shortDate, series, 'First click position', '','{point.y:.0f}');

							series = processDataForFirstClickPositionDelay(dataFromServer.statSerpClicks);
							CocChart.drawLineChart('First-click-position-delay',$clicksMetrics, range.shortDate, series, 'First click position delay', '','{point.y:.0f}');

							series = processDataForLastClickPositionDelay(dataFromServer.statSerpClicks);
							CocChart.drawLineChart('Last-click-position-delay',$clicksMetrics, range.shortDate, series, 'Last click position delay', '', '{point.y:.0f}');

							series = processDataForOneClickQueriesShare(dataFromServer.statSerpClicks);
							CocChart.drawColumnChart('One-click-queries-share',$clicksMetrics, range.shortDate, series, 'One click queries share', '', '{point.y:.2f}',null,'');

							series = processDataForFastClickQueriesShare(dataFromServer.statSerpClicks);
							CocChart.drawColumnChart('Fast-click-queries-share',$clicksMetrics, range.shortDate, series, 'Fast click queries share', '', '{point.y:.2f}',null,'');

							series = processDataForSlowClickQueriesShare(dataFromServer.statSerpClicks);
							CocChart.drawColumnChart('Slow-click-queries-share',$clicksMetrics, range.shortDate, series, 'Slow click queries share', '', '{point.y:.2f}',null,'');

							series = processDataForFirstClickPositionPage1(dataFromServer.statSerpClicks);
							CocChart.drawLineChart('First-click-position-page1',$clicksMetrics, range.shortDate, series, 'First click position page 1', '','{point.y:.0f}');

							series = processDataForFirstClickDelayPage1(dataFromServer.statSerpClicks);
							CocChart.drawLineChart('First-click-delay-page1',$clicksMetrics, range.shortDate, series, 'First click delay page 1', '','{point.y:.0f}');
						}
						else{
							series = processDataForQueriesAndClicks(dataFromServer.statLinearMetrics);
							CocChart.drawLineChart('queries-and-click', $clicksMetrics, range.timeStamp, series, 'Queries and Clicks', '', '{point.y:.0f}',skip);

							series = processDataForClickShare(dataFromServer.statLinearMetrics);
							CocChart.drawLineChart('clicks-share', $clicksMetrics, range.timeStamp, series, 'Clicks share', '', '{point.y:.2f}',skip);

							series = processDataForQueriesPerUsers(dataFromServer.statUserRetention);
							CocChart.drawLineChart('queries-per-user', $clicksMetrics, range.timeStamp, series, 'Queries per users chart', 'Queries', '{point.y:.2f}',skip);

							series = processDataForClicksByPages(dataFromServer.statSerpClicks);
							CocChart.drawStackedAreaChart('clicks-by-pages',$clicksMetrics, range.timeStamp, series, 'Clicks by pages', '','{point.y:.4f}',skip, addButton);

							series = processDataForClicksByPositions(dataFromServer.statSerpClicks);
							CocChart.drawStackedAreaChart('clicks-by-positions',$clicksMetrics,range.timeStamp, series, 'Clicks by positions', '','{point.y:.4f}', skip, addButton);

							series = processDataForUnclickedQueries(dataFromServer.statSerpClicks);
							CocChart.drawLineChart('Unclicked_queries',$clicksMetrics, range.timeStamp, series, 'Unclicked queries', 'queries','{point.y:.0f}',skip);

							series = processDataForUnclickedQueriesShare(dataFromServer.statSerpClicks);
							CocChart.drawColumnChart('Unclicked_queries_share',$clicksMetrics, range.timeStamp, series, 'Unclicked queries share', '','{point.y:.2f}',skip,'');

							series = processDataForUnclickedQueries2(dataFromServer.statSerpClicks);
							CocChart.drawLineChart('Unclicked_queries2',$clicksMetrics, range.timeStamp, series, 'Unclicked queries 2', 'queries','{point.y:.0f}',skip);

							series = processDataForUnclickedQueriesShare2(dataFromServer.statSerpClicks);
							CocChart.drawColumnChart('Unclicked_queries_share2',$clicksMetrics, range.timeStamp, series, 'Unclicked queries share 2', '','{point.y:.2f}',skip, '');

							series = processDataForFirstClickPosition(dataFromServer.statSerpClicks);
							CocChart.drawLineChart('First-click-position',$clicksMetrics, range.timeStamp, series, 'First click position', '','{point.y:.0f}', skip);

							series = processDataForFirstClickPositionDelay(dataFromServer.statSerpClicks);
							CocChart.drawLineChart('First-click-position-delay',$clicksMetrics, range.timeStamp, series, 'First click position delay', '','{point.y:.0f}', skip);

							series = processDataForLastClickPositionDelay(dataFromServer.statSerpClicks);
							CocChart.drawLineChart('Last-click-position-delay',$clicksMetrics, range.shortDate, series, 'Last click position delay', '', '{point.y:.0f}', skip);

							series = processDataForOneClickQueriesShare(dataFromServer.statSerpClicks);
							CocChart.drawColumnChart('One-click-queries-share',$clicksMetrics, range.shortDate, series, 'One click queries share', '', '{point.y:.2f}', skip, '');

							series = processDataForFastClickQueriesShare(dataFromServer.statSerpClicks);
							CocChart.drawColumnChart('Fast-click-queries-share',$clicksMetrics, range.shortDate, series, 'Fast click queries share', '', '{point.y:.2f}', skip, '');

							series = processDataForSlowClickQueriesShare(dataFromServer.statSerpClicks);
							CocChart.drawColumnChart('Slow-click-queries-share',$clicksMetrics, range.shortDate, series, 'Slow click queries share', '', '{point.y:.2f}', skip, '');

							series = processDataForFirstClickDelayPage1(dataFromServer.statSerpClicks);
							CocChart.drawLineChart('First-click-delay-page1',$clicksMetrics, range.timeStamp, series, 'First click delay page 1', '','{point.y:.0f}', skip);

							series = processDataForFirstClickPositionPage1(dataFromServer.statSerpClicks);
							CocChart.drawLineChart('First-click-position-page1',$clicksMetrics, range.timeStamp, series, 'First click position page 1', '','{point.y:.0f}', skip);

						}

						// Reset loading
						$btnRedraw.button('reset');
						$loading.addClass('hide');
					}
					break;
				case 'poi-metrics':
					if(isArrayLoaded(dataFromServer.statSerpClicks)){
						$poiMetrics.siblings().fadeOut();
						if(!isCurrent){
							$poiMetrics.fadeIn();
						}
						if (step > 12) {

							series = processDataForPOIQueries1(dataFromServer.statSerpClicks);
							CocChart.drawLineChart('poi-queries', $poiMetrics, range.shortDate, series, 'POI Queries', '', '{point.y:.0f}');

							series = processDataForTotalClicksOnPOIqueries(dataFromServer.statSerpClicks);
							CocChart.drawLineChart('Clicked-POI-queries', $poiMetrics, range.shortDate, series, 'Clicked POI queries', '', '{point.y:.0f}');

							series = processDataForPOIclicksShare(dataFromServer.statSerpClicks);
							CocChart.drawLineChart('POI-clicks-share', $poiMetrics, range.shortDate, series, 'POI clicks share (CTR)', '', '{point.y:.2f}');

							series = processDataForElementsCTR(dataFromServer.statSerpClicks);
							CocChart.drawLineChart('Elements-CTR', $poiMetrics, range.shortDate, series, 'Elements CTR', '', '{point.y:.2f}');

							series = proccessDataForUnclickedPOIshare(dataFromServer.statSerpClicks);
							CocChart.drawStackedChart('Unclicked-POI-share',$poiMetrics, range.shortDate, series,'Unclicked POI share','Visitors',null,'{point.y:.2f}');

						}else{

							series = processDataForPOIQueries1(dataFromServer.statSerpClicks);
							CocChart.drawLineChart('poi-queries', $poiMetrics, range.timeStamp, series, 'POI Queries', '', '{point.y:.0f}',skip);

							series = processDataForTotalClicksOnPOIqueries(dataFromServer.statSerpClicks);
							CocChart.drawLineChart('Clicked-POI-queries', $poiMetrics, range.timeStamp, series, 'Clicked POI queries', '', '{point.y:.0f}',skip);

							series = processDataForPOIclicksShare(dataFromServer.statSerpClicks);
							CocChart.drawLineChart('POI-clicks-share', $poiMetrics, range.timeStamp, series, 'POI clicks share (CTR)', '', '{point.y:.2f}', skip);

							series = processDataForElementsCTR(dataFromServer.statSerpClicks);
							CocChart.drawLineChart('Elements-CTR', $poiMetrics, range.timeStamp, series, 'Elements CTR', '', '{point.y:.2f}', skip);

							series = proccessDataForUnclickedPOIshare(dataFromServer.statSerpClicks);
							CocChart.drawStackedChart('Unclicked-POI-share',$poiMetrics, range.timeStamp, series,'Unclicked POI share','Visitors',skip,'{point.y:.2f}');
						}
					}
					break;
				default: break;
			}
		};

		$frm.trigger('submit');
	});
}(jQuery));