"use strict";
function vgui_manager()
{
	this.parseInitialData();
	this.parseConfig();
	this.updateConfig(this.config, true);
}

// The main template that actually gets rendered.
// Others can be included with doT includes.
vgui_manager.prototype.masterTemplate = null;

// List of templates used in this UI.
vgui_manager.prototype.templates = {};

vgui_manager.prototype.failedTemplates = [];

// UI status (available, update-only and disabled)
vgui_manager.prototype.status = constants.VGUI_STAT_INTERACTIVE;

vgui_manager.prototype.data = null;

vgui_manager.prototype.config = null;

// Reads the body's config argument.
vgui_manager.prototype.parseConfig = function()
{
	this.config = JSON.parse(document.body.getAttribute("data-config"));
}

vgui_manager.prototype.updateConfig = function(data, initial)
{
	// If something wants to edit the config beforehand it can.
	$(document).trigger("config-update", data);

	if (data.title != undefined)
	{
		$("title, #header-text").html(data.title);
	}

	if (data.modules != undefined)
	{
		this.loadModules(data.modules);
	}

	// Goddamnit.
	// Because everything is a fucking callback and Lummox didn't implement CEF yet,
	// I can't do arrow functions so in any callback "this" gets fucked up.
	// I blame both Lummox and Javascript for this.
	// Mostly Javascript though. Fuck Javascript.
	// In browser Python when?
	// Even when we get WebAssembly it'll take 10 years before using it in production can be considered reasonable anyways so...
	// [Insert more shitposts]
	var _this = this;

	// This fucking language I swear to god.
	this.config.templates.forEach(function(currentValue, index, array)
	{
		var filename = currentValue + ".tmpl"
		$.when(
			$.ajax({
				url: filename,
				cache: false,
				dataType: "text",
				beforeSend: function(xhr)
				{
					// Piece of shit hack to fix jQuery being too dumb to set the content type.
					if (xhr.overrideMimeType)
					{
						xhr.overrideMimeType("text/plain");
					}
				}
			})

		).fail(function()
		{
			console.error("Unable to load template: " + filename);
			_this.failedTemplates.push(currentValue);

		}).done(function (content)
		{
			_this.compileTemplate(content, currentValue);
			// Last template in the list is the master template.
			if (_this.config.templates.length === index + 1)
			{
				if (!(_this.masterTemplate = _this.templates[currentValue]))
				{
					console.error("Unable to get master template! Panic!");
				}
				console.log("Main template is " + currentValue);

				if (data != undefined && data)
				{
					_this.start();
				}
			}
		});
	});
}

vgui_manager.prototype.compileTemplate = function(template, name)
{
	var old_template = template
	// TODO: Handle compile-time data.
	template = doT.compile(template, this.templates);
	if(typeof template !== "function")
	{
		console.error("Template " + name + " failed to compile!");
		return;
	}

	// This allows us to do def.template in DoT compile time expressions and not have to worry about a separate list!
	template.toString = function()
	{
		return old_template;
	};

	this.templates[name] = template;
	console.log("Successfully compiled template " + name + ".");
}

vgui_manager.prototype.updateStatus = function(newStatus)
{

}

vgui_manager.prototype.parseInitialData = function()
{
	var data = document.body.getAttribute("data-initial-data");
	this.update(data, false);
}

vgui_manager.prototype.update = function(newdata, triggerEvent)
{
	// > This fucking meme of a language didn't have default parameters until 2015.
	if (triggerEvent === undefined)
	{
		triggerEvent = true;
	}
	this.data = JSON.parse(newdata);

	if (triggerEvent)
	{
		this.updateContent();
	}
}

vgui_manager.prototype.updateContent = function()
{
	$(document).trigger(constants.events.data_update, this.data);
}

vgui_manager.prototype.initialLoad = function()
{
	//$("#ui-content").html(this.masterTemplate(this.data, this.config, vgui_helper))
}

vgui_manager.prototype.start = function()
{
	// Render main template!
	var htmlContent = this.masterTemplate(this.data, null, null);

	$("#ui-content").html(htmlContent);
}
