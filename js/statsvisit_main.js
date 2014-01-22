/**
 * @copyright: Coccoc Search Engine
 * @author: Nguyen Tuan Anh
 * @date: 5/24/13
 * @time: 4:57 PM
 */
(function($,win,doc){
	$(function(){
		var $tr1 = $('#tr1');
		var $tr2 = $('#tr2');
		var $step = $('#step');
		var $utm = $('#utm');
		var $frm  = $('#frm');
		var $table1 = $('#table1');
		var $table2 = $('#table2');
		var $tableUtm1 = $('#tableUtm1');
		var $tableUtm2 = $('#tableUtm2');
		var $btnRedraw = $('#btn-redraw');
		var $breadcrumb1 = $('ul.breadcrumb.timerange1');
		var $breadcrumb2 = $('ul.breadcrumb.timerange2');
		var dataTabe1 = $table1.dataTable();
		var dataTabe2 = $table2.dataTable();
		var dataTabeUtm1 = $tableUtm1.dataTable();
		var dataTabeUtm2 = $tableUtm2.dataTable();
		var UTM = ['utm_campaign','utm_source','utm_content','utm_medium'];


		var dataFromServer;
		var $myTab = $('#myTab');

		$myTab.find('a:first').tab('show');

		$tr1.add($tr2).daterangepicker({
			format: 'YYYY-MM-DD'
		});
		$tr1.add($tr2).attr('value', moment().subtract('days', 7).format('YYYY-MM-DD') + ' - ' + moment().format('YYYY-MM-DD'));

		var url = 'http://logstore1v.dev.itim.vn/cgi-bin/stat-separate-referers';
		var utm_url = 'http://logstore1v.dev.itim.vn/cgi-bin/get-utm-list';

		// Get data to select box
		$.ajax({
			type: 'get',
			url: utm_url,
			async: false,
			jsonpCallback: 'jsonDoc',
			contentType:'application/json',
			dataType: 'jsonp',
			success: function(json){
				var options ='<option value=""></option>';
				for(var i=0; i< json.length; i++){
					options+='<option value="utm_campaign='+json[i].utm_campaign+'&utm_source='+json[i].utm_source+'&utm_medium='+json[i].utm_medium+'">'+json[i].utm_campaign+'/'+json[i].utm_source+'/'+json[i].utm_medium+'</option>';
				}
				$utm.html(options);
			},
			error: function(e){
				console.log(e.message);
			}
		});

		// Form Action
		$frm.submit(function(e){
			e.preventDefault();
			$btnRedraw.button('loading');
			var param = $(this).serialize();
			if($utm.val() && $utm.val().trim()){
				param+='&'+$utm.val();
			}
			$.ajax({
				type: 'get',
				url: url,
				data: param,
				async: false,
				jsonpCallback: 'jsonDoc',
				contentType: "application/json",
				dataType: 'jsonp',
				success: function(json) {
					dataFromServer =json;
					dataTabe1.fnClearTable();
					dataTabe2.fnClearTable();
					updateDataDomain(json, 1, dataTabe1);
					updateDataDomain(json, 2, dataTabe2);

					dataTabeUtm1.fnClearTable();
					dataTabeUtm2.fnClearTable();

					updateDataUtm(json, 1, dataTabeUtm1);
					updateDataUtm(json, 2, dataTabeUtm2);

					$btnRedraw.button('reset');
				},
				error: function(e) {
					console.log(e.message);
				}
			});

		});
		var hasUtm = function(data, name, tr_index, prefix){
			var referers= getReferersByKey(data, name, tr_index);
			if(referers){
				for(var i =0; i< referers.big_referers.length; i++){
					if(referers.big_referers[i].name.indexOf(prefix)!==-1){
						return referers;
					}
				}
			}
			return null;
		};
		var updateDataUtm = function(data, tr_index, dataTable){
			var arr=[];
			var domains = data['tr'+tr_index].domains;
			var prefix ='utm_';
			for(var i =0; i< domains.length; i++){
				var refer = hasUtm(data, domains[i].name, tr_index, prefix);
				if(refer){
					var dt = buildDataFromReferers(refer,domains[i].name, true);
					arr = arr.concat(dt);
				}
			}
			// Fill total row
			var footerData = sumArrays(arr);
			var footerHtml = '<th scope="row">Total</th>';
			for(i=1; i< 5; i++){
				footerHtml+='<th scope="row">'+footerData[i]+'</th>';
			}
			$(dataTable[0]).find('tfoot tr:first').html(footerHtml);

			dataTable.fnClearTable();
			dataTable.fnAddData(arr);
		};
		var updateDataDomain = function(data, index, dataTable){
			var tr_index = 'tr'+ index;
			var domains = data[tr_index].domains;
			var totalTable = sumArrays(data[tr_index].total);

			var dataset = [],i,j;

			// Fill total row
			var footerHtml = '<th scope="row">Total</th>';
			for(i=0; i< totalTable.length; i++){
				footerHtml+='<th scope="row">'+totalTable[i]+'</th>';
			}

			if(data[tr_index].users_by_queries && data[tr_index].users_by_queries.length>0){
				var totalQueries = data[tr_index].users_by_queries;

				for(i=0; i< 4; i++){
					footerHtml+='<th scope="row">'+totalQueries[i]+'</th>';
				}
				footerHtml+='<th scope="row">'+totalQueries.sum(4)+'</th>';
				footerHtml+='<th scope="row">'+totalQueries.sum(1)+'</th>';
			}
			$(dataTable[0]).find('tfoot tr:first').html(footerHtml);

			// Add data
			for(i=0; i< domains.length; i++){
				var row = [];
				row.push(linkShortener(domains[i].name,20, true));
				var total = sumArrays(domains[i].total);
				for(j=0; j< total.length;j++ ){
					row.push(total[j]);
				}
				var users_by_queries;
				if(domains[i].users_by_queries)
					users_by_queries = domains[i].users_by_queries;
				var k=0;
				if(users_by_queries && users_by_queries.length>0){
					for(k=0; k< 4; k++){
						row.push(users_by_queries[k]);
					}
					row.push(users_by_queries.sum(4));
					row.push(users_by_queries.sum(1));
				}else{
					for(k=0; k< 6; k++){
						row.push('');
					}
				}

				dataset.push(row);
			}
			dataTable.fnAddData(dataset);
		};

		var buildDataFromReferers = function(referers,parent,isUtm){
			var dataset = [];
			for(var i=0; i< referers.big_referers.length; i++){
				var row=[];
				if(isUtm){
					var name = separateUtmName(referers.big_referers[i].name);
					if(name)
						row.push(parent+ ':  '+name);
					else
						continue;
				}
				else
					row.push(linkShortener(referers.big_referers[i].name,20));

				var total = sumArrays(referers.big_referers[i].data);
				for(j=0; j< total.length;j++ ){
					row.push(total[j]);
				}
				var users_by_queries;
				if(referers.big_referers[i].users_by_queries)
					users_by_queries =  referers.big_referers[i].users_by_queries;
				var k=0;
				if(users_by_queries && users_by_queries.length>0){
					for(k=0; k< 4; k++){
						row.push(users_by_queries[k]);
					}
					row.push(users_by_queries.sum(4));
					row.push(users_by_queries.sum(1));
				}else{
//					for(k=0; k< 6; k++){
//						row.push('');
//					}
				}

				dataset.push(row);
			}
			return dataset;
		};
		var updateDataReferer = function(referers, dataTable){
			var dataSet = buildDataFromReferers(referers);
//			var totalTable = sumArrays(referers.total);
			var users_by_queries = referers.users_by_queries;

			// Fill total row
			var footerData = sumArrays(dataSet);
			var footerHtml = '<th scope="row">Total</th>';
			for(i=1; i< 5; i++){
				footerHtml+='<th scope="row">'+footerData[i]+'</th>';
			}

			if(users_by_queries && users_by_queries.length>0){
				for(i=5; i< footerData.length-2 ; i++){
					footerHtml+='<th scope="row">'+footerData[i]+'</th>';
				}
				footerHtml+='<th scope="row">'+footerData.sum(4)+'</th>';
				footerHtml+='<th scope="row">'+footerData.sum(1)+'</th>';
			}
			dataTable.fnClearTable();
			$(dataTable[0]).find('tfoot tr:first').html(footerHtml);

			dataTable.fnAddData(dataSet);
		};

		var sumArrays = function(twoDimensionArr){
			var arr = twoDimensionArr.slice(0);
			if(arr.length<2)
				return arr[0];
			var temp = arr[0].slice(0);
			for(var i=1; i< arr.length; i++){
				for(var j=0; j< temp.length; j++){
					temp[j] = temp[j] + arr[i][j];
				}
			}
			return temp;
		};

		// Get referers
		var getReferersByKey = function (data, key, timeRangeIndex){
			var domains = data['tr'+timeRangeIndex].domains;
			for(var i=0; i< domains.length; i++){
				if(domains[i].name===key && domains[i].big_referers.length>0)
					return domains[i];
			}
			return null;
		};
		var linkShortener = function(text, max_length, hasChild){
			if(text.length<=max_length)
				return '<a '+(hasChild?'hasChild="haschild"':'')+' href="#">'+text+'</a>';
			else
				return '<a data-toggle="tooltip" title="" data-original-title="'+text+'" '+(hasChild?'hasChild="haschild"':'')+' href="#" title="'+text+'">'+text.substr(0, max_length-4)+'...</a>';
		};
		var separateUtmName = function(text){
			var name = [];
			var i;
			for(i=0; i< UTM.length; i++){
				name.push('');
			}

			var arr = text.split(';');
			for(i=1; i< arr.length; i++){
				var item = arr[i].trim().split('=');
				var index = UTM.indexOf(item[0].trim());
				if(index>-1)
					name[index]=item[1];
			}
			var value = '';
			for(i =0; i< name.length; i++){
				if(name[i])
					value+='<b>'+name[i]+'</b>' + ' / ';
			}
			return value;
		};
		dataTabe1.on('click','td a', function(e){
			e.preventDefault();
			var href = this.innerHTML;
			var hasChild = this.getAttribute('hasChild');
			var referers= getReferersByKey(dataFromServer,href, 1);
			if(referers && hasChild){
				dataTabe1.fnClearTable();
				updateDataReferer(referers,dataTabe1);

				$breadcrumb1.find('li:first-child').append('<span class="divider">/</span>');
				$breadcrumb1.append('<li class="active">'+href+'</li>')
			}else{
				alert('No data referer');
			}
		});
		dataTabe2.on('click','td a', function(e){
			e.preventDefault();
			var href = this.innerHTML;
			var hasChild = this.getAttribute('hasChild');
			var referers= getReferersByKey(dataFromServer,href, 2);
			if(referers && hasChild){
				dataTabe2.fnClearTable();
				updateDataReferer(referers,dataTabe2);

				$breadcrumb2.find('li:first-child').append('<span class="divider">/</span>');
				$breadcrumb2.append('<li class="active">'+href+'</li>')
			}else{
				alert('No data referer');
			}
		});

		$table1.add($table2).tooltip({
			selector:'a'
		});

		$breadcrumb1.find('a.parent').click(function(e){
			e.preventDefault();
			dataTabe1.fnClearTable();
			updateDataDomain(dataFromServer, 1, dataTabe1);
			$(this).siblings('span').remove();
			$(this).parent('li').siblings().remove();
		});
		$breadcrumb2.find('a.parent').click(function(e){
			e.preventDefault();
			dataTabe2.fnClearTable();
			updateDataDomain(dataFromServer, 2, dataTabe2);
			$(this).siblings('span').remove();
			$(this).parent('li').siblings().remove();
		});
	});
}(jQuery,window,document));