import { SimpleTypeKind } from "ts-simple-type";
import { tsTest } from "../../helpers/ts-test";
import { analyzeTextWithCurrentTsModule } from "../../helpers/analyze-text-with-current-ts-module";
import { assertHasMembers } from "../../helpers/util";

tsTest("Readonly modifier is found", t => {
	const {
		results: [result],
		checker
	} = analyzeTextWithCurrentTsModule({
		fileName: "test.js",
		text: `
		/**
		 * @element
		 */
		class MyElement extends HTMLElement {
			readonly myProp: string;
		}
	 `
	});

	const { members } = result.componentDefinitions[0]?.declaration();

	assertHasMembers(
		members,
		[
			{
				kind: "property",
				propName: "myProp",
				modifiers: new Set(["readonly"])
			}
		],
		t,
		checker
	);
});

tsTest("Getter have readonly modifier", t => {
	const {
		results: [result],
		checker
	} = analyzeTextWithCurrentTsModule({
		fileName: "test.js",
		text: `
		/**
		 * @element
		 */
		class MyElement extends HTMLElement {
			get myProp() {
				return "foo";
			}
		}
	 `
	});

	const { members } = result.componentDefinitions[0]?.declaration();

	assertHasMembers(
		members,
		[
			{
				kind: "property",
				propName: "myProp",
				modifiers: new Set(["readonly"])
			}
		],
		t,
		checker
	);
});

tsTest("Getter and setter become one property without readonly modifier", t => {
	const {
		results: [result],
		checker
	} = analyzeTextWithCurrentTsModule({
		fileName: "test.js",
		text: `
		/**
		 * @element
		 */
		class MyElement extends HTMLElement {
			get myProp() {
				return "foo";
			}
		}
	 `
	});

	const { members } = result.componentDefinitions[0]?.declaration();

	assertHasMembers(
		members,
		[
			{
				kind: "property",
				propName: "myProp",
				modifiers: new Set(),
				type: () => ({ kind: SimpleTypeKind.STRING })
			}
		],
		t,
		checker
	);
});
