// ## users.list.js
// This script will run as a handler for "users.list"
//
// ### Notes
// This example shows how to loop through the users being 
// returned and augment the outbound result set.
//
// The script first checks if the user's email address 
// is at `@hotmail.com`. This check also adds a new property 
// (`record.hotmail_user`) to the returned data.
//
// The second part checks for a specific email address and 
// uppercases the last name
//
// In addition, the entire script is driven by the [UnderscoreJS](http://underscorejs.org/) 
// "each" function. [UnderscoreJS](http://underscorejs.org/) is available for all scripts to use.
//

//
// ### Recommended Pattern
// We recommend the following pattern for your scripts.
//
// A function (you can use whatever construct you desire) is defined to process a single record.
//
// Next, check to see if we're dealing with an array, or a single record of data. This pattern will work for both inbound and outbound scripts. 
// 
// Should an exception be thrown, the system will stop the REST call in progress by sending the exception back to the client. The [admin application](/launchpad/index.html) will display this to the user. Handle accordingly in your apps.
//

/**
 * Performs the operations described above on the passed in record.
 *
 * @param record
 */
function updateRecord(record) {
	//	HoTMaiL user? Set the property
	record.hotmail_user = ( -1 != record.email.indexOf('@hotmail.com') );

	//	This guy gets his last name uppercased
	if ('hacketyhackhack@haxalot.com' == record.email) {
		record.last_name = record.last_name.toUpperCase();
	}
}

//	Array of records?
if (event.record) {
	_.each(event.record, function (record, index, list) {
		updateRecord(record);
	});
//	Single record?
} else if (event.last_name) {
	updateRecord(event);
//	Bogus...
} else {
	throw "Unrecognized Data Format";
}