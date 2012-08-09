function formatCodeAreas() {
	var codeTags = document.getElementsByTagName("textarea");
	for (var i=codeTags.length-1; i>=0; i--) {
		var e = codeTags[i];
		if (!e || e.className.indexOf("brush: ") != 0) { continue; }
		var code = e.value.replace(/[&]/g,"&amp;").replace(/</g,"&lt;").replace(/(\r|\n\r)/g,"\n");
		var div = document.createElement("pre");
		div.className = e.className;
		div.innerHTML = code.substr(0,code.lastIndexOf("\n"));
		e.parentNode.replaceChild(div, e);
	}
	SyntaxHighlighter.highlight();
}