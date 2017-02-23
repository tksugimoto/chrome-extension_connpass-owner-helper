(function (window, document) {
	"use strict";
	
	const ownerDocument = document.currentScript.ownerDocument;
	
	const template = ownerDocument.querySelector("template").content;
	
	class CheckBoxElement extends HTMLElement {
		constructor() {
			super();

			const shadowRoot = this.attachShadow({
				mode: "closed"
			});

			const clone = template.cloneNode(true);
			shadowRoot.appendChild(clone);
			
			this._checkbox = shadowRoot.querySelector("input");
			
			if (this.hasAttribute("checked")) {
				this._checkbox.checked = true;
			}
			if (this.hasAttribute("disabled")) {
				this._checkbox.disabled = true;
			}
			
			this._checkbox.addEventListener("change", () => {
				this.updateCheckedAttribute();
				const event = new window.Event("change");
				event.checked = this._checkbox.checked;
				this.dispatchEvent(event);
			});
		}

		set checked(value) {
			this._checkbox.checked = !!value;
			this.updateCheckedAttribute();
		}
		get checked() {
			return this._checkbox.checked;
		}

		updateCheckedAttribute() {
			if (this._checkbox.checked) {
				this.setAttribute("checked", true);
			} else {
				this.removeAttribute("checked");
			}
		}
	}

	window.customElements.define("check-box", CheckBoxElement);
})(window, document);
