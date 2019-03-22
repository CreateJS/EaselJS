vec3 srcClr = min(src.rgb / src.a, 1.0);
vec3 dstClr = min(dst.rgb / dst.a, 1.0);
float totalAlpha = min(1.0 - (1.0 - dst.a) * (1.0 - src.a), 1.0);
float srcFactor = min(max(src.a - dst.a, 0.0) / totalAlpha, 1.0);
float dstFactor = min(max(dst.a - src.a, 0.0) / totalAlpha, 1.0);
float mixFactor = max(max(1.0 - srcFactor, 0.0) - dstFactor, 0.0);
gl_FragColor = vec4(
	(
		srcFactor * srcClr +
		dstFactor * dstClr +
		mixFactor * vec3(
