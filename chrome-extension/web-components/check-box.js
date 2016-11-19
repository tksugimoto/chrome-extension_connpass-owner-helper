(function (window, document) {
	"use strict";
	
	const thatDoc = document;
	const thisDoc = thatDoc.currentScript.ownerDocument;
	
	const template = thisDoc.querySelector("template").content;
	
	const MyElementProto = window.Object.create(window.HTMLElement.prototype);
		
	window.Object.defineProperty(MyElementProto, "checked", {
		set: function (value) {
			this.checkbox.checked = !!value;
			this.updateCheckedAttribute();
		},
		get: function () {
			return this.checkbox.checked;
		}
	});
	
	MyElementProto.updateCheckedAttribute = function () {
		if (this.checkbox.checked) {
			this.setAttribute("checked", true);
		} else {
			this.removeAttribute("checked");
		}
	};

	MyElementProto.createdCallback = function () {
		this.createShadowRoot();
		
		const clone = thatDoc.importNode(template, true);
		this.shadowRoot.appendChild(clone);
		
		this.checkbox = this.shadowRoot.querySelector("input");
		
		if (this.hasAttribute("checked")) {
			this.checkbox.checked = true;
		}
		if (this.hasAttribute("disabled")) {
			this.checkbox.disabled = true;
		}
		
		this.checkbox.addEventListener("change", () => {
			this.updateCheckedAttribute();
			const event = new window.Event("change");
			event.checked = this.checkbox.checked;
			this.dispatchEvent(event);
		});
	};
	
	thatDoc.registerElement("check-box", {
		prototype: MyElementProto
	});
})(window, document);
