<svg xmlns="http://www.w3.org/2000/svg" class="overflow-hidden rounded-xl" viewBox="-1 0 462 336">
	<style>
		.bg {
			fill: var(--color-base-100);
		}
		.sun {
			fill: var(--color-secondary);
			stroke: var(--color-secondary);
			stroke-width: 8;
			stroke-linecap: round;
		}
		.sun-ray {
			stroke: var(--color-secondary);
			stroke-width: 8;
			stroke-linecap: round;
		}
		.face-line {
			fill: none;
			stroke: var(--color-secondary-content);
			stroke-width: 4;
			stroke-linecap: round;
		}
		.cheek {
			fill: var(--color-error);
		}
		.cloud {
			fill: var(--color-base-100);
			stroke: var(--color-info);
			stroke-width: 2;
			opacity: 0.9;
		}
		.stem {
			fill: none;
			stroke: var(--color-accent);
			stroke-width: 4;
		}
		.leaf {
			fill: var(--color-accent);
		}
		.petal {
			fill: var(--color-primary);
		}
		.flower-core {
			fill: var(--color-neutral);
		}
	</style>

	<!-- Background -->
	<rect class="bg" x="-1" y="0" width="462" height="336" />

	<!-- Sun + face -->
	<g transform="translate(-5.48847 80.13175)">
		<circle class="sun" cx="193" cy="81" r="80" />
		<line class="sun-ray" x1="193" y1="-52" x2="193" y2="-19" />
		<line class="sun-ray" x1="263" y1="11" x2="283" y2="-19" />
		<line class="sun-ray" x1="303" y1="81" x2="333" y2="81" />
		<line class="sun-ray" x1="263" y1="151" x2="283" y2="181" />
		<line class="sun-ray" x1="123" y1="151" x2="103" y2="181" />
		<line class="sun-ray" x1="83" y1="81" x2="53" y2="81" />
		<line class="sun-ray" x1="123" y1="11" x2="103" y2="-19" />
		<line class="sun-ray" x1="193.274" y1="208.651" x2="193.274" y2="178.651" />

		<!-- Face -->
		<g>
			<path class="face-line" d="M163 71 q10 -15 20 0" />
			<path class="face-line" d="M203 71 q10 -15 20 0" />
			<circle class="cheek" cx="158" cy="91" r="12" />
			<circle class="cheek" cx="228" cy="91" r="12" />
			<path class="face-line" d="M173 101 q20 20 40 0" />
		</g>
	</g>

	<!-- Clouds -->
	<path
		class="cloud"
		d="M134.567 212.447
           C121.487 197.642 105.137 193.940 85.516 201.343
           C72.436 190.239 59.356 190.239 46.276 201.343
           C33.195 193.940 23.385 197.642 16.845 212.447
           C10.305 227.252 13.576 238.356 26.656 245.760
           C20.116 260.565 23.385 271.669 36.465 279.072
           C49.546 286.476 62.626 284.625 75.706 273.520
           C88.787 284.625 101.866 284.625 114.948 273.520
           C128.027 280.924 139.474 279.072 149.284 267.968
           C159.094 256.864 160.728 245.760 154.188 234.655
           C150.918 219.850 144.378 212.447 134.567 212.447"
	/>
	<path
		class="cloud"
		d="M337.715 232.708
           C323.545 217.861 309.375 214.149 295.206 221.572
           C288.120 206.725 277.493 203.014 263.324 210.436
           C249.155 203.014 238.528 206.725 231.443 221.572
           C224.358 236.420 227.901 247.556 242.070 254.979
           C234.985 269.827 238.528 280.962 252.698 288.385
           C266.867 295.809 281.037 293.953 295.206 282.818
           C309.375 293.953 321.774 292.098 332.401 277.250
           C339.486 262.403 341.257 247.556 337.715 232.708"
	/>

	<!-- Stem & leaves -->
	<path class="stem" d="M403 295 q-33.096 -85.161 0 -141.935" />
	<path class="leaf" d="M390 210.839 q-28.387 -7.097 -14.194 14.194" />
	<path class="leaf" d="M387 236.226 q28.387 -7.097 14.194 14.194" />

	<!-- Flower -->
	<g transform="translate(395 145)">
		<circle class="petal" cx="12" cy="8" r="25.548" />
		<circle class="petal" cx="12" cy="-16" r="21.290" />
		<circle class="petal" cx="34.710" cy="8" r="21.290" />
		<circle class="petal" cx="12" cy="31" r="21.290" />
		<circle class="petal" cx="-10.710" cy="8" r="21.290" />
		<circle class="flower-core" cx="12" cy="8" r="17.032" />
	</g>
</svg>
