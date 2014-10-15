(function(w) {
	var CDN_PATH = "https://code.createjs.com/easeljs-{version}.min.js";
	var CDN_VERSIONS = [
		"0.7.1",
		"0.7.0",
		"0.6.1",
		"0.6.0",
		"0.5.0",
		"0.4.2",
		"0.4.1"
	];
	var NEXT_PATH = "../../lib/easeljs-NEXT.combined.js";
	var AUTO_ITERATIONS = 5;
	
	var qs, version, versionStr, times={}, startTimes={};
	var data, iterations, result;
	
	(function setup() {
		injectUI();
		qs = w.queryString = readQueryString();
		
		var dataStr = localStorage["perfdata"];
		
		if (qs.auto) {
			iterations = parseInt(qs.auto);
			if (isNaN(iterations)) { iterations = AUTO_ITERATIONS; }
			
			var index = qs.index = Number(qs.index)|0;
			qs.iteration = Number(qs.iteration)|0;
			if (qs.index == 0 && qs.iteration == 0) { 
				data = {};
			} else {
				data = JSON.parse(dataStr);
			}
			qs.version = index==CDN_VERSIONS.length ? "NEXT" : CDN_VERSIONS[index];
		} else if (dataStr) {
			localStorage["perfdata"] = "";
			data = JSON.parse(dataStr);
			report(data);
			return;
		}
		
		version = getVersion(qs.version);
		versionStr = version ? qs.version.toUpperCase() : "";
		if (version) {
			setStatus("preparing...");
			setupTest();
			updateSelectedVersion();
		} else {
			setStatus("select a library version to begin");
		}
	})();
	
	function setupTest() {
		var script = document.createElement("script");
		document.body.appendChild(script);
		script.onload = onLibLoad;
		result = "";
		script.src = (versionStr == "NEXT") ? NEXT_PATH : CDN_PATH.replace("{version}", qs.version);
	}
	
	function onLibLoad() {
		setTimeout(runTest, 500);
	}
	
	function runTest() {
		setStatus("running...");
		if (!window.runTest) { throw("window.runTest is not defined."); }
		else { window.runTest(version, qs); }
	}
	
	function getVersion(v) {
		if (!v) { return; }
		if (v.toUpperCase() == "NEXT") { return ["NEXT"]; }
		var arr = v.split(".");
		for (var i=0; i<arr.length; i++) {
			var int = parseInt(arr[i]);
			arr[i] = isNaN(int) ? 0 : int;
		}
		return arr;
	}
	
	function updateSelectedVersion() {
		document.getElementById("version").value = versionStr;
	}
	
	function readQueryString() {
		var match;
		var search = /([^&=]+)=?([^&]*)/g;
		var decode = function (s) { return decodeURIComponent(s.replace(/\+/g, " ")); };
		var query  = window.location.search.substring(1);
	
		var o = {};
		while (match = search.exec(query)) {
			o[decode(match[1])] = decode(match[2]);
		}
		return o;
	}
	
	function injectUI() {
		var versions = CDN_VERSIONS.slice(0);
		versions.unshift("", "NEXT");
		var doc = document;
		
		var div = doc.createElement("div");
		div.setAttribute("style","background:#EEE; padding: 0.75em;");
		div.innerText = "Version: ";
		
		var select = doc.createElement("select");
		select.id = "version";
		select.addEventListener("change", function() { console.log("eh"); reload(document.getElementById("version").value); });
		for (var i=0; i<versions.length; i++) {
			var option = doc.createElement("option");
			option.value = option.innerText = versions[i];
			select.appendChild(option);
		}
		div.appendChild(select);
		
		var span = doc.createElement("span");
		span.innerHTML += " <input type='button' value='auto' onclick='auto();'/>" +
						 " <span id='status'></span>";
		div.appendChild(span);
		
		doc.body.appendChild(div);
	}
	
	function setStatus(str) {
		var status = document.getElementById("status");
		status.innerHTML = str;
	}
	
	function reload(version) {
		if (version != null) { qs.version = version; }
		var url = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port: "");
		url += window.location.pathname+"?";
		for (var n in qs) {
			url += n + "=" + encodeURIComponent(qs[n]) + "&";
		}
		url = url.substring(0, url.length-1);
		url += window.location.hash;
		window.location = url;
	}
	
	window.checkVersion = function(v) {
		if (v.toUpperCase() == "NEXT") { return versionStr == "NEXT"; }
		if (versionStr == "NEXT") { return true; }
		
		v = getVersion(v);
		var l = Math.max(v.length, version.length);
		for (var i=0; i<l; i++) {
			if ((v[i]||0) < (version[i]||0)) { return true; }
			if ((v[i]||0) > (version[i]||0)) { return false; }
		}
		return true;
	};
	
	var now = window.performance && (performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow);
	function getTime() {
		return (now&&now.call(performance))||(new Date().getTime());
	}
	
	window.time = function(str) {
		startTimes[str] = getTime();
	};
	
	window.endTime =function(str, log) {
		var t = startTimes[str];
		if (!t) { t = -1; }
		else { t = getTime()-t; }
		if (log && qs.auto) {
			times[str] = t;
		} else {
			console&&console.log(str, t.toFixed(2)+"ms");
			result += str+": <b>"+(t+0.5|0)+"ms</b> ";
		}
		return t;
	};
	
	window.endTest = function() {
		if (!qs.auto) { setStatus(result); return; }
		
		if (!data[versionStr]) { data[versionStr] = []; }
		data[versionStr][qs.iteration] = times;
		localStorage["perfdata"] = JSON.stringify(data);
		
		if (++qs.iteration >= iterations) {
			qs.index++;
			qs.iteration = 0;
		}
		if (qs.index > CDN_VERSIONS.length) {
			qs = {};
		}
		
		delete(qs.version);
		reload();
	};
	
	window.auto = function() {
		delete(qs.version);
		delete(qs.index);
		delete(qs.iteration);
		qs.auto = AUTO_ITERATIONS;
		reload();
	};
	
	function report(data) {
		data = normalizeData(data);
		data = prepData(data);
		
		var col, row, str = "version", cols=data.cols, rows=data.rows;
		for (col in cols) { str += "\t"+col; }
		
		for (row in rows) {
			str += "\n"+row;
			for (col in cols) {
				var stats = rows[row][col];
				str += "\t"+(stats&&stats.mean ? stats.mean.toFixed(1) : "----")+"ms";
			}
		}
		console.log(str);
		setStatus("see console for results");
	}
	
	function normalizeData(data) {
		var norm = {};
		for (var row in data) {
			var arr = data[row];
			var o = norm[row] = {};
			for (var i= 0,l=arr.length; i<l; i++) {
				var tests = arr[i];
				for (var test in tests) {
					if (!o[test]) { o[test] = []; }
					o[test].push(tests[test]);
				}
			}
		}
		return norm;
	}
	
	function prepData(data) {
		var prep = {};
		var cols = prep.cols = {};
		var rows = prep.rows = {};
		for (var row in data) {
			var tests = data[row];
			rows[row] = {};
			for (var test in tests) {
				cols[test] = 1;
				rows[row][test] = getStats(tests[test]);
			}
		}
		return prep;
	}
	
	function getStats(arr) {
		var i, l=arr.length, mean, sum= 0, dev=0;
		for (i=0; i<l; i++) { sum += arr[i]; }
		mean = sum/l;
		for (i=0; i<l; i++) { dev += (arr[i]-mean)*(arr[i]-mean); }
		return {sum:sum, mean:mean, sd:Math.sqrt(dev/l)};
	}
})(window);