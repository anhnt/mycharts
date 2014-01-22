/**
 * @copyright: Coccoc search engine
 * @author: Nguyen Tuan Anh
 * @date: 6/20/13
 * @time: 4:01 PM
 */
var CocMaps = CocMaps || {};
(function(){
	CocMaps.createMap = function(container, data, typeIndex){
		var self = this;

		function calculator(markers, styles) {
			var count = 0;
			$.each(markers, function(_, marker) {
				count += marker.statData[typeIndex];
			});

			// style = min(log10(count), styles)
			var style = Math.min(Math.floor(Math.log(count) / Math.LN10) + 1, styles);
			return {
				text: count,
				index: style
			};
		}


		var center = new google.maps.LatLng(15.999999, 106.000002);
		var options = {
			zoom: 6,
			'center': center,
			'mapTypeId': google.maps.MapTypeId.ROADMAP
		};

		var map = new google.maps.Map(container, options);

		var markers = [];
		for (var i = 0; i < data.length; i++) {
			var latLng = new google.maps.LatLng(data[i][0],data[i][1]);

			var marker = new google.maps.Marker({'position': latLng});

			marker.statData = data[i];
			marker.infowindow = new google.maps.InfoWindow({
				content:'Queries count: <b>'+self.number_format(data[i][2])+'</b><br>Homepage requests count: <b> '+self.number_format(data[i][3])+'</b><br>Clicks count: <b>'+self.number_format(data[i][2])+'</b>'
			});
			google.maps.event.addListener(marker, 'click', function() {
				this.infowindow.open(map,this);
			});
			markers.push(marker);
		}

		// Show
		new MarkerClusterer(map, markers, {
			'calculator': calculator,
			'minimumClusterSize': 1
		});
	};
	CocMaps.number_format = function(number, decimals, dec_point, thousands_sep) {
		// http://kevin.vanzonneveld.net
		// +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
		// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// +     bugfix by: Michael White (http://getsprink.com)
		// +     bugfix by: Benjamin Lupton
		// +     bugfix by: Allan Jensen (http://www.winternet.no)
		// +    revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
		// +     bugfix by: Howard Yeend
		// +    revised by: Luke Smith (http://lucassmith.name)
		// +     bugfix by: Diogo Resende
		// +     bugfix by: Rival
		// +      input by: Kheang Hok Chin (http://www.distantia.ca/)
		// +   improved by: davook
		// +   improved by: Brett Zamir (http://brett-zamir.me)
		// +      input by: Jay Klehr
		// +   improved by: Brett Zamir (http://brett-zamir.me)
		// +      input by: Amir Habibi (http://www.residence-mixte.com/)
		// +     bugfix by: Brett Zamir (http://brett-zamir.me)
		// +   improved by: Theriault
		// +      input by: Amirouche
		// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// *     example 1: number_format(1234.56);
		// *     returns 1: '1,235'
		// *     example 2: number_format(1234.56, 2, ',', ' ');
		// *     returns 2: '1 234,56'
		// *     example 3: number_format(1234.5678, 2, '.', '');
		// *     returns 3: '1234.57'
		// *     example 4: number_format(67, 2, ',', '.');
		// *     returns 4: '67,00'
		// *     example 5: number_format(1000);
		// *     returns 5: '1,000'
		// *     example 6: number_format(67.311, 2);
		// *     returns 6: '67.31'
		// *     example 7: number_format(1000.55, 1);
		// *     returns 7: '1,000.6'
		// *     example 8: number_format(67000, 5, ',', '.');
		// *     returns 8: '67.000,00000'
		// *     example 9: number_format(0.9, 0);
		// *     returns 9: '1'
		// *    example 10: number_format('1.20', 2);
		// *    returns 10: '1.20'
		// *    example 11: number_format('1.20', 4);
		// *    returns 11: '1.2000'
		// *    example 12: number_format('1.2000', 3);
		// *    returns 12: '1.200'
		// *    example 13: number_format('1 000,50', 2, '.', ' ');
		// *    returns 13: '100 050.00'
		// Strip all characters but numerical ones.
		number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
		var n = !isFinite(+number) ? 0 : +number,
			prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
			sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
			dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
			s = '',
			toFixedFix = function (n, prec) {
				var k = Math.pow(10, prec);
				return '' + Math.round(n * k) / k;
			};
		// Fix for IE parseFloat(0.55).toFixed(0) = 0;
		s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
		if (s[0].length > 3) {
			s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
		}
		if ((s[1] || '').length < prec) {
			s[1] = s[1] || '';
			s[1] += new Array(prec - s[1].length + 1).join('0');
		}
		return s.join(dec);
	}
}());