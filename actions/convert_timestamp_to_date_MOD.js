module.exports = {
	name: "Convert Timestamp to Date",
	section: "Other Stuff",

	subtitle: function(data) {
		return `Convert ${data.time}`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		return ([data.varName, "Date"]);
	},


	fields: ["time", "storage", "varName"],

	html: function(isEvent, data) {
		return `
	<div style="float: right; width: 60%; padding-top: 8px;">
		<p><u>Note:</u><br>
		You can convert <b>Unix Timestamp</b> and <b>YouTube Timestamp</b> with this mod (both were tested).</p>
	</div><br><br><br>
	<div style="float: left; width: 70%; padding-top: 8px;">
		Timestamp to Convert:
		<input id="time" class="round" type="text" placeholder="e.g. 1522672056">
	</div>
	<div style="float: left; width: 35%; padding-top: 8px;">
		Store Result In:<br>
		<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
		${data.variables[0]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; display: none; width: 60%; padding-top: 8px;">
		Variable Name:<br>
		<input id="varName" class="round" type="text">
	</div>
	<div style="text-align: center; float: left; width: 100%; padding-top: 8px;">
		<p><b>Recommended formats:</b></p>
		<img src="https://i.imgur.com/fZXXgFa.png" alt="Timestamp Formats" />
	</div>`;
	},

	init: function() {
		const { glob, document } = this;

		glob.variableChange(document.getElementById("storage"), "varNameContainer");
	},

	action: function(cache) {

		const data = cache.actions[cache.index];
		var   _this = this; // this is needed sometimes.
		const Mods = _this.getMods(); // as always.
		const toDate = Mods.require("normalize-date");
		const time = this.evalMessage(data.time, cache);

		// Main code.
		let result;
		if (/^\d+(?:\.\d*)?$/.exec(time)) {
			result = toDate((+time).toFixed(3));
		} else {
			result = toDate(time);
		}
		if (result.toString() === "Invalid Date") result = undefined;

		// Storage.
		if(result !== undefined) {
			const storage = parseInt(data.storage);
			const varName = this.evalMessage(data.varName, cache);
			this.storeValue(result, storage, varName, cache);
		}
		this.callNextAction(cache);
	},

	mod: function() {}
};
