function include(sourceFile) {
	if (document.getElementById(sourceFile)) {
		return;
	}

	let head = document.getElementsByTagName("head")[0];
	let script = document.createElement("script");
	head.appendChild(script);
	script.id = sourceFile;
	script.src  = sourceFile;
	script.type = "text/javascript";
	script.defer = false;
}