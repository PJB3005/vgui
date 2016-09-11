var vgui_helper = {
	// >tfw there is no way in IE8 to check the lenght of an Object.
	// How the fuck does anybody put up with this fucking language?
	objectLength: function(object)
	{
		var count = 0;
		for (key in object)
		{
			if (object.hasOwnProperty(key))
			{
				count++;
			}
		}
		return count;
	}
};
