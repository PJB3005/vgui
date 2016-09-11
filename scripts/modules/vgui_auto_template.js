$(document).on(constants.events.data_update, function(e, data)
{
	// Render main template!
	var htmlContent = vgui.masterTemplate(data, null, null);

	$("#ui-content").html(htmlContent);
})
