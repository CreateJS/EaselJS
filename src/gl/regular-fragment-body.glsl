void main(void) {
	vec4 color = vec4(1.0, 0.0, 0.0, 1.0);

	if (indexPicker <= 0.5) {
		color = texture2D(uSampler[0], vTextureCoord);
		{{alternates}}
	}

	gl_FragColor = vec4(color.rgb * alphaValue, color.a * alphaValue);
}
