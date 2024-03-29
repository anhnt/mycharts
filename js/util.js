/**
 * @copyright: Coccoc search engine
 * @author: Nguyen Tuan Anh
 * @date: 5/27/13
 * @time: 6:33 PM
 */
 Array.prototype.sum = function(start, end){
	var count =0;
	if(!start)
		start = 0;
	if(!end)
		end = this.length;

	for(var i=start; i< end; i++){
		count+= this[i];
	}
	return count;
 };

// **************************************************************************
// Copyright 2007 - 2009 Tavs Dokkedahl
// Contact: http://www.jslab.dk/contact.php
//
// This file is part of the JSLab Standard Library (JSL) Program.
//
// JSL is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 3 of the License, or
// any later version.
//
// JSL is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.
// ***************************************************************************

// Return new array with duplicate values removed
Array.prototype.unique =
	function() {
		var a = [];
		var l = this.length;
		for(var i=0; i<l; i++) {
			for(var j=i+1; j<l; j++) {
				// If this[i] is found later in the array
				if (this[i] === this[j])
					j = ++i;
			}
			a.push(this[i]);
		}
		return a;
	};