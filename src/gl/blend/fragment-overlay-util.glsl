float overlay(float a, float b) {
	if (a < 0.5) { return 2.0 * a * b; }
	return 1.0 - 2.0 * (1.0 - a) * (1.0 - b);
}
