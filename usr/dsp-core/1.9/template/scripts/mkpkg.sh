#!/bin/bash
# DreamFactory Application Packager Script
# Copyright (C) 2009-2013 DreamFactory Software, Inc. All Rights Reserved
#
# CHANGELOG:
#
# v1.0.0
#   General cleanup
#	Use scriptHelpers.sh common console library
#	Add /log and /vendor to exclude directories
#

# Get some help
. `dirname $0`/colors.sh

# Methods
usage() {
	echo
	_msg "usage" ${_YELLOW} "${_ME} [application name]"

	echo
	echo "       ${B1}[application name]${B2} will become the endpoint of the URL to this application."
	echo "       This ${B1}must match${B2} the name of the directory containing the application."
	echo
	echo "       You may turn on DEBUG output by setting ${B1}DF_DEBUG${B2}=1 either in your ~/.bashrc or on the command line:"
	echo
	echo "       $ DF_DEBUG=1 ${_ME}"
	echo

	exit 1
}

VERSION=1.0.0
APP_NAME="$1"
ZIP_SOURCE_PATH="${APP_NAME}"
ZIP_OUTPUT_FILE="${APP_NAME}.zip"
DFPKG_OUTPUT_FILE="${APP_NAME}.dfpkg"
FILE_LIST=("description.json" "schema.json" "data.json" "services.json" "composer.json" "package.json")
ZIP_CMD=`which zip`
CONTENTS=

# Make sure all is well...
if [ -z "${APP_NAME}" ] ; then
   _error "No application API name specified."
   usage
fi

# Make sure all is well...
if [ ! -d "./${APP_NAME}" ] ; then
   _error "Your application must have a sub-directory called \"${APP_NAME}\"."
   usage
fi

echo "${B1}DreamFactory Services Platform(tm)${B2} ${SYSTEM_TYPE} Application Packager [${TAG} v${VERSION}]"
_dbg "  * Debug Mode Enabled" ${_YELLOW} 1 1

[ -f "${ZIP_OUTPUT_FILE}" ]   && cecho "  * Removing existing ZIP file: " ${_RED} 0 0 && cecho "${ZIP_OUTPUT_FILE}" ${_RED} 1 1 && rm ${ZIP_OUTPUT_FILE}
[ -f "${DFPKG_OUTPUT_FILE}" ] && cecho "  * Removing existing DFPKG file: ${DFPKG_OUTPUT_FILE}" ${_RED} 0 1 && rm ${DFPKG_OUTPUT_FILE}

if [ ! -d "${APP_NAME}" ] ; then
	_error "Application \"${APP_NAME}\" not found in current directory."
	_error "Be sure to be in the root directory of your application."
	usage
fi

for _file in ${FILE_LIST[*]}
do
	_dbg "  * Checking file: ${ZIP_SOURCE_PATH}/${_file}" ${_WHITE} 0 1
	[ -f "${ZIP_SOURCE_PATH}/${_file}" ] &&
		CONTENTS="${CONTENTS}${ZIP_SOURCE_PATH}/${_file} " &&
		_dbg "    File \"${ZIP_SOURCE_PATH}/${_file}\" added to package payload" "${_CYAN}" 0 1
done

_dbg  "  * Source directory: ${ZIP_SOURCE_PATH}"

#	Create Zip file
cecho "  * Creating ZIP package now... " ${_MAGENTA} 0 0
"${ZIP_CMD}" -rq "${ZIP_OUTPUT_FILE}" "${APP_NAME}" ${CONTENTS} -x "*/\.*"

if [ $? -eq 0 ] ; then
	cecho " done! " ${_MAGENTA} 1 1
	cecho "  * Created ZIP: " ${_GREEN} 0 0
	cecho "${ZIP_OUTPUT_FILE}" ${_GREEN} 1 1
else
	cecho " error (${?})! Could not create ${ZIP_OUTPUT_FILE}!" ${_RED} 1 1
fi

#	Create a DFPKG file
cecho "  * Creating DFPKG package now... " ${_MAGENTA} 0 0

"${ZIP_CMD}" -rq "${DFPKG_OUTPUT_FILE}" "${APP_NAME}" -x "*/\.*"

if [ $? -eq 0 ] ; then
	cecho " done! " ${_MAGENTA} 1 1
	cecho "  * Created DFPKG: " ${_GREEN} 0 0
	cecho "${DFPKG_OUTPUT_FILE}.zip" ${_GREEN} 1 1
else
	cecho " error (${?})! Could not create ${DFPKG_OUTPUT_FILE}!" ${_RED} 1 1
fi

echo
echo "Complete. Enjoy the rest of your day!"

exit 0
