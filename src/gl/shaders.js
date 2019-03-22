import regularVaryingHeader from "./regular-varying-header.glsl";
import regularVertexHeader from "./regular-vertex-header.glsl";
import regularVertexBody from "./regular-vertex-body.glsl";
import regularFragmentHeader from "./regular-fragment-header.glsl";
import regularFragmentBody from "./regular-fragment-body.glsl";
import coverVaryingHeader from "./cover-varying-header.glsl";
import coverVertexHeader from "./cover-vertex-header.glsl";

import colorBurn from "./blend/color-burn.glsl";
import colorDodge from "./blend/color-dodge.glsl";
import color from "./blend/color.glsl";
import copy from "./blend/copy.glsl";
import darken from "./blend/darken.glsl";
import destinationAtop from "./blend/destination-atop.glsl";
import destinationIn from "./blend/destination-in.glsl";
import difference from "./blend/difference.glsl";
import exclusion from "./blend/exclusion.glsl";
import fragmentComplexFooter from "./blend/fragment-complex-footer.glsl";
import fragmentComplexHeader from "./blend/fragment-complex-header.glsl";
import fragmentHslUtil from "./blend/fragment-hsl-util.glsl";
import fragmentOverlayUtil from "./blend/fragment-overlay-util.glsl";
import fragmentSimpleHeader from "./blend/fragment-simple-header.glsl";
import hardLight from "./blend/hard-light.glsl";
import hue from "./blend/hue.glsl";
import lighten from "./blend/lighten.glsl";
import luminosity from "./blend/luminosity.glsl";
import multiply from "./blend/multiply.glsl";
import overlay from "./blend/overlay.glsl";
import saturation from "./blend/saturation.glsl";
import softLightUtil from "./blend/soft-light-util.glsl";
import softLight from "./blend/soft-light.glsl";
import sourceIn from "./blend/source-in.glsl";
import sourceOut from "./blend/source-out.glsl";
import xor from "./blend/xor.glsl";

const join = (...strs) => strs.join("\n");

export {
	"cover-varying-header": coverVaryingHeader,
	"cover-vertex-header": join(
		coverVaryingHeader,
		coverVertexHeader
	),
	"regular-fragment-header": join(
		regularVaryingHeader,
		regularFragmentHeader
	),
	"regular-fragment-body": regularFragmentBody,
	"regular-varying-header": regularVaryingHeader,
	"regular-vertex-header": join(
		regularVaryingHeader,
		regularVertexHeader
	),
	"regular-vertex-body": regularVertexBody,

	blendSources: {
		"color-burn": join(
			fragmentSimpleHeader,
			fragmentComplexHeader,
			colorBurn,
			fragmentComplexFooter
		),
		"color-dodge": join(
			fragmentSimpleHeader,
			fragmentComplexHeader,
			colorDodge,
			fragmentComplexFooter
		),
		"color": join(
			fragmentHslUtil,
			fragmentSimpleHeader,
			fragmentComplexHeader,
			color,
			fragmentComplexFooter
		),
		"copy": join(
			fragmentSimpleHeader,
			copy
		),
		"copy_cheap": {
			dstRGB: "ZERO", dstA: "ZERO"
		},
		"darken": join(
			fragmentSimpleHeader,
			fragmentComplexHeader,
			darken,
			fragmentComplexFooter
		),
		"destination-atop": join(
			fragmentSimpleHeader,
			destinationAtop
		),
		"destination-atop_cheap": {
			srcRGB: "ONE_MINUS_DST_ALPHA", srcA: "ONE",
			dstRGB: "SRC_ALPHA", dstA: "ZERO"
		},
		"destination-in": join(
			fragmentSimpleHeader,
			destinationIn
		),
		"destination-in_cheap": {
			srcRGB: "ZERO", srcA: "DST_ALPHA",
			dstRGB: "SRC_ALPHA", dstA: "ZERO"
		},
		"destination-over": {
			srcRGB: "ONE_MINUS_DST_ALPHA", srcA: "ONE_MINUS_DST_ALPHA",
			dstRGB: "ONE", dstA: "ONE"
		},
		"destination-out": {
			eqA: "FUNC_REVERSE_SUBTRACT",
			srcRGB: "ZERO", srcA: "DST_ALPHA",
			dstRGB: "ONE_MINUS_SRC_ALPHA", dstA: "ONE"
		},
		"difference": join(
			fragmentSimpleHeader,
			fragmentComplexHeader,
			difference,
			fragmentComplexFooter
		),
		"exclusion": join(
			fragmentSimpleHeader,
			fragmentComplexHeader,
			exclusion,
			fragmentComplexFooter
		),
		"hard-light": join(
			fragmentOverlayUtil,
			fragmentSimpleHeader,
			fragmentComplexHeader,
			hardLight,
			fragmentComplexFooter
		),
		"hue": join(
			fragmentHslUtil,
			fragmentSimpleHeader,
			fragmentComplexHeader,
			hue,
			fragmentComplexFooter
		),
		"lighten": join(
			fragmentSimpleHeader,
			fragmentComplexHeader,
			lighten,
			fragmentComplexFooter
		),
		"lighter": {
			dstRGB: "ONE", dstA: "ONE"
		},
		"luminosity": join(
			fragmentHslUtil,
			fragmentSimpleHeader,
			fragmentComplexHeader,
			luminosity,
			fragmentComplexFooter
		),
		"multiply": join(
			fragmentSimpleHeader,
			fragmentComplexHeader,
			multiply,
			fragmentComplexFooter
		),
		"multiply_cheap": {
			// NEW, handles retention of src data incorrectly when no dst data present
			srcRGB: "ONE_MINUS_DST_ALPHA", srcA: "ONE",
			dstRGB: "SRC_COLOR", dstA: "ONE"
		},
		"overlay": join(
			fragmentOverlayUtil,
			fragmentSimpleHeader,
			fragmentComplexHeader,
			overlay,
			fragmentComplexFooter
		),
		"saturation": join(
			fragmentHslUtil,
			fragmentSimpleHeader,
			fragmentComplexHeader,
			saturation,
			fragmentComplexFooter
		),
		"screen": {
			srcRGB: "ONE", srcA: "ONE",
			dstRGB: "ONE_MINUS_SRC_COLOR", dstA: "ONE_MINUS_SRC_ALPHA"
		},
		"soft-light": join(
			softLightUtil,
			fragmentSimpleHeader,
			fragmentComplexHeader,
			softLight,
			fragmentComplexFooter
		),
		"source-atop": {
			srcRGB: "DST_ALPHA", srcA: "ZERO",
			dstRGB: "ONE_MINUS_SRC_ALPHA", dstA: "ONE"
		},
		"source-in": join(
			fragmentSimpleHeader,
			sourceIn
		),
		"source-in_cheap": {
			srcRGB: "DST_ALPHA", srcA: "ZERO",
			dstRGB: "ZERO", dstA: "SRC_ALPHA"
		},
		"source-out": join(
			fragmentSimpleHeader,
			sourceOut
		),
		"source-out_cheap": {
			eqA: "FUNC_SUBTRACT",
			srcRGB: "ONE_MINUS_DST_ALPHA", srcA: "ONE",
			dstRGB: "ZERO", dstA: "SRC_ALPHA"
		},
		"source-over": {},
		"xor": join(
			fragmentSimpleHeader,
			xor
		)
	}
}
