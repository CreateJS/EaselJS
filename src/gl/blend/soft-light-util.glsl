float softcurve(float a) {
	if (a > 0.25) { return sqrt(a); }
	return ((16.0 * a - 12.0) * a + 4.0) * a;
}
float softmix(float a, float b) {
	if (b <= 0.5) { return a - (1.0 - 2.0*b) * a * (1.0 - a); }
	return a + (2.0 * b - 1.0) * (softcurve(a) - a);
}
