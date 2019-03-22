// prefix fragment simple
	gl_FragColor = vec4(src.rgb * (1.0 - dst.a), src.a - dst.a);
}
