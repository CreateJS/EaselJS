// prefix fragment simple
	gl_FragColor = vec4(dst.rgb * src.a + src.rgb * (1.0 - dst.a), src.a);
}
