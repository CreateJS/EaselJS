// prefix fragment complex
1.0 - clamp((1.0 - smoothstep(0.0035, 0.9955, dstClr)) / smoothstep(0.0035, 0.9955, srcClr), 0.0, 1.0)
// suffix fragment cap
