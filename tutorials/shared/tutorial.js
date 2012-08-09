function initTutorial() {
	formatCodeAreas();
	injectDemos();
}

function formatCodeAreas() {
	var tags = document.getElementsByTagName("textarea");
	for (var i=tags.length-1; i>=0; i--) {
		var e = tags[i];
		if (!e || e.className.indexOf("brush: ") != 0) { continue; }
		var code = e.value.replace(/[&]/g,"&amp;").replace(/</g,"&lt;").replace(/(\r|\n\r)/g,"\n");
		var pre = document.createElement("pre");
		pre.className = e.className;
		pre.innerHTML = code.substr(0,code.lastIndexOf("\n"));
		e.parentNode.replaceChild(pre, e);
	}
	SyntaxHighlighter.highlight();
}

function injectDemos() {
	var tags = document.getElementsByTagName("iframe");
	for (var i=tags.length-1; i>=0; i--) {
		var e = tags[i];
		if (!e || e.className.indexOf("demo") != 0) { continue; }
		var src = e.src;
		var div = document.createElement("div");
		div.className = "demo";
		e.parentNode.replaceChild(div, e);
		div.appendChild(e);
		var p = document.createElement("p");
		var srcLabel = src.split("\\").join("/").split("/").pop();
		var html = "<strong>Demo</strong>";
		if (e.longDesc) { html += ": "+e.longDesc; }
		html += "<a href='"+src+"' target='_blank'>"+srcLabel+"</a>";
		p.innerHTML = html;
		div.appendChild(p);
	}
}