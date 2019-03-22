float getLum(vec3 c) { return (0.299 * c.r) + (0.589 * c.g) + (0.109 * c.b); }
float getSat(vec3 c) { return max(max(c.r, c.g), c.b) - min(min(c.r, c.g), c.b); }
vec3 clipHSL(vec3 c) {
	float lum = getLum(c);
	float n = min(min(c.r, c.g), c.b);
	float x = max(max(c.r, c.g), c.b);
	if (n < 0.0) { c = lum + (((c - lum) * lum) / (lum - n)); }
	if (x > 1.0) { c = lum + (((c - lum) * (1.0 - lum)) / (x - lum)); }
	return clamp(c, 0.0, 1.0);
}
vec3 setLum(vec3 c, float lum) {
	return clipHSL(c + (lum - getLum(c)));
}
vec3 setSat(vec3 c, float val) {
	vec3 result = vec3(0.0);
	float minVal = min(min(c.r, c.g), c.b);
	float maxVal = max(max(c.r, c.g), c.b);
	vec3 minMask = vec3(c.r == minVal, c.g == minVal, c.b == minVal);
	vec3 maxMask = vec3(c.r == maxVal, c.g == maxVal, c.b == maxVal);
	vec3 midMask = 1.0 - min(minMask+maxMask, 1.0);
	float midVal = (c * midMask).r + (c * midMask).g + (c * midMask).b;
	if (maxVal > minVal) {
		result = midMask * min(((midVal - minVal) * val) / (maxVal - minVal), 1.0);
		result += maxMask * val;
	}
	return result;
}
