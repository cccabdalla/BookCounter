/**
 * New node file
 */

var Enum = require('enum');

module.exports = new Enum(
	{

		STRING			:	2001,
		NUMBER			:	2010,
		DATE			:	2014,
		CURSOR			:	2021,
		BUFFER    		:	2006,
		CLOB       		:	2017,
		BLOB       		:	2019,

		BIND_IN			:	3001,
		BIND_INOUT		:	3002,
		BIND_OUT		:	3003,

		ARRAY			:	4001,
		OBJECT			:	4002
	}
		/*{

			STRING			:	2001,
			NUMBER			:	2002,
			DATE			:	2003,
			CURSOR			:	2004,
			BUFFER    		:	2005,
			CLOB       		:	2006,
			BLOB       		:	2007,

			BIND_IN			:	3001,
			BIND_INOUT		:	3002,
			BIND_OUT		:	3003,

			ARRAY			:	4001,
			OBJECT			:	4002
		}*/
);

//module.exports = Enum;