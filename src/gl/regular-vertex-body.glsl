void main(void) {
	gl_Position = pMatrix * vec4(vertexPosition.x, vertexPosition.y, 0.0, 1.0);
	alphaValue = objectAlpha;
	indexPicker = textureIndex;
	vTextureCoord = uvPosition;
}
