uniform sampler2D uMixSampler;
void main(void) {
	vec4 src = texture2D(uMixSampler, vTextureCoord);
	vec4 dst = texture2D(uSampler, vTextureCoord);
