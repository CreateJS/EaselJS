// prefix fragment simple
	float omSRC = (1.0 - src.a);
	float omDST = (1.0 - dst.a);
	gl_FragColor = vec4(src.rgb * omDST + dst.rgb * omSRC, src.a * omDST + dst.a * omSRC);
}
